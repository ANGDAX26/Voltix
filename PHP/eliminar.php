<?php

require_once('conexion.php');

$id = 1;
$sql = "DELETE FROM usuarios WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "Registro eliminado correctamente.";
} else {
    echo "Error al eliminar el registro: " . $stmt->error;
}
$stmt->close();
$conexion->close();
?>