

class Carrito {
    constructor() {
        this.items = this.cargarDelLocal();
        this.inicializar();
    }

    cargarDelLocal() {
        const datos = localStorage.getItem('voltix_carrito');
        return datos ? JSON.parse(datos) : [];
    }

    guardarEnLocal() {
        localStorage.setItem('voltix_carrito', JSON.stringify(this.items));
    }

    agregarProducto(producto) {
        // Buscar si el producto ya existe en el carrito
        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
        }

        this.guardarEnLocal();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
        this.actualizarCarrito();
    }

    eliminarProducto(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarEnLocal();
        this.actualizarCarrito();
    }

    actualizarCantidad(id, cantidad) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad = Math.max(1, cantidad);
            this.guardarEnLocal();
            this.actualizarCarrito();
        }
    }

    obtenerTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    obtenerSubtotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    obtenerEnvio() {
        // Envío gratis si el total es mayor a $500
        const subtotal = this.obtenerSubtotal();
        return subtotal > 500 ? 0 : 50;
    }

    actualizarCarrito() {
        // Renderizar en la página del carrito si existe
        const carritoItems = document.querySelector('.carrito-items');
        if (carritoItems) {
            this.renderizarCarrito();
        }

        // Actualizar cualquier indicador de cantidad
        this.actualizarIndicadores();
    }

    renderizarCarrito() {
        const carritoItems = document.querySelector('.carrito-items');
        const resumen = document.querySelector('.resumen');

        if (!carritoItems) return;

        if (this.items.length === 0) {
            carritoItems.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; color: var(--gris-texto);">
                    <p style="font-size: 18px; font-weight: 600;">Tu carrito está vacío</p>
                    <p><a href="Voltix.html" style="color: var(--naranja); text-decoration: underline;">Continuar comprando</a></p>
                </div>
            `;
            if (resumen) {
                resumen.querySelector('.total span:last-child').textContent = '$0.00';
            }
            return;
        }

        carritoItems.innerHTML = this.items.map(item => `
            <section class="producto-carrito" data-id="${item.id}">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="producto-info">
                    <h3>${item.nombre}</h3>
                    <p>En stock</p>
                </div>
                <div class="producto-controls">
                    <input class="cantidad" type="number" value="${item.cantidad}" min="1" data-id="${item.id}">
                    <p class="precio">$${(item.precio * item.cantidad).toFixed(2)}</p>
                    <button class="eliminar-btn" data-id="${item.id}">Eliminar</button>
                </div>
            </section>
        `).join('');

        // Actualizar resumen
        this.actualizarResumen();

        // Agregar event listeners
        this.agregarEventListeners();
    }

    actualizarResumen() {
        const resumen = document.querySelector('.resumen');
        if (!resumen) return;

        const subtotal = this.obtenerSubtotal();
        const envio = this.obtenerEnvio();
        const total = subtotal + envio;

        resumen.querySelectorAll('p')[0].innerHTML = `<span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span>`;
        resumen.querySelectorAll('p')[1].innerHTML = `<span>Envío:</span> <span>$${envio.toFixed(2)}</span>`;
        resumen.querySelector('.total').innerHTML = `<span>Total:</span> <span>$${total.toFixed(2)}</span>`;
    }

    agregarEventListeners() {
        // Botones eliminar
        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                this.eliminarProducto(id);
            });
        });

        // Inputs de cantidad
        document.querySelectorAll('input.cantidad').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = Number(e.target.dataset.id);
                const cantidad = Math.max(1, parseInt(e.target.value) || 1);
                this.actualizarCantidad(id, cantidad);
            });
        });
    }

    actualizarIndicadores() {
        // Actualizar badge del carrito en el header si existe
        const totalItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
        const badges = document.querySelectorAll('[data-carrito-count]');
        badges.forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }

    mostrarNotificacion(mensaje) {
        // Crear notificación temporal
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--naranja);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
        `;
        notif.textContent = mensaje;

        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }

    inicializar() {
        // Si estamos en la página del carrito, renderizar
        if (document.querySelector('.carrito-items')) {
            this.renderizarCarrito();
        }

        // Agregar event listeners a los botones "Agregar al carrito" existentes
        this.conectarBotones();

        // Actualizar indicadores
        this.actualizarIndicadores();
    }

    conectarBotones() {
        document.addEventListener('click', async (e) => {
            const isAddBtn = e.target.matches('.add-to-cart') || e.target.textContent.trim() === 'Agregar al carrito';
            if (!isAddBtn) return;

            e.preventDefault();

            // Si es desde la página de detalle, el producto ya está disponible
            const detalleInfo = document.querySelector('.detalle-info');
            if (detalleInfo && e.target.matches('.add-to-cart') === false) {
                const producto = this.obtenerProductoDelDetalle();
                if (producto) {
                    this.agregarProducto(producto);
                    return;
                }
            }

            // Priorizar data- atributos si vienen en el botón
            const btn = e.target.closest('button');
            if (btn) {
                const did = btn.dataset.id;
                if (did) {
                    const producto = {
                        id: Number(did),
                        nombre: btn.dataset.nombre || btn.dataset.name || btn.getAttribute('data-nombre') || '' ,
                        precio: parseFloat(btn.dataset.precio) || parseFloat(btn.getAttribute('data-precio')) || 0,
                        imagen: btn.dataset.img || btn.getAttribute('data-img') || ''
                    };

                    this.agregarProducto(producto);
                    return;
                }
            }

            // Si es desde la lista de productos, obtener datos del card
            const card = e.target.closest('.producto-card');
            if (card) {
                const nombreEl = card.querySelector('h3 a');
                const nombre = nombreEl ? nombreEl.textContent : (card.dataset.nombre || '');
                const precioText = card.querySelector('.precio') ? card.querySelector('.precio').textContent : (card.dataset.precio || '0');
                const precio = parseFloat(String(precioText).replace('$', '').replace(' MXN', '')) || Number(card.dataset.precio) || 0;
                const imagen = card.querySelector('img') ? card.querySelector('img').src : (card.dataset.img || '');
                const id = Number(card.dataset.id) || (function(){
                    const a = card.querySelector('a');
                    if (!a) return NaN;
                    try { return Number(new URL(a.href, window.location.origin).searchParams.get('id')) } catch { return NaN }
                })();

                const producto = {
                    id,
                    nombre,
                    precio,
                    imagen
                };

                this.agregarProducto(producto);
            }
        });
    }

    obtenerProductoDelDetalle() {
        const detalleInfo = document.querySelector('.detalle-info');
        const detalleImg = document.querySelector('.detalle img');

        if (!detalleInfo || !detalleImg) return null;

        const nombre = detalleInfo.querySelector('h1').textContent;
        const precio = parseFloat(detalleInfo.querySelector('.precio').textContent.replace('$', '').replace(' MXN', ''));
        const imagen = detalleImg.src;

        // Extraer ID de la URL
        const params = new URLSearchParams(window.location.search);
        const id = Number(params.get('id'));

        return {
            id,
            nombre,
            precio,
            imagen
        };
    }
}

// Inicializar el carrito cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    window.carrito = new Carrito();
});

// Agregar estilos para la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
