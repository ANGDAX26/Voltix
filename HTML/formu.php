<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de sesión</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/auth.css">
</head>
<body>
    <br>
    <main class="login-container">
        <h1 align="center">Iniciar sesión</h1>

        <?php if (isset($_GET['error'])): ?>
            <p style="color:#c0392b; text-align:center; font-weight:600;">
                <?php echo htmlspecialchars($_GET['error']); ?>
            </p>
        <?php endif; ?>

        <?php if (isset($_GET['registrado'])): ?>
            <p style="color:#1e7e34; text-align:center; font-weight:600;">
                Cuenta creada correctamente. Ya puedes iniciar sesión.
            </p>
        <?php endif; ?>

        <form action="../PHP/validar.php" method="POST">
            <label for="usuario">Usuario o correo</label>
            <input type="text" id="usuario" name="usuario" placeholder="Ingresa tu usuario" required>

            <label for="contrasena">Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" placeholder="Ingresa tu contraseña" required>

            <button type="submit">Entrar</button>
        </form>
        <div class="login-footer">
            <p class="description" align="center">Accede a tu cuenta introduciendo tu usuario y contraseña.</p>
            ¿No tienes cuenta? <a href="registro.php">Regístrate</a>
        </div>

    </main>
    <br>

</body>
</html>