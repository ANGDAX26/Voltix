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

    <main class="promociones-main">
        <div class="promo-grid">
            <div class="promo-card" data-id="1001" data-nombre="Mega Kit" data-precio="14999" data-img="https://imgs.search.brave.com/Km8lRed2Xrhm4qw8aQDoL2KFTUeqHq6J2KxVD2mofU0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFEblBPaG9aZUwu/anBn">
                <img src="https://imgs.search.brave.com/Km8lRed2Xrhm4qw8aQDoL2KFTUeqHq6J2KxVD2mofU0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFEblBPaG9aZUwu/anBn" alt="Mega kit Voltix">
                <h2>Mega Kit</h2>
                <p class="price-new">$14,999</p>
                <p class="price-old">Antes: $15,000</p>
                <button class="add-to-cart" data-id="1001" data-nombre="Mega Kit" data-precio="14999" data-img="https://imgs.search.brave.com/Km8lRed2Xrhm4qw8aQDoL2KFTUeqHq6J2KxVD2mofU0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFEblBPaG9aZUwu/anBn">Comprar</button>
            </div>
            <div class="promo-card" data-id="1002" data-nombre="Protoboard gigante" data-precio="7999" data-img="https://imgs.search.brave.com/FHFxNJC1UWMjKKuWh1b2L_55LBxufLI67UGdutqfSVw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsb3NlbGVjdHJv/bmljcy5jb20vY2Ru/L3Nob3AvcHJvZHVj/dHMvcHJvdG9ib2Fy/ZF84MzBfcHVudG9z/X21leGljb19qYWxp/c2NvX2d1YWRhbGFq/YXJhXzY2Y2EyOGEy/LWY4OWQtNDI4ZS04/YzE2LTBjZDQ1ZmFj/MWIxMV83MDB4NzAw/LkpQRz92PTE1OTM4/MTcxMjQ">
                <img src="https://imgs.search.brave.com/FHFxNJC1UWMjKKuWh1b2L_55LBxufLI67UGdutqfSVw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsb3NlbGVjdHJv/bmljcy5jb20vY2Ru/L3Nob3AvcHJvZHVj/dHMvcHJvdG9ib2Fy/ZF84MzBfcHVudG9z/X21leGljb19qYWxp/c2NvX2d1YWRhbGFq/YXJhXzY2Y2EyOGEy/LWY4OWQtNDI4ZS04/YzE2LTBjZDQ1ZmFj/MWIxMV83MDB4NzAw/LkpQRz92PTE1OTM4/MTcxMjQ" alt="Protoboard gigante">
                <h2>Protoboard gigante</h2>
                <p class="price-new">$7,999</p>
                <p class="price-old">Antes: $9,500</p>
                <button class="add-to-cart" data-id="1002" data-nombre="Protoboard gigante" data-precio="7999" data-img="https://imgs.search.brave.com/FHFxNJC1UWMjKKuWh1b2L_55LBxufLI67UGdutqfSVw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsb3NlbGVjdHJv/bmljcy5jb20vY2Ru/L3Nob3AvcHJvZHVj/dHMvcHJvdG9ib2Fy/ZF84MzBfcHVudG9z/X21leGljb19qYWxp/c2NvX2d1YWRhbGFq/YXJhXzY2Y2EyOGEy/LWY4OWQtNDI4ZS04/YzE2LTBjZDQ1ZmFj/MWIxMV83MDB4NzAw/LkpQRz92PTE1OTM4/MTcxMjQ">Comprar</button>
            </div>
            <div class="promo-card" data-id="1003" data-nombre="Protoboard pequeña" data-precio="10" data-img="https://imgs.search.brave.com/g3hAZemmPcCn1fIYR-L2TDSIfdJwTschQ3lnD2OSKkg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wcmlu/dGVkLXByb3RvYm9h/cmQtd29vZGVuLXRh/YmxlLWxlZnQtZGlh/Z29uYWwtd2hpdGUt/cHJpbnRlZC1wcm90/b2JvYXJkLWx5aW5n/LXN0cmFpZ2h0LW9u/YS13b29kZW4tdGFi/bGUtdXNlZC0xMjM3/NTE1NDguanBn">
                <img src="https://imgs.search.brave.com/g3hAZemmPcCn1fIYR-L2TDSIfdJwTschQ3lnD2OSKkg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wcmlu/dGVkLXByb3RvYm9h/cmQtd29vZGVuLXRh/YmxlLWxlZnQtZGlh/Z29uYWwtd2hpdGUt/cHJpbnRlZC1wcm90/b2JvYXJkLWx5aW5n/LXN0cmFpZ2h0LW9u/YS13b29kZW4tdGFi/bGUtdXNlZC0xMjM3/NTE1NDguanBn" alt="Protoboard pequeña">
                <h2>Protoboard pequeña</h2>
                <p class="price-new">$10</p>
                <p class="price-old">Antes: $1,200</p>
                <button class="add-to-cart" data-id="1003" data-nombre="Protoboard pequeña" data-precio="10" data-img="https://imgs.search.brave.com/g3hAZemmPcCn1fIYR-L2TDSIfdJwTschQ3lnD2OSKkg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wcmlu/dGVkLXByb3RvYm9h/cmQtd29vZGVuLXRh/YmxlLWxlZnQtZGlh/Z29uYWwtd2hpdGUt/cHJpbnRlZC1wcm90/b2JvYXJkLWx5aW5n/LXN0cmFpZ2h0LW9u/YS13b29kZW4tdGFi/bGUtdXNlZC0xMjM3/NTE1NDguanBn">Comprar</button>
            </div>
            <div class="promo-card" data-id="1004" data-nombre="Kit de componentes" data-precio="4299" data-img="https://imgs.search.brave.com/7DRPO3p88aVY5C4fka7vUcJ7CPrtKE_gOLdpQH7k0CU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXJjYWVsZWN0cm9u/aWNhLmNvbS9jZG4v/c2hvcC9maWxlcy9L/aXRfZGVfY29tcG9u/ZW50ZXNfZWxlY3Ry/b25pY29zXzJfNTgw/eC5qcGc_dj0xNzY4/NTEyNDEw">
                <img src="https://imgs.search.brave.com/7DRPO3p88aVY5C4fka7vUcJ7CPrtKE_gOLdpQH7k0CU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXJjYWVsZWN0cm9u/aWNhLmNvbS9jZG4v/c2hvcC9maWxlcy9L/aXRfZGVfY29tcG9u/ZW50ZXNfZWxlY3Ry/b25pY29zXzJfNTgw/eC5qcGc_dj0xNzY4/NTEyNDEw" alt="Kit de componentes">
                <h2>Kit de componentes</h2>
                <p class="price-new">$4,299</p>
                <p class="price-old">Antes: $5,500</p>
                <button class="add-to-cart" data-id="1004" data-nombre="Kit de componentes" data-precio="4299" data-img="https://imgs.search.brave.com/7DRPO3p88aVY5C4fka7vUcJ7CPrtKE_gOLdpQH7k0CU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXJjYWVsZWN0cm9u/aWNhLmNvbS9jZG4v/c2hvcC9maWxlcy9L/aXRfZGVfY29tcG9u/ZW50ZXNfZWxlY3Ry/b25pY29zXzJfNTgw/eC5qcGc_dj0xNzY4/NTEyNDEw">Comprar</button>
            </div>
        </div>

        <h1>LLÉVATE UN DESCUENTO EN TU PRIMER PEDIDO AL REGISTRAR TU CUENTA</h1>

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
        fetch('footer.html')
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
<<<<<<< HEAD
     <script src="../JS/buscador.js"></script>
=======
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
>>>>>>> desarrollo-AngelD
</body>
</html>
