<header class="site-header">
    <div class="logo">
        <a href="Index.php" aria-label="Ir al inicio de Voltix">
            <img class="logo-header"
                 src="https://res.cloudinary.com/ty7o3lam/image/upload/v1785210490/imagen_2026-07-27_214853268_jmkgqu.png"
                 alt="Logo Voltix">
        </a>
    </div>

    <div class="buscador-contenedor">
        <input type="search" id="buscador-input" placeholder="🔎 Buscar productos" autocomplete="off" aria-label="Buscar productos">
        <div id="buscador-resultados" class="buscador-resultados" role="listbox"></div>
    </div>

    <button class="menu-icon" id="btn-menu" type="button"
            aria-label="Abrir menú de navegación"
            aria-controls="nav-principal"
            aria-expanded="false">
        <span aria-hidden="true">☰</span>
    </button>

    <nav class="nav" id="nav-principal" aria-label="Navegación principal">
        <ul>
            <li>
                <a href="Index.php" aria-label="Inicio">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-text">Inicio</span>
                </a>
            </li>
            <li>
                <a href="promociones.php" aria-label="Ofertas">
                    <span class="nav-icon">🏷️</span>
                    <span class="nav-text">Ofertas</span>
                </a>
            </li>
            <li>
                <a href="preguntasvol.php" aria-label="Preguntas frecuentes">
                    <span class="nav-icon">❓</span>
                    <span class="nav-text">Preguntas</span>
                </a>
            </li>
            <li id="enlace-login">
                <a href="formu.php" aria-label="Iniciar sesión">
                    <span class="nav-icon">🔑</span>
                    <span class="nav-text">Iniciar sesión</span>
                </a>
            </li>
            <li>
                <a href="carrito.php" aria-label="Carrito">
                    <span class="nav-icon">🛒</span>
                    <span class="nav-text">Carrito</span>
                    <span class="carrito-badge" data-carrito-count style="display:none;">0</span>
                </a>
            </li>
            <li>
                <a href="perfil.php" aria-label="Perfil">
                    <span class="nav-icon">👤</span>
                    <span class="nav-text">Perfil</span>
                </a>
            </li>
            <li id="nav-cerrar-sesion" style="display:none;">
                <a href="../PHP/cerrar.php" aria-label="Cerrar sesión">
                    <span class="nav-icon">🚪</span>
                    <span class="nav-text">Cerrar sesión</span>
                </a>
            </li>
        </ul>
    </nav>
</header>

<div class="categorias-bar">
    <div class="categorias-bar-inner">
        <button class="categorias-trigger" id="btn-categorias" type="button"
                aria-controls="categorias-drawer" aria-expanded="false">
            <span aria-hidden="true">☰</span>
            <span>Todo / Categorías</span>
        </button>
        <div class="categorias-atajos" aria-label="Categorías destacadas">
            <a href="Herramientas.php">Herramientas</a>
            <a href="Kits_Educativos.php">Kits educativos</a>
            <a href="Cables.php">Cables</a>
            <a href="sensores.php">Sensores</a>
            <a href="computacion.php">Computación</a>
        </div>
    </div>
</div>

<div class="categorias-overlay" id="categorias-overlay" hidden></div>
<aside class="categorias-drawer" id="categorias-drawer" aria-hidden="true" aria-label="Todas las categorías">
    <div class="categorias-drawer-header">
        <div>
            <strong>Explora Voltix</strong>
            <span>Compra por categoría</span>
        </div>
        <button type="button" class="categorias-close" id="btn-cerrar-categorias" aria-label="Cerrar categorías">×</button>
    </div>

    <nav class="categorias-drawer-nav" aria-label="Categorías de productos">
        <a href="Herramientas.php"><span>🛠️</span> Herramientas <b>›</b></a>
        <a href="Kits_Educativos.php"><span>🤖</span> Kits educativos <b>›</b></a>
        <a href="Cables.php"><span>🔌</span> Cables <b>›</b></a>
        <a href="sensores.php"><span>📡</span> Sensores <b>›</b></a>
        <a href="hogar.php"><span>🏠</span> Hogar <b>›</b></a>
        <a href="telefonia.php"><span>📱</span> Telefonía <b>›</b></a>
        <a href="promociones.php"><span>🏷️</span> Promociones <b>›</b></a>
        <a href="computacion.php"><span>💻</span> Computación <b>›</b></a>
        <a href="audio.php"><span>🎧</span> Audio <b>›</b></a>
    </nav>
</aside>
