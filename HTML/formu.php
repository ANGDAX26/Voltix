<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de sesión - Voltix</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
          crossorigin="anonymous">

    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/auth.css">
</head>

<body>

    <div id="header-placeholder"></div>

    <script>
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
            })
            .catch(error => {
                console.error('Error cargando header:', error);
                document.getElementById('header-placeholder').innerHTML = '<!-- header no cargado -->';
            });
    </script>

    <div class="auth-page">
        <main class="login-container">

            <h1>Iniciar sesión</h1>

            <p class="description">
                Accede a tu cuenta introduciendo tu usuario y contraseña.
            </p>

            <?php if (isset($_GET['error'])): ?>
                <div class="alert error">
                    <?php echo htmlspecialchars($_GET['error']); ?>
                </div>
            <?php endif; ?>

            <?php if (isset($_GET['registrado'])): ?>
                <div class="alert success">
                    Cuenta creada correctamente. Ya puedes iniciar sesión.
                </div>
            <?php endif; ?>

            <form action="../PHP/validar.php" method="POST">

                <label for="usuario">Usuario o correo</label>
                <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    placeholder="Ingresa tu usuario o correo"
                    autocomplete="username"
                    required
                >

                <label for="contrasena">Contraseña</label>
                <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    placeholder="Ingresa tu contraseña"
                    autocomplete="current-password"
                    required
                >

                <button type="submit">Entrar</button>

            </form>

            <div class="login-footer">
                ¿No tienes cuenta?
                <a href="registro.php">Regístrate</a>
            </div>

        </main>
    </div>

    <script src="../JS/carrito.js"></script>
    <script src="../JS/buscador.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
            crossorigin="anonymous"></script>

</body>
</html>
