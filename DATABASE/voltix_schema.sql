DROP DATABASE IF EXISTS voltix;
CREATE DATABASE voltix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE voltix;


CREATE TABLE categoria (
    id_categoria     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE productos (
    id_productos INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombreP      VARCHAR(120) NOT NULL,
    precio       DECIMAL(10,2) NOT NULL,
    stock        INT NOT NULL DEFAULT 0,
    descripcion  TEXT NULL,
    imagen       VARCHAR(255) NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE usuario (
    id_usuario  INT AUTO_INCREMENT PRIMARY KEY,
    nombreU     VARCHAR(20)  NOT NULL UNIQUE,
    nombre      VARCHAR(60)  NULL,
    apellidos   VARCHAR(60)  NULL,
    correoU     VARCHAR(60)  NOT NULL UNIQUE,
    contrasena  VARCHAR(255) NOT NULL,
    direccion   VARCHAR(60)  NULL,
    colonia     VARCHAR(60)  NULL,
    ciudad      VARCHAR(60)  NULL,
    estado      VARCHAR(60)  NULL,
    cp          VARCHAR(10)  NULL,
    telefono    VARCHAR(15)  NULL,
    rol         VARCHAR(10)  NOT NULL DEFAULT 'cliente'
);



CREATE TABLE pedido (
    id_pedido   INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario  INT NOT NULL,
    fecha       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    direccion   VARCHAR(60)  NULL,
    colonia     VARCHAR(60)  NULL,
    ciudad      VARCHAR(60)  NULL,
    estado_env  VARCHAR(60)  NULL,
    cp          VARCHAR(10)  NULL,
    metodo_pago VARCHAR(30)  NOT NULL,
    estado      VARCHAR(20)  NOT NULL DEFAULT 'En proceso',
    subtotal    DECIMAL(10,2) NOT NULL,
    envio       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total       DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);



CREATE TABLE detalle_venta (
    id_venta     INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido    INT NOT NULL,
    id_productos INT NOT NULL,
    cantidad     INT NOT NULL,
    precio       DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido)    REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_productos) REFERENCES productos(id_productos)
);


CREATE TABLE resenas (
    id_resena    INT AUTO_INCREMENT PRIMARY KEY,
    id_producto  INT NOT NULL,
    id_usuario   INT NOT NULL,
    calificacion TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario   TEXT NOT NULL,
    fecha        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_productos) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario)  REFERENCES usuario(id_usuario)   ON DELETE CASCADE,
    CONSTRAINT una_resena_por_usuario UNIQUE (id_producto, id_usuario)
);


CREATE TABLE hero_slides (
    id_hero     INT AUTO_INCREMENT PRIMARY KEY,
    titulo      VARCHAR(120) NOT NULL,
    subtitulo   VARCHAR(200) NULL,
    imagen      VARCHAR(255) NOT NULL,
    enlace      VARCHAR(255) NULL,
    texto_boton VARCHAR(60)  NULL DEFAULT 'Ver producto',
    orden       INT NOT NULL DEFAULT 0,
    activo      TINYINT(1)   NOT NULL DEFAULT 1
);



-- Categorías
INSERT INTO categoria (id_categoria, nombre_categoria) VALUES
    (1, 'Sensores'),
    (2, 'Kits educativos'),
    (3, 'Cables'),
    (4, 'Herramientas'),
    (5, 'Computación'),
    (6, 'Hogar'),
    (7, 'Telefonía'),
    (8, 'Audio');



-- Usuario administrador (Contraseña hash original preservada)
INSERT INTO usuario (id_usuario, nombreU, nombre, apellidos, correoU, contrasena, direccion, colonia, ciudad, estado, cp, telefono, rol) VALUES
    (1, 'admin', 'Administrador', 'Voltix', 'admin@voltix.com', '$2y$10$kYRmte4F8leowhEKBrWvCekF6JFBXcJLnp/1QPwvQ6Hdti/O5zyKC', NULL, NULL, NULL, NULL, NULL, NULL, 'admin');



-- Productos
INSERT INTO productos (id_productos, id_categoria, nombreP, precio, stock, descripcion, imagen) VALUES
    (1, 1, 'Sensor de temperatura DHT11', 45.00, 50, 'Sensor digital de temperatura y humedad para Arduino y ESP32.', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785476710/imagen_2026-07-30_234554627_j02e5g.png'),
    (3, 2, 'Kit Arduino Starter Plus', 299.00, 30, 'Kit completo para principiantes con Arduino UNO, protoboard, sensores y más.', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785476723/imagen_2026-07-30_234604635_jmwubd.png'),
    (4, 2, 'Kit ESP32 IoT', 350.00, 20, 'Placa ESP32 con WiFi y Bluetooth integrados, ideal para proyectos IoT.', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785476731/imagen_2026-07-30_234615441_ri8fjk.png'),
    (5, 3, 'Set de cables Dupont 40 pzas', 25.00, 200, 'Cables de conexión Macho-Macho, Macho-Hembra y Hembra-Hembra para protoboard.', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785476630/imagen_2026-07-30_234434770_wk7nes.png'),
    (6, 4, 'Multímetro digital DT830B', 85.00, 40, 'Multímetro básico para medir voltaje, corriente y resistencia.', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785476420/imagen_2026-07-30_234103711_efiz8i.png');


-- Hero Slides
INSERT INTO hero_slides (id_hero, titulo, subtitulo, imagen, enlace, texto_boton, orden, activo) VALUES
    (1, 'Kits Arduino para Principiantes', 'Hasta 30% de descuento', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785344024/imagen_2026-07-29_105422442_zywaq6.png', 'producto.php?id=3', 'Ver producto', 1, 1),
    (2, 'ESP32 y Proyectos IoT', 'WiFi y Bluetooth Integrados', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785344181/imagen_2026-07-29_105656737_plowfj.png', 'producto.php?id=4', 'Ver producto', 2, 1),
    (3, 'Gran Variedad de Sensores', 'Para Arduino, Raspberry y ESP32', 'https://res.cloudinary.com/ty7o3lam/image/upload/v1785344059/imagen_2026-07-29_105503771_zpsxfw.png', 'producto.php?id=1', 'Ver producto', 3, 1);


-- Reseñas
INSERT INTO resenas (id_resena, id_producto, id_usuario, calificacion, comentario, fecha) VALUES
    (1, 1, 1, 5, 'Excelente sensor, llegó en perfectas condiciones y funciona de maravilla con Arduino.', '2026-07-31 05:35:48'),
    (2, 3, 1, 4, 'El kit trae todo lo necesario para empezar, muy recomendado para principiantes.', '2026-07-31 05:35:48');

