

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
    contrasena  VARCHAR(255) NOT NULL,        -- bcrypt, nunca texto plano
    direccion   VARCHAR(60)  NULL,
    colonia     VARCHAR(60)  NULL,
    ciudad      VARCHAR(60)  NULL,
    estado      VARCHAR(60)  NULL,
    cp          VARCHAR(10)  NULL,
    telefono    VARCHAR(15)  NULL,
    rol         VARCHAR(10)  NOT NULL DEFAULT 'cliente'   -- 'cliente' | 'admin'
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
    envio       DECIMAL(10,2) NOT NULL DEFAULT 0,
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
    FOREIGN KEY (id_usuario)  REFERENCES usuario(id_usuario)     ON DELETE CASCADE,
    UNIQUE KEY una_resena_por_usuario (id_producto, id_usuario)
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



INSERT INTO categoria (nombre_categoria) VALUES
    ('Sensores'),
    ('Kits educativos'),
    ('Cables'),
    ('Herramientas'),
    ('Computación'),
    ('Hogar'),
    ('Telefonía'),
    ('Audio');

-- Administrador: usuario=admin / contraseña=admin123
INSERT INTO usuario (nombreU, nombre, apellidos, correoU, contrasena, rol) VALUES
    ('admin', 'Administrador', 'Voltix', 'admin@voltix.com',
     '$2y$10$kYRmte4F8leowhEKBrWvCekF6JFBXcJLnp/1QPwvQ6Hdti/O5zyKC', 'admin');

-- Productos de ejemplo
INSERT INTO productos (id_categoria, nombreP, precio, stock, descripcion, imagen) VALUES
    (1, 'Sensor de temperatura DHT11',   45.00, 50,
     'Sensor digital de temperatura y humedad para Arduino y ESP32.',
     'https://http2.mlstatic.com/D_NQ_NP_2X_780545-MLM32201039725_092019-F.webp'),
    (1, 'Sensor ultrasónico HC-SR04',    38.00, 80,
     'Sensor de distancia ultrasónico, rango 2 cm a 400 cm.',
     'https://http2.mlstatic.com/D_NQ_NP_2X_771588-MLM32201039723_092019-F.webp'),
    (2, 'Kit Arduino Starter Plus',     299.00, 30,
     'Kit completo para principiantes con Arduino UNO, protoboard, sensores y más.',
     'https://http2.mlstatic.com/D_NQ_NP_2X_969843-MLM74071236703_012024-F.webp'),
    (2, 'Kit ESP32 IoT',                350.00, 20,
     'Placa ESP32 con WiFi y Bluetooth integrados, ideal para proyectos IoT.',
     'https://http2.mlstatic.com/D_NQ_NP_2X_614516-MLM75199482226_032024-F.webp'),
    (3, 'Set de cables Dupont 40 pzas',  25.00, 200,
     'Cables de conexión Macho-Macho, Macho-Hembra y Hembra-Hembra para protoboard.',
     'https://http2.mlstatic.com/D_NQ_NP_2X_769019-MLM32201039728_092019-F.webp'),
    (4, 'Multímetro digital DT830B',     85.00, 40,
     'Multímetro básico para medir voltaje, corriente y resistencia.',
     'https://http2.mlstatic.com/D_NQ_NP_2X_779547-MLM32201039726_092019-F.webp');

-- Banners del hero
INSERT INTO hero_slides (titulo, subtitulo, imagen, enlace, texto_boton, orden) VALUES
    ('Kits Arduino para Principiantes', 'Hasta 30% de descuento',
     'https://http2.mlstatic.com/D_NQ_NP_2X_969843-MLM74071236703_012024-F.webp',
     'producto.php?id=3', 'Ver producto', 1),
    ('ESP32 y Proyectos IoT', 'WiFi y Bluetooth Integrados',
     'https://http2.mlstatic.com/D_NQ_NP_2X_614516-MLM75199482226_032024-F.webp',
     'producto.php?id=4', 'Ver producto', 2),
    ('Gran Variedad de Sensores', 'Para Arduino, Raspberry y ESP32',
     'https://http2.mlstatic.com/D_NQ_NP_2X_780545-MLM32201039725_092019-F.webp',
     'producto.php?id=1', 'Ver producto', 3);

-- Reseñas de ejemplo
INSERT INTO resenas (id_producto, id_usuario, calificacion, comentario) VALUES
    (1, 1, 5, 'Excelente sensor, llegó en perfectas condiciones y funciona de maravilla con Arduino.'),
    (3, 1, 4, 'El kit trae todo lo necesario para empezar, muy recomendado para principiantes.');
