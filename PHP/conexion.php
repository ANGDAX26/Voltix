<?php
// Conexión a la base de datos "voltix"
$servidor = "localhost";
$puerto = "añada su puerto";
$usuario_db = "root";
$password_db = "";
$base_datos = "voltix";

$conexion = new mysqli($servidor, $usuario_db, $password_db, $base_datos, $puerto);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

$conexion->set_charset("utf8mb4");
?>