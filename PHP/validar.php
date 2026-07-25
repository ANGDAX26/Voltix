<?php
require_once 'conexion.php';
require_once 'sesion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../HTML/formu.php");
    exit();
}

$usuario = trim($_POST['usuario'] ?? '');
$password = $_POST['contrasena'] ?? '';

if ($usuario === '' || $password === '') {
    header("Location: ../HTML/formu.php?error=" . urlencode("Completa usuario y contraseña."));
    exit();
}

// Permite entrar con nombre de usuario O correo
$sql = "SELECT id_usuario, nombreU, contrasena, rol FROM usuario WHERE nombreU = ? OR correoU = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $usuario);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {

    $fila = $resultado->fetch_assoc();

    if (password_verify($password, $fila['contrasena'])) {

        // Regenerar el id de sesión al iniciar sesión (buena práctica de seguridad)
        session_regenerate_id(true);

        $_SESSION["id_usuario"] = $fila['id_usuario'];
        $_SESSION["usuario"]    = $fila['nombreU'];
        $_SESSION["rol"]        = $fila['rol'];

        $stmt->close();
        $conexion->close();

        if ($fila['rol'] === 'admin') {
            header("Location: ../HTML/admin.php");
        } else {
            header("Location: ../HTML/Index.php");
        }
        exit();

    } else {
        $stmt->close();
        $conexion->close();
        header("Location: ../HTML/formu.php?error=" . urlencode("Contraseña incorrecta."));
        exit();
    }

} else {
    $stmt->close();
    $conexion->close();
    header("Location: ../HTML/formu.php?error=" . urlencode("Usuario no encontrado."));
    exit();
}
