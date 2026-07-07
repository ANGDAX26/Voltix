async function cargarDetalle() {

    const params = new URLSearchParams(window.location.search);

    const id = Number(params.get("id"));

    const respuesta = await fetch("productos.json");

    const productos = await respuesta.json();

    const producto = productos.find(p => p.id === id);

    if (!producto) {

        document.getElementById("detalle-producto").innerHTML =
            "<h1>Producto no encontrado</h1>";

        return;
    }

    document.getElementById("detalle-producto").innerHTML = `
        <div class="detalle">

            <img src="${producto.imagen}"
                 alt="${producto.nombre}"
                 width="400">

            <h1>${producto.nombre}</h1>

            <h2>$${producto.precio} MXN</h2>

            <p>${producto.descripcion}</p>

            <button>Agregar al carrito</button>

        </div>
    `;
}

cargarDetalle();