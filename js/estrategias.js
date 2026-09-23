/**
 * ==============================================================================
 * PATRÓN DE DISEÑO STRATEGY (Gang of Four - GoF)
 * Asignatura: Arquitectura de Software
 * Unidad 3: Estrategias de Navegación en la Arquitectura de Software
 * 
 * Contexto del Negocio: Módulo de Logística Joyería Nudo de Oro
 * ==============================================================================
 * 
 * PROPÓSITO DEL PATRÓN STRATEGY:
 * Permite definir una familia de algoritmos de enrutamiento, encapsular cada uno
 * en una clase separada y hacerlos intercambiables dinámicamente en tiempo de ejecución.
 * El cliente (la interfaz o el servicio de despacho) puede variar el algoritmo de cálculo
 * (menor kilometraje vs menor tiempo de tráfico) sin modificar el código que lo consume.
 */

// ==============================================================================
// 1. INTERFAZ / CLASE BASE ABSTRACTA: EstrategiaNavegacion
// ==============================================================================
/**
 * Define el contrato común que todas las estrategias concretas de cálculo de rutas
 * deben implementar obligatoriamente.
 */
class EstrategiaNavegacion {
  constructor(nombre, descripcion, metricaPrincipal) {
    if (new.target === EstrategiaNavegacion) {
      throw new TypeError("No se puede instanciar la clase abstracta EstrategiaNavegacion directamente.");
    }
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.metricaPrincipal = metricaPrincipal;
  }

  /**
   * Método abstracto que debe ser sobrescrito por las estrategias concretas.
   * @param {string} origenId - Identificador del nodo origen
   * @param {string} destinoId - Identificador del nodo destino
   * @param {Object} grafo - Estructura del grafo en memoria
   * @returns {Object} Resultado del cálculo de la ruta
   */
  calcularRuta(origenId, destinoId, grafo) {
    throw new Error("El método calcularRuta() debe ser implementado por la estrategia concreta.");
  }

  /**
   * Algoritmo de Dijkstra Genérico.
   * Se coloca como método de soporte protegido/reutilizable en la jerarquía.
   * Utiliza una función de peso ('distanciaKm' o 'tiempoMinutos') según la estrategia.
   * 
   * @param {string} origenId 
   * @param {string} destinoId 
   * @param {Object} grafo 
   * @param {'distanciaKm' | 'tiempoMinutos'} propiedadPeso 
   * @returns {{ rutaIds: string[], distanciaTotalKm: number, tiempoTotalMinutos: number }}
   */
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

    // Inicialización de distancias
    for (const nodoId of noVisitados) {
      distancias[nodoId] = Infinity;
      anteriores[nodoId] = null;
    }
    distancias[origenId] = 0;

