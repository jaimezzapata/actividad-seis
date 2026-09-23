# Módulo de Logística y Optimización de Rutas de Despacho
## Joyería Nudo de Oro — Arquitectura de Software (Unidad 3: Estrategias de Navegación)

Este proyecto corresponde a un prototipo funcional para la asignatura de **Arquitectura de Software**, enfocado en resolver el problema de recorrido óptimo en el despacho de joyas de alto valor y recolección de insumos en la ciudad de Bogotá, Colombia.

El núcleo de la solución implementa de manera estricta el **Patrón de Diseño de Comportamiento Strategy (Gang of Four - GoF)** junto con el algoritmo **Dijkstra** y visualización geoespacial interactiva mediante **Leaflet.js** y **OpenStreetMap** (100% libre, sin requerimiento de API Keys).

---

## 🏛️ 1. Arquitectura y Patrón Strategy (GoF)

### Justificación Arquitectónica
En operaciones de logística de alta seguridad para joyería, el concepto de "mejor ruta" varía según las condiciones del entorno:
- **Criterio A (Minimizar Distancia):** Reduce el kilometraje físico y consumo de combustible. Útil en horarios de bajo tráfico o vías despejadas.
- **Criterio B (Minimizar Tiempo / Tráfico):** Reduce los minutos de exposición en las vías públicas ante congestión severa o semaforización lenta, enviando la carga blindada por vías arterias rápidas aunque el trayecto sea físicamente más largo.

El **Patrón Strategy** permite desacoplar la interfaz gráfica y los servicios de despacho de la lógica matemática del cálculo, posibilitando el cambio de algoritmo en caliente (*runtime*) mediante polimorfismo.

### 📐 Diagramas UML de Arquitectura

> [!NOTE]
> La documentación completa con detalles extendidos y matrices de correspondencia se encuentra en [`docs/DIAGRAMAS_UML.md`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/docs/DIAGRAMAS_UML.md).

#### 1. Diagrama de Clases (Patrón Strategy GoF)
```mermaid
classDiagram
    direction TB

    class CalculadorRutas {
        -GrafoJoyeria _grafo
        -EstrategiaNavegacion _estrategia
        +constructor(grafo, estrategiaInicial)
        +setEstrategia(nuevaEstrategia) void
        +getEstrategiaActual() EstrategiaNavegacion
        +ejecutarCalculo(origenId, destinoId) ResultadoCalculo
    }

    class EstrategiaNavegacion {
        <<abstract>>
        +String nombre
        +String descripcion
        +String metricaPrincipal
        +constructor(nombre, descripcion, metricaPrincipal)
        +calcularRuta(origenId, destinoId, grafo)* ResultadoCalculo
        #_ejecutarDijkstra(origenId, destinoId, grafo, metricaPeso) Object
    }

    class EstrategiaRutaMasCorta {
        +constructor()
        +calcularRuta(origenId, destinoId, grafo) ResultadoCalculo
    }

    class EstrategiaRutaMasRapida {
        +constructor()
        +calcularRuta(origenId, destinoId, grafo) ResultadoCalculo
    }

    class GrafoJoyeria {
        +String ciudadActivaId
        +Object ciudades
        +nodos: Object
        +conexiones: Array
        +setCiudadActiva(ciudadId) Object
        +getCiudadActiva() Object
        +obtenerArista(origenId, destinoId) Arista
        +validarExistenciaNodo(nodoId) Boolean
    }

    class Nodo {
        +String id
        +String nombre
        +String tipo
        +String categoria
        +Number lat
        +Number lng
        +String descripcion
    }

    class Arista {
        +String origen
        +String destino
        +Number distanciaKm
        +Number tiempoMinutos
        +String via
        +String cruce
        +String hitos
    }

    class ResultadoCalculo {
        +String estrategia
        +String descripcionEstrategia
        +String origenId
        +String destinoId
        +String origenNombre
        +String destinoNombre
        +Array rutaIds
        +Array nodosRecorridos
        +Array coordenadasRuta
        +Number distanciaTotalKm
        +Number tiempoTotalMinutos
        +Number tiempoProcesamientoMs
        +Number cantidadNodos
    }

    CalculadorRutas o-- EstrategiaNavegacion : _estrategia
    CalculadorRutas --> GrafoJoyeria : _grafo
    CalculadorRutas ..> ResultadoCalculo : produce
    EstrategiaNavegacion <|-- EstrategiaRutaMasCorta : hereda
    EstrategiaNavegacion <|-- EstrategiaRutaMasRapida : hereda
    GrafoJoyeria *-- Nodo : contiene
    GrafoJoyeria *-- Arista : contiene
    EstrategiaNavegacion ..> Arista : evalua pesos
```

