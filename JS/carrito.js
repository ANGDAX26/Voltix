class Carrito {
    constructor() {
        this.items = this.cargarDelLocal();
        this.inicializar();
    }

    cargarDelLocal() {
        try {
            const datos = JSON.parse(localStorage.getItem('voltix_carrito') || '[]');
            if (!Array.isArray(datos)) return [];

            return datos
                .map(item => ({
                    id: Number(item.id),
                    nombre: String(item.nombre || 'Producto'),
                    precio: Number(item.precio) || 0,
                    imagen: String(item.imagen || ''),
                    cantidad: Math.max(1, Number.parseInt(item.cantidad, 10) || 1)
                }))
                .filter(item => Number.isFinite(item.id) && item.id > 0);
        } catch (error) {
            console.warn('No se pudo leer el carrito guardado:', error);
            return [];
        }
    }

    guardarEnLocal() {
        localStorage.setItem('voltix_carrito', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('voltix:carrito-actualizado'));
    }

    agregarProducto(producto) {
        const id = Number(producto.id);
        if (!Number.isFinite(id) || id <= 0) return;

        const itemExistente = this.items.find(item => item.id === id);

        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.items.push({
                id,
                nombre: String(producto.nombre || 'Producto'),
                precio: Number(producto.precio) || 0,
                imagen: String(producto.imagen || ''),
                cantidad: 1
            });
        }

        this.guardarEnLocal();
        this.mostrarNotificacion(`${producto.nombre || 'Producto'} agregado al carrito`);
        this.actualizarCarrito();
    }

    eliminarProducto(id) {
        this.items = this.items.filter(item => item.id !== Number(id));
        this.guardarEnLocal();
        this.actualizarCarrito();
    }

    actualizarCantidad(id, cantidad) {
        const item = this.items.find(producto => producto.id === Number(id));
        if (!item) return;

        item.cantidad = Math.max(1, Number.parseInt(cantidad, 10) || 1);
        this.guardarEnLocal();
        this.actualizarCarrito();
    }

    obtenerSubtotal() {
        return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
    }

    obtenerEnvio() {
        const subtotal = this.obtenerSubtotal();
        return subtotal > 500 || subtotal === 0 ? 0 : 50;
    }

    obtenerTotal() {
        return this.obtenerSubtotal() + this.obtenerEnvio();
    }

    actualizarCarrito() {
        if (document.querySelector('.carrito-items')) {
            this.renderizarCarrito();
        }
        this.actualizarIndicadores();
    }

    renderizarCarrito() {
        const carritoItems = document.querySelector('.carrito-items');
        if (!carritoItems) return;

        if (this.items.length === 0) {
            carritoItems.innerHTML = `
                <div class="carrito-vacio">
                    <span class="vacio-icono" aria-hidden="true">🛒</span>
                    <p><strong>Tu carrito está vacío</strong></p>
                    <p><a href="Index.php">Explorar productos</a></p>
                </div>
            `;
            this.actualizarResumen();
            this.bloquearCheckoutVacio();
            return;
        }

        carritoItems.innerHTML = this.items.map(item => `
            <section class="producto-carrito" data-id="${item.id}">
                <img src="${this.escaparAtributo(item.imagen)}" alt="${this.escaparAtributo(item.nombre)}">
                <div class="producto-info">
                    <h3>${this.escaparHTML(item.nombre)}</h3>
                    <p>Disponible</p>
                </div>
                <div class="producto-controls">
                    <input class="cantidad" type="number" value="${item.cantidad}" min="1" max="99"
                           inputmode="numeric" data-id="${item.id}" aria-label="Cantidad de ${this.escaparAtributo(item.nombre)}">
                    <p class="precio">$${(item.precio * item.cantidad).toFixed(2)}</p>
                    <button class="eliminar-btn" type="button" data-id="${item.id}">Eliminar</button>
                </div>
            </section>
        `).join('');

        this.actualizarResumen();
        this.habilitarCheckout();
    }

    actualizarResumen() {
        const resumen = document.querySelector('.resumen');
        if (!resumen) return;

        const subtotal = this.obtenerSubtotal();
        const envio = this.obtenerEnvio();
        const total = subtotal + envio;
        const lineas = resumen.querySelectorAll('p');

        if (lineas[0]) lineas[0].innerHTML = `<span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span>`;
        if (lineas[1]) lineas[1].innerHTML = `<span>Envío:</span> <span>${envio === 0 ? '$0.00' : '$' + envio.toFixed(2)}</span>`;

        const totalEl = resumen.querySelector('.total');
        if (totalEl) totalEl.innerHTML = `<span>Total:</span> <span>$${total.toFixed(2)}</span>`;
    }

    bloquearCheckoutVacio() {
        const boton = document.getElementById('btnCheckout');
        const panel = document.getElementById('checkout-panel');

        if (boton) {
            boton.disabled = true;
            boton.textContent = 'Carrito vacío';
            boton.dataset.checkoutAbierto = 'false';
        }

        if (panel) {
            panel.classList.remove('abierto');
            panel.setAttribute('aria-hidden', 'true');
        }
    }

    habilitarCheckout() {
        const boton = document.getElementById('btnCheckout');
        if (!boton) return;

        boton.disabled = false;
        if (boton.dataset.checkoutAbierto !== 'true') {
            boton.textContent = 'Proceder al pago';
        }
    }

    actualizarIndicadores() {
        const totalItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
        const badges = document.querySelectorAll('[data-carrito-count]');

        badges.forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
        });
    }

    mostrarNotificacion(mensaje) {
        const notif = document.createElement('div');
        notif.className = 'voltix-notificacion';
        notif.textContent = mensaje;
        document.body.appendChild(notif);
        window.setTimeout(() => notif.remove(), 2200);
    }

    inicializar() {
        this.conectarBotonesProductos();
        this.conectarControlesCarrito();
        this.actualizarCarrito();
    }

    conectarControlesCarrito() {
        document.addEventListener('click', e => {
            const eliminar = e.target.closest('.eliminar-btn');
            if (!eliminar) return;
            this.eliminarProducto(eliminar.dataset.id);
        });

        document.addEventListener('change', e => {
            if (!e.target.matches('input.cantidad')) return;
            const cantidad = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
            e.target.value = cantidad;
            this.actualizarCantidad(e.target.dataset.id, cantidad);
        });
    }

    conectarBotonesProductos() {
        document.addEventListener('click', e => {
            const objetivo = e.target instanceof Element ? e.target : e.target.parentElement;
            if (!objetivo) return;

            const boton = objetivo.closest('.add-to-cart');
            if (!boton) return;

            e.preventDefault();

            const producto = {
                id: Number(boton.dataset.id),
                nombre: boton.dataset.nombre || boton.dataset.name || '',
                precio: Number.parseFloat(boton.dataset.precio) || 0,
                imagen: boton.dataset.img || ''
            };

            // Respaldo para botones de detalle que no tengan data-*.
            if (!producto.id) {
                const detalle = objetivo.closest('.detalle') || document.querySelector('.detalle');
                const params = new URLSearchParams(window.location.search);

                if (detalle) {
                    producto.id = Number(params.get('id'));
                    producto.nombre = detalle.querySelector('h1')?.textContent.trim() || 'Producto';
                    producto.precio = Number.parseFloat(
                        (detalle.querySelector('.precio')?.textContent || '0').replace(/[^\d.]/g, '')
                    ) || 0;
                    producto.imagen = detalle.querySelector('img')?.src || '';
                }
            }

            this.agregarProducto(producto);
        });
    }

    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = String(texto ?? '');
        return div.innerHTML;
    }

    escaparAtributo(texto) {
        return this.escaparHTML(texto).replace(/"/g, '&quot;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.carrito = new Carrito();
    inicializarCheckout();
});

