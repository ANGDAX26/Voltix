<?php
// Conexión a la base de datos "voltix" (ver DATABASE/voltix_schema.sql)
$servidor   = "localhost";
$usuario_db = "root";
$password_db = "";
$base_datos = "voltix";

$conexion = new mysqli($servidor, $usuario_db, $password_db, $base_datos);
$conexion->set_charset("utf8mb4");

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
