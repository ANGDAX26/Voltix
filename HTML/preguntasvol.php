<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preguntas Frecuentes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="../CSS/style.css?v=3">
</head>
<body>

<?php include 'header.php'; ?>


<main class="preguntas-main">
    <div class="preguntas-header">
        <h1>Preguntas Frecuentes</h1>
        <p class="subtitle">Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios</p>
    </div>

    <div class="preguntas-container">
        <div class="pregunta-item">
            <h3>1. ¿Qué productos venden?</h3>
            <p>
            Vendemos cables eléctricos, interruptores, contactos, focos LED,
            apagadores, tubería, centros de carga, herramientas y accesorios eléctricos.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>2. ¿Realizan envíos?</h3>
            <p>
            Sí, realizamos envíos a todo el país mediante paqueterías confiables.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>3. ¿Los productos tienen garantía?</h3>
            <p>
            Sí, la mayoría de nuestros productos cuentan con garantía por defectos de fabricación.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>4. ¿Qué métodos de pago aceptan?</h3>
            <p>
            Aceptamos tarjetas de crédito, débito, transferencias bancarias y efectivo.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>5. ¿Cómo puedo contactar al servicio al cliente?</h3>
            <p>
            Puedes comunicarte por teléfono, correo electrónico o mediante nuestro formulario de contacto.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>6. ¿Puedo devolver un producto?</h3>
            <p>
            Sí, siempre que el producto se encuentre en buen estado y dentro del tiempo establecido para devoluciones.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>7. ¿Venden productos para uso residencial e industrial?</h3>
            <p>
            Sí, contamos con materiales para instalaciones eléctricas domésticas e industriales.
            </p>
        </div>

        <div class="pregunta-item">
            <h3>8. ¿Cómo sé qué componente necesito?</h3>
            <p>
            Nuestro equipo puede ayudarte a elegir el producto adecuado según tu proyecto.
            </p>
        </div>
    </div>
    <div style="text-align:center; margin:30px 0;">
    <h2>¡Prueba tu suerte!</h2>

    <h1 id="contador">0</h1>

    <button onclick="iniciar()">Iniciar</button>
    <button onclick="detener()">Detener</button>

    <p id="mensaje" style="font-size:20px; font-weight:bold;"></p>
</div>
<script>
let contador = 0;
let intervalo;

function iniciar() {

    if (intervalo) return;

    intervalo = setInterval(function () {

        contador++;

        document.getElementById("contador").textContent = contador;

        if (contador >= 100) {
            contador = 0;
        }

    }, 0); 

}

function detener() {

    clearInterval(intervalo);
    intervalo = null;

    if (contador == 100) {
        document.getElementById("mensaje").innerHTML =
            "🎉 ¡Felicidades! Ganaste un 20% de descuento.";
    } else {

        document.getElementById("mensaje").innerHTML =
            "No obtuviste descuento. Inténtalo otra vez.";

    }

}
</script>
</main>

<?php include 'footer.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>


    <script src="../JS/header.js?v=3"></script>
    <script src="../JS/buscador.js?v=3"></script>

</body>

</html>
