const API_PRODUCTOS = '../PHP/admin_productos.php';
const API_HERO = '../PHP/admin_hero.php';

let productos = [];
let editandoId = null;

let heroSlides = [];
let editandoHeroId = null;

/* =========================================================
   PRODUCTOS
   ========================================================= */

/* ---------- Carga inicial (desde la base de datos) ---------- */
async function iniciar() {
    try {
        const respuesta = await fetch(API_PRODUCTOS);
        if (respuesta.status === 401 || respuesta.status === 403) {
            window.location.href = 'formu.php';
            return;
        }
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
        productos = await respuesta.json();
    } catch (e) {
        console.error('Error cargando productos:', e);
        productos = [];
        mostrarAviso('No se pudieron cargar los productos desde el servidor.', true);
    }

    renderizarTabla();
}

/* ---------- Render de la tabla ---------- */
function renderizarTabla() {
    const tbody = document.getElementById('tabla-productos-body');
    const contador = document.getElementById('contador-productos');
    if (contador) contador.textContent = productos.length;

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="admin-vacio">No hay productos. Agrega el primero con el formulario de arriba.</td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map(p => {
        const stockNum = Number(p.stock) || 0;
        const stockClass = stockNum === 0 ? 'stock-agotado' : stockNum <= 5 ? 'stock-bajo' : 'stock-ok';
        return `
        <tr>
            <td class="admin-col-img"><img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}" onerror="this.src='https://placehold.co/60x60?text=%3F'"></td>
            <td>${escapeHtml(p.nombre)}</td>
            <td>${escapeHtml(p.categoria)}</td>
            <td>$${Number(p.precio).toFixed(2)} MXN</td>
            <td><span class="stock-badge ${stockClass}">${stockNum === 0 ? 'Agotado' : stockNum + ' uds.'}</span></td>
            <td>${p.id}</td>
            <td class="admin-col-acciones">
                <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
        </tr>
        `;
    }).join('');
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

/* ---------- Formulario: alta / edición ---------- */
function limpiarFormulario() {
    editandoId = null;
    document.getElementById('form-producto').reset();
    document.getElementById('input-stock').value = 0;
    document.getElementById('form-titulo').textContent = 'Agregar producto';
    document.getElementById('btn-cancelar-edicion').style.display = 'none';
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    editandoId = id;
    document.getElementById('form-titulo').textContent = `Editando: ${producto.nombre}`;
    document.getElementById('input-nombre').value = producto.nombre;
    document.getElementById('input-precio').value = producto.precio;
    document.getElementById('input-stock').value = producto.stock || 0;
    document.getElementById('input-categoria').value = producto.categoria;
    document.getElementById('input-imagen').value = producto.imagen;
    document.getElementById('input-descripcion').value = producto.descripcion;
    document.getElementById('btn-cancelar-edicion').style.display = 'inline-block';

    document.getElementById('form-producto').scrollIntoView({ behavior: 'smooth' });
}

async function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const confirmado = confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    try {
        const respuesta = await fetch(API_PRODUCTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'eliminar', id })
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarAviso(resultado.error || 'No se pudo eliminar el producto.', true);
            return;
        }

        productos = productos.filter(p => p.id !== id);
        renderizarTabla();
        mostrarAviso(`"${producto.nombre}" eliminado.`);

        if (editandoId === id) limpiarFormulario();
    } catch (e) {
        console.error('Error eliminando producto:', e);
        mostrarAviso('Error de conexión al eliminar el producto.', true);
    }
}



async function iniciarHero() {
    try {
        const respuesta = await fetch(API_HERO);

        if (!respuesta.ok) {
            const resultado = await respuesta.json().catch(() => ({}));
            throw new Error(resultado.error || 'HTTP ' + respuesta.status);
        }

        heroSlides = await respuesta.json();
    } catch (e) {
        console.error('Error cargando Hero:', e);
        heroSlides = [];
        mostrarAviso(e.message || 'No se pudo cargar el Hero.', true);
    }

    renderizarHeroAdmin();
}