function inicializarCheckout() {
    const boton = document.getElementById('btnCheckout');
    if (!boton) return;

    boton.dataset.checkoutAbierto = 'false';
    boton.addEventListener('click', manejarBotonCheckout);

    document.addEventListener('change', e => {
        if (e.target.matches('input[name="pago"]')) {
            actualizarMetodoPago();
            limpiarMensajeCheckout();
        }
    });

    const numero = document.getElementById('numero-tarjeta');
    const vencimiento = document.getElementById('vencimiento-tarjeta');
    const cvv = document.getElementById('cvv-tarjeta');
    const cp = document.getElementById('cp');

    numero?.addEventListener('input', formatearNumeroTarjeta);
    vencimiento?.addEventListener('input', formatearVencimiento);
    cvv?.addEventListener('input', soloDigitos);
    cp?.addEventListener('input', soloDigitos);
}

function manejarBotonCheckout() {
    const carrito = window.carrito;
    const boton = document.getElementById('btnCheckout');

    if (!carrito || carrito.items.length === 0) {
        mostrarMensajeCheckout('Tu carrito está vacío.', true);
        return;
    }

    if (boton.dataset.checkoutAbierto !== 'true') {
        abrirCheckout();
        return;
    }

    procesarCheckout();
}

function abrirCheckout() {
    const panel = document.getElementById('checkout-panel');
    const boton = document.getElementById('btnCheckout');
    if (!panel || !boton) return;

    panel.classList.add('abierto');
    panel.setAttribute('aria-hidden', 'false');
    boton.dataset.checkoutAbierto = 'true';
    boton.textContent = 'Confirmar compra';

    window.setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('calle')?.focus({ preventScroll: true });
    }, 80);
}

