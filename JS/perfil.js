let perfilActual = null;

async function cargarPerfil() {
    try {
        const respuesta = await fetch('../PHP/perfil_datos.php');
        if (respuesta.status === 401) {
            window.location.href = 'formu.php';
            return;
        }
        if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

        const datos = await respuesta.json();
        perfilActual = datos.perfil;

        document.getElementById("nombreTexto").textContent = perfilActual.nombre || "(sin definir)";
        document.getElementById("apellidosTexto").textContent = perfilActual.apellidos || "(sin definir)";
        document.getElementById("correoTexto").textContent = perfilActual.correoU || "";
        document.getElementById("usuarioTexto").textContent = perfilActual.nombreU || "";

        document.getElementById("calleTexto").textContent = perfilActual.direccion || "(sin definir)";
        document.getElementById("coloniaTexto").textContent = perfilActual.colonia || "";
        document.getElementById("ciudadTexto").textContent = perfilActual.ciudad || "(sin definir)";
        document.getElementById("estadoTexto").textContent = perfilActual.estado || "(sin definir)";
        document.getElementById("cpTexto").textContent = perfilActual.cp || "(sin definir)";
        document.getElementById("telefonoTexto").textContent = perfilActual.telefono || "(sin definir)";

        renderizarPedidos(datos.pedidos);

    } catch (e) {
        console.error('Error cargando el perfil:', e);
        document.getElementById("pedidosLista").innerHTML = '<p>No se pudo cargar el historial de compras.</p>';
    }
}

function renderizarPedidos(pedidos) {
    const contenedor = document.getElementById("pedidosLista");
    if (!contenedor) return;

    if (!pedidos || pedidos.length === 0) {
        contenedor.innerHTML = '<p>Todavía no tienes pedidos.</p>';
        return;
    }

    contenedor.innerHTML = pedidos.map(pedido => {
        const productosTexto = pedido.productos
            .map(p => `${p.nombre} (x${p.cantidad})`)
            .join(', ');

        const fecha = new Date(pedido.fecha).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const claseEstado = pedido.estado === 'Entregado' ? 'entregado' : 'en-proceso';

        return `
            <div class="pedido">
                <p>Pedido #${String(pedido.id_pedido).padStart(3, '0')}</p>
                <p>${productosTexto}</p>
                <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <span class="estado ${claseEstado}">${pedido.estado}</span>
            </div>
        `;
    }).join('');
}

function editarPerfil() {

    document.getElementById("vistaPerfil").style.display = "none";
    document.getElementById("formularioPerfil").style.display = "block";

    document.getElementById("vistaDireccion").style.display = "none";
    document.getElementById("formularioDireccion").style.display = "block";


    document.getElementById("nombreInput").value = perfilActual.nombre || '';
    document.getElementById("apellidosInput").value = perfilActual.apellidos || '';
    document.getElementById("correoInput").value = perfilActual.correoU || '';
    document.getElementById("usuarioInput").value = perfilActual.nombreU || '';

    document.getElementById("calleInput").value = perfilActual.direccion || '';
    document.getElementById("coloniaInput").value = perfilActual.colonia || '';
    document.getElementById("ciudadInput").value = perfilActual.ciudad || '';
    document.getElementById("estadoInput").value = perfilActual.estado || '';
    document.getElementById("cpInput").value = perfilActual.cp || '';
    document.getElementById("telefonoInput").value = perfilActual.telefono || '';


    document.getElementById("btnEditar").style.display = "none";
    document.getElementById("btnGuardar").style.display = "inline-block";
}


async function guardarPerfil() {

    const payload = {
        nombre: document.getElementById("nombreInput").value.trim(),
        apellidos: document.getElementById("apellidosInput").value.trim(),
        correo: document.getElementById("correoInput").value.trim(),
        usuario: document.getElementById("usuarioInput").value.trim(),
        direccion: document.getElementById("calleInput").value.trim(),
        colonia: document.getElementById("coloniaInput").value.trim(),
        ciudad: document.getElementById("ciudadInput").value.trim(),
        estado: document.getElementById("estadoInput").value.trim(),
        cp: document.getElementById("cpInput").value.trim(),
        telefono: document.getElementById("telefonoInput").value.trim(),
    };

    try {
        const respuesta = await fetch('../PHP/perfil_datos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.error || 'No se pudo guardar el perfil.');
            return;
        }

        perfilActual = {
            ...perfilActual,
            nombre: payload.nombre,
            apellidos: payload.apellidos,
            correoU: payload.correo,
            nombreU: payload.usuario,
            direccion: payload.direccion,
            colonia: payload.colonia,
            ciudad: payload.ciudad,
            estado: payload.estado,
            cp: payload.cp,
            telefono: payload.telefono,
        };

        document.getElementById("nombreTexto").textContent = perfilActual.nombre || "(sin definir)";
        document.getElementById("apellidosTexto").textContent = perfilActual.apellidos || "(sin definir)";
        document.getElementById("correoTexto").textContent = perfilActual.correoU;
        document.getElementById("usuarioTexto").textContent = perfilActual.nombreU;

        document.getElementById("calleTexto").textContent = perfilActual.direccion || "(sin definir)";
        document.getElementById("coloniaTexto").textContent = perfilActual.colonia || "";
        document.getElementById("ciudadTexto").textContent = perfilActual.ciudad || "(sin definir)";
        document.getElementById("estadoTexto").textContent = perfilActual.estado || "(sin definir)";
        document.getElementById("cpTexto").textContent = perfilActual.cp || "(sin definir)";
        document.getElementById("telefonoTexto").textContent = perfilActual.telefono || "(sin definir)";

        document.getElementById("vistaPerfil").style.display = "block";
        document.getElementById("formularioPerfil").style.display = "none";

        document.getElementById("vistaDireccion").style.display = "block";
        document.getElementById("formularioDireccion").style.display = "none";

        document.getElementById("btnEditar").style.display = "inline-block";
        document.getElementById("btnGuardar").style.display = "none";

        alert("Perfil y dirección actualizados");

    } catch (e) {
        console.error('Error guardando el perfil:', e);
        alert('Ocurrió un error al guardar. Intenta de nuevo.');
    }
}

document.addEventListener('DOMContentLoaded', cargarPerfil);
