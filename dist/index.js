"use strict";
const obtenerPalabras = (cadena) => {
    return cadena.match(/\b[\wáéíóúÁÉÍÓÚñÑüÜ]+(?:\.\d+)?\b/g);
};
const alertas = [];
const cantidadDeAlertas = 50;
const descripcionPar = 'Descripcion par para el auto. ';
const descripcionImpar = 'Descripcion impar para el auto. ';
let id = 0;
for (let i = 0; i < cantidadDeAlertas; i++) {
    alertas.push({
        id: id,
        descripcion: (0 == i % 2 ? descripcionPar : descripcionImpar) + "Alerta nro: " + i.toString() + ".",
        fechaYHora: new Date()
    });
    id++;
}
const cadenaDePrueba = ' AA108XU.!1';
const palabras = obtenerPalabras(cadenaDePrueba);
console.log(palabras); // null si no hay match, array si hay palabras
// .find sirve para iterar sobre array, cuando encuentra la primer coincidencia, devuelve la referencia
// (elemento, indice, arrayOriginal) => { ... };
const clave = '';
let busqueda = ''; //esto es asi, porque es lo que devuelve find
if (null !== palabras) { // 1 ITERACIÓN PARA DESCRIPCIÓN
    const condicionDeBusqueda = (palabra) => palabra === clave;
    const resultadoBusqueda = palabras.find(condicionDeBusqueda);
    busqueda = undefined !== resultadoBusqueda ? resultadoBusqueda : busqueda;
}
const cadenaIngresadaPorElUsuario = "Auto rojo modelo 2023";
// PASO 1: separar lo que ingreso el usuario en palabras
const palabrasFiltro = obtenerPalabras(cadenaIngresadaPorElUsuario);
// PASO 2: instancio el Set para crear el indice invertido(colección que NO ADMITE DUPLICADOS => key: palabraFiltro value: [idxAlerta])
const indiceInvertido = {};
for (let indiceAlerta = 0; indiceAlerta < cantidadDeAlertas; indiceAlerta++) {
    if (null !== palabrasFiltro && null !== alertas) {
        //PASO 3: cargo de indice invertido
        for (const palabra of palabrasFiltro) {
            const key = palabra.toLowerCase();
            if (!indiceInvertido[key]) {
                indiceInvertido[key] = [];
            }
            indiceInvertido[key].push(indiceAlerta);
        }
    }
}
for (const key in indiceInvertido) {
    console.log(indiceInvertido[key]);
}
