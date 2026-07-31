async function cargarProductos() {

    const contenedor = document.getElementById('productos');
    if (!contenedor) return;

    // Si el contenedor tiene data-categoria="Sensores", solo se muestran
    // los productos de esa categoría (usado en sensores.html).
    const categoria = contenedor.dataset.categoria;

    try {
        const url = categoria
            ? `../PHP/productos.php?categoria=${encodeURIComponent(categoria)}`
            : '../PHP/productos.php';

        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

        const listaAMostrar = await respuesta.json();

        if (listaAMostrar.length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
            return;
        }

        contenedor.innerHTML = listaAMostrar.map(producto => `
            <div class="producto-card" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-img="${producto.imagen}">

                <a href="producto.php?id=${producto.id}">
                    <img src="${producto.imagen}"
                         alt="${producto.nombre}">
                </a>

                <h3><a href="producto.php?id=${producto.id}">${producto.nombre}</a></h3>

                <p class="precio">$${producto.precio.toFixed(2)} MXN</p>

                ${producto.stock === 0
                    ? '<p class="stock-indicator agotado">❌ Agotado</p>'
                    : producto.stock <= 5
                        ? `<p class="stock-indicator bajo">⚠️ Últimas ${producto.stock} unidades</p>`
                        : `<p class="stock-indicator disponible">✅ En stock (${producto.stock})</p>`
                }

                <button class="add-to-cart" ${producto.stock === 0 ? 'disabled title="Sin stock"' : ''} data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-img="${producto.imagen}">Agregar al carrito</button>

            </div>
        `).join('');

    } catch (e) {
        console.error('Error cargando productos:', e);
        contenedor.innerHTML = '<p>No se pudieron cargar los productos.</p>';
    }
}

cargarProductos();
