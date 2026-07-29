<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promociones | Voltix</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="../CSS/style.css?v=2">
</head>
<body>
    <div id="header-placeholder"></div>

    <script>
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
            })
            .catch(e => {
                console.error('Error cargando header:', e);
                document.getElementById('header-placeholder').innerHTML = '<!-- header no cargado -->';
            });
    </script>

    <h1>PROMOCIONES DE VERANO</h1>
<div style="text-align:center; border:2px solid #f0ad4e; border-radius:10px; padding:20px; margin:20px auto; width:80%; background:#fff8e6;">

    <h2> Producto del Día </h2>

    <h3 id="productoDia"></h3>

    <p id="descripcionProducto"></p>

</div>


        <h1>LLÉVATE UN DESCUENTO EN TU PRIMER PEDIDO AL REGISTRAR TU CUENTA</h1>
  <div style="text-align:center; margin:30px 0;">
    <h2>¡Prueba tu suerte!</h2>

    <h1 id="contador">0</h1>

    <button onclick="iniciar()">Iniciar</button>
    <button onclick="detener()">Detener</button>

    <p id="mensaje" style="font-size:20px; font-weight:bold;"></p>
    <div style="text-align:center; margin:40px 0;">

<h2>Genera tu cupón</h2>

<button onclick="generarCupon()">Generar cupón</button>

<h3 id="cupon"></h3>

<p id="descuento"></p>

</div>
</div>
<script>
let contador = 0;
let intervalo;

function iniciar() {

    if (intervalo) return;

    intervalo = setInterval(function () {

        contador++;

        document.getElementById("contador").textContent = contador;

        if (contador >= 101) {
            contador = 0;
        }

    }, 0); 

}

function detener() {

    clearInterval(intervalo);
    intervalo = null;

    if (contador == 100) {
        document.getElementById("mensaje").innerHTML =
            " ¡Felicidades! Ganaste un 20% de descuento.";
    } else {

        document.getElementById("mensaje").innerHTML =
            "No obtuviste descuento. Inténtalo otra vez";

    }

}
</script>
<script>
function generarCupon(){

const cupones=[

{
codigo:"VOLTIX10",
mensaje:"Obtuviste un 10% de descuento."
},

{
codigo:"VOLTIX15",
mensaje:"Obtuviste un 15% de descuento."
},

{
codigo:"VOLTIX20",
mensaje:"Obtuviste un 20% de descuento."
},

{
codigo:"ENVIOGRATIS",
mensaje:"¡Envío gratis en tu compra!"
}

];

let numero=Math.floor(Math.random()*cupones.length);

document.getElementById("cupon").innerHTML=
"Tu cupón es: <strong>"+cupones[numero].codigo+"</strong>";

document.getElementById("descuento").innerHTML=
cupones[numero].mensaje;

}
</script>
<script>

const productos = [

{
nombre:"Mega Kit",
descripcion:"Incluye todo lo necesario para comenzar tus proyectos electrónicos."
},

{
nombre:"Protoboard gigante",
descripcion:"Ideal para proyectos escolares y pruebas."
},

{
nombre:"Protoboard pequeña",
descripcion:"Perfecta para circuitos sencillos."
},

{
nombre:"Kit de componentes",
descripcion:"Incluye LEDs, resistencias y capacitores."
}

];

let numeroProducto=Math.floor(Math.random()*productos.length);

document.getElementById("productoDia").innerHTML=
productos[numeroProducto].nombre;

document.getElementById("descripcionProducto").innerHTML=
productos[numeroProducto].descripcion;

</script>
        <div class="por-que">
            <h2>¿Por qué elegir Voltix?</h2>
            <ul>
                <li>Kits con instrucciones</li>
                <li>Precios accesibles</li>
                <li>Envíos a todo México</li>
                <li>Quejas y sugerencias disponibles</li>
            </ul>
        </div>
    </main>

    <div id="footer-placeholder"></div>

    <script>
        fetch('footer.php')
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(e => {
                console.error('Error cargando footer:', e);
                document.getElementById('footer-placeholder').innerHTML = '<!-- footer no cargado -->';
            });
    </script>
   
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="../JS/carrito.js"></script>
</body>
</html>
