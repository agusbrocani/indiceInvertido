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

function verificarExistencia(campo: unknown, clave: string): boolean {
    if (campo === null || campo === undefined) return false;

    if (typeof campo === 'string' || typeof campo === 'number' || typeof campo === 'boolean') {
        return verificarExistenciaDeClaveEnContenido(String(campo), clave);
    }

    if (Array.isArray(campo)) {
        for (const item of campo) {
            if (verificarExistencia(item, clave)) return true;
        }
        return false;
    }

    if (typeof campo === 'object') {
        for (const valor of Object.values(campo)) {
            if (verificarExistencia(valor, clave)) return true;
        }
        return false;
    }

    return false;
}

function agregarIndiceAMapaSiPalabraExisteEnRegistro<T extends object>(indiceInvertido: Map<string, Set<number>> , registro: T, palabraIngresadasEnElBuscador: string, indiceEnColeccion: number) {
    for (const campo in registro) {
        const valor: unknown = registro[campo];
        if ('object'=== typeof valor && null !== valor) {
            agregarIndiceAMapaSiPalabraExisteEnRegistro(indiceInvertido, valor, palabraIngresadasEnElBuscador, indiceEnColeccion);
        } else {
            if (verificarExistencia(registro[campo], palabraIngresadasEnElBuscador)) {
                agregarIndiceInvertido(indiceInvertido, palabraIngresadasEnElBuscador, indiceEnColeccion);
                return;
            }
        }
    }
}

function construirIndiceInvertido<T extends object>(coleccion: T[], cadenaIngresadaEnBuscador: string): Map<string, Set<number>> {
    const palabrasIngresadasEnElBuscador: string[] = obtenerPalabras(cadenaIngresadaEnBuscador);
    const indiceInvertido: Map<string, Set<number>> = new Map<string, Set<number>>();

    for (let palabraIngresadasEnElBuscador of palabrasIngresadasEnElBuscador) {
        let indiceEnColeccion: number = 0;
        for (const registro of coleccion) {
            agregarIndiceAMapaSiPalabraExisteEnRegistro(indiceInvertido, registro, palabraIngresadasEnElBuscador, indiceEnColeccion);
            indiceEnColeccion++;
        }
    }

    return indiceInvertido;
}

function definirIndicesResultadoConInterseccionTotal(indiceInvertido: Map<string, Set<number>>): Set<number> {
    const sets: Set<number>[] = Array.from(indiceInvertido.values());
    const cantidadDeSets: number = sets.length;
    if (0 === cantidadDeSets) {
        return new Set();
    }

    const resultado: Set<number> = new Set(sets[0]);
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
                descripcion: "camión blanco AB100XX NARANJA"
            }
        }
    },
    {
        id: 3, descripcion: "camión", fechaYHora: new Date(), patente: ""
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
const cadenaIngresadaEnBuscador: string = "camión blanco AB100XX NARANJA";

// buscar(alertas, cadenaIngresadaEnBuscador)
console.log(buscar(alertas, cadenaIngresadaEnBuscador));