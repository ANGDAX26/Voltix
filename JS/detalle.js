async function cargarDetalle() {

    const contenedor = document.getElementById('detalle-producto');
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));

    try {
        const respuesta = await fetch('productos.json');
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

        const productos = await respuesta.json();
        const producto = productos.find(p => p.id === id);

        if (!producto) {
            contenedor.innerHTML = `
                <div class="detalle">
                    <h1>Producto no encontrado</h1>
                    <p><a href="Voltix.html">&larr; Volver a la tienda</a></p>
                </div>
            `;
            return;
        }

        document.title = `${producto.nombre} — Voltix`;

        contenedor.innerHTML = `
            <div class="detalle">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="detalle-info">
                    <p class="detalle-categoria">${producto.categoria}</p>
                    <h1>${producto.nombre}</h1>
                    <p class="precio">$${producto.precio.toFixed(2)} MXN</p>
                    <p class="detalle-descripcion">${producto.descripcion}</p>
                    <button>Agregar al carrito</button>
                    <p><a href="Voltix.html">&larr; Volver a la tienda</a></p>
                </div>

            </div>
        `;

    } catch (e) {
        console.error('Error cargando el producto:', e);
        contenedor.innerHTML = '<h1>No se pudo cargar el producto.</h1>';
    }
}

cargarDetalle();
