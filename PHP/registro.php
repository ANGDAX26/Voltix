<?php
require_once 'conexion.php';
require_once 'sesion.php';

function volverConError(string $mensaje): void
{
    header('Location: ../HTML/registro.php?error=' . urlencode($mensaje));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../HTML/registro.php');
    exit();
}

$nombre     = trim($_POST['nombre'] ?? '');
$correo     = trim($_POST['correo'] ?? '');
$usuario    = trim($_POST['usuario'] ?? '');
$contrasena = $_POST['contrasena'] ?? '';
$confirmar  = $_POST['confirmar'] ?? '';

if ($nombre === '' || $correo === '' || $usuario === '' || $contrasena === '' || $confirmar === '') {
    volverConError('Completa todos los campos.');
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    volverConError('El correo no es válido.');
}

if (strlen($usuario) > 20) {
    volverConError('El nombre de usuario debe tener máximo 20 caracteres.');
}

if (strlen($contrasena) < 6) {
    volverConError('La contraseña debe tener al menos 6 caracteres.');
}

if ($contrasena !== $confirmar) {
    volverConError('Las contraseñas no coinciden.');
}

// Verificar que el usuario o correo no existan ya
$sql = "SELECT id_usuario FROM usuario WHERE nombreU = ? OR correoU = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param('ss', $usuario, $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conexion->close();
    volverConError('Ese usuario o correo ya está registrado.');
}
$stmt->close();

$hash = password_hash($contrasena, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuario (nombreU, nombre, correoU, contrasena) VALUES (?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param('ssss', $usuario, $nombre, $correo, $hash);

if ($stmt->execute()) {
    $stmt->close();
    $conexion->close();
    header('Location: ../HTML/formu.php?registrado=1');
    exit();
} else {
    $error = $stmt->error;
    $stmt->close();
    $conexion->close();
    volverConError('No se pudo registrar la cuenta: ' . $error);
}
