async function cargarDetalle() {

    const contenedor = document.getElementById('detalle-producto');
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));

    if (!id || isNaN(id)) {
        contenedor.innerHTML = `
            <div class="detalle">
                <h1>Producto no encontrado</h1>
                <p><a href="Index.php">&larr; Volver a la tienda</a></p>
            </div>
        `;
        return;
    }

    try {
        const respuesta = await fetch('../PHP/productos.php?id=' + encodeURIComponent(id));

        if (respuesta.status === 404) {
            contenedor.innerHTML = `
                <div class="detalle">
                    <h1>Producto no encontrado</h1>
                    <p><a href="Index.php">&larr; Volver a la tienda</a></p>
                </div>
            `;
            return;
        }
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

        const producto = await respuesta.json();

        if (!producto || !producto.id) {
            contenedor.innerHTML = `
                <div class="detalle">
                    <h1>Producto no encontrado</h1>
                    <p><a href="Index.php">&larr; Volver a la tienda</a></p>
                </div>
            `;
            return;
        }

        // Ensure precio is a number
        const precio = Number(producto.precio) || 0;

        document.title = `${producto.nombre} — Voltix`;

        const productoId = producto.id;

        contenedor.innerHTML = `
            <div class="detalle">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="detalle-info">
                    <p class="detalle-categoria">${producto.categoria}</p>
                    <h1>${producto.nombre}</h1>
                    <p class="precio">$${precio.toFixed(2)} MXN</p>

                    ${producto.stock === 0
                        ? '<p class="stock-indicator agotado">❌ Agotado — no disponible por el momento</p>'
                        : producto.stock <= 5
                            ? `<p class="stock-indicator bajo">⚠️ ¡Quedan solo ${producto.stock} unidades!</p>`
                            : `<p class="stock-indicator disponible">✅ En stock — ${producto.stock} unidades disponibles</p>`
                    }

                    <p class="detalle-descripcion">${producto.descripcion}</p>

                    <div id="seccion-resenas" class="seccion-resenas">
                        <h2>Opiniones del producto</h2>
                        <div id="lista-resenas"><p class="cargando-resenas">Cargando opiniones...</p></div>
                        <div id="form-resena" style="display:none;">
                            <h3>Deja tu opinión</h3>
                            <div class="estrellas-selector" id="estrellas-selector">
                                <span class="estrella" data-valor="1">★</span>
                                <span class="estrella" data-valor="2">★</span>
                                <span class="estrella" data-valor="3">★</span>
                                <span class="estrella" data-valor="4">★</span>
                                <span class="estrella" data-valor="5">★</span>
                            </div>
                            <input type="hidden" id="calificacion-seleccionada" value="0">
                            <textarea id="texto-resena" placeholder="¿Qué opinas del producto?" rows="3" maxlength="500"></textarea>
                            <button type="button" id="btn-enviar-resena" class="add-to-cart">Publicar opinión</button>
                            <p id="resena-mensaje" style="display:none;"></p>
                        </div>
                        <div id="aviso-login-resena" style="display:none;">
                            <p>¿Tienes algo que decir? <a href="formu.php">Inicia sesión</a> para dejar tu opinión.</p>
                        </div>
                    </div>

                    <button class="add-to-cart" ${producto.stock === 0 ? 'disabled title="Sin stock"' : ''} data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${precio}" data-img="${producto.imagen}">Agregar al carrito</button>
                    <p><a href="Index.php">&larr; Volver a la tienda</a></p>
                </div>

            </div>
        `;

        // Cargar reseñas del producto
        await cargarResenas(productoId);

    } catch (e) {
        console.error('Error cargando el producto:', e);
        contenedor.innerHTML = `
            <div class="detalle">
                <h1>No se pudo cargar el producto.</h1>
                <p><a href="Index.php">&larr; Volver a la tienda</a></p>
            </div>
        `;
    }
}

cargarDetalle();


// ── Reseñas ──────────────────────────────────────────────────────────────────

