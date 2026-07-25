<?php
require_once 'conexion.php';
require_once 'sesion.php';
header('Content-Type: application/json; charset=utf-8');

requerirLoginApi();
$idUsuario = $_SESSION['id_usuario'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // --- Datos del usuario ---
    $sql = "SELECT nombreU, nombre, apellidos, correoU, direccion, colonia, ciudad, estado, cp, telefono
            FROM usuario WHERE id_usuario = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $idUsuario);
    $stmt->execute();
    $perfil = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // --- Historial de pedidos con sus productos ---
    $sql = "SELECT id_pedido, fecha, metodo_pago, estado, total FROM pedido
            WHERE id_usuario = ? ORDER BY fecha DESC";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $idUsuario);
    $stmt->execute();
    $resultadoPedidos = $stmt->get_result();

    $pedidos = [];
    while ($pedido = $resultadoPedidos->fetch_assoc()) {
        $sqlDet = "SELECT dv.cantidad, p.nombreP AS nombre
                   FROM detalle_venta dv
                   JOIN productos p ON p.id_productos = dv.id_productos
                   WHERE dv.id_pedido = ?";
        $stmtDet = $conexion->prepare($sqlDet);
        $stmtDet->bind_param('i', $pedido['id_pedido']);
        $stmtDet->execute();
        $detalles = $stmtDet->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmtDet->close();

        $pedido['id_pedido'] = (int) $pedido['id_pedido'];
        $pedido['total'] = (float) $pedido['total'];
        $pedido['productos'] = $detalles;
        $pedidos[] = $pedido;
    }
    $stmt->close();
    $conexion->close();

    echo json_encode(['perfil' => $perfil, 'pedidos' => $pedidos]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $datos = json_decode(file_get_contents('php://input'), true) ?? [];

    $nombre    = trim($datos['nombre'] ?? '');
    $apellidos = trim($datos['apellidos'] ?? '');
    $correo    = trim($datos['correo'] ?? '');
    $usuario   = trim($datos['usuario'] ?? '');
    $direccion = trim($datos['direccion'] ?? '');
    $colonia   = trim($datos['colonia'] ?? '');
    $ciudad    = trim($datos['ciudad'] ?? '');
    $estado    = trim($datos['estado'] ?? '');
    $cp        = trim($datos['cp'] ?? '');
    $telefono  = trim($datos['telefono'] ?? '');

    if ($correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'El correo no es válido.']);
        exit();
    }

    if ($usuario === '' || strlen($usuario) > 20) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre de usuario no es válido.']);
        exit();
    }

    // Evitar que el nuevo usuario/correo choque con el de otra cuenta
    $sql = "SELECT id_usuario FROM usuario WHERE (nombreU = ? OR correoU = ?) AND id_usuario != ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ssi', $usuario, $correo, $idUsuario);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->close();
        http_response_code(409);
        echo json_encode(['error' => 'Ese usuario o correo ya lo usa otra cuenta.']);
        exit();
    }
    $stmt->close();

    $sql = "UPDATE usuario SET nombreU=?, nombre=?, apellidos=?, correoU=?,
            direccion=?, colonia=?, ciudad=?, estado=?, cp=?, telefono=?
            WHERE id_usuario=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param(
        'ssssssssssi',
        $usuario, $nombre, $apellidos, $correo,
        $direccion, $colonia, $ciudad, $estado, $cp, $telefono,
        $idUsuario
    );

    if ($stmt->execute()) {
        $_SESSION['usuario'] = $usuario; // mantener sesión consistente
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo actualizar: ' . $stmt->error]);
    }

    $stmt->close();
    $conexion->close();
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
