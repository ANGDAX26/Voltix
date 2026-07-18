async function cargarProductos() {

    const contenedor = document.getElementById('productos');
    if (!contenedor) return;

    // Si el contenedor tiene data-categoria="Sensores", solo se muestran
    // los productos de esa categoría (usado en sensores.html).
    const categoria = contenedor.dataset.categoria;

    try {
        const respuesta = await fetch('../JSON/productos.json');
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

        const productos = await respuesta.json();

        const listaAMostrar = categoria
            ? productos.filter(p => p.categoria === categoria)
            : productos;

        if (listaAMostrar.length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
            return;
        }

        contenedor.innerHTML = listaAMostrar.map(producto => `
            <div class="producto-card" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-img="${producto.imagen}">

                <a href="producto.html?id=${producto.id}">
                    <img src="${producto.imagen}"
                         alt="${producto.nombre}">
                </a>

                <h3><a href="producto.html?id=${producto.id}">${producto.nombre}</a></h3>

                <p class="precio">$${producto.precio.toFixed(2)} MXN</p>

                <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-img="${producto.imagen}">Agregar al carrito</button>

            </div>
        `).join('');

    } catch (e) {
        console.error('Error cargando productos:', e);
        contenedor.innerHTML = '<p>No se pudieron cargar los productos.</p>';
    }
}

cargarProductos();
