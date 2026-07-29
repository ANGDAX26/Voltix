<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voltix - Ofertas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="../CSS/style.css?v=2">
</head>

<body>

    <div id="header-placeholder"></div>
    <script src="../JS/header.js"></script>

    <script>
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                inicializarHeader();
            })
            .catch(e => {
                console.error('Error cargando header:', e);
                document.getElementById('header-placeholder').innerHTML = '<!-- header no cargado -->';
            });
    </script>

    <!-- El contenido de este Hero se reemplaza con los datos guardados en la BD. -->
    <section class="hero" id="hero-principal">

        <!-- Contenido de respaldo por si la API no puede cargar. -->
        <div class="slide active">
            <a class="slide-link" href="producto.php?id=2" aria-label="Ver Kit Arduino para principiantes">
                <img src="https://ibb.co/rRrvYxmf" alt="Kits Arduino para Principiantes">
                <div class="texto">
                    <h2>Kits Arduino para Principiantes</h2>
                    <p>Hasta 30% de descuento</p>
                    <span class="hero-cta">Ver producto</span>
                </div>
            </a>
        </div>

        <div class="slide">
            <a class="slide-link" href="producto.php?id=12" aria-label="Ver ESP32 y Proyectos IoT">
                <img src="https://ibb.co/bjpJDgbJ" alt="ESP32 y Proyectos IoT">
                <div class="texto">
                    <h2>ESP32 y Proyectos IoT</h2>
                    <p>WiFi y Bluetooth Integrados</p>
                    <span class="hero-cta">Ver producto</span>
                </div>
            </a>
        </div>

        <div class="slide">
            <a class="slide-link" href="producto.php?id=1" aria-label="Ver Gran Variedad de Sensores">
                <img src="https://ibb.co/99nDdxJn" alt="Gran Variedad de Sensores">
                <div class="texto">
                    <h2>Gran Variedad de Sensores</h2>
                    <p>Para Arduino, Raspberry y ESP32</p>
                    <span class="hero-cta">Ver producto</span>
                </div>
            </a>
        </div>

        <button class="prev" type="button" aria-label="Banner anterior">&#10094;</button>
        <button class="next" type="button" aria-label="Banner siguiente">&#10095;</button>

    </section>

    <h1>ÚLTIMAS OFERTAS Y LO ÚLTIMO EN PRODUCTOS</h1>

    <main>
        <div class="productos" id="productos"></div>

        <h1 class="section-title">LLÉVATE UN DESCUENTO EN TU PRIMER PEDIDO AL REGISTRAR TU CUENTA</h1>

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

    <script src="../JS/producto.js?v=2"></script>
    <script src="../JS/carrito.js"></script>
    <script src="../JS/buscador.js"></script>

    <script>
        const API_HERO = '../PHP/admin_hero.php';
        let intervaloHero = null;

        function escaparHero(texto) {
            const div = document.createElement('div');
            div.textContent = texto ?? '';
            return div.innerHTML;
        }

        function renderizarHero(slides) {
            const hero = document.getElementById('hero-principal');

            if (!Array.isArray(slides) || slides.length === 0) {
                hero.style.display = 'none';
                return;
            }

            hero.style.display = '';

            const contenido = slides.map((slide, indice) => `
                <div class="slide ${indice === 0 ? 'active' : ''}">
                    <a class="slide-link"
                       href="${escaparHero(slide.enlace || '#')}"
                       aria-label="${escaparHero(slide.titulo)}">
                        <img src="${escaparHero(slide.imagen)}"
                             alt="${escaparHero(slide.titulo)}">
                        <div class="texto">
                            <h2>${escaparHero(slide.titulo)}</h2>
                            ${slide.subtitulo ? `<p>${escaparHero(slide.subtitulo)}</p>` : ''}
                            <span class="hero-cta">${escaparHero(slide.texto_boton || 'Ver producto')}</span>
                        </div>
                    </a>
                </div>
            `).join('');

            const controles = slides.length > 1 ? `
                <button class="prev" type="button" aria-label="Banner anterior">&#10094;</button>
                <button class="next" type="button" aria-label="Banner siguiente">&#10095;</button>
            ` : '';

            hero.innerHTML = contenido + controles;
            iniciarCarruselHero();
        }

        function iniciarCarruselHero() {
            const hero = document.getElementById('hero-principal');
            const slides = hero.querySelectorAll('.slide');
            const btnSiguiente = hero.querySelector('.next');
            const btnAnterior = hero.querySelector('.prev');

            if (intervaloHero !== null) {
                clearInterval(intervaloHero);
                intervaloHero = null;
            }

            if (slides.length === 0) return;

            let index = 0;

            function mostrarSlide(n) {
                slides.forEach(slide => slide.classList.remove('active'));
                slides[n].classList.add('active');
            }

            if (slides.length === 1) {
                mostrarSlide(0);
                return;
            }

            btnSiguiente.addEventListener('click', () => {
                index = (index + 1) % slides.length;
                mostrarSlide(index);
            });

            btnAnterior.addEventListener('click', () => {
                index = (index - 1 + slides.length) % slides.length;
                mostrarSlide(index);
            });

            intervaloHero = setInterval(() => {
                index = (index + 1) % slides.length;
                mostrarSlide(index);
            }, 5000);
        }

        async function cargarHero() {
            try {
                const respuesta = await fetch(API_HERO);
                if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

                const slides = await respuesta.json();
                renderizarHero(slides);
            } catch (error) {
                console.error('No se pudo cargar el Hero desde la base de datos:', error);

                // Si falla la API, se mantiene el contenido de respaldo escrito en HTML.
                iniciarCarruselHero();
            }
        }

        cargarHero();
    </script>

</body>

</html>