function actualizarMetodoPago() {
    const seleccionado = document.querySelector('input[name="pago"]:checked');
    const datosTarjeta = document.getElementById('datos-tarjeta');
    if (!datosTarjeta) return;

    const mostrarTarjeta = seleccionado?.value === 'tarjeta';
    datosTarjeta.classList.toggle('visible', mostrarTarjeta);
    datosTarjeta.setAttribute('aria-hidden', String(!mostrarTarjeta));
}

function mostrarMensajeCheckout(texto, esError = false) {
    const caja = document.getElementById('checkout-mensaje');
    if (!caja) return;

    caja.textContent = texto;
    caja.hidden = false;
    caja.classList.toggle('error', esError);
    caja.classList.toggle('exito', !esError);
}

function limpiarMensajeCheckout() {
    const caja = document.getElementById('checkout-mensaje');
    if (!caja) return;

    caja.hidden = true;
    caja.textContent = '';
    caja.classList.remove('error', 'exito');
}

function formatearNumeroTarjeta(e) {
    const input = e.target;
    const digitos = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = digitos.replace(/(\d{4})(?=\d)/g, '$1 ');
    actualizarMarcaTarjeta(digitos);
}

function formatearVencimiento(e) {
    const input = e.target;
    const digitos = input.value.replace(/\D/g, '').slice(0, 4);

    if (digitos.length <= 2) {
        input.value = digitos;
    } else {
        input.value = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    }
}

function soloDigitos(e) {
    const input = e.target;
    input.value = input.value.replace(/\D/g, '').slice(0, Number(input.maxLength) > 0 ? Number(input.maxLength) : undefined);
}

function actualizarMarcaTarjeta(numero) {
    const marca = document.getElementById('marca-tarjeta');
    if (!marca) return;

    if (/^4/.test(numero)) marca.textContent = 'VISA';
    else if (/^(5[1-5]|2[2-7])/.test(numero)) marca.textContent = 'MASTERCARD';
    else if (/^3[47]/.test(numero)) marca.textContent = 'AMEX';
    else marca.textContent = 'Tarjeta';
}

function validarLuhn(numero) {
    const digitos = numero.replace(/\D/g, '');
    if (digitos.length < 13 || digitos.length > 19) return false;

    let suma = 0;
    let duplicar = false;

    for (let i = digitos.length - 1; i >= 0; i--) {
        let valor = Number(digitos[i]);

        if (duplicar) {
            valor *= 2;
            if (valor > 9) valor -= 9;
        }

        suma += valor;
        duplicar = !duplicar;
    }

    return suma % 10 === 0;
}

function validarVencimiento(valor) {
    const coincidencia = /^(\d{2})\/(\d{2})$/.exec(valor);
    if (!coincidencia) return false;

    const mes = Number(coincidencia[1]);
    const anio = 2000 + Number(coincidencia[2]);
    if (mes < 1 || mes > 12) return false;

    const ahora = new Date();
    const vencimiento = new Date(anio, mes, 0, 23, 59, 59);
    return vencimiento >= ahora;
}

