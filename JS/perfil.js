function editarPerfil() {

    document.getElementById("vistaPerfil").style.display = "none";
    document.getElementById("formularioPerfil").style.display = "block";

    document.getElementById("vistaDireccion").style.display = "none";
    document.getElementById("formularioDireccion").style.display = "block";


    document.getElementById("nombreInput").value =
        document.getElementById("nombreTexto").textContent;

    document.getElementById("apellidosInput").value =
        document.getElementById("apellidosTexto").textContent;

    document.getElementById("correoInput").value =
        document.getElementById("correoTexto").textContent;

    document.getElementById("usuarioInput").value =
        document.getElementById("usuarioTexto").textContent;


    document.getElementById("calleInput").value =
        document.getElementById("calleTexto").textContent;

    document.getElementById("coloniaInput").value =
        document.getElementById("coloniaTexto").textContent;

    document.getElementById("ciudadInput").value =
        document.getElementById("ciudadTexto").textContent;

    document.getElementById("estadoInput").value =
        document.getElementById("estadoTexto").textContent;

    document.getElementById("cpInput").value =
        document.getElementById("cpTexto").textContent;

    document.getElementById("telefonoInput").value =
        document.getElementById("telefonoTexto").textContent;


    document.getElementById("btnEditar").style.display = "none";
    document.getElementById("btnGuardar").style.display = "inline-block";
}


function guardarPerfil() {

    document.getElementById("nombreTexto").textContent =
        document.getElementById("nombreInput").value;

    document.getElementById("apellidosTexto").textContent =
        document.getElementById("apellidosInput").value;

    document.getElementById("correoTexto").textContent =
        document.getElementById("correoInput").value;

    document.getElementById("usuarioTexto").textContent =
        document.getElementById("usuarioInput").value;


    document.getElementById("calleTexto").textContent =
        document.getElementById("calleInput").value;

    document.getElementById("coloniaTexto").textContent =
        document.getElementById("coloniaInput").value;

    document.getElementById("ciudadTexto").textContent =
        document.getElementById("ciudadInput").value;

    document.getElementById("estadoTexto").textContent =
        document.getElementById("estadoInput").value;

    document.getElementById("cpTexto").textContent =
        document.getElementById("cpInput").value;

    document.getElementById("telefonoTexto").textContent =
        document.getElementById("telefonoInput").value;


    document.getElementById("vistaPerfil").style.display = "block";
    document.getElementById("formularioPerfil").style.display = "none";

    document.getElementById("vistaDireccion").style.display = "block";
    document.getElementById("formularioDireccion").style.display = "none";


    document.getElementById("btnEditar").style.display = "inline-block";
    document.getElementById("btnGuardar").style.display = "none";

    alert("Perfil y dirección actualizados");
}