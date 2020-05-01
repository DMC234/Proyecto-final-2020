console.log('recicla T.T');
//INDEX.HTML


class Index{
    mostrarFormulario(operacion){
        switch(operacion){
            case "abrir":
                formulario_capa.style.display = 'block';
            break;
            case "cerrar":
                formulario_capa.style.display = 'none';
            break;
        }
    }

    recuperarContrasenaIndex(operacion){
        switch(operacion){
            case "abrir":
                formulario_general[2].lastElementChild.style.height = '10vh';
                formulario_general[2].lastElementChild.style.transition = '0.5s';
            break;
            case "cerrar":
                formulario_general[2].lastElementChild.style.height = '0vh';
                formulario_general[2].lastElementChild.style.transition = '0.5s';
            break;
        }
    
    }
}

const clase = new Index();



/*Apertura y cierre del formulario del INDEX */
/*Variables Generales*/
const formulario_general = document.querySelectorAll('.index_formulario_caja');
const formulario_capa = document.querySelector('#index_formulario');
const formulario_abrir = document.querySelectorAll('.encabezado_caja');


//Para abrir y cerrar el formulario
formulario_abrir[2].addEventListener('click',()=>clase.mostrarFormulario("abrir"));
formulario_general[0].lastElementChild.addEventListener('click',()=>clase.mostrarFormulario("cerrar"));
//Para abrir y cerrar el formulario de recuperación de contraseña
formulario_general[2].addEventListener('mouseover',()=>clase.recuperarContrasenaIndex("abrir"));
formulario_general[2].addEventListener('mouseleave',()=>clase.recuperarContrasenaIndex("cerrar"));
formulario_general[2].firstElementChild.addEventListener('mouseenter',()=>clase.recuperarContrasenaIndex("abrir"));