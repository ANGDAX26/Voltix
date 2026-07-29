/**
 * Voltix - Script Principal
 * Control de interfaz, validaciones de formularios y peticiones de usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ Voltix JS inicializado correctamente');

    // 1. Inicializar módulos
    initRegisterValidation();
    initTogglePassword();
    initAlertAutoDismiss();
});

/**
 * Validaciones dinámicas en el formulario de registro de Voltix
 */
function initRegisterValidation() {
    const registerForm = document.querySelector('#form-register') || document.querySelector('form');

    if (!registerForm) return;

    registerForm.addEventListener('submit', (e) => {
        const username = document.querySelector('#username');
        const email = document.querySelector('#email');
        const password = document.querySelector('#password');
        const confirmPassword = document.querySelector('#confirm_password');
        
        let errors = [];

        // Validar Usuario
        if (username && username.value.trim().length < 3) {
            errors.push('El nombre de usuario debe tener al menos 3 caracteres.');
        }

        // Validar Email
        if (email && !validateEmail(email.value.trim())) {
            errors.push('Por favor, ingresa un correo electrónico válido.');
        }

        // Validar Contraseña
        if (password && password.value.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres.');
        }

        // Validar Confirmación de Contraseña
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            errors.push('Las contraseñas no coinciden.');
        }

        // Si hay errores, detener el envío y mostrarlos
        if (errors.length > 0) {
            e.preventDefault();
            showFormAlert(errors.join('<br>'), 'danger');
        }
    });
}

/**
 * Función auxiliar para validar formato de Email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Muestra/oculta las contraseñas (Toggle Show/Hide)
 */
function initTogglePassword() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.classList.add('active');
                } else {
                    input.type = 'password';
                    btn.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Cierra automáticamente los mensajes de alerta flotantes después de 5 segundos
 */
function initAlertAutoDismiss() {
    const alerts = document.querySelectorAll('.alert-auto-dismiss');

    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
}

/**
 * Genera alertas dinámicas dentro del contenedor del formulario
 */
function showFormAlert(message, type = 'danger') {
    let alertContainer = document.querySelector('#alert-container');

    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        const form = document.querySelector('form');
        if (form) form.insertBefore(alertContainer, form.firstChild);
    }

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-auto-dismiss" style="padding: 10px; margin-bottom: 15px; border-radius: 5px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;">
            ${message}
        </div>
    `;

    initAlertAutoDismiss();
}