async function cargarResenas(idProducto) {
    const lista = document.getElementById('lista-resenas');
    if (!lista) return;

    try {
        const r = await fetch('../PHP/resenas.php?id_producto=' + idProducto);
        if (!r.ok) throw new Error();
        const data = await r.json();

        if (!data.resenas || data.resenas.length === 0) {
            lista.innerHTML = '<p class="sin-resenas">Todavía no hay opiniones. ¡Sé el primero!</p>';
        } else {
            const promedio = data.resenas.reduce((s, r) => s + r.calificacion, 0) / data.resenas.length;
            lista.innerHTML = `
                <div class="resenas-promedio">
                    <span class="promedio-numero">${promedio.toFixed(1)}</span>
                    <span class="estrellas-display">${estrellasHTML(Math.round(promedio))}</span>
                    <span class="resenas-cantidad">(${data.resenas.length} ${data.resenas.length === 1 ? 'opinión' : 'opiniones'})</span>
                </div>
                ${data.resenas.map(res => `
                    <div class="resena-item">
                        <div class="resena-header">
                            <strong>${escapeHtmlR(res.nombreU)}</strong>
                            <span class="estrellas-display">${estrellasHTML(res.calificacion)}</span>
                            <span class="resena-fecha">${new Date(res.fecha).toLocaleDateString('es-MX', {day:'numeric',month:'long',year:'numeric'})}</span>
                        </div>
                        <p class="resena-texto">${escapeHtmlR(res.comentario)}</p>
                    </div>
                `).join('')}
            `;
        }

        // Mostrar u ocultar el formulario según si el usuario está logueado
        // y si ya dejó una opinión antes (solo se permite una por producto).
        const formResena = document.getElementById('form-resena');
        const aviso = document.getElementById('aviso-login-resena');

        if (data.logueado && data.ya_reseno) {
            if (aviso) {
                aviso.innerHTML = '<p>Ya dejaste tu opinión sobre este producto. ¡Gracias por compartirla!</p>';
                aviso.style.display = 'block';
            }
        } else if (data.logueado) {
            if (formResena) formResena.style.display = 'block';
            conectarFormResena(idProducto);
        } else {
            if (aviso) aviso.style.display = 'block';
        }

    } catch {
        lista.innerHTML = '<p class="sin-resenas">No se pudieron cargar las opiniones.</p>';
    }
}

function estrellasHTML(n) {
    return '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(5 - Math.max(0, Math.min(5, n)));
}

function escapeHtmlR(t) {
    const d = document.createElement('div');
    d.textContent = String(t ?? '');
    return d.innerHTML;
}

function conectarFormResena(idProducto) {
    // Selector de estrellas
    const estrellas = document.querySelectorAll('#estrellas-selector .estrella');
    const inputCal = document.getElementById('calificacion-seleccionada');

    estrellas.forEach(e => {
        e.addEventListener('mouseover', () => resaltarEstrellas(estrellas, Number(e.dataset.valor)));
        e.addEventListener('mouseout', () => resaltarEstrellas(estrellas, Number(inputCal?.value || 0)));
        e.addEventListener('click', () => {
            if (inputCal) inputCal.value = e.dataset.valor;
            resaltarEstrellas(estrellas, Number(e.dataset.valor));
        });
    });

    // Envío del formulario
    const btn = document.getElementById('btn-enviar-resena');
    if (btn) btn.addEventListener('click', () => enviarResena(idProducto));
}

function resaltarEstrellas(estrellas, valor) {
    estrellas.forEach(e => {
        e.classList.toggle('activa', Number(e.dataset.valor) <= valor);
    });
}

async function enviarResena(idProducto) {
    const calificacion = Number(document.getElementById('calificacion-seleccionada')?.value || 0);
    const comentario = document.getElementById('texto-resena')?.value.trim() || '';
    const mensaje = document.getElementById('resena-mensaje');

    if (calificacion < 1 || calificacion > 5) {
        if (mensaje) { mensaje.textContent = 'Selecciona una calificación de 1 a 5 estrellas.'; mensaje.style.display = 'block'; mensaje.style.color = '#c0392b'; }
        return;
    }
    if (comentario.length < 5) {
        if (mensaje) { mensaje.textContent = 'Escribe al menos 5 caracteres.'; mensaje.style.display = 'block'; mensaje.style.color = '#c0392b'; }
        return;
    }

    const btn = document.getElementById('btn-enviar-resena');
    if (btn) { btn.disabled = true; btn.textContent = 'Publicando...'; }

    try {
        const r = await fetch('../PHP/resenas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: idProducto, calificacion, comentario })
        });
        const data = await r.json();

        if (!r.ok) {
            if (mensaje) { mensaje.textContent = data.error || 'No se pudo publicar.'; mensaje.style.display = 'block'; mensaje.style.color = '#c0392b'; }
        } else {
            document.getElementById('form-resena').style.display = 'none';
            if (mensaje) { mensaje.textContent = '¡Opinión publicada!'; mensaje.style.display = 'block'; mensaje.style.color = '#1e7e34'; }
            await cargarResenas(idProducto);
        }
    } catch {
        if (mensaje) { mensaje.textContent = 'Error de conexión.'; mensaje.style.display = 'block'; mensaje.style.color = '#c0392b'; }
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Publicar opinión'; }
    }
}
