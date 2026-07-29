/*
 * Se ejecuta después de insertar header.html en #header-placeholder.
 * (Los <script> dentro de un HTML insertado con innerHTML NO se ejecutan
 * solos, por eso esta lógica vive en un archivo aparte y se llama a mano.)
 */
async function inicializarHeader() {
    try {
        const respuesta = await fetch('../PHP/estado_sesion.php');
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

        const sesion = await respuesta.json();

        const cerrarLi = document.getElementById('nav-cerrar-sesion');
        const loginLi = document.getElementById('enlace-login');

        if (sesion.logueado) {
            if (cerrarLi) cerrarLi.style.display = '';
            if (loginLi) loginLi.style.display = 'none';
        }

        if (sesion.es_admin) {
            const listaMenu = document.querySelector('#header-placeholder .nav ul');
            if (listaMenu && !document.getElementById('enlace-panel-admin')) {
                const itemAdmin = document.createElement('li');
                itemAdmin.innerHTML = `
                    <a href="admin.php" id="enlace-panel-admin" aria-label="Panel de administración" title="Panel de administración">
                        ⚙️
                    </a>
                `;
                listaMenu.appendChild(itemAdmin);
            }
        }
    } catch (error) {
        console.error('No se pudo comprobar la sesión del usuario:', error);
    }
}
