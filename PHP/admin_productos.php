<?php
require_once 'conexion.php';
require_once 'sesion.php';
header('Content-Type: application/json; charset=utf-8');

requerirAdminApi();

function idCategoria($conexion, string $nombreCategoria): int
{
    $nombreCategoria = trim($nombreCategoria);

    $stmt = $conexion->prepare("SELECT id_categoria FROM categoria WHERE nombre_categoria = ?");
    $stmt->bind_param('s', $nombreCategoria);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($fila) {
        return (int) $fila['id_categoria'];
    }

    // Categoría nueva: al momento de crear un producto, se crea la categoría en el momento
    $stmt = $conexion->prepare("INSERT INTO categoria (nombre_categoria) VALUES (?)");
    $stmt->bind_param('s', $nombreCategoria);
    $stmt->execute();
    $nuevoId = $conexion->insert_id;
    $stmt->close();
    return (int) $nuevoId;
}

$metodo = $_SERVER['REQUEST_METHOD'];

// ENLISTAR LOS PRODUCTOS 
if ($metodo === 'GET') {
    $sql = "SELECT p.id_productos AS id, p.nombreP AS nombre, p.precio, p.stock,
                   p.descripcion, p.imagen, c.nombre_categoria AS categoria
            FROM productos p
            JOIN categoria c ON c.id_categoria = p.id_categoria
            ORDER BY p.id_productos DESC";
    $resultado = $conexion->query($sql);
    $productos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $fila['id'] = (int) $fila['id'];
        $fila['precio'] = (float) $fila['precio'];
        $fila['stock'] = (int) $fila['stock'];
        $productos[] = $fila;
    }
    $conexion->close();
    echo json_encode($productos);
    exit();
}

$datos = json_decode(file_get_contents('php://input'), true) ?? [];
$accion = $datos['accion'] ?? '';

// AÑADIR PRODUCTOS / ACTUALIZAR PRODCUTOS 
if ($metodo === 'POST' && in_array($accion, ['crear', 'actualizar'], true)) {

    $nombre      = trim($datos['nombre'] ?? '');
    $precio      = (float) ($datos['precio'] ?? -1);
    $categoria   = trim($datos['categoria'] ?? '');
    $imagen      = trim($datos['imagen'] ?? '');
    $descripcion = trim($datos['descripcion'] ?? '');
    $stock       = isset($datos['stock']) ? (int) $datos['stock'] : 0;

    if ($nombre === '' || $precio < 0 || $categoria === '' || $imagen === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Completa nombre, precio, categoría e imagen.']);
        exit();
    }

    $idCat = idCategoria($conexion, $categoria);

    if ($accion === 'crear') {
        $sql = "INSERT INTO productos (id_categoria, nombreP, precio, stock, descripcion, imagen)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param('isdiss', $idCat, $nombre, $precio, $stock, $descripcion, $imagen);
    
    }

    if ($accion === 'actualizar') {
        $id = (int) ($datos['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de producto inválido.']);
            exit();
        }
        $sql = "UPDATE productos SET id_categoria=?, nombreP=?, precio=?, stock=?, descripcion=?, imagen=?
                WHERE id_productos=?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param('isdissi', $idCat, $nombre, $precio, $stock, $descripcion, $imagen, $id);
    }

    if ($stmt->execute()) {
        $idResultado = $accion === 'crear' ? $conexion->insert_id : $id;
        echo json_encode(['ok' => true, 'id' => (int) $idResultado]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar: ' . $stmt->error]);
    }
    $stmt->close();
    $conexion->close();
    exit();
}

// ELIMINAR PRODUCTOS 
if ($metodo === 'POST' && $accion === 'eliminar') {
    $id = (int) ($datos['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de producto inválido.']);
        exit();
    }

    $stmt = $conexion->prepare("DELETE FROM productos WHERE id_productos = ?");
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {

        http_response_code(409);
        echo json_encode(['error' => 'No se puede eliminar: el producto ya tiene ventas registradas.']);
    }
    $stmt->close();
    $conexion->close();
    exit();
}

http_response_code(400);
echo json_encode(['error' => 'Solicitud no reconocida.']);
