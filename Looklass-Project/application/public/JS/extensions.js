//INDEX.HTML
const encabezado_caja = document.querySelectorAll('.encabezado_caja');
const encabezado_caja_registro = document.querySelector('.encabezado_caja_registro');
const cerrar_formulario = document.querySelector('.x');
const formulario_recuperacion_enlace = document.querySelectorAll('.encabezado_caja_registro_division')[3];
const formulario_recuperacion = document.querySelector('#sesion_recuperacion');
encabezado_caja[2].firstElementChild.style.cursor = "pointer";
//INFORMACION.HTML
const capa_contenido = document.querySelectorAll('.term_unfold_content');
const boton_termino = document.querySelectorAll('.term_button');
const cuerpo = document.querySelectorAll('.cuerpo');

//BUSQUEDA.HTML
const valoracion = document.querySelectorAll('.fa-star');

console.log(valoracion);

//Clase donde se encuentran posibles estructuras para cargar en el HTML.
class builder {
    Formulario(operacion) {
        switch (operacion) {
            //Abrir formulario de inicio y registro de sesión
            case 1: encabezado_caja_registro.style.display = 'grid'; break;
            //Cerrar formulario de inicio, registro de sesión y formulario de recuperación de cuenta
            case 2: encabezado_caja_registro.style.display = 'none'; 
                    formulario_recuperacion.style.display = 'none'; break;
            //Abrir formulario de recuperación de cuenta
            case 3: formulario_recuperacion.style.display = 'flex'; break;
        }
    }
    mostrarTerminos(posicion) {
        if (boton_termino[posicion].firstElementChild.getAttribute('class') == 'term_unfold') {
            capa_contenido[posicion].style.display = 'block';
            boton_termino[posicion].firstElementChild.setAttribute('class', 'term_fold');
            boton_termino[posicion].firstElementChild.setAttribute('src', './img/actions/recoger.png');
            cuerpo[posicion].style.height = '40vh';
        }else if(boton_termino[posicion].firstElementChild.getAttribute('class') == 'term_fold'){
            capa_contenido[posicion].style.display = 'none';
            boton_termino[posicion].firstElementChild.setAttribute('class', 'term_unfold');
            boton_termino[posicion].firstElementChild.setAttribute('src', './img/actions/desplegar.png');
            cuerpo[posicion].style.height = '17vh';
        }
    }
    buscarByValoracion(posicion){
        let campo = document.getElementById(`star_${posicion+1}`);
        campo.checked = true;
    }
}

//Llamadas desde el HTML y otros.
const clase = new builder();
    //Recorremos los terminos y preguntas
for(let i = 0; i < boton_termino.length; i++){
    boton_termino[i].firstElementChild.addEventListener('click', () => clase.mostrarTerminos(i));
}
//Recorremos las estrellas de valoración de búsqueda
for(let i = 0; i < valoracion.length; i++){
    valoracion[i].addEventListener('click',()=>clase.buscarByValoracion(i));
}
//Accedemos a los botones de registro y cierre del formulario del index.
encabezado_caja[2].firstElementChild.addEventListener('click', ()=>clase.Formulario(1));
cerrar_formulario.addEventListener('click',()=>clase.Formulario(2));
formulario_recuperacion_enlace.addEventListener('click',()=>clase.Formulario(3));