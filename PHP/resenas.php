<?php
require_once 'conexion.php';
require_once 'sesion.php';
header('Content-Type: application/json; charset=utf-8');

// GET /PHP/resenas.php?id_producto=3 → lista de reseñas del producto
// POST /PHP/resenas.php               → crear reseña (requiere sesión)

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $idProducto = (int) ($_GET['id_producto'] ?? 0);

    if ($idProducto <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de producto inválido.']);
        exit();
    }

    $sql = "SELECT r.id_resena, r.calificacion, r.comentario, r.fecha,
                   u.nombreU
            FROM resenas r
            JOIN usuario u ON u.id_usuario = r.id_usuario
            WHERE r.id_producto = ?
            ORDER BY r.fecha DESC";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $idProducto);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $resenas = [];
    while ($fila = $resultado->fetch_assoc()) {
        $fila['calificacion'] = (int) $fila['calificacion'];
        $resenas[] = $fila;
    }
    $stmt->close();

    $yaReseno = false;
    if (usuarioLogueado()) {
        $idUsuario = (int) $_SESSION['id_usuario'];
        $check = $conexion->prepare("SELECT id_resena FROM resenas WHERE id_producto = ? AND id_usuario = ?");
        $check->bind_param('ii', $idProducto, $idUsuario);
        $check->execute();
        $check->store_result();
        $yaReseno = $check->num_rows > 0;
        $check->close();
    }

    $conexion->close();

    echo json_encode([
        'resenas'  => $resenas,
        'logueado' => usuarioLogueado(),
        'ya_reseno' => $yaReseno,
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requerirLoginApi();

    $datos        = json_decode(file_get_contents('php://input'), true) ?? [];
    $idProducto   = (int) ($datos['id_producto']  ?? 0);
    $calificacion = (int) ($datos['calificacion'] ?? 0);
    $comentario   = trim($datos['comentario']      ?? '');
    $idUsuario    = (int) $_SESSION['id_usuario'];

    if ($idProducto <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de producto inválido.']);
        exit();
    }

    if ($calificacion < 1 || $calificacion > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'La calificación debe ser entre 1 y 5.']);
        exit();
    }

    if (mb_strlen($comentario) < 5) {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario debe tener al menos 5 caracteres.']);
        exit();
    }

    if (mb_strlen($comentario) > 500) {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede superar los 500 caracteres.']);
        exit();
    }

    // Un usuario solo puede dejar una reseña por producto
    $check = $conexion->prepare("SELECT id_resena FROM resenas WHERE id_producto = ? AND id_usuario = ?");
    $check->bind_param('ii', $idProducto, $idUsuario);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $check->close();
        http_response_code(409);
        echo json_encode(['error' => 'Ya dejaste una opinión para este producto.']);
        exit();
    }
    $check->close();

    $sql  = "INSERT INTO resenas (id_producto, id_usuario, calificacion, comentario) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('iiis', $idProducto, $idUsuario, $calificacion, $comentario);

    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo guardar la opinión: ' . $stmt->error]);
    }

    $stmt->close();
    $conexion->close();
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
