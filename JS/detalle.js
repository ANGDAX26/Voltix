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

        contenedor.innerHTML = `
            <div class="detalle">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="detalle-info">
                    <p class="detalle-categoria">${producto.categoria}</p>
                    <h1>${producto.nombre}</h1>
                    <p class="precio">$${precio.toFixed(2)} MXN</p>
                    <p class="detalle-descripcion">${producto.descripcion}</p>
                    <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${precio}" data-img="${producto.imagen}">Agregar al carrito</button>
                    <p><a href="Index.php">&larr; Volver a la tienda</a></p>
                </div>

            </div>
        `;

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
