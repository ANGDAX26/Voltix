<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voltix - Panel de Administración</title>
    <link rel="stylesheet" href="/CSS/style.css">
    <link rel="stylesheet" href="/CSS/admin.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>

<body>

   


    <main class="admin-main">

        <h1>PANEL DE ADMINISTRACIÓN</h1>

        <div class="admin-nota">
            <strong>Nota:</strong> <strong>"Descargar productos.json"</strong>
            
        </div>

        <div id="admin-aviso" class="admin-aviso" style="display:none;"></div>

        <section class="admin-panel">
            <h2 id="form-titulo">Agregar producto</h2>

            <form id="form-producto" class="admin-form">
                <div class="admin-form-grid">
                    <label>
                        Nombre
                        <input type="text" id="input-nombre" required>
                    </label>

                    <label>
                        Precio (MXN)
                        <input type="number" id="input-precio" step="0.01" min="0" required>
                    </label>

                    <label>
                        Categoría
                        <input type="text" id="input-categoria" list="lista-categorias" required placeholder="Ej. Sensores">
                        <datalist id="lista-categorias">
                            <option value="Sensores">
                            <option value="Kits educativos">
                            <option value="Componentes electrónicos">
                            <option value="Herramientas">
                            <option value="Cables">
                        </datalist>
                    </label>

                    <label>
                        URL de imagen
                        <input type="url" id="input-imagen" required placeholder="https://...">
                    </label>
                </div>

                <label class="admin-form-full">
                    Descripción
                    <textarea id="input-descripcion" rows="3"></textarea>
                </label>

                <div class="admin-form-botones">
                    <button type="submit" class="btn-guardar">Guardar producto</button>
                    <button type="button" id="btn-cancelar-edicion" style="display:none;" class="btn-cancelar">Cancelar edición</button>
                </div>
            </form>
        </section>

        <section class="admin-panel">
            <h2>Importar y reportar</h2>
            <div class="admin-form-grid">
                <label>
                    Subir archivo Excel / CSV
                    <input type="file" id="input-archivo-excel" accept=".xlsx,.xls,.csv">
                </label>
            </div>
            <div class="admin-form-botones">
                <button type="button" id="btn-importar-excel" class="btn-guardar">Importar desde archivo</button>
                <button type="button" id="btn-descargar-reporte" class="btn-descargar">Descargar reporte CSV</button>
            </div>
            <p class="admin-ayuda">El archivo debe contener columnas: <strong>nombre</strong>, <strong>precio</strong>, <strong>categoria</strong>, <strong>imagen</strong>, <strong>descripcion</strong> e <strong>id</strong> (opcional).</p>
        </section>

        <section class="admin-panel">
            <div class="admin-tabla-header">
                <h2>Productos (<span id="contador-productos"></span>)</h2>
                <div class="admin-tabla-botones">
                    <button id="btn-descargar" class="btn-descargar">Descargar productos.json</button>
                    <button id="btn-restablecer" class="btn-restablecer">Restablecer original</button>
                </div>
            </div>

            <div class="admin-tabla-wrap">
                <table class="admin-tabla">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>ID</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-productos-body"></tbody>
                </table>
            </div>
        </section>

    </main>

    <div id="footer-placeholder"></div>

    <script>
        fetch('footera.html')
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(e => {
                console.error('Error cargando footer:', e);
                document.getElementById('footer-placeholder').innerHTML = '<!-- footer no cargado -->';
            });
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="/JS/admin.js"></script>

</body>

</html>
