
//Parámetros y capas importantes.
const encabezado_caja = document.querySelectorAll('.encabezado_caja');
const encabezado_caja_registro = document.querySelector('.encabezado_caja_registro');
const cerrar_formulario = document.querySelector('.x');
encabezado_caja[2].firstElementChild.style.cursor = "pointer";

//Abrir formulario de inicio y registro de sesión
encabezado_caja[2].firstElementChild.addEventListener('click',()=>{
    encabezado_caja_registro.style.display = 'grid';
});

//Cerrar formulario de inicio y registro de sesión
cerrar_formulario.addEventListener('click',()=>{
    encabezado_caja_registro.style.display = 'none';
});

//Clase donde se encuentran posibles estructuras para cargar en el HTML.



class builder{




}