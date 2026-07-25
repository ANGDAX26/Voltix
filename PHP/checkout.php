<?php
require_once 'conexion.php';
require_once 'sesion.php';
header('Content-Type: application/json; charset=utf-8');

requerirLoginApi();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

$datos = json_decode(file_get_contents('php://input'), true) ?? [];

$items       = $datos['items'] ?? [];       
$direccion   = trim($datos['direccion'] ?? '');
$colonia     = trim($datos['colonia'] ?? '');
$ciudad      = trim($datos['ciudad'] ?? '');
$estadoEnv   = trim($datos['estado'] ?? '');
$cp          = trim($datos['cp'] ?? '');
$metodoPago  = trim($datos['metodo_pago'] ?? '');

$metodosValidos = ['tarjeta', 'transferencia', 'efectivo'];

if (empty($items) || !is_array($items)) {
    http_response_code(400);
    echo json_encode(['error' => 'El carrito está vacío.']);
    exit();
}

if ($direccion === '' || $ciudad === '' || $estadoEnv === '' || $cp === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Completa la dirección de envío.']);
    exit();
}

if (!in_array($metodoPago, $metodosValidos, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Selecciona un método de pago válido.']);
    exit();
}

$idUsuario = $_SESSION['id_usuario'];

$conexion->begin_transaction();

try {
    $subtotal = 0.0;
    $lineas = []; // id_productos, cantidad, precio

    foreach ($items as $item) {
        $idProducto = (int) ($item['id'] ?? 0);
        $cantidad   = (int) ($item['cantidad'] ?? 0);

        if ($idProducto <= 0 || $cantidad <= 0) {
            throw new Exception('Artículo de carrito inválido.');
        }

        // Bloquear la fila para evitar condiciones de carrera con el stock
        $stmt = $conexion->prepare(
            "SELECT precio, stock, nombreP FROM productos WHERE id_productos = ? FOR UPDATE"
        );
        $stmt->bind_param('i', $idProducto);
        $stmt->execute();
        $producto = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$producto) {
            throw new Exception("Un producto de tu carrito ya no existe.");
        }

        if ($producto['stock'] < $cantidad) {
            throw new Exception("No hay stock suficiente de \"{$producto['nombreP']}\" (disponible: {$producto['stock']}).");
        }

        $precio = (float) $producto['precio'];
        $subtotal += $precio * $cantidad;

        $lineas[] = ['id' => $idProducto, 'cantidad' => $cantidad, 'precio' => $precio];
    }

    $envio = $subtotal > 500 ? 0 : 50;
    $total = $subtotal + $envio;

    $sql = "INSERT INTO pedido (id_usuario, direccion, colonia, ciudad, estado_env, cp, metodo_pago, subtotal, envio, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $tipos = 'i' . str_repeat('s', 6) . str_repeat('d', 3); // i + 6 strings + 3 decimales = 10
    $stmt->bind_param(
        $tipos,
        $idUsuario, $direccion, $colonia, $ciudad, $estadoEnv, $cp, $metodoPago, $subtotal, $envio, $total
    );
    $stmt->execute();
    $idPedido = $conexion->insert_id;
    $stmt->close();

    $sqlDet = "INSERT INTO detalle_venta (id_pedido, id_productos, cantidad, precio) VALUES (?, ?, ?, ?)";
    $stmtDet = $conexion->prepare($sqlDet);

    $sqlStock = "UPDATE productos SET stock = stock - ? WHERE id_productos = ?";
    $stmtStock = $conexion->prepare($sqlStock);

    foreach ($lineas as $linea) {
        $stmtDet->bind_param('iiid', $idPedido, $linea['id'], $linea['cantidad'], $linea['precio']);
        $stmtDet->execute();

        $stmtStock->bind_param('ii', $linea['cantidad'], $linea['id']);
        $stmtStock->execute();
    }
    $stmtDet->close();
    $stmtStock->close();

    $conexion->commit();

    echo json_encode([
        'ok' => true,
        'id_pedido' => $idPedido,
        'total' => $total,
    ]);

} catch (Exception $e) {
    $conexion->rollback();
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

$conexion->close();
