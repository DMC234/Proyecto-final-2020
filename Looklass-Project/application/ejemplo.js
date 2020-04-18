const os = require('os');
let ip = os.networkInterfaces();
let ips = new Array();

//Si el objeto no te permite acceder a sus valores, la solución
//es asignarle claves y luego mapearlo, para así acceder de manera sencilla
Object.keys(ip).forEach((dispositivos)=>{
    ip['Wi-Fi'].map((valor)=>{
        console.log(valor.address);
    })
})

console.log(ip);

// let ejemplo = [2,3,4,5,6];

// let fk = ejemplo.keys();

// for(let i = fk.next().value; i < ejemplo.length; i++){
//     console.log(i);
// }

// ejemplo.fill('kiwi',0,3);
// console.log(ejemplo);
