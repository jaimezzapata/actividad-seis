# Joyería Nudo de Oro — Módulo de Navegación y Logística
## Documento de Arquitectura de Software: Diagramas UML Oficiales
### Asignatura: Arquitectura de Software • Unidad 3: Estrategias de Navegación

Este documento contiene la especificación formal y gráfica de los **cuatro (4) diagramas UML obligatorios** correspondientes al sistema de optimización de rutas de despacho blindado de **Joyería Nudo de Oro**, implementado bajo el **Patrón de Diseño de Comportamiento Strategy (Gang of Four - GoF)**.

> [!TIP]
> Todos los diagramas han sido testeados para renderizado nativo en **GitHub Markdown** utilizando la sintaxis estándar de **Mermaid.js**.

---

## 📑 Índice de Diagramas
1. [Diagrama de Clases (Patrón Strategy GoF)](#1-diagrama-de-clases-patrón-strategy-gof)
2. [Diagrama de Componentes](#2-diagrama-de-componentes)
3. [Diagrama de Secuencia](#3-diagrama-de-secuencia)
4. [Diagrama de Actividad / Flujo del Recorrido](#4-diagrama-de-actividad--flujo-del-recorrido)
5. [Matriz de Correspondencia Arquitectónica](#5-matriz-de-correspondencia-arquitectónica)

---

## 1. Diagrama de Clases (Patrón Strategy GoF)

### Descripción
El diagrama de clases modela la estructura estática del sistema. Evidencia la aplicación rigurosa del **Patrón Strategy (GoF)**, desacoplando la clase de contexto (`CalculadorRutas`) de los algoritmos concretos mediante la abstracción `EstrategiaNavegacion`. Además, se detallan las estructuras del grafo (`GrafoJoyeria`, `Nodo`, `Arista`) y el objeto de transferencia de datos enriquecido (`ResultadoCalculo`).

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

### Roles del Patrón Strategy
- **Contexto (`CalculadorRutas`):** Mantiene una referencia al objeto `EstrategiaNavegacion`. Permite cambiar la estrategia dinámicamente en tiempo de ejecución con `setEstrategia()` y cronometra el rendimiento con `performance.now()`.
- **Estrategia Abstracta (`EstrategiaNavegacion`):** Define el contrato uniforme `calcularRuta()` y encapsula el algoritmo base Dijkstra parametrizado.
- **Estrategia Concreta 1 (`EstrategiaRutaMasCorta`):** Pondera aristas priorizando la menor distancia física en kilómetros (`distanciaKm`).
- **Estrategia Concreta 2 (`EstrategiaRutaMasRapida`):** Pondera aristas priorizando la menor duración temporal en minutos con congestión (`tiempoMinutos`).

---

## 2. Diagrama de Componentes

### Descripción
El diagrama de componentes ilustra la organización en capas del sistema, sus dependencias y las interfaces con servicios externos de código abierto (OpenStreetMap OSRM y Leaflet CDN).

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

---

## 3. Diagrama de Secuencia

### Descripción
Representa la interacción temporal y el intercambio de mensajes entre los objetos cuando el usuario solicita calcular una ruta individual o comparar ambas estrategias en tiempo real.

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

---

## 4. Diagrama de Actividad / Flujo del Recorrido

### Descripción
Describe el flujo de control y las decisiones de negocio desde que se carga el sistema hasta que se inspecciona la ruta óptima para el transporte de valores.

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

---

## 5. Matriz de Correspondencia Arquitectónica

| Concepto Arquitectónico | Elemento en el Código | Justificación y Función |
| :--- | :--- | :--- |
| **Contexto (Strategy Pattern)** | [`CalculadorRutas`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/estrategias.js#L243) | Alberga la estrategia activa y ejecuta polimórficamente `calcularRuta()`. |
| **Abstracción / Interfaz** | [`EstrategiaNavegacion`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/estrategias.js#L14) | Clase abstracta con el contrato y algoritmo genérico Dijkstra. |
| **Estrategia Concreta A** | [`EstrategiaRutaMasCorta`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/estrategias.js#L162) | Minimiza `distanciaKm` (consumo de combustible y kilometraje de flota). |
| **Estrategia Concreta B** | [`EstrategiaRutaMasRapida`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/estrategias.js#L198) | Minimiza `tiempoMinutos` (exposición al tráfico y seguridad del cargamento). |
| **Grafo Multiciudad** | [`GrafoJoyeria`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/grafo.js) | Topología vial con pesos dobles, nombres de vías, cruces e hitos urbanos. |
| **Visualización Geoespacial** | [`ModuloMapa`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/mapa.js) | Integración con Leaflet.js y OSRM para dibujo de rutas en tiempo real. |
| **Medición de Rendimiento** | `performance.now()` | Auditoría de tiempo de ejecución asintótico en micro/milisegundos. |
