<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de cuenta</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/auth.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>

<body>

    <main class="register-container">

        <h1 align="center">Crear cuenta</h1>

        <form action="#" method="post">

            <label for="nombre">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre completo" required>

            <label for="correo">Correo electrónico</label>
            <input type="email" id="correo" name="correo" placeholder="Ingresa tu correo" required>

            <label for="usuario">Nombre de usuario</label>
            <input type="text" id="usuario" name="usuario" placeholder="Crea un usuario" required>

            <label for="contrasena">Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" placeholder="Crea una contraseña" required>

            <label for="confirmar">Confirmar contraseña</label>
            <input type="password" id="confirmar" name="confirmar" placeholder="Repite la contraseña" required>

            <button type="submit">Registrarse</button>

        </form>

        <div class="register-footer">
            <p>Completa tus datos para crear una cuenta.</p>
            ¿Ya tienes cuenta? <a href="iniciosesion.html">Inicia sesión</a>
        </div>

    </main>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

    </body>
    </html>