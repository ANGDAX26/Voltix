<?php
require_once '../PHP/sesion.php';
requerirAdminPagina('formu.php');
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voltix - Panel de Administración</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/admin.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>

<body>

    <main class="admin-main">

        <h1>PANEL DE ADMINISTRACIÓN</h1>

        <div class="admin-nota">
            Desde este panel puedes administrar el <strong>Hero de la página de inicio</strong> y los <strong>productos de Voltix</strong>.
        </div>

        <div id="admin-aviso" class="admin-aviso" style="display:none;"></div>

        <section class="admin-panel">
            <h2 id="hero-form-titulo">Administrar Hero</h2>

            <p class="admin-ayuda">
                Cada elemento corresponde a un banner del carrusel principal de la página de inicio.
                Puedes agregar, editar o eliminar banners sin modificar el código de Index.php.
            </p>

            <form id="form-hero" class="admin-form">
                <div class="admin-form-grid">
                    <label>
                        Título
                        <input type="text" id="hero-titulo" required placeholder="Ej. Kits Arduino para Principiantes">
                    </label>

                    <label>
                        Subtítulo
                        <input type="text" id="hero-subtitulo" placeholder="Ej. Hasta 30% de descuento">
                    </label>

                    <label>
                        URL de imagen
                        <input type="text" id="hero-imagen" required placeholder="https://... o ../IMG/banner.jpg">
                    </label>

                    <label>
                        Enlace del botón
                        <input type="text" id="hero-enlace" placeholder="producto.php?id=2">
                    </label>

                    <label>
                        Texto del botón
                        <input type="text" id="hero-texto-boton" value="Ver producto" placeholder="Ver producto">
                    </label>

                    <label>
                        Orden
                        <input type="number" id="hero-orden" min="1" value="1" required>
                    </label>
                </div>

                <div class="admin-form-botones">
                    <button type="submit" class="btn-guardar">Guardar en Hero</button>
                    <button type="button" id="btn-cancelar-hero" style="display:none;" class="btn-cancelar">Cancelar edición</button>
                </div>
            </form>

            <div class="admin-tabla-header" style="margin-top: 1.5rem;">
                <h2>Elementos del Hero (<span id="contador-hero"></span>)</h2>
            </div>

            <div class="admin-tabla-wrap">
                <table class="admin-tabla">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Título</th>
                            <th>Subtítulo</th>
                            <th>Orden</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-hero-body"></tbody>
                </table>
            </div>
        </section>

        <!-- ==================== PRODUCTOS ==================== -->
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
    <button type="button" id="btn-guardar" onclick="location.href='../PHP/cerrar.php'" class="btn-guardar" style="margin-left:48%; margin-bottom: 5%;">
        Cerrar sesión
    </button>




    <div id="footer-placeholder"></div>

    <script>
        fetch('footera.php')
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
    <script src="../JS/admin.js?v=3"></script>

</body>

</html>
