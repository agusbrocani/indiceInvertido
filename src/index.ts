const obtenerPalabrasLegacy = (cadena: string): RegExpMatchArray | null => {
    return cadena.match(/\b[\wáéíóúÁÉÍÓÚñÑüÜ]+(?:\.\d+)?\b/g);
}

type Alerta = {
    id: number,
    descripcion: string,
    fechaYHora: Date
};

const alertas2: Alerta[] = [];
const cantidadDeAlertas: number = 50;
const descripcionPar: string = 'Descripcion par para el auto. '
const descripcionImpar: string = 'Descripcion impar para el auto. '
let id: number = 0;

// for (let i = 0; i < cantidadDeAlertas; i++) {
//     alertas.push({
//             id: id,
//             descripcion: (0 == i % 2 ? descripcionPar : descripcionImpar) + "Alerta nro: " + i.toString() + ".",
//             fechaYHora: new Date()
//         });
//     id++;
// }


const cadenaDePrueba: string = ' AA108XU.!1';
const palabras: RegExpMatchArray | null = obtenerPalabrasLegacy(cadenaDePrueba);
console.log(palabras);   // null si no hay match, array si hay palabras

// .find sirve para iterar sobre array, cuando encuentra la primer coincidencia, devuelve la referencia
// (elemento, indice, arrayOriginal) => { ... };

const clave: string = '';
let busqueda: string | undefined = '';  //esto es asi, porque es lo que devuelve find

if (null !== palabras) {    // 1 ITERACIÓN PARA DESCRIPCIÓN
    const condicionDeBusqueda = (palabra: string): boolean => palabra === clave;
    const resultadoBusqueda: string | undefined = palabras.find(condicionDeBusqueda);
    busqueda = undefined !== resultadoBusqueda ? resultadoBusqueda : busqueda;
}

const cadenaIngresadaPorElUsuario2: string = "Auto rojo modelo 2023";

// PASO 1: separar lo que ingreso el usuario en palabras
const palabrasFiltro: RegExpMatchArray | null = obtenerPalabrasLegacy(cadenaIngresadaPorElUsuario2);
// PASO 2: instancio el Set para crear el indice invertido(colección que NO ADMITE DUPLICADOS => key: palabraFiltro value: [idxAlerta])
const indiceInvertido: Record<string, number[]> = {};

for (let indiceAlerta = 0; indiceAlerta < cantidadDeAlertas; indiceAlerta++) {
    if (null !== palabrasFiltro && null !== alertas2) {
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

const setPalabras = new Set<string>(["carro", "auto", "bicicleta", "auto"]);    // RESPETAN ORDEN DE INSERCIÓN, NO ALFABETICO O NUMERICO
console.log(setPalabras);   // output: Set(3) { 'carro', 'auto', 'bicicleta' }
// si tengo new Set<number>([1,2,4,0]) => output: 1,2,4,0 RESPETA ORDEN DE INSERCIÓN
// Como los indices en mi caso siempre van a ser ascendentes, no voy a tener este problema y en vez de tener intersecciones entre KV de N*M van a ser de N + M siendo N ce primer array y M ce segundo array

/*
    const setKV = new Set<Record<string, Set<number>>>(); //ESTO ESTÁ MAL, los Set, solo admiten valores únicos => le estoy poniendo como valor único un par Key - Value => DEBERIA USAR MAP

    Porque usé Map? => acepta Clave - Valor
    Clave: string => palabra que ingreso el usuario en el buscador
    Value: Set<number> => porque? => porque NO ADMITE DUPLICADOS, esto es ideal, porque voy a guardar los ÍNDICES de los Registros en donde aparezca la palabra que el usuario quiere buscar.
*/

/*
    / ... /g → delimitadores de regex con bandera g (global):
        Encuentra todas las coincidencias, no solo la primera.
    \b → borde de palabra:
        Coincide solo si hay un inicio o fin de palabra.
        Evita encontrar coincidencias parciales dentro de otras palabras.
    [\wáéíóúÁÉÍÓÚñÑüÜ]+
        \w = letras, números y guión bajo ([A-Za-z0-9_])
        Lo extendiste para incluir letras con tilde y diéresis (¡muy bien!)
        El + dice: “uno o más caracteres válidos”
        Esto detecta palabras como auto, café, niñez, Árbol, etc.
    (?:\.\d+)?
        Un grupo no capturante (por eso ?:)
        \. = un punto literal
        \d+ = uno o más dígitos
        El ? dice que es opcional
        Esto permite palabras tipo modelo.2023, version.1, etc.
    Otro \b al final → asegura que la palabra termine bien.
*/

const alertas: Alerta[] = [
  { id: 0, descripcion: "Auto rojo detenido", fechaYHora: new Date() },
  { id: 1, descripcion: "Camión blanco", fechaYHora: new Date() },
  { id: 2, descripcion: "Patente AB100XX involucrada detenido en arbol", fechaYHora: new Date() }
];
const cadenaIngresadaPorElUsuario: string = "Auto rojo modelo 2023 patente AB100XX detenido";

const obtenerPalabras = (cadena: string): string[] => {
  return cadena.match(/\b[\wáéíóúÁÉÍÓÚñÑüÜ]+(?:\.\d+)?\b/g) ?? [];  // ?? [] es el operador de nullish coalescing => Si el resultado de .match(...) es null o undefined, en su lugar devuelve []
};

const mapIndice: Map<string, Set<number>> = new Map<string, Set<number>>();
const palabrasIngresadasEnElBuscador: string[] = obtenerPalabras(cadenaIngresadaPorElUsuario);
for (let palabra of palabrasIngresadasEnElBuscador) { 
    let indiceAlerta: number = 0;
    palabra = palabra.toLowerCase();  // IMPORTANTE: estandarizar las key pasandolas a minuscula
    for (const alerta of alertas) {
        const descripcionNormalizada = alerta.descripcion.toLowerCase();    // NORMALIZO campo verificar => si está la palabra, lo indexo.
        if (descripcionNormalizada.includes(palabra)) { // SI el CAMPO CONTIENE palabra ingresada por el USUARIO.
            if (!mapIndice.has(palabra)) {  // Si NO EXISTE la key => la agrego
            mapIndice.set(palabra, new Set<number>());
            }

            mapIndice.get(palabra)!.add(indiceAlerta);  // EXISTE key && palabra está en CAMPO => INDEXO resultado
        }
        indiceAlerta++;
    }
}

console.log(mapIndice);