#### 2. Diagrama de Componentes
```mermaid
flowchart TD
    subgraph CapaPresentacion ["Capa de Presentación (UI & Visualización)"]
        UI["index.html (Dashboard & Viewport)"]
        CSS["styles.css (Tokens de Diseño & Modales)"]
        MapaLeaflet["js/mapa.js (ModuloMapa: Leaflet Engine)"]
    end

    subgraph CapaControlador ["Capa de Control & Orquestación"]
        AppController["js/app.js (Eventos, Modales & Comparador)"]
    end

    subgraph CapaDominio ["Capa de Lógica de Negocio & Algoritmos (GoF)"]
        Contexto["CalculadorRutas (Contexto de Navegación)"]
        EstrategiaBase["[Interface] EstrategiaNavegacion"]
        EstratCorta["EstrategiaRutaMasCorta (Peso: distanciaKm)"]
        EstratRapida["EstrategiaRutaMasRapida (Peso: tiempoMinutos)"]
    end

    subgraph CapaDatos ["Capa de Datos Geoespaciales"]
        GrafoModel["js/grafo.js (GrafoJoyeria)"]
        RedNodos["Subgrafos Multiciudad (Bogotá, Medellín, Bucaramanga)"]
    end

    subgraph ServiciosExternos ["Servicios Externos & CDN (100% Libres de API Keys)"]
        OSRM["OSRM Public Routing API (router.project-osrm.org)"]
        LeafletCDN["Leaflet.js v1.9.4 CDN (Cartografía OpenStreetMap)"]
        LucideCDN["Lucide Icons v0.344.0 (Iconografía SVG limpia)"]
        GoogleFonts["Google Fonts (Cormorant Garamond & Manrope)"]
    end

    UI --> AppController
    CSS -.-> UI
    AppController --> Contexto
    AppController --> MapaLeaflet
    Contexto --> EstrategiaBase
    EstratCorta -.->|implementa| EstrategiaBase
    EstratRapida -.->|implementa| EstrategiaBase
    EstratCorta --> GrafoModel
    EstratRapida --> GrafoModel
    GrafoModel --> RedNodos
    MapaLeaflet --> LeafletCDN
    MapaLeaflet --> OSRM
    UI --> LucideCDN
    UI --> GoogleFonts
```

