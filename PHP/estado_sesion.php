<?php
require_once 'sesion.php';

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'logueado' => usuarioLogueado(),
    'es_admin' => esAdmin()
]);
