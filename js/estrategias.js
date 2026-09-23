class EstrategiaNavegacion {
  constructor(nombre, descripcion, metricaPrincipal) {
    if (new.target === EstrategiaNavegacion) {
      throw new TypeError("No se puede instanciar la clase abstracta EstrategiaNavegacion directamente.");
    }
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.metricaPrincipal = metricaPrincipal;
  }

  calcularRuta(origenId, destinoId, grafo) {
    throw new Error("El método calcularRuta() debe ser implementado por la estrategia concreta.");
  }

  _ejecutarDijkstra(origenId, destinoId, grafo, propiedadPeso) {
    if (!grafo.nodos[origenId] || !grafo.nodos[destinoId]) {
      throw new Error(`Uno o ambos nodos no existen en el grafo: ${origenId}, ${destinoId}`);
    }

    if (origenId === destinoId) {
      return {
        rutaIds: [origenId],
        distanciaTotalKm: 0,
        tiempoTotalMinutos: 0
      };
    }

    const distancias = {};
    const anteriores = {};
    const noVisitados = new Set(Object.keys(grafo.nodos));

    for (const nodoId of noVisitados) {
      distancias[nodoId] = Infinity;
      anteriores[nodoId] = null;
    }
    distancias[origenId] = 0;

    while (noVisitados.size > 0) {
      let nodoActual = null;
      let menorValor = Infinity;
      for (const nodoId of noVisitados) {
        if (distancias[nodoId] < menorValor) {
          menorValor = distancias[nodoId];
          nodoActual = nodoId;
        }
      }

      if (nodoActual === null || menorValor === Infinity) break;
      if (nodoActual === destinoId) break;

      noVisitados.delete(nodoActual);

      const vecinos = grafo.obtenerVecinos(nodoActual);
      for (const vecino of vecinos) {
        if (!noVisitados.has(vecino.nodoId)) continue;

        const pesoArista = vecino[propiedadPeso];
        const nuevaDistancia = distancias[nodoActual] + pesoArista;

        if (nuevaDistancia < distancias[vecino.nodoId]) {
          distancias[vecino.nodoId] = nuevaDistancia;
          anteriores[vecino.nodoId] = nodoActual;
        }
      }
    }

    const rutaIds = [];
    let paso = destinoId;
    while (paso !== null) {
      rutaIds.unshift(paso);
      paso = anteriores[paso];
    }

    if (rutaIds[0] !== origenId) {
      return {
        rutaIds: [],
        distanciaTotalKm: 0,
        tiempoTotalMinutos: 0
      };
    }

    let distanciaTotalKm = 0;
    let tiempoTotalMinutos = 0;

    for (let i = 0; i < rutaIds.length - 1; i++) {
      const u = rutaIds[i];
      const v = rutaIds[i + 1];
      const arista = grafo.obtenerArista(u, v);
      if (arista) {
        distanciaTotalKm += arista.distanciaKm;
        tiempoTotalMinutos += arista.tiempoMinutos;
      }
    }

    return {
      rutaIds,
      distanciaTotalKm: Number(distanciaTotalKm.toFixed(2)),
      tiempoTotalMinutos: Number(tiempoTotalMinutos.toFixed(1))
    };
  }
}

class EstrategiaRutaMasCorta extends EstrategiaNavegacion {
  constructor() {
    super(
      "Ruta Más Corta (Distancia Física)",
      "Prioriza el menor recorrido en kilómetros usando el algoritmo Dijkstra sobre la distancia física de las vías.",
      "distanciaKm"
    );
  }

  calcularRuta(origenId, destinoId, grafo) {
    const res = this._ejecutarDijkstra(origenId, destinoId, grafo, "distanciaKm");
    return {
      estrategiaAplicada: this.nombre,
      criterio: "Distancia Mínima (Kilómetros)",
      rutaIds: res.rutaIds,
      distanciaKm: res.distanciaTotalKm,
      tiempoMinutos: res.tiempoTotalMinutos
    };
  }
}

class EstrategiaRutaMasRapida extends EstrategiaNavegacion {
  constructor() {
    super(
      "Ruta Más Rápida (Tiempo con Tráfico)",
      "Prioriza el menor tiempo de traslado en minutos considerando la congestión y el flujo vehicular urbano.",
      "tiempoMinutos"
    );
  }

  calcularRuta(origenId, destinoId, grafo) {
    const res = this._ejecutarDijkstra(origenId, destinoId, grafo, "tiempoMinutos");
    return {
      estrategiaAplicada: this.nombre,
      criterio: "Tiempo Mínimo (Minutos con Tráfico)",
      rutaIds: res.rutaIds,
      distanciaKm: res.distanciaTotalKm,
      tiempoMinutos: res.tiempoTotalMinutos
    };
  }
}

class CalculadorRutas {
  constructor(grafo, estrategiaInicial = null) {
    this._grafo = grafo;
    this._estrategia = estrategiaInicial || new EstrategiaRutaMasCorta();
  }

  setEstrategia(nuevaEstrategia) {
    if (!(nuevaEstrategia instanceof EstrategiaNavegacion)) {
      throw new TypeError("La nueva estrategia debe ser una instancia de EstrategiaNavegacion.");
    }
    this._estrategia = nuevaEstrategia;
  }

  getEstrategiaActual() {
    return this._estrategia;
  }

  ejecutarCalculo(origenId, destinoId) {
    if (!this._estrategia) {
      throw new Error("No hay una estrategia de navegación configurada en el contexto.");
    }

    const tInicio = performance.now();
    const resultadoCalculo = this._estrategia.calcularRuta(origenId, destinoId, this._grafo);
    const tFin = performance.now();
    const tiempoProcesamientoMs = Number((tFin - tInicio).toFixed(4));

    const nombresNodos = resultadoCalculo.rutaIds.map(id => {
      const nodo = this._grafo.nodos[id];
      return nodo ? nodo.nombre : id;
    });

    const coordenadasRuta = resultadoCalculo.rutaIds.map(id => {
      const nodo = this._grafo.nodos[id];
      return [nodo.lat, nodo.lng];
    });

    return {
      estrategia: this._estrategia.nombre,
      descripcionEstrategia: this._estrategia.descripcion,
      origenId,
      destinoId,
      origenNombre: this._grafo.nodos[origenId]?.nombre || origenId,
      destinoNombre: this._grafo.nodos[destinoId]?.nombre || destinoId,
      rutaIds: resultadoCalculo.rutaIds,
      nodosRecorridos: nombresNodos,
      coordenadasRuta,
      distanciaTotalKm: resultadoCalculo.distanciaKm,
      tiempoTotalMinutos: resultadoCalculo.tiempoMinutos,
      tiempoProcesamientoMs: tiempoProcesamientoMs,
      cantidadNodos: resultadoCalculo.rutaIds.length
    };
  }
}

if (typeof window !== "undefined") {
  window.EstrategiaNavegacion = EstrategiaNavegacion;
  window.EstrategiaRutaMasCorta = EstrategiaRutaMasCorta;
  window.EstrategiaRutaMasRapida = EstrategiaRutaMasRapida;
  window.CalculadorRutas = CalculadorRutas;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    EstrategiaNavegacion,
    EstrategiaRutaMasCorta,
    EstrategiaRutaMasRapida,
    CalculadorRutas
  };
}