function validarFormularioCheckout() {
    const direccion = document.getElementById('calle')?.value.trim() || '';
    const colonia = document.getElementById('colonia')?.value.trim() || '';
    const ciudad = document.getElementById('ciudad')?.value.trim() || '';
    const estado = document.getElementById('estado')?.value.trim() || '';
    const cp = document.getElementById('cp')?.value.trim() || '';
    const metodoPagoInput = document.querySelector('input[name="pago"]:checked');

    if (!direccion || !ciudad || !estado || !cp) {
        return { error: 'Completa calle, ciudad, estado y código postal.' };
    }

    if (!/^\d{5}$/.test(cp)) {
        return { error: 'El código postal debe tener 5 dígitos.' };
    }

    if (!metodoPagoInput) {
        return { error: 'Selecciona un método de pago.' };
    }

    if (metodoPagoInput.value === 'tarjeta') {
        const titular = document.getElementById('titular-tarjeta')?.value.trim() || '';
        const numero = document.getElementById('numero-tarjeta')?.value || '';
        const vencimiento = document.getElementById('vencimiento-tarjeta')?.value || '';
        const cvv = document.getElementById('cvv-tarjeta')?.value || '';

        if (titular.length < 3) {
            return { error: 'Ingresa el nombre del titular de la tarjeta.' };
        }

        if (!validarLuhn(numero)) {
            return { error: 'El número de tarjeta no es válido.' };
        }

        if (!validarVencimiento(vencimiento)) {
            return { error: 'La fecha de vencimiento no es válida o ya venció.' };
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            return { error: 'El CVV debe tener 3 o 4 dígitos.' };
        }
    }

    return {
        datos: {
            direccion,
            colonia,
            ciudad,
            estado,
            cp,
            metodo_pago: metodoPagoInput.value
        }
    };
}

async function procesarCheckout() {
    const carrito = window.carrito;
    if (!carrito || carrito.items.length === 0) {
        mostrarMensajeCheckout('Tu carrito está vacío.', true);
        return;
    }

    limpiarMensajeCheckout();

    const validacion = validarFormularioCheckout();
    if (validacion.error) {
        mostrarMensajeCheckout(validacion.error, true);
        return;
    }

    const boton = document.getElementById('btnCheckout');
    const textoOriginal = boton?.textContent || 'Confirmar compra';

    if (boton) {
        boton.disabled = true;
        boton.textContent = 'Procesando...';
    }

    const payload = {
        items: carrito.items.map(item => ({ id: item.id, cantidad: item.cantidad })),
        ...validacion.datos
        // Deliberadamente NO se envían número de tarjeta ni CVV.
    };

    try {
        const respuesta = await fetch('../PHP/checkout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        let resultado = {};
        try {
            resultado = await respuesta.json();
        } catch {
            resultado = {};
        }

        if (respuesta.status === 401) {
            mostrarMensajeCheckout('Debes iniciar sesión para completar tu compra. Redirigiendo...', true);
            window.setTimeout(() => { window.location.href = 'formu.php'; }, 1200);
            return;
        }

        if (!respuesta.ok) {
            mostrarMensajeCheckout(resultado.error || 'No se pudo procesar el pedido.', true);
            return;
        }

        carrito.items = [];
        carrito.guardarEnLocal();
        carrito.actualizarCarrito();

        const total = Number(resultado.total) || 0;
        mostrarMensajeCheckout(`¡Pedido #${resultado.id_pedido} realizado! Total: $${total.toFixed(2)} MXN.`);

        window.setTimeout(() => {
            window.location.href = 'perfil.php';
        }, 1600);
    } catch (error) {
        console.error('Error en el checkout:', error);
        mostrarMensajeCheckout('Error de conexión al procesar el pedido. Inténtalo de nuevo.', true);
    } finally {
        if (boton && carrito.items.length > 0) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    }
}

const estiloNotificacion = document.createElement('style');
estiloNotificacion.textContent = `
    .voltix-notificacion {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: min(360px, calc(100vw - 40px));
        z-index: 9999;
        padding: .9rem 1.15rem;
        border-radius: 10px;
        background: var(--naranja);
        color: #fff;
        box-shadow: 0 8px 24px rgba(0,0,0,.2);
        font-weight: 700;
        animation: voltixSlideIn .25s ease-out;
    }
    @keyframes voltixSlideIn {
        from { transform: translateX(30px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(estiloNotificacion);
