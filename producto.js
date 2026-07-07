async function cargarProductos() {

    const respuesta = await fetch('productos.json');
    const productos = await respuesta.json();

    const contenedor = document.getElementById('productos');

    productos.forEach(producto => {

        contenedor.innerHTML += `
            <div class="producto-card">

                <a href="producto.html?id=${producto.id}">
                    <img src="${producto.imagen}"
                         alt="${producto.nombre}">
                </a>

                <h3>${producto.nombre}</h3>

                <p>Precio: $${producto.precio} MXN</p>

                <button>Agregar al carrito</button>

            </div>
        `;
    });

}

cargarProductos();