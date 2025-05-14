type Alerta = {
    id: number,
    descripcion: string,
    fechaYHora: Date,
    patente: string
};

const obtenerPalabras = (cadena: string): string[] => {
    return cadena.match(/\b[\wáéíóúÁÉÍÓÚñÑüÜ]+(?:\.\d+)?\b/g) ?? [];
};

const normalizar = (cadena: string) => {
    return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const alertas: Alerta[] = [
    { id: 0, descripcion: "Auto rojo detenido", fechaYHora: new Date(), patente: "AB100XX"},
    { id: 1, descripcion: "Camion blanco", fechaYHora: new Date(), patente: "AB100XX"},
    { id: 2, descripcion: "Patente AB100XX involucrada detenido en arbol camión blanco", fechaYHora: new Date(), patente: "AB100XX" }
];
const cadenaIngresadaEnBuscador: string = "camión blanco AB100XX";

function construirIndiceInvertido<T extends Record<string, unknown>>(coleccion: T[], cadenaIngresadaEnBuscador: string): Map<string, Set<number>> {
    const palabrasIngresadasEnElBuscador: string[] = obtenerPalabras(cadenaIngresadaEnBuscador);
    const indiceInvertido: Map<string, Set<number>> = new Map<string, Set<number>>();

    for (let palabraIngresadasEnElBuscador of palabrasIngresadasEnElBuscador) {
        palabraIngresadasEnElBuscador = normalizar(palabraIngresadasEnElBuscador);
        let indiceEnColeccion: number = 0;
        for (const registro of coleccion) {
            for (const campo in registro) {
                const valor: string = normalizar(String(registro[campo]));

                if (valor.includes(palabraIngresadasEnElBuscador)) {
                    if (!indiceInvertido.has(palabraIngresadasEnElBuscador)) {
                        indiceInvertido.set(palabraIngresadasEnElBuscador, new Set<number>());
                    }
                    indiceInvertido.get(palabraIngresadasEnElBuscador)!.add(indiceEnColeccion);
                }
            }
            indiceEnColeccion++;
        }
    }

    return indiceInvertido;
}

function definirIndicesResultadoConInterseccionTotal(mapIndice: Map<string, Set<number>>): Set<number> {
    const sets: Set<number>[] = [...mapIndice.values()];
    if (0 === sets.length) {
        return new Set();
    }

    const resultado: Set<number> = new Set(sets[0]);
    const cantidadDeSets: number = sets.length;
    for (let i = 1; i < cantidadDeSets; i++) {
        for (const valor of [...resultado]) {
            if (!sets[i].has(valor)) {
                resultado.delete(valor);
            }
        }
    }
    return resultado;
}
const indicesComunes: Set<number> = definirIndicesResultadoConInterseccionTotal(construirIndiceInvertido(alertas, cadenaIngresadaEnBuscador));

console.log("RESULTADOS DE LA BUSQUEDA:");
for (const indice of indicesComunes) {
    console.log(alertas[indice]);
}
