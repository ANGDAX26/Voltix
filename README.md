# Voltix — Instrucciones de desarrollo

Para que `header.html` y `footer.html` se carguen correctamente desde `Voltix.html`, abre la página a través de un servidor HTTP (no con `file://`).

En la carpeta del proyecto ejecuta:

```bash
python3 -m http.server 8000
```

Luego abre en el navegador:

http://localhost:8000/Voltix.html

Motivo: los navegadores bloquean peticiones `fetch` cuando se sirven archivos desde el sistema de archivos (`file://`) por razones de seguridad. Servir por HTTP permite que `fetch('header.html')` y `fetch('footer.html')` funcionen.
