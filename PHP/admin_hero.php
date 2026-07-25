<?php
require_once 'conexion.php';
require_once 'sesion.php';

header('Content-Type: application/json; charset=utf-8');

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    try {
        $sql = "SELECT id_hero AS id, titulo, subtitulo, imagen, enlace, texto_boton, orden
                FROM hero_slides
                ORDER BY orden ASC, id_hero ASC";

        $resultado = $conexion->query($sql);
        $slides = [];

        while ($fila = $resultado->fetch_assoc()) {
            $fila['id'] = (int) $fila['id'];
            $fila['orden'] = (int) $fila['orden'];
            $slides[] = $fila;
        }

        echo json_encode($slides);
    } catch (mysqli_sql_exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'No se pudo cargar el Hero. Verifica que exista la tabla hero_slides.'
        ]);
    }

    $conexion->close();
    exit();
}


requerirAdminApi();

$datos = json_decode(file_get_contents('php://input'), true) ?? [];
$accion = $datos['accion'] ?? '';

if ($metodo === 'POST' && in_array($accion, ['crear', 'actualizar'], true)) {

    $titulo = trim($datos['titulo'] ?? '');
    $subtitulo = trim($datos['subtitulo'] ?? '');
    $imagen = trim($datos['imagen'] ?? '');
    $enlace = trim($datos['enlace'] ?? '#');
    $textoBoton = trim($datos['texto_boton'] ?? 'Ver producto');
    $orden = max(1, (int) ($datos['orden'] ?? 1));

    if ($titulo === '' || $imagen === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Completa al menos el título y la imagen del Hero.']);
        exit();
    }

    if ($enlace === '') {
        $enlace = '#';
    }

    if ($textoBoton === '') {
        $textoBoton = 'Ver producto';
    }

    if (stripos($enlace, 'javascript:') === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'El enlace indicado no es válido.']);
        exit();
    }

    if ($accion === 'crear') {
        $sql = "INSERT INTO hero_slides
                (titulo, subtitulo, imagen, enlace, texto_boton, orden)
                VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $conexion->prepare($sql);
        $stmt->bind_param('sssssi', $titulo, $subtitulo, $imagen, $enlace, $textoBoton, $orden);
    }

    if ($accion === 'actualizar') {
        $id = (int) ($datos['id'] ?? 0);

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'ID del elemento del Hero inválido.']);
            exit();
        }

        $sql = "UPDATE hero_slides
                SET titulo = ?, subtitulo = ?, imagen = ?, enlace = ?, texto_boton = ?, orden = ?
                WHERE id_hero = ?";

        $stmt = $conexion->prepare($sql);
        $stmt->bind_param('sssssii', $titulo, $subtitulo, $imagen, $enlace, $textoBoton, $orden, $id);
    }

    if ($stmt->execute()) {
        $idResultado = $accion === 'crear' ? $conexion->insert_id : $id;
        echo json_encode(['ok' => true, 'id' => (int) $idResultado]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar el Hero: ' . $stmt->error]);
    }

    $stmt->close();
    $conexion->close();
    exit();
}

if ($metodo === 'POST' && $accion === 'eliminar') {
    $id = (int) ($datos['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID del elemento del Hero inválido.']);
        exit();
    }

    $stmt = $conexion->prepare("DELETE FROM hero_slides WHERE id_hero = ?");
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo eliminar el elemento del Hero.']);
    }

    $stmt->close();
    $conexion->close();
    exit();
}

http_response_code(400);
echo json_encode(['error' => 'Solicitud no reconocida.']);
$conexion->close();
