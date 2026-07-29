<?php

// Conexión a la base de datos "voltix"
$servidor = "localhost";
$puerto = "3306"; 
$usuario_db = "root";
$password_db = "";
$base_datos = "voltix";

$conexion = new mysqli($servidor, $usuario_db, $password_db, $base_datos, $puerto);
$conexion->set_charset("utf8mb4");

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
