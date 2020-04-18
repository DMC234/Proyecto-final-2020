/*COMPROBAMOS LA EXISTENCIA DE LA BASE DE DATOS*/
DROP DATABASE IF EXISTS `Looklass`;
/*CREAMOS LA BASE DE DATOS*/
CREATE DATABASE Looklass;

use Looklass;
/*TABLA USUARIOS*/
CREATE TABLE usuarios(
idUsuario integer not null primary key auto_increment,
nombreUsuario varchar(30) not null unique,
pwd varchar(50) not null,
nombreReal varchar(30) not null,
apellidoReal varchar(50) not null,
correo varchar(40) not null,
d_mac varchar(20)
)ENGINE = InnoDB, CHARACTER SET='utf8';


/*TABLA CENTRO*/
CREATE TABLE centro(
numeroCentro integer not null primary key,
nombreCentro varchar(40) not null,
localizacion varchar(50) not null,
descripionCentro longtext,
img varchar(80) not null,
enlace varchar(180) not null,
tematica varchar(50) not null
)ENGINE = InnoDB, CHARACTER SET = 'utf8';



/*TABLA INTERACCIÓN*/
CREATE TABLE interaccion(
idUsuario integer not null,
visita int not,
valoracion int,
numeroCentro integer not null,
FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
FOREIGN KEY (numeroCentro) REFERENCES centro(numeroCentro)
); 


/*Inserts de la BBDD*/

/*Tabla Usuario*/
INSERT INTO `usuarios` (`idUsuario`, `nombreUsuario`, `pwd`, `nombreReal`, `apellidoReal`, `correo`, `d_mac`) VALUES
(1, 'sigil95', '1234', 'Eduardo', 'del Río Rodríguez', 'rabahretmix@gmail.com', ''),
(2, 'anonimo', '0', 'anonimo', 'anonimo', 'anonimo', ''),
(4, 'anonimo', '000000', 'anonimo', 'anonimo', 'anonimo', '88:78:73:c3:11:21');


/*Tabla Interaccion*/

INSERT INTO `interaccion` (`idUsuario`, `visita`, `valoracion`, `numeroCentro`) VALUES
(2, 1, 4, 102),
(2, 1, 0, 103),
(1, 1, 4, 103),
(1, 1, 4, 101),
(4, 1, 0, 101),
(4, 1, 4, 102),
(4, 1, 0, 103),
(1, 1, 4, 120),
(4, 1, 0, 120);

/*Tabla centro*/
INSERT INTO `centro` (`numeroCentro`, `nombreCentro`, `localizacion`, `descripcionCentro`, `img`, `enlace`, `tematica`) VALUES
(101, 'IFP', 'Madrid', '\r\n\r\niFP (Innovación en Formación Profesional) es un centro oficial de Formación Profesional de primer nivel, innovador, funcional y moderno.\r\n\r\nOfrecemos una formación de calidad combinando una metodología innovadora, profesores expertos y la colaboración de las mejores empresas que enriquecen los contenidos y facilitan prácticas.\r\n', '/img/centros/101.png', 'https://www.ifp.es/fp-madrid/desarrollo-de-aplicaciones-web', 'informatica'),
(102, 'Ilerna', 'Madrid', 'Impartimos cuatro titulaciones 100% oficiales. En modalidad presen- cial, el Grado Medio de Farmacia y Parafarmacia y el Grado Superior de Dietética. En modalidad semipresencial, a través de ILERNA Online y con clases de apoyo en ILERNA Madrid, el ciclo de Grado Medio de Cuidados Auxiliares de Enfermería y el de Grado Superior de Higiene Bucodental.', '/img/centros/102.png', 'https://www.ilerna.es/fp-madrid/?utm_source=adwords', 'enfermeria'),
(103, 'escuelaiem', 'Madrid', 'Doble titulación con\r\nEspecialidad Infantil\r\nPrácticas y trabajos asegurados\r\nPonencias y actividades\r\nContenidos digitales y dispositivo tablet\r\nTodo incluido\r\n', '/img/centros/103.jpg', 'https://www.escuelaiem.com/enfermeria.html?gclid=CjwKCAjwg6b0BRBMEiwANd1_SMPEJtiB9nTgBR44ca4Wx2CIO_e6yh0DQzqDwpBX0Fsk2h6fr4HHvxoCq1MQAvD_BwE', 'enfermeria'),
(110, 'Ilerna', 'Cataluña', 'La Formación Profesional presencial de Grado Medio o Grado Superior 100% oficial.\r\nCon nosotros obtendrás la titulación oficial y homologada, formación a medida para empresas, formación continua, especialidades formativas,\r\npreparación para pruebas de acceso… \r\n\r\nConsulta toda nuestra oferta formativa complementaria. ', '/img/centros/102.png', 'https://www.ilerna.es/fp-lleida/es/', 'enfermeria|informatica'),
(120, 'C.E ADAMS', 'Valencia', 'Idiomas, Informática y Comunicaciones, Marketing y Relaciones Públicas, \r\nOfimática y mucho más.\r\n', '/img/centros/120.png', 'https://www.adams.es/nuestros-centros/valencia/0/4', 'informatica|marketing');
