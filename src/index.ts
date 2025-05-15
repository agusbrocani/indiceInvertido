const obtenerPalabras = (cadena: string): string[] => {
    return cadena.match(/\b[\wáéíóúÁÉÍÓÚñÑüÜ]+(?:\.\d+)?\b/g) ?? [];
};

const normalizar = (cadena: string): string => {
    return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

function agregarIndiceInvertido(indiceInvertido: Map<string, Set<number>>, clave: string, valor: number): void {
    if (!indiceInvertido.has(clave)) {
        indiceInvertido.set(clave, new Set<number>());
    }
    indiceInvertido.get(clave)!.add(valor);
}

function verificarExistenciaDeClaveEnContenido(contenido: string, clave: string): boolean {
    return normalizar(contenido).includes(normalizar(clave));
}

function construirIndiceInvertido<T extends object>(coleccion: T[], cadenaIngresadaEnBuscador: string): Map<string, Set<number>> {
    const palabrasIngresadasEnElBuscador: string[] = obtenerPalabras(cadenaIngresadaEnBuscador);
    const indiceInvertido: Map<string, Set<number>> = new Map<string, Set<number>>();

    for (let palabraIngresadasEnElBuscador of palabrasIngresadasEnElBuscador) {
        let indiceEnColeccion: number = 0;
        for (const registro of coleccion) {
            for (const campo in registro) {
                if (verificarExistenciaDeClaveEnContenido(String(registro[campo]), palabraIngresadasEnElBuscador)) {
                    agregarIndiceInvertido(indiceInvertido, palabraIngresadasEnElBuscador, indiceEnColeccion);
                }
            }
            indiceEnColeccion++;
        }
    }

    return indiceInvertido;
}

function definirIndicesResultadoConInterseccionTotal(indiceInvertido: Map<string, Set<number>>): Set<number> {
    const sets: Set<number>[] = Array.from(indiceInvertido.values());
    if (0 === sets.length) {
        return new Set();
    }

    const resultado: Set<number> = new Set(sets[0]);
    const cantidadDeSets: number = sets.length;
    for (let i = 1; i < cantidadDeSets; i++) {
        for (const valor of Array.from(resultado)) {
            if (!sets[i].has(valor)) {
                resultado.delete(valor);
            }
        }
    }
    return resultado;
}
export function buscar<T extends object>(coleccion: T[], cadenaABuscar: string): T[] {
    const indicesComunes: Set<number> = definirIndicesResultadoConInterseccionTotal(construirIndiceInvertido(coleccion, cadenaABuscar));
    const resultado: T[] = [];
    for (const indice of Array.from(indicesComunes)) {
        resultado.push(coleccion[indice]);
    }
    return resultado;
}

type Alerta = {
    id: number,
    descripcion: string,
    fechaYHora: Date,
    patente: string
    campoRandom?: {
        id: number,
        descripcion: string,
        campoRandom: {
            id: number,
            descripcion: string
        }
    }
};

const alertas: Alerta[] = [
    { id: 0, descripcion: "Auto rojo detenido", fechaYHora: new Date(), patente: "AB100XX" },
    { id: 1, descripcion: "Camion blanco", fechaYHora: new Date(), patente: "AB100XX" },
    {
        id: 2, descripcion: "", fechaYHora: new Date(), patente: "AB100XX"
        , campoRandom: {
            id: 1,
            descripcion: "des",
            campoRandom: {
                id: 1,
                descripcion: "camión blanco AB100XX"
            }
        }
    },
    {
        id: 3, descripcion: "camión blanco AB100XX", fechaYHora: new Date(), patente: ""
        , campoRandom: {
            id: 1,
            descripcion: "des",
            campoRandom: {
                id: 1,
                descripcion: "camión blanco AB100XX"
            }
        }
    }
];
const cadenaIngresadaEnBuscador: string = "camión blanco AB100XX";

console.log(buscar(alertas, cadenaIngresadaEnBuscador));