#### 3. Diagrama de Secuencia
```mermaid
sequenceDiagram
    autonumber
    actor Operador as Operador Logístico
    participant UI as Vista UI (index.html)
    participant App as Controlador (app.js)
    participant Contexto as CalculadorRutas
    participant Estrategia as Estrategia (Corta / Rápida)
    participant Grafo as GrafoJoyeria
    participant Mapa as ModuloMapa (mapa.js)
    participant OSRM as OpenStreetMap OSRM API

    Operador ->> UI: 1. Selecciona Ciudad, Sede Origen y Sede Destino
    UI ->> App: Evento 'change' (actualiza listas con exclusión mutua)

    alt Caso A: Cálculo de Ruta Individual ("Calcular Ruta Óptima")
        Operador ->> UI: 2a. Clic en "Calcular Ruta Óptima"
        UI ->> App: Evento click ('btn-calcular')
        App ->> Contexto: setEstrategia(estrategiaSeleccionada)
        App ->> Contexto: ejecutarCalculo(origenId, destinoId)
        activate Contexto
        Note over Contexto: Inicia cronómetro de precisión (performance.now())
        Contexto ->> Estrategia: calcularRuta(origenId, destinoId, Grafo)
        activate Estrategia
        Estrategia ->> Grafo: Consulta nodos y aristas activas
        Grafo -->> Estrategia: Retorna adyacencias con distanciaKm y tiempoMinutos
        Note over Estrategia: Ejecuta algoritmo Dijkstra y reconstruye ruta
        Estrategia -->> Contexto: Retorna rutaIds, distanciaTotal y tiempoTotal
        deactivate Estrategia
        Note over Contexto: Finaliza cronómetro (tiempoProcesamientoMs)
        Contexto -->> App: Retorna ResultadoCalculo estructurado
        deactivate Contexto

        App ->> UI: Renderiza lista de Puntos de Control (Itinerario)
        App ->> Mapa: trazarRuta(resultado)
        activate Mapa
        Mapa ->> UI: Dibuja trazo vectorial preliminar entre nodos
        Mapa ->> OSRM: GET /route/v1/driving (coordenadas)
        OSRM -->> Mapa: Retorna GeoJSON con geometría vial real
        Mapa ->> UI: Renderiza polilínea vial real y vincula tooltip interactivo
        deactivate Mapa

    else Caso B: Comparativa Real ("Comparar Ambas Estrategias")
        Operador ->> UI: 2b. Clic en "Comparar Ambas Estrategias"
        UI ->> App: Evento click ('btn-comparar')
        App ->> Contexto: setEstrategia(EstrategiaRutaMasCorta)
        App ->> Contexto: ejecutarCalculo(origenId, destinoId)
        Contexto -->> App: resCorta
        App ->> Contexto: setEstrategia(EstrategiaRutaMasRapida)
        App ->> Contexto: ejecutarCalculo(origenId, destinoId)
        Contexto -->> App: resRapida
        Note over App: Evalúa igualdad de rutaIds

        alt Ambas estrategias son la misma ruta
            App ->> UI: Configura alerta de "Coincidencia Total"
            App ->> Mapa: trazarComparativa(resCorta, resRapida) con trazo unificado
        else Son rutas diferentes
            App ->> UI: Configura cuadrícula lado a lado y Análisis de Trade-Off
            App ->> Mapa: trazarComparativa(resCorta, resRapida) con doble trazo (Dorado vs Azul)
        end

        App ->> UI: Muestra Banner Flotante en Mapa y Abre Modal Comparativo
        Operador ->> UI: Clic en polyline del mapa o botón de informe
        UI ->> App: abrirModalInformeRuta() / abrirModalComparativa()
        App ->> UI: Despliega modal con justificación, vías, cruces y métricas
    end
```

#### 4. Diagrama de Actividad / Flujo del Recorrido
```mermaid
flowchart TD
    Inicio([Inicio: Carga de Aplicación]) --> CargarTema[Cargar tema claro / oscuro de localStorage]
    CargarTema --> InitMapa[Inicializar mapa Leaflet y capas base OSM]
    InitMapa --> CargarCiudad[Activar red vial de ciudad por defecto: Bogotá D.C.]
    CargarCiudad --> PoblarSelectores[Llenar origen y destino con exclusión mutua]
    PoblarSelectores --> TrazarDefecto[Trazado inicial de demostración]

    TrazarDefecto --> EsperaAccion{¿Qué acción realiza el Operador?}

    EsperaAccion -->|Cambiar Ciudad| CambiarCiudad[ModuloMapa.cambiarCiudad<br/>Centrar mapa y actualizar nodos]
    CambiarCiudad --> PoblarSelectores

    EsperaAccion -->|Invertir Sedes| Invertir[Intercambiar Origen y Destino]
    Invertir --> EjecutarNav[Ejecutar Navegación]

    EsperaAccion -->|Clic en Calcular Ruta| EjecutarNav
    EsperaAccion -->|Clic en Comparar| IniciarComparativa[Iniciar Comparativa GoF]

    subgraph FlujoCalculo ["Flujo de Cálculo de Ruta Individual"]
        EjecutarNav --> SetEstrategia[Inyectar estrategia activa en CalculadorRutas]
        SetEstrategia --> MedirT0[Iniciar cronómetro: performance.now]
        MedirT0 --> Dijkstra[Ejecutar algoritmo Dijkstra según métrica: Km o Min]
        Dijkstra --> MedirT1[Finalizar cronómetro: tiempoProcesamientoMs]
        MedirT1 --> RenderItinerario[Renderizar lista de puntos de control en lateral]
        RenderItinerario --> RenderLineaMapa[Dibujar polilínea preliminar en Leaflet]
        RenderLineaMapa --> FetchOSRM[Consultar OSRM API: router.project-osrm.org]
        FetchOSRM --> PintarReal[Pintar trazado real sobre calles y curvas]
    end

    subgraph FlujoComparativa ["Flujo de Comparativa entre Estrategias"]
        IniciarComparativa --> CalcDist[Dijkstra ponderado por distanciaKm: Ruta Corta]
        CalcDist --> CalcTiempo[Dijkstra ponderado por tiempoMinutos: Ruta Rápida]
        CalcTiempo --> CompararTrayectorias{¿Rutas Idénticas?<br/>resCorta.rutaIds == resRapida.rutaIds}

        CompararTrayectorias -->|SÍ: Misma Ruta| CasoMismaRuta[Activar Estado Coincidencia Total<br/>Trazar polilínea unificada dorada]
        CompararTrayectorias -->|NO: Diferentes| CasoRutasDif[Activar Comparativa Lado a Lado<br/>Trazar ambas rutas: Dorado sólida vs Azul segmentada]
        CasoRutasDif --> ComputarTradeOff[Calcular Trade-Off: Delta Km vs Ahorro Minutos]

        CasoMismaRuta --> AbrirModalComp[Desplegar Modal de Comparativa de Estrategias]
        ComputarTradeOff --> AbrirModalComp
    end

    PintarReal --> Auditoria[Inspección Interactiva de Ruta]
    AbrirModalComp --> Auditoria

    subgraph Inspeccion ["Inspección y Auditoría Técnica"]
        Auditoria --> ClicRuta{¿Clic sobre la ruta en el mapa?}
        ClicRuta -->|Sí| AbrirModalInforme[Desplegar Modal Técnico de Informe de Ruta]
        AbrirModalInforme --> VerDetalle[Consultar Justificación GoF, Calles, Cruces, Hitos y Métricas]
        VerDetalle --> Fin([Fin del Ciclo Logístico])
        ClicRuta -->|No| Fin
    end
```


