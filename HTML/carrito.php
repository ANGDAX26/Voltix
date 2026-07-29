<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito de compras | Voltix</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="../CSS/style.css?v=3">
    <link rel="stylesheet" href="../CSS/auth.css?v=3">
    <link rel="stylesheet" href="../CSS/carrito.css?v=3">
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
            .catch(error => {
                console.error('Error cargando header:', error);
                document.getElementById('header-placeholder').innerHTML = '<!-- header no cargado -->';
            });
    </script>

    <main class="login-container carrito-page">
        <h1>Carrito de compras</h1>

        <section class="carrito-items" aria-live="polite">
            <!-- carrito.js reemplaza este contenido con los productos guardados -->
        </section>

        <section class="resumen">
            <h2>Resumen del pedido</h2>
            <p><span>Subtotal:</span> <span>$0.00</span></p>
            <p><span>Envío:</span> <span>$0.00</span></p>
            <p class="total"><span>Total:</span> <span>$0.00</span></p>
            <small>Envío gratis en compras mayores a $500 MXN.</small>
        </section>

        <section class="checkout-panel" id="checkout-panel" aria-hidden="true">
            <div class="direccion-envio">
                <div class="checkout-heading">
                    <span class="checkout-step">1</span>
                    <div>
                        <h2>Dirección de envío</h2>
                        <p>Indica dónde quieres recibir tu pedido.</p>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="campo campo-completo">
                        <label for="calle">Calle y número</label>
                        <input type="text" id="calle" name="calle" autocomplete="street-address" placeholder="Ejemplo: Av. Principal #123">
                    </div>

                    <div class="campo">
                        <label for="colonia">Colonia</label>
                        <input type="text" id="colonia" name="colonia" placeholder="Ejemplo: Centro">
                    </div>

                    <div class="campo">
                        <label for="ciudad">Ciudad</label>
                        <input type="text" id="ciudad" name="ciudad" autocomplete="address-level2" placeholder="Ejemplo: Cuernavaca">
                    </div>

                    <div class="campo">
                        <label for="estado">Estado</label>
                        <input type="text" id="estado" name="estado" autocomplete="address-level1" placeholder="Ejemplo: Morelos">
                    </div>

                    <div class="campo">
                        <label for="cp">Código postal</label>
                        <input type="text" id="cp" name="cp" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="Ejemplo: 62000">
                    </div>

                    <div class="campo campo-completo">
                        <label for="referencias">Referencias de entrega <span>(opcional)</span></label>
                        <textarea id="referencias" name="referencias" rows="3" placeholder="Ejemplo: Casa color blanco, cerca de la tienda"></textarea>
                    </div>
                </div>
            </div>

            <div class="metodo-pago">
                <div class="checkout-heading">
                    <span class="checkout-step">2</span>
                    <div>
                        <h2>Método de pago</h2>
                        <p>Selecciona cómo deseas pagar.</p>
                    </div>
                </div>

                <div class="metodos-lista">
                    <label class="metodo-card">
                        <input type="radio" name="pago" value="tarjeta">
                        <span class="metodo-icono">💳</span>
                        <span>
                            <strong>Tarjeta de crédito o débito</strong>
                            <small>Visa, Mastercard o American Express</small>
                        </span>
                    </label>

                    <div class="datos-tarjeta" id="datos-tarjeta" aria-hidden="true">
                        <p class="pago-demo-aviso">Pago de demostración: no ingreses datos bancarios reales.</p>

                        <div class="form-grid tarjeta-grid">
                            <div class="campo campo-completo">
                                <label for="titular-tarjeta">Nombre del titular</label>
                                <input type="text" id="titular-tarjeta" autocomplete="cc-name" placeholder="Como aparece en la tarjeta">
                            </div>

                            <div class="campo campo-completo">
                                <label for="numero-tarjeta">Número de tarjeta</label>
                                <div class="tarjeta-input-wrap">
                                    <input type="text" id="numero-tarjeta" inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="0000 0000 0000 0000">
                                    <span id="marca-tarjeta" class="marca-tarjeta">Tarjeta</span>
                                </div>
                            </div>

                            <div class="campo">
                                <label for="vencimiento-tarjeta">Vencimiento</label>
                                <input type="text" id="vencimiento-tarjeta" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="MM/AA">
                            </div>

                            <div class="campo">
                                <label for="cvv-tarjeta">CVV</label>
                                <input type="password" id="cvv-tarjeta" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="123">
                            </div>
                        </div>
                    </div>

                    <label class="metodo-card">
                        <input type="radio" name="pago" value="transferencia">
                        <span class="metodo-icono">🏦</span>
                        <span>
                            <strong>Transferencia bancaria</strong>
                            <small>Recibirás la referencia de tu pedido</small>
                        </span>
                    </label>

                    <label class="metodo-card">
                        <input type="radio" name="pago" value="efectivo">
                        <span class="metodo-icono">💵</span>
                        <span>
                            <strong>Pago en efectivo al recibir</strong>
                            <small>Sujeto a disponibilidad de entrega</small>
                        </span>
                    </label>
                </div>
            </div>
        </section>

        <div id="checkout-mensaje" class="checkout-mensaje" role="status" aria-live="polite" hidden></div>

        <div class="login-footer">
            <button id="btnCheckout" type="button">Proceder al pago</button>
            <p><a href="Index.php">Seguir comprando</a></p>
        </div>
    </main>

    <footer class="carrito-footer">
        <p>&copy; 2026 Voltix. Todos los derechos reservados.</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="../JS/header.js?v=3"></script>
    <script src="../JS/buscador.js?v=3"></script>
    <script src="../JS/carrito.js?v=3"></script>
</body>
</html>
