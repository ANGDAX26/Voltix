const STORAGE_KEY = 'voltix_productos_admin';
const PRODUCTOS_JSON_PATH = '../JSON/productos.json';

let productos = [];
let editandoId = null;

/* ---------- Carga inicial ---------- */
async function iniciar() {
    const guardado = localStorage.getItem(STORAGE_KEY);

    if (guardado) {
        productos = JSON.parse(guardado);
        mostrarAviso('Mostrando productos guardados en el navegador');
    } else {
        try {
            const respuesta = await fetch(PRODUCTOS_JSON_PATH);
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
        const confirmado = confirm('Esto descarta los cambios guardados en este navegador y vuelve a cargar productos.json original. ¿Continuar?');
        if (!confirmado) return;

        localStorage.removeItem(STORAGE_KEY);
        try {
            const respuesta = await fetch(PRODUCTOS_JSON_PATH);
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

        productos = filas.map(fila => {
            const nombre = String(fila.nombre ?? fila.Nombre ?? fila.name ?? fila.Name ?? '').trim();
            const precio = Number(fila.precio ?? fila.Precio ?? fila.price ?? fila.Price ?? 0);
            const categoria = String(fila.categoria ?? fila.Categoria ?? fila.category ?? fila.Category ?? '').trim();
            const imagen = String(fila.imagen ?? fila.Imagen ?? fila.image ?? fila.Image ?? '').trim();
            const descripcion = String(fila.descripcion ?? fila.Descripcion ?? fila.description ?? fila.Description ?? '').trim();
            const idBruto = fila.id ?? fila.ID ?? fila.Id ?? null;
            const id = idBruto !== null && idBruto !== undefined && String(idBruto).trim() !== '' ? Number(idBruto) : null;
            return { id, nombre, precio, categoria, imagen, descripcion };
        }).filter(producto => producto.nombre && !isNaN(producto.precio) && producto.categoria && producto.imagen);

        if (!productos.length) {
            throw new Error('No se encontró ninguna fila válida con nombre, precio, categoría e imagen.');
        }

        asignarIdsUnicas();
        guardarEnLocalStorage();
        renderizarTabla();
        limpiarFormulario();
        mostrarAviso(`Importados ${productos.length} productos desde ${archivo.name}.`);
    } catch (error) {
        console.error('Error importando archivo:', error);
        mostrarAviso(error.message || 'Error al importar archivo.', true);
    }
}

function asignarIdsUnicas() {
    let siguiente = productos.reduce((max, producto) => {
        const id = typeof producto.id === 'number' && !isNaN(producto.id) ? producto.id : 0;
        return Math.max(max, id);
    }, 0);

    const usados = new Set();
    productos = productos.map(producto => {
        if (!producto.id || isNaN(producto.id) || usados.has(producto.id)) {
            siguiente += 1;
            producto.id = siguiente;
        }
        usados.add(producto.id);
        return producto;
    });
}

function mostrarAviso(mensaje, esError = false) {
    const aviso = document.getElementById('admin-aviso');
    aviso.textContent = mensaje;
    aviso.className = esError ? 'admin-aviso admin-aviso-error' : 'admin-aviso';
    aviso.style.display = 'block';
    clearTimeout(mostrarAviso._t);
    mostrarAviso._t = setTimeout(() => { aviso.style.display = 'none'; }, 5000);
}