### Componentes de la Arquitectura
1. **Interfaz / Clase Base Abstracta (`EstrategiaNavegacion`):**
   - Declara la firma del método `calcularRuta(origenId, destinoId, grafo)`.
   - Provee la implementación genérica de Dijkstra que puede parametrizarse según la métrica (`distanciaKm` o `tiempoMinutos`).
2. **Estrategia Concreta A (`EstrategiaRutaMasCorta`):**
   - Sobrescribe `calcularRuta()`, instruyendo al algoritmo Dijkstra a ponderar los arcos por menor distancia física.
3. **Estrategia Concreta B (`EstrategiaRutaMasRapida`):**
   - Sobrescribe `calcularRuta()`, instruyendo al algoritmo a ponderar los arcos por menor tiempo en minutos (considerando congestión urbana).
4. **Contexto (`CalculadorRutas`):**
   - Mantiene una referencia a la estrategia activa.
   - Provee el método `setEstrategia()` para alternar el algoritmo en tiempo de ejecución.
   - En `ejecutarCalculo()`, delega la ejecución al objeto estrategia y cronometra el rendimiento con `performance.now()`.


---

## 🗺️ 2. Estructura de Datos (Grafo Multiciudad Nacional)

El sistema ahora soporta cobertura logística en **tres ciudades clave** de Colombia mediante un grafo geoespacial estructurado en [`js/grafo.js`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/grafo.js):

### 1. Bogotá D.C. (Red Expandida - 18 Nodos)
- **Talleres y Proveedores:** Taller Central Candelaria, Proveedor Centro Oro, Proveedor Gemas del Eje, Sucursal Galerías, Sucursal Gran Estación.
- **Clientes y Boutiques:** Cliente VIP Chapinero, Rosales Alto, Parque 93, Santa Ana Exclusive, Boutique Usaquén, Unicentro Norte, Cedritos Boutique, Colina Campestre, Plaza Suba, Salitre Plaza, Modelia Occidental, Kennedy Central, Santa Bárbara.

### 2. Medellín (Valle de Aburrá y Oriente - 8 Nodos)
- **Talleres y Proveedores:** Taller Nudo de Oro El Poblado (Milla de Oro), Proveedor Junín Joyero (Centro), Sucursal Parque Laureles.
- **Clientes y Boutiques:** El Tesoro Parque Comercial, Envigado Jardines, Sabaneta Parque, Belén Rosales, Finca Llanogrande (Rionegro).

### 3. Bucaramanga (Área Metropolitana y Meseta - 8 Nodos)
- **Talleres y Proveedores:** Taller Nudo de Oro Cabecera (Cra 33), Proveedor Joyero Calle 35, Sucursal Cañaveral Mall (Floridablanca).
- **Clientes y Boutiques:** Sotomayor Exclusivo, San Francisco, Provenza Real, Girón Monumental, Ruitoque Country Club.

Cada arista entre dos nodos incluye dos pesos calibrados para modelar la realidad del tráfico urbano:
- `distanciaKm`: Longitud en kilómetros.
- `tiempoMinutos`: Tiempo estimado de traslado considerando congestión, semaforización y corredores de seguridad.

