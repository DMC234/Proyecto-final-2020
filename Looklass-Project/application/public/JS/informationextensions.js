console.log('información')
//INFORMACION.HTML
const capa_contenido = document.querySelectorAll('.term_unfold_content');
const boton_termino = document.querySelectorAll('.term_button');
const cuerpo = document.querySelectorAll('.cuerpo');

class Informacion{
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
}

const clase = new Informacion();

//Recorremos los terminos y preguntas
for(let i = 0; i < boton_termino.length; i++){
    boton_termino[i].firstElementChild.addEventListener('click', () => clase.mostrarTerminos(i));
}