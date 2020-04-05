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
correo varchar(40) not null
)ENGINE = InnoDB, CHARACTER SET='utf8';


/*TABLA CENTRO*/
CREATE TABLE centro(
numeroCentro integer not null primary key,
nombreCentro varchar(40) not null,
localizacion varchar(50) not null,
precio dec(9,2) not null,
descripionCentro longtext not null,
img varchar(80) not null,
enlace varchar(180) not null
)ENGINE = InnoDB, CHARACTER SET = 'utf8';



/*TABLA INTERACCIÓN*/
CREATE TABLE interaccion(
idUsuario integer not null,
visita bit not null,
valoracion dec(5,2),
numeroCentro integer not null,
FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
FOREIGN KEY (numeroCentro) REFERENCES centro(numeroCentro)
); 


/*VALORES PREDETERMINADOS*/
INSERT INTO usuarios (nombreUsuario, pwd, nombreReal, apellidoReal, correo) VALUES('sigil95','1234','Eduardo','del Río Rodríguez','rabahretmix@gmail.com');