### Caso de Estudio Clave: Taller Central &rarr; Cliente Usaquén
- **Ruta Más Corta (Distancia):**
  - Recorrido: *Taller Central &rarr; Proveedor Centro &rarr; Chapinero &rarr; Parque 93 &rarr; Usaquén*
  - Distancia: **15.1 km** (más corta)
  - Tiempo: **78 min** (más lenta debido al tráfico del Centro y Cra 7ma)
- **Ruta Más Rápida (Tiempo con Tráfico):**
  - Recorrido: *Taller Central &rarr; Salitre Plaza &rarr; Santa Bárbara &rarr; Usaquén*
  - Distancia: **19.7 km** (más larga)
  - Tiempo: **46 min** (¡ahorra 32 minutos utilizando corredores rápidos!)

---

## ⚡ 3. Medición de Rendimiento con `performance.now()`

El método `ejecutarCalculo` en `CalculadorRutas` mide el tiempo exacto en milisegundos que le toma a la CPU resolver el grafo y reconstruir el camino:
```javascript
const tInicio = performance.now();
const resultadoCalculo = this._estrategia.calcularRuta(origenId, destinoId, this._grafo);
const tFin = performance.now();
const tiempoProcesamientoMs = Number((tFin - tInicio).toFixed(4));
```
La latencia obtenida se sitúa típicamente entre **0.05 ms** y **0.45 ms**, garantizando un rendimiento en tiempo real idóneo para sistemas de despacho.

---

## 🚀 4. Modo de Uso y Ejecución

El proyecto está diseñado para ser **100% autocontenido y listo para usar**.

### Opción 1: Ejecución Directa (Doble Clic)
1. Navega a la carpeta del proyecto: `actividad-seis`.
2. Haz doble clic en el archivo `index.html`.
3. Se abrirá de inmediato en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari) sin requerir instalación de servidores, Node.js ni tokens.

### Opción 2: Ejecución de las Pruebas Unitarias (Node.js)
Para verificar la lógica algorítmica y el cumplimiento del patrón en consola:
```bash
node test/test_estrategias.js
```
Salida esperada:
```
✅ [PASS] EstrategiaNavegacion no se puede instanciar directamente (Clase Base Abstracta).
✅ [PASS] EstrategiaRutaMasCorta es subclase de EstrategiaNavegacion.
✅ [PASS] EstrategiaRutaMasRapida es subclase de EstrategiaNavegacion.
✅ [PASS] CalculadorRutas inicializa con la estrategia inyectada.
✅ [PASS] setEstrategia() actualiza dinámicamente la estrategia activa.
✅ [PASS] EstrategiaRutaMasCorta produce una distancia menor o igual en km.
✅ [PASS] EstrategiaRutaMasRapida produce un tiempo menor o igual en minutos.
✅ [PASS] El tiempo de procesamiento medido con performance.now() es un número válido.
```

---

## 📂 5. Estructura del Proyecto

```
actividad-seis/
│
├── index.html              # Interfaz web principal, Dashboard y contenedor Leaflet.js
├── README.md               # Documentación académica de arquitectura y guía de uso
├── css/
│   └── styles.css          # Sistema de diseño de lujo (Glassmorphism, Luxury Gold & Midnight Slate)
├── js/
│   ├── grafo.js            # Grafo en memoria con 8 nodos reales de Bogotá y aristas con doble métrica
│   ├── estrategias.js      # Implementación del Patrón Strategy (GoF), Dijkstra y CalculadorRutas
│   ├── mapa.js             # Módulo Leaflet.js (OpenStreetMap, marcadores custom, red y polylines)
│   └── app.js              # Controlador principal de la UI, eventos y comparador de estrategias
└── test/
    └── test_estrategias.js # Suite de pruebas automatizadas en consola
```

---

## 🎓 6. Créditos y Asignatura
- **Asignatura:** Arquitectura de Software
- **Unidad:** Unidad 3 - Estrategias de Navegación en la Arquitectura de Software
- **Caso de Aplicación:** Joyería Nudo de Oro — Despacho y Recolección Segura de Joyas
- **Patrón:** Strategy (Patrones de Diseño Gang of Four)
- **Tecnologías:** JavaScript ES6+, Leaflet.js, OpenStreetMap, HTML5 semántico, CSS3 Flexbox/Grid.
