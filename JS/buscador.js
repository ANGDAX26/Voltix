

(function () {
    let productos = null;
    let productosPromesa = null;
    let indiceActivo = -1;

    function normalizar(texto) {
        return (texto || '')
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // quita acentos
            .toLowerCase()
            .trim();
    }

    function cargarProductos() {
        if (productosPromesa) return productosPromesa;

        productosPromesa = fetch('../JSON/productos.json')
            .then(res => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(data => {
                productos = data;
                return productos;
            })
            .catch(e => {
                console.error('Error cargando productos para el buscador:', e);
                productos = [];
                return productos;
            });

        return productosPromesa;
    }

    function filtrarProductos(termino) {
        const q = normalizar(termino);
        if (!q) return [];

        return productos
            .filter(p =>
                normalizar(p.nombre).includes(q) ||
                normalizar(p.categoria).includes(q) ||
                normalizar(p.descripcion).includes(q)
            )
            .slice(0, 8);
    }

    function renderResultados(contenedor, lista, termino) {
        indiceActivo = -1;

        if (!termino.trim()) {
            contenedor.innerHTML = '';
            contenedor.classList.remove('abierto');
            return;
        }

        if (lista.length === 0) {
            contenedor.innerHTML = '<div class="buscador-sin-resultados">Sin resultados para "' + escaparHTML(termino) + '"</div>';
            contenedor.classList.add('abierto');
            return;
        }

        contenedor.innerHTML = lista.map(p => `
            <div class="buscador-item" data-id="${p.id}" role="option">
                <img src="${p.imagen}" alt="${escaparHTML(p.nombre)}" loading="lazy">
                <div class="buscador-item-info">
                    <h4>${escaparHTML(p.nombre)}</h4>
                    <span>${escaparHTML(p.categoria)}</span>
                </div>
                <div class="buscador-item-precio">$${Number(p.precio).toFixed(2)}</div>
            </div>
        `).join('');

        contenedor.classList.add('abierto');
    }

    function escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto == null ? '' : String(texto);
        return div.innerHTML;
    }

    function irAProducto(id) {
        window.location.href = 'producto.html?id=' + encodeURIComponent(id);
    }

    function cerrarResultados(contenedor) {
        contenedor.classList.remove('abierto');
        contenedor.innerHTML = '';
        indiceActivo = -1;
    }

    // --- Escritura en el buscador ---
    document.addEventListener('input', function (e) {
        if (!e.target.matches('#buscador-input')) return;

        const input = e.target;
        const contenedor = document.getElementById('buscador-resultados');
        if (!contenedor) return;

        const termino = input.value;

        if (!termino.trim()) {
            renderResultados(contenedor, [], termino);
            return;
        }

        contenedor.innerHTML = '<div class="buscador-cargando">Buscando...</div>';
        contenedor.classList.add('abierto');

        cargarProductos().then(() => {
            // Evita mostrar resultados viejos si el usuario ya cambió el texto
            if (input.value !== termino) return;
            const resultados = filtrarProductos(termino);
            renderResultados(contenedor, resultados, termino);
        });
    });

    // --- Click en un resultado ---
    document.addEventListener('click', function (e) {
        const item = e.target.closest('.buscador-item');
        if (item) {
            irAProducto(item.dataset.id);
            return;
        }

        if (!e.target.closest('.buscador-contenedor')) {
            const contenedor = document.getElementById('buscador-resultados');
            if (contenedor) cerrarResultados(contenedor);
        }
    });

    // --- Navegación con teclado (flechas, Enter, Escape) ---
    document.addEventListener('keydown', function (e) {
        if (!e.target.matches('#buscador-input')) return;

        const contenedor = document.getElementById('buscador-resultados');
        if (!contenedor || !contenedor.classList.contains('abierto')) return;

        const items = Array.from(contenedor.querySelectorAll('.buscador-item'));
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            indiceActivo = (indiceActivo + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            indiceActivo = (indiceActivo - 1 + items.length) % items.length;
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const elegido = indiceActivo >= 0 ? items[indiceActivo] : items[0];
            irAProducto(elegido.dataset.id);
            return;
        } else if (e.key === 'Escape') {
            cerrarResultados(contenedor);
            e.target.blur();
            return;
        } else {
            return;
        }

        items.forEach((it, i) => it.classList.toggle('activo', i === indiceActivo));
        items[indiceActivo].scrollIntoView({ block: 'nearest' });
    });

   
    cargarProductos();
})();