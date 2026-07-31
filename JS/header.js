/**
 * Voltix - Controlador del header.
 * El header ahora se incluye del lado del servidor con <?php include 'header.php'; ?>,
 * así que ya está presente en el DOM desde el primer render (ya no se inyecta con
 * fetch()+innerHTML dentro de un #header-placeholder).
 */
(function () {
    'use strict';

    let sesionConsultada = false;

    function obtenerHeader() {
        return document.querySelector('.site-header');
    }

    function cerrarMenuPrincipal() {
        const nav = document.getElementById('nav-principal');
        const boton = document.getElementById('btn-menu');
        if (!nav || !boton) return;

        nav.classList.remove('open');
        boton.classList.remove('active');
        boton.setAttribute('aria-expanded', 'false');
        boton.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    function alternarMenuPrincipal() {
        const nav = document.getElementById('nav-principal');
        const boton = document.getElementById('btn-menu');
        if (!nav || !boton) return;

        const abierto = nav.classList.toggle('open');
        boton.classList.toggle('active', abierto);
        boton.setAttribute('aria-expanded', String(abierto));
        boton.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }

    function abrirCategorias() {
        const drawer = document.getElementById('categorias-drawer');
        const overlay = document.getElementById('categorias-overlay');
        const boton = document.getElementById('btn-categorias');
        if (!drawer || !overlay || !boton) return;

        cerrarMenuPrincipal();
        overlay.hidden = false;

        // Permite que la transición CSS se vea después de quitar hidden.
        requestAnimationFrame(() => {
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.classList.add('menu-lateral-abierto');
        });

        drawer.setAttribute('aria-hidden', 'false');
        boton.setAttribute('aria-expanded', 'true');
    }

    function cerrarCategorias() {
        const drawer = document.getElementById('categorias-drawer');
        const overlay = document.getElementById('categorias-overlay');
        const boton = document.getElementById('btn-categorias');
        if (!drawer || !overlay || !boton) return;

        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('menu-lateral-abierto');
        drawer.setAttribute('aria-hidden', 'true');
        boton.setAttribute('aria-expanded', 'false');

        window.setTimeout(() => {
            if (!overlay.classList.contains('open')) overlay.hidden = true;
        }, 220);
    }

    function consultarSesion() {
        if (sesionConsultada || !obtenerHeader()) return;
        sesionConsultada = true;

        fetch('../PHP/estado_sesion.php')
            .then(r => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(sesion => {
                const cerrarLi = document.getElementById('nav-cerrar-sesion');
                const loginLi = document.getElementById('enlace-login');

                if (sesion.logueado) {
                    if (cerrarLi) cerrarLi.style.display = '';
                    if (loginLi) loginLi.style.display = 'none';

                    // Agregar enlace al panel admin si es administrador
                    if (sesion.es_admin) {
                        const nav = document.getElementById('nav-principal');
                        if (nav && !document.getElementById('enlace-panel-admin')) {
                            const liAdmin = document.createElement('li');
                            const aAdmin = document.createElement('a');
                            aAdmin.id = 'enlace-panel-admin';
                            aAdmin.href = 'admin.php';
                            aAdmin.setAttribute('aria-label', 'Panel de administración');
                            aAdmin.title = 'Panel de administración';
                            const iconSpan = document.createElement('span');
                            iconSpan.className = 'nav-icon';
                            iconSpan.textContent = '⚙️';
                            const textSpan = document.createElement('span');
                            textSpan.className = 'nav-text';
                            textSpan.textContent = 'Admin';
                            aAdmin.appendChild(iconSpan);
                            aAdmin.appendChild(textSpan);
                            liAdmin.appendChild(aAdmin);
                            nav.querySelector('ul').appendChild(liAdmin);
                        }
                    }
                } else {
                    if (cerrarLi) cerrarLi.style.display = 'none';
                    if (loginLi) loginLi.style.display = '';
                }
            })
            .catch(error => {
                console.warn('No se pudo comprobar la sesión:', error);
            });
    }

    function actualizarBadgeCarrito() {
        const badges = document.querySelectorAll('[data-carrito-count]');
        if (!badges.length) return;

        let items = [];
        try {
            items = JSON.parse(localStorage.getItem('voltix_carrito') || '[]');
            if (!Array.isArray(items)) items = [];
        } catch {
            items = [];
        }

        const total = items.reduce((suma, item) => suma + (Number(item.cantidad) || 0), 0);
        badges.forEach(badge => {
            badge.textContent = total;
            badge.style.display = total > 0 ? 'inline-flex' : 'none';
        });
    }

    function headerListo() {
        if (!obtenerHeader()) return;
        consultarSesion();
        actualizarBadgeCarrito();
    }

    document.addEventListener('click', function (e) {
        const botonMenu = e.target.closest('#btn-menu');
        if (botonMenu) {
            e.preventDefault();
            alternarMenuPrincipal();
            return;
        }

        const botonCategorias = e.target.closest('#btn-categorias');
        if (botonCategorias) {
            e.preventDefault();
            const drawer = document.getElementById('categorias-drawer');
            if (drawer && drawer.classList.contains('open')) cerrarCategorias();
            else abrirCategorias();
            return;
        }

        if (e.target.closest('#btn-cerrar-categorias') || e.target.id === 'categorias-overlay') {
            cerrarCategorias();
            return;
        }

        const enlaceCategoria = e.target.closest('#categorias-drawer a');
        if (enlaceCategoria) {
            cerrarCategorias();
            return;
        }

        const nav = document.getElementById('nav-principal');
        const header = obtenerHeader();

        if (nav && nav.classList.contains('open')) {
            if (e.target.closest('#nav-principal a')) {
                cerrarMenuPrincipal();
            } else if (header && !e.target.closest('.site-header')) {
                cerrarMenuPrincipal();
            }
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        cerrarMenuPrincipal();
        cerrarCategorias();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 992) cerrarMenuPrincipal();
    });

    window.addEventListener('storage', function (e) {
        if (e.key === 'voltix_carrito') actualizarBadgeCarrito();
    });

    // Evento emitido por carrito.js cuando cambia la cantidad.
    document.addEventListener('voltix:carrito-actualizado', actualizarBadgeCarrito);

    // El header ya está en el DOM (PHP include), no necesitamos MutationObserver.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', headerListo);
    } else {
        headerListo();
    }
})();