function renderizarHeroAdmin() {
    const tbody = document.getElementById('tabla-hero-body');
    const contador = document.getElementById('contador-hero');

    if (contador) contador.textContent = heroSlides.length;

    if (heroSlides.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="admin-vacio">No hay elementos en el Hero. Agrega el primero con el formulario de arriba.</td></tr>`;
        return;
    }

    tbody.innerHTML = heroSlides.map(slide => `
        <tr>
            <td class="admin-col-img">
                <img src="${escapeHtml(slide.imagen)}"
                     alt="${escapeHtml(slide.titulo)}"
                     onerror="this.src='https://placehold.co/60x60?text=%3F'">
            </td>
            <td>${escapeHtml(slide.titulo)}</td>
            <td>${escapeHtml(slide.subtitulo || '')}</td>
            <td>${slide.orden}</td>
            <td class="admin-col-acciones">
                <button class="btn-editar" onclick="editarHero(${slide.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarHero(${slide.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function limpiarFormularioHero() {
    editandoHeroId = null;

    const form = document.getElementById('form-hero');
    form.reset();

    document.getElementById('hero-form-titulo').textContent = 'Administrar Hero';
    document.getElementById('hero-texto-boton').value = 'Ver producto';
    document.getElementById('hero-orden').value = heroSlides.length + 1;
    document.getElementById('btn-cancelar-hero').style.display = 'none';
}

function editarHero(id) {
    const slide = heroSlides.find(item => item.id === id);
    if (!slide) return;

    editandoHeroId = id;

    document.getElementById('hero-form-titulo').textContent = `Editando Hero: ${slide.titulo}`;
    document.getElementById('hero-titulo').value = slide.titulo;
    document.getElementById('hero-subtitulo').value = slide.subtitulo || '';
    document.getElementById('hero-imagen').value = slide.imagen;
    document.getElementById('hero-enlace').value = slide.enlace || '';
    document.getElementById('hero-texto-boton').value = slide.texto_boton || 'Ver producto';
    document.getElementById('hero-orden').value = slide.orden || 1;
    document.getElementById('btn-cancelar-hero').style.display = 'inline-block';

    document.getElementById('form-hero').scrollIntoView({ behavior: 'smooth' });
}

async function eliminarHero(id) {
    const slide = heroSlides.find(item => item.id === id);
    if (!slide) return;

    const confirmado = confirm(`¿Eliminar del Hero "${slide.titulo}"?`);
    if (!confirmado) return;

    try {
        const respuesta = await fetch(API_HERO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'eliminar', id })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarAviso(resultado.error || 'No se pudo eliminar el elemento del Hero.', true);
            return;
        }

        await iniciarHero();
        limpiarFormularioHero();
        mostrarAviso(`"${slide.titulo}" fue eliminado del Hero.`);
    } catch (e) {
        console.error('Error eliminando Hero:', e);
        mostrarAviso('Error de conexión al eliminar el elemento del Hero.', true);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    iniciar();
    iniciarHero().then(() => {
        if (editandoHeroId === null) {
            document.getElementById('hero-orden').value = heroSlides.length + 1;
        }
    });

    /* ---------- Guardar Hero ---------- */
    document.getElementById('form-hero').addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('hero-titulo').value.trim();
        const subtitulo = document.getElementById('hero-subtitulo').value.trim();
        const imagen = document.getElementById('hero-imagen').value.trim();
        const enlace = document.getElementById('hero-enlace').value.trim();
        const texto_boton = document.getElementById('hero-texto-boton').value.trim();
        const orden = parseInt(document.getElementById('hero-orden').value, 10) || 1;

        if (!titulo || !imagen) {
            mostrarAviso('Completa al menos el título y la imagen del Hero.', true);
            return;
        }

        const payload = {
            titulo,
            subtitulo,
            imagen,
            enlace,
            texto_boton,
            orden
        };

        try {
            const accion = editandoHeroId !== null ? 'actualizar' : 'crear';

            const respuesta = await fetch(API_HERO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion,
                    ...(editandoHeroId !== null ? { id: editandoHeroId } : {}),
                    ...payload
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                mostrarAviso(resultado.error || 'No se pudo guardar el Hero.', true);
                return;
            }

            const mensaje = editandoHeroId !== null
                ? `Elemento "${titulo}" actualizado en el Hero.`
                : `Elemento "${titulo}" agregado al Hero.`;

            await iniciarHero();
            limpiarFormularioHero();
            mostrarAviso(mensaje);

        } catch (e) {
            console.error('Error guardando Hero:', e);
            mostrarAviso('Error de conexión al guardar el Hero.', true);
        }
    });

    document.getElementById('btn-cancelar-hero').addEventListener('click', limpiarFormularioHero);

    /* ---------- Guardar producto ---------- */
    document.getElementById('form-producto').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('input-nombre').value.trim();
        const precio = parseFloat(document.getElementById('input-precio').value);
        const stock = parseInt(document.getElementById('input-stock').value, 10) || 0;
        const categoria = document.getElementById('input-categoria').value.trim();
        const imagen = document.getElementById('input-imagen').value.trim();
        const descripcion = document.getElementById('input-descripcion').value.trim();

        if (!nombre || isNaN(precio) || !categoria || !imagen) {
            mostrarAviso('Completa nombre, precio, categoría e imagen.', true);
            return;
        }

        const payload = { nombre, precio, stock, categoria, imagen, descripcion };

        try {
            let respuesta;
            if (editandoId !== null) {
                respuesta = await fetch(API_PRODUCTOS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accion: 'actualizar', id: editandoId, ...payload })
                });
            } else {
                respuesta = await fetch(API_PRODUCTOS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accion: 'crear', ...payload })
                });
            }

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                mostrarAviso(resultado.error || 'No se pudo guardar el producto.', true);
                return;
            }

            if (editandoId !== null) {
                const producto = productos.find(p => p.id === editandoId);
                Object.assign(producto, payload);
                mostrarAviso(`Producto "${nombre}" actualizado.`);
            } else {
                productos.unshift({ id: resultado.id, ...payload });
                mostrarAviso(`Producto "${nombre}" agregado.`);
            }

            renderizarTabla();
            limpiarFormulario();

        } catch (e) {
            console.error('Error guardando producto:', e);
            mostrarAviso('Error de conexión al guardar el producto.', true);
        }
    });

    document.getElementById('btn-cancelar-edicion').addEventListener('click', limpiarFormulario);

    document.getElementById('btn-descargar').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(productos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.json';
        a.click();
        URL.revokeObjectURL(url);
        mostrarAviso('Respaldo de productos.json descargado.');
    });

    document.getElementById('btn-descargar-reporte').addEventListener('click', descargarReporteCSV);

    document.getElementById('btn-importar-excel').addEventListener('click', async () => {
        const input = document.getElementById('input-archivo-excel');
        if (!input.files || input.files.length === 0) {
            mostrarAviso('Selecciona un archivo Excel o CSV para importar.', true);
            return;
        }
        await importarProductosDesdeArchivo(input.files[0]);
    });

    document.getElementById('btn-restablecer').addEventListener('click', async () => {
        const confirmado = confirm('Esto vuelve a cargar la lista de productos desde el servidor, descartando cualquier cambio sin guardar. ¿Continuar?');
        if (!confirmado) return;
        await iniciar();
        limpiarFormulario();
        mostrarAviso('Lista de productos recargada desde el servidor.');
    });
});

