<?php
// Utilidades de sesión. Incluir con require_once en cualquier página/endpoint
// que necesite saber si hay un usuario logueado.

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function usuarioLogueado(): bool
{
    return isset($_SESSION['id_usuario']);
}

function esAdmin(): bool
{
    return usuarioLogueado() && ($_SESSION['rol'] ?? '') === 'admin';
}

// Se corta la ejecución con un JSON de error si no hay sesión iniciada.
// Se usa en los endpoints que responden JSON (fetch desde JS).
function requerirLoginApi(): void
{
    if (!usuarioLogueado()) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Debes iniciar sesión.']);
        exit();
    }
}

function requerirAdminApi(): void
{
    requerirLoginApi();
    if (!esAdmin()) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'No tienes permisos de administrador.']);
        exit();
    }
}

// Redirige a páginas normales (no-API) que requieren sesión.
function requerirLoginPagina(string $urlLogin = 'formu.php'): void
{
    if (!usuarioLogueado()) {
        header('Location: ' . $urlLogin);
        exit();
    }
}

function requerirAdminPagina(string $urlLogin = 'formu.php'): void
{
    requerirLoginPagina($urlLogin);
    if (!esAdmin()) {
        header('Location: Index.php');
        exit();
    }
}
