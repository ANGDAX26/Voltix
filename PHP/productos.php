<?php
require_once 'conexion.php';
header('Content-Type: application/json; charset=utf-8');

// GET /PHP/productos.php               -> todos los productos
// GET /PHP/productos.php?id=3          -> un producto
// GET /PHP/productos.php?categoria=Sensores -> productos de una categoría

$id = $_GET['id'] ?? null;
$categoria = $_GET['categoria'] ?? null;

$sqlBase = "SELECT p.id_productos AS id, p.nombreP AS nombre, p.precio, p.stock,
                   p.descripcion, p.imagen, c.nombre_categoria AS categoria
            FROM productos p
            JOIN categoria c ON c.id_categoria = p.id_categoria";

if ($id !== null) {
    $sql = $sqlBase . " WHERE p.id_productos = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $fila = $resultado->fetch_assoc();
    $stmt->close();
    $conexion->close();

    if (!$fila) {
        http_response_code(404);
        echo json_encode(['error' => 'Producto no encontrado']);
        exit();
    }

    $fila['id'] = (int) $fila['id'];
    $fila['precio'] = (float) $fila['precio'];
    $fila['stock'] = (int) $fila['stock'];
    echo json_encode($fila);
    exit();
}

if ($categoria !== null && $categoria !== '') {
    $categoria = trim($categoria);
    $sql = $sqlBase . " WHERE TRIM(LOWER(c.nombre_categoria)) = TRIM(LOWER(?)) ORDER BY p.id_productos DESC";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('s', $categoria);
    $stmt->execute();
    $resultado = $stmt->get_result();
} else {
    $sql = $sqlBase . " ORDER BY p.id_productos DESC";
    $resultado = $conexion->query($sql);
}

$productos = [];
while ($fila = $resultado->fetch_assoc()) {
    $fila['id'] = (int) $fila['id'];
    $fila['precio'] = (float) $fila['precio'];
    $fila['stock'] = (int) $fila['stock'];
    $productos[] = $fila;
}

if (isset($stmt)) {
    $stmt->close();
}
$conexion->close();

echo json_encode($productos);