function descargarReporteCSV() {
    const cabeceras = ['id', 'nombre', 'precio', 'categoria', 'imagen', 'descripcion'];
    const filas = productos.map(producto => cabeceras.map(campo => {
        const valor = producto[campo] ?? '';
        return `"${String(valor).replace(/"/g, '""')}"`;
    }).join(','));
    const contenido = [cabeceras.join(','), ...filas].join('\r\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-productos.csv';
    a.click();
    URL.revokeObjectURL(url);
    mostrarAviso('Reporte CSV descargado.');
}

/* ---------- Importar productos desde Excel/CSV ---------- */
async function importarProductosDesdeArchivo(archivo) {
    try {
        if (!archivo.name.match(/\.(xlsx|xls|csv)$/i)) {
            throw new Error('Solo se admiten archivos .xlsx, .xls o .csv.');
        }

        let workbook;
        if (archivo.name.match(/\.csv$/i)) {
            const texto = new TextDecoder('utf-8').decode(await archivo.arrayBuffer());
            workbook = XLSX.read(texto, { type: 'string' });
        } else {
            workbook = XLSX.read(await archivo.arrayBuffer(), { type: 'array' });
        }

        const hoja = workbook.SheetNames[0];
        const filas = XLSX.utils.sheet_to_json(workbook.Sheets[hoja], { defval: '' });
        if (!filas.length) {
            throw new Error('El archivo está vacío o no contiene datos válidos.');
        }

        const nuevosProductos = filas.map(fila => {
            const nombre = String(fila.nombre ?? fila.Nombre ?? fila.name ?? fila.Name ?? '').trim();
            const precio = Number(fila.precio ?? fila.Precio ?? fila.price ?? fila.Price ?? 0);
            const categoria = String(fila.categoria ?? fila.Categoria ?? fila.category ?? fila.Category ?? '').trim();
            const imagen = String(fila.imagen ?? fila.Imagen ?? fila.image ?? fila.Image ?? '').trim();
            const descripcion = String(fila.descripcion ?? fila.Descripcion ?? fila.description ?? fila.Description ?? '').trim();
            return { nombre, precio, categoria, imagen, descripcion };
        }).filter(p => p.nombre && !isNaN(p.precio) && p.categoria && p.imagen);

        if (!nuevosProductos.length) {
            throw new Error('No se encontró ninguna fila válida con nombre, precio, categoría e imagen.');
        }

        let importados = 0;
        for (const producto of nuevosProductos) {
            const respuesta = await fetch(API_PRODUCTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accion: 'crear', ...producto })
            });
            if (respuesta.ok) importados++;
        }

        await iniciar();
        limpiarFormulario();
        mostrarAviso(`Importados ${importados} de ${nuevosProductos.length} productos desde ${archivo.name}.`);
    } catch (error) {
        console.error('Error importando archivo:', error);
        mostrarAviso(error.message || 'Error al importar archivo.', true);
    }
}

function mostrarAviso(mensaje, esError = false) {
    const aviso = document.getElementById('admin-aviso');
    aviso.textContent = mensaje;
    aviso.className = esError ? 'admin-aviso admin-aviso-error' : 'admin-aviso';
    aviso.style.display = 'block';
    clearTimeout(mostrarAviso._t);
    mostrarAviso._t = setTimeout(() => { aviso.style.display = 'none'; }, 5000);
}
