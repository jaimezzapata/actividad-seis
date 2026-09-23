const GrafoJoyeria = require('../js/grafo.js');
const {
  EstrategiaNavegacion,
  EstrategiaRutaMasCorta,
  EstrategiaRutaMasRapida,
  CalculadorRutas
} = require('../js/estrategias.js');

console.log("===============================================================");
console.log("INICIANDO PRUEBAS DEL PATRÓN STRATEGY Y ALGORITMOS DIJKSTRA");
console.log("===============================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

try {
  new EstrategiaNavegacion("Test", "Desc", "distanciaKm");
  assert(false, "EstrategiaNavegacion debería ser abstracta y arrojar error al instanciarse directamente.");
} catch (e) {
  assert(true, "EstrategiaNavegacion no se puede instanciar directamente (Clase Base Abstracta).");
}

const stratCorta = new EstrategiaRutaMasCorta();
const stratRapida = new EstrategiaRutaMasRapida();
assert(stratCorta instanceof EstrategiaNavegacion, "EstrategiaRutaMasCorta es subclase de EstrategiaNavegacion.");
assert(stratRapida instanceof EstrategiaNavegacion, "EstrategiaRutaMasRapida es subclase de EstrategiaNavegacion.");

const calculador = new CalculadorRutas(GrafoJoyeria, stratCorta);
assert(calculador.getEstrategiaActual() === stratCorta, "CalculadorRutas inicializa con la estrategia inyectada.");

calculador.setEstrategia(stratRapida);
assert(calculador.getEstrategiaActual() === stratRapida, "setEstrategia() actualiza dinámicamente la estrategia activa.");

calculador.setEstrategia(stratCorta);
const resCorta = calculador.ejecutarCalculo("TALLER_CENTRAL", "CLI_USAQUEN");

calculador.setEstrategia(stratRapida);
const resRapida = calculador.ejecutarCalculo("TALLER_CENTRAL", "CLI_USAQUEN");

console.log("\n--- RESULTADOS COMPARATIVOS: Taller Central -> Cliente Usaquén ---");
console.log(`[Ruta Más Corta]:  Distancia = ${resCorta.distanciaTotalKm} km | Tiempo = ${resCorta.tiempoTotalMinutos} min | Latencia = ${resCorta.tiempoProcesamientoMs} ms`);
console.log(`                   Ruta: ${resCorta.nodosRecorridos.join(" -> ")}`);
console.log(`[Ruta Más Rápida]: Distancia = ${resRapida.distanciaTotalKm} km | Tiempo = ${resRapida.tiempoTotalMinutos} min | Latencia = ${resRapida.tiempoProcesamientoMs} ms`);
console.log(`                   Ruta: ${resRapida.nodosRecorridos.join(" -> ")}\n`);

assert(resCorta.distanciaTotalKm <= resRapida.distanciaTotalKm, "EstrategiaRutaMasCorta produce una distancia menor o igual en km.");
assert(resRapida.tiempoTotalMinutos <= resCorta.tiempoTotalMinutos, "EstrategiaRutaMasRapida produce un tiempo menor o igual en minutos.");
assert(typeof resCorta.tiempoProcesamientoMs === "number" && resCorta.tiempoProcesamientoMs >= 0, "El tiempo de procesamiento medido con performance.now() es un número válido.");
assert(resCorta.nodosRecorridos.length >= 2, "La lista de nodos recorridos contiene al menos origen y destino.");

const resMismoNodo = calculador.ejecutarCalculo("TALLER_CENTRAL", "TALLER_CENTRAL");
assert(resMismoNodo.distanciaTotalKm === 0 && resMismoNodo.tiempoTotalMinutos === 0, "Ruta entre el mismo nodo tiene costo 0.");

GrafoJoyeria.setCiudadActiva("MEDELLIN");
const resMedellin = calculador.ejecutarCalculo("MED_TALLER", "MED_CLI_LLANOGRANDE");
assert(resMedellin.distanciaTotalKm > 0 && resMedellin.tiempoTotalMinutos > 0, "Cálculo exitoso en red de Medellín (El Poblado -> Llanogrande).");

GrafoJoyeria.setCiudadActiva("BUCARAMANGA");
const resBucaramanga = calculador.ejecutarCalculo("BUC_TALLER", "BUC_CLI_RUITOQUE");
assert(resBucaramanga.distanciaTotalKm > 0 && resBucaramanga.tiempoTotalMinutos > 0, "Cálculo exitoso en red de Bucaramanga (Cabecera -> Ruitoque).");

GrafoJoyeria.setCiudadActiva("BOGOTA");

console.log(`\n===============================================================`);
console.log(`RESULTADOS: ${passedTests}/${totalTests} pruebas superadas exitosamente.`);
console.log(`===============================================================\n`);