    while (noVisitados.size > 0) {
      // Seleccionar el nodo no visitado con la menor métrica acumulada
      let nodoActual = null;
      let menorValor = Infinity;
      for (const nodoId of noVisitados) {
        if (distancias[nodoId] < menorValor) {
          menorValor = distancias[nodoId];
          nodoActual = nodoId;
        }
      }

      // Si no hay camino alcanzable o llegamos al destino
      if (nodoActual === null || menorValor === Infinity) break;
      if (nodoActual === destinoId) break;

      noVisitados.delete(nodoActual);

      // Evaluar vecinos del nodo actual
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

    // Reconstruir el camino desde el destino hacia el origen
    const rutaIds = [];
    let paso = destinoId;
    while (paso !== null) {
      rutaIds.unshift(paso);
      paso = anteriores[paso];
    }

    // Si el primer elemento no es el origen, no existe ruta conectada
    if (rutaIds[0] !== origenId) {
      return {
        rutaIds: [],
        distanciaTotalKm: 0,
        tiempoTotalMinutos: 0
      };
    }

    // Calcular ambas métricas acumuladas de la ruta reconstruida para análisis comparativo
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

// ==============================================================================
// 2. ESTRATEGIA CONCRETA A: EstrategiaRutaMasCorta
// ==============================================================================
/**
 * Implementa la estrategia que prioriza la menor distancia física en kilómetros.
 * Ideal para minimizar el consumo de combustible, kilometraje de la flota blindada
 * o cuando las vías troncales están despejadas.
 */
class EstrategiaRutaMasCorta extends EstrategiaNavegacion {
  constructor() {
    super(
      "Ruta Más Corta (Distancia Física)",
      "Prioriza el menor recorrido en kilómetros usando el algoritmo Dijkstra sobre la distancia física de las vías.",
      "distanciaKm"
    );
  }

  /**
   * Implementación de la interfaz EstrategiaNavegacion.
   * @override
   */
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

// ==============================================================================
// 3. ESTRATEGIA CONCRETA B: EstrategiaRutaMasRapida
// ==============================================================================
/**
 * Implementa la estrategia que prioriza el menor tiempo en minutos.
 * Considera factores de congestión vehicular en hora pico, semaforización
 * y vías de alta velocidad aunque representen una distancia mayor.
 * Vital para entregas urgentes o protocolos de seguridad con exposición mínima.
 */
class EstrategiaRutaMasRapida extends EstrategiaNavegacion {
  constructor() {
    super(
      "Ruta Más Rápida (Tiempo con Tráfico)",
      "Prioriza el menor tiempo de traslado en minutos considerando la congestión y el flujo vehicular urbano.",
      "tiempoMinutos"
    );
  }

  /**
   * Implementación de la interfaz EstrategiaNavegacion.
   * @override
   */
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

// ==============================================================================
// 4. CLASE CONTEXTO: CalculadorRutas
// ==============================================================================
/**
 * Clase Contexto del patrón Strategy.
 * Mantiene una referencia a un objeto EstrategiaNavegacion y delega en él
 * la responsabilidad del cómputo de la ruta.
 * 
 * Permite cambiar la estrategia de cálculo dinámicamente en tiempo de ejecución
 * mediante el método setEstrategia().
 */
class CalculadorRutas {
  /**
   * @param {Object} grafo - El grafo de ubicaciones en memoria
   * @param {EstrategiaNavegacion} [estrategiaInicial] - Estrategia por defecto
   */
  constructor(grafo, estrategiaInicial = null) {
    this._grafo = grafo;
    this._estrategia = estrategiaInicial || new EstrategiaRutaMasCorta();
  }

  /**
   * Permite inyectar o alternar la estrategia de navegación en tiempo de ejecución.
   * (Punto clave del Patrón Strategy).
   * @param {EstrategiaNavegacion} nuevaEstrategia 
   */
  setEstrategia(nuevaEstrategia) {
    if (!(nuevaEstrategia instanceof EstrategiaNavegacion)) {
      throw new TypeError("La nueva estrategia debe ser una instancia de EstrategiaNavegacion.");
    }
    this._estrategia = nuevaEstrategia;
  }

  /**
   * Obtiene la estrategia actualmente activa en el contexto.
   * @returns {EstrategiaNavegacion}
   */
  getEstrategiaActual() {
    return this._estrategia;
  }

  /**
   * Ejecuta el cálculo delegando en la estrategia actualmente configurada
   * y cronometra el rendimiento exacto en milisegundos con performance.now().
   * 
   * @param {string} origenId 
   * @param {string} destinoId 
   * @returns {Object} Informe completo de la ruta con métricas de rendimiento
   */
  ejecutarCalculo(origenId, destinoId) {
    if (!this._estrategia) {
      throw new Error("No hay una estrategia de navegación configurada en el contexto.");
    }

    // Medición de rendimiento de alta precisión requerida por el estándar
    const tInicio = performance.now();

    // DELEGACIÓN POLIMÓRFICA DEL CÁLCULO
    const resultadoCalculo = this._estrategia.calcularRuta(origenId, destinoId, this._grafo);

    const tFin = performance.now();
    const tiempoProcesamientoMs = Number((tFin - tInicio).toFixed(4));

    // Mapeo enriquecido con nombres y metadatos de los nodos recorridos
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
      tiempoProcesamientoMs: tiempoProcesamientoMs, // Medición con performance.now()
      cantidadNodos: resultadoCalculo.rutaIds.length
    };
  }
}

// Exportación universal
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
