<?php
require_once 'conexion.php';

// Verificar que se hayan enviado los datos requeridos
if (isset($_POST['usuario'], $_POST['correo'], $_POST['contrasena'])) {

    $usuario = $_POST['usuario'];
    $correo = $_POST['correo'];
    $password = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (usuario, correo, contrasena) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sss", $usuario, $correo, $password);

        if ($stmt->execute()) {
            echo "Usuario registrado correctamente.";
        } else {
            echo "Error al registrar el usuario: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Error al preparar la consulta: " . $conexion->error;
    }

} else {
    echo "Por favor completa todos los campos del formulario.";
}

// Cierra la conexión únicamente al finalizar todo el proceso
$conexion->close();
?>