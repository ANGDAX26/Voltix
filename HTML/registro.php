<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de cuenta - Voltix</title>

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
        <main class="register-container">

            <h1>Crear cuenta</h1>

            <p class="description">
                Completa tus datos para crear una cuenta en Voltix.
            </p>

            <?php if (isset($_GET['error'])): ?>
                <div class="alert error">
                    <?php echo htmlspecialchars($_GET['error']); ?>
                </div>
            <?php endif; ?>

            <form action="../PHP/registro.php" method="post">

                <label for="nombre">Nombre completo</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingresa tu nombre completo"
                    autocomplete="name"
                    required
                >

                <label for="correo">Correo electrónico</label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    placeholder="Ingresa tu correo"
                    autocomplete="email"
                    required
                >

                <label for="usuario">Nombre de usuario</label>
                <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    placeholder="Crea un usuario"
                    autocomplete="username"
                    required
                >

                <label for="contrasena">Contraseña</label>
                <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    placeholder="Crea una contraseña"
                    autocomplete="new-password"
                    required
                >

                <label for="confirmar">Confirmar contraseña</label>
                <input
                    type="password"
                    id="confirmar"
                    name="confirmar"
                    placeholder="Repite la contraseña"
                    autocomplete="new-password"
                    required
                >

                <button type="submit">Registrarse</button>

            </form>

            <div class="register-footer">
                ¿Ya tienes cuenta?
                <a href="formu.php">Inicia sesión</a>
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
