const STORAGE_KEY = 'voltix_productos_admin';

let productos = [];
let editandoId = null;

/* ---------- Carga inicial ---------- */
async function iniciar() {
    const guardado = localStorage.getItem(STORAGE_KEY);

    if (guardado) {
        productos = JSON.parse(guardado);
        mostrarAviso('Mostrando cambios guardados en este navegador. Si quieres partir del productos.json original, usa "Restablecer".');
    } else {
        try {
            const respuesta = await fetch('productos.json');
            if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
            productos = await respuesta.json();
        } catch (e) {
            console.error('Error cargando productos.json:', e);
            productos = [];
            mostrarAviso('No se pudo cargar productos.json. Empezando con una lista vacía.', true);
        }
    }

    renderizarTabla();
}

function guardarEnLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
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

    tbody.innerHTML = productos.map(p => `
        <tr>
            <td class="admin-col-img"><img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}" onerror="this.src='https://placehold.co/60x60?text=%3F'"></td>
            <td>${escapeHtml(p.nombre)}</td>
            <td>${escapeHtml(p.categoria)}</td>
            <td>$${Number(p.precio).toFixed(2)} MXN</td>
            <td>${p.id}</td>
            <td class="admin-col-acciones">
                <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
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
    document.getElementById('input-categoria').value = producto.categoria;
    document.getElementById('input-imagen').value = producto.imagen;
    document.getElementById('input-descripcion').value = producto.descripcion;
    document.getElementById('btn-cancelar-edicion').style.display = 'inline-block';

    document.getElementById('form-producto').scrollIntoView({ behavior: 'smooth' });
}

function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const confirmado = confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    productos = productos.filter(p => p.id !== id);
    guardarEnLocalStorage();
    renderizarTabla();

    if (editandoId === id) limpiarFormulario();
}

function siguienteId() {
    if (productos.length === 0) return 1;
    return Math.max(...productos.map(p => p.id)) + 1;
}

document.addEventListener('DOMContentLoaded', () => {
    iniciar();

    document.getElementById('form-producto').addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('input-nombre').value.trim();
        const precio = parseFloat(document.getElementById('input-precio').value);
        const categoria = document.getElementById('input-categoria').value.trim();
        const imagen = document.getElementById('input-imagen').value.trim();
        const descripcion = document.getElementById('input-descripcion').value.trim();

        if (!nombre || isNaN(precio) || !categoria || !imagen) {
            mostrarAviso('Completa nombre, precio, categoría e imagen.', true);
            return;
        }

        if (editandoId !== null) {
            const producto = productos.find(p => p.id === editandoId);
            Object.assign(producto, { nombre, precio, categoria, imagen, descripcion });
            mostrarAviso(`Producto "${nombre}" actualizado.`);
        } else {
            productos.push({ id: siguienteId(), nombre, precio, categoria, imagen, descripcion });
            mostrarAviso(`Producto "${nombre}" agregado.`);
        }

        guardarEnLocalStorage();
        renderizarTabla();
        limpiarFormulario();
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
        mostrarAviso('Descargado. Reemplaza el archivo productos.json de tu proyecto con este para publicar los cambios.');
    });

    document.getElementById('btn-restablecer').addEventListener('click', async () => {
        const confirmado = confirm('Esto descarta los cambios guardados en este navegador y vuelve a cargar productos.json original. ¿Continuar?');
        if (!confirmado) return;

        localStorage.removeItem(STORAGE_KEY);
        try {
            const respuesta = await fetch('productos.json');
            productos = await respuesta.json();
            mostrarAviso('Restablecido a productos.json original.');
        } catch (e) {
            productos = [];
            mostrarAviso('No se pudo recargar productos.json.', true);
        }
        renderizarTabla();
        limpiarFormulario();
    });
});

function mostrarAviso(mensaje, esError = false) {
    const aviso = document.getElementById('admin-aviso');
    aviso.textContent = mensaje;
    aviso.className = esError ? 'admin-aviso admin-aviso-error' : 'admin-aviso';
    aviso.style.display = 'block';
    clearTimeout(mostrarAviso._t);
    mostrarAviso._t = setTimeout(() => { aviso.style.display = 'none'; }, 5000);
}
