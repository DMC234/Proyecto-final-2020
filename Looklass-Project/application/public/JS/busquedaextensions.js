console.log('Busqueda');
//BUSQUEDA.HTML
const capa_busqueda_valoracion = document.querySelectorAll('.form_caja_busqueda')
const error_busqueda = document.querySelector('.error_busqueda');
const seccion_busqueda = document.getElementById('seccion_busqueda');
const sesion_busqueda = document.querySelector('#sesion_busqueda');
const capa_valoracion = document.querySelectorAll('#valorar_centro');
const capa_valoracion_checkbox = document.querySelectorAll('.valorar_centro_checkbox');

const formulario_iniciar_sesion = document.querySelector('#encabezado_caja_iniciar_sesion');
const recuperar_contraseña = document.querySelector('#busqueda_recuperacion');
const busqueda_cerrar_formulario = document.querySelector('#busqueda_cerrar_formulario');
const busqueda_abrir_formulario = document.querySelector('#busqueda_abrir_sesion');

//Clase donde se encuentran posibles estructuras para cargar en el HTML.
class Busqueda {
    //Al cargar la página de búsqueda, la pantalla donde se muestran los centros se oculta
    FormularioIniciarSesion(operacion){
        console.log('funciona'); 
        switch(operacion){
            case 1:formulario_iniciar_sesion.style.display = 'flex';break;
            case 2:formulario_iniciar_sesion.style.display = 'none';break;
        }
    }

    FormularioRecuperacion(operacion){
        switch(operacion){
            case 1:recuperar_contraseña.style.height = "10vh";break;
            case 2:recuperar_contraseña.style.height = "0vh";break;
        }
    }

    //Formulario de búsqueda por valoración
    buscarValoracion(posicion){
        let campo = capa_busqueda_valoracion[posicion].firstElementChild.checked = true;
        let color;
        console.log(window.innerWidth);

        for(let i = 0; i < capa_busqueda_valoracion.length; i++){
            if(capa_busqueda_valoracion[i].firstElementChild.checked == true){
                capa_busqueda_valoracion[i].lastElementChild.style.backgroundImage = "radial-gradient(rgb(251, 72, 72), rgb(161, 47, 47))";
            }else{
                capa_busqueda_valoracion[i].lastElementChild.style.backgroundImage = "radial-gradient(rgba(72, 219, 251,1.0), rgba(47, 161, 131, 1.0))";
            }
        }
    }
    //Valorar centro dentro de la etiqueta.
    actualizarValoracion(posicion){
        let campo = capa_valoracion_checkbox[posicion].firstElementChild.checked = true;
        //Recorremos las capas de los emojis para comprobar la capa cambiada y así diferenciarlo
        //cambiando el color.
        for(let i = 0; i < capa_valoracion_checkbox.length; i++){
            if(capa_valoracion_checkbox[i].firstElementChild.checked == true){
                capa_valoracion_checkbox[i].style.backgroundColor = "rgba(47, 161, 131, 0.9)";
                capa_valoracion_checkbox[i].style.color = "rgba(72, 219, 251,0.9)";
            }else{
                capa_valoracion_checkbox[i].style.backgroundColor = "transparent";
                capa_valoracion_checkbox[i].style.color = "white";
            }
        }
    }
    //Aumentar capa de la capa de los resultados por estética
    mostrarResultadosBusqueda(){
        if(error_busqueda.firstElementChild.textContent == ''){
            seccion_busqueda.style.height = '0vh';
        }else{
            seccion_busqueda.style.height = '40vh';
        }
    }
    //Aumentar y reducir altura de la capa de valoración del centro
    mostrarCampoValoracion(posicion){
        if(sesion_busqueda == null){
            capa_valoracion[posicion].style.height = '0vh';
        }else{
            capa_valoracion[posicion].style.height = '10vh';
        }
    }
}


//Llamadas desde el HTML y otros.
const clase = new Busqueda();

//Se aumenta la capa de resultados de la página busqueda.html al cargar la misma, comprobando
//si está vacío la capa donde se muestran los resultados y el error mismamente, de esta manera
//ahorramos codigo CSS y queda más estético.
document.addEventListener('DOMContentLoaded', ()=>{
    clase.mostrarResultadosBusqueda();
});

//Recorremos las estrellas de valoración de búsqueda
for(let i = 0; i < capa_busqueda_valoracion.length; i++){
    capa_busqueda_valoracion[i].addEventListener('click',()=>clase.buscarValoracion(i));
}


// Mostramos u ocultamos el formulario de valoración en la ficha de búsqueda
for(let i = 0; i < capa_valoracion.length; i++){
    clase.mostrarCampoValoracion(i);
}

//Recorremos los emojis del formulario de valoración de la búsqueda
for(let i = 0; i < capa_valoracion_checkbox.length; i++){
    capa_valoracion_checkbox[i].addEventListener('click',()=>clase.actualizarValoracion(i));
}

//Accedemos al formulario de Búsqueda
busqueda_abrir_formulario.addEventListener('click',()=>clase.FormularioIniciarSesion(1));
busqueda_cerrar_formulario.addEventListener('click',()=>clase.FormularioIniciarSesion(2));
recuperar_contraseña.previousElementSibling.addEventListener('mouseenter',()=>clase.FormularioRecuperacion(1));
recuperar_contraseña.addEventListener('mouseleave',()=>clase.FormularioRecuperacion(2));

