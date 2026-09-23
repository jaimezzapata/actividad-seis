# Joyería Nudo de Oro — Módulo de Navegación y Logística
## Documento de Arquitectura de Software: Diagramas UML Oficiales
### Asignatura: Arquitectura de Software • Unidad 3: Estrategias de Navegación

Este documento contiene la especificación formal y gráfica de los **cuatro (4) diagramas UML obligatorios** correspondientes al sistema de optimización de rutas de despacho blindado de **Joyería Nudo de Oro**, implementado bajo el **Patrón de Diseño de Comportamiento Strategy (Gang of Four - GoF)**.

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
        +constructor(grafo: GrafoJoyeria, estrategiaInicial: EstrategiaNavegacion)
        +setEstrategia(nuevaEstrategia: EstrategiaNavegacion) void
        +getEstrategiaActual() EstrategiaNavegacion
        +ejecutarCalculo(origenId: String, destinoId: String) ResultadoCalculo
    }

    class EstrategiaNavegacion {
        <<abstract>>
        +String nombre
        +String descripcion
        +String metricaPrincipal
        +constructor(nombre: String, descripcion: String, metricaPrincipal: String)
        +calcularRuta(origenId: String, destinoId: String, grafo: GrafoJoyeria)* ResultadoRuta
        #_ejecutarDijkstra(origenId: String, destinoId: String, grafo: GrafoJoyeria, metricaPeso: String) Object
    }

    class EstrategiaRutaMasCorta {
        +constructor()
        +calcularRuta(origenId: String, destinoId: String, grafo: GrafoJoyeria) ResultadoRuta
    }

    class EstrategiaRutaMasRapida {
        +constructor()
        +calcularRuta(origenId: String, destinoId: String, grafo: GrafoJoyeria) ResultadoRuta
    }

    class GrafoJoyeria {
        +String ciudadActivaId
        +Object ciudades
        +nodos: Map~String, Nodo~
        +conexiones: List~Arista~
        +setCiudadActiva(ciudadId: String) Object
        +getCiudadActiva() Object
        +obtenerArista(origenId: String, destinoId: String) Arista
        +validarExistenciaNodo(nodoId: String) Boolean
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
        +List~String~ rutaIds
        +List~String~ nodosRecorridos
        +List~LatLng~ coordenadasRuta
        +Number distanciaTotalKm
        +Number tiempoTotalMinutos
        +Number tiempoProcesamientoMs
        +Number cantidadNodos
    }

    CalculadorRutas o--> EstrategiaNavegacion : "_estrategia (Composición Polimórfica)"
    CalculadorRutas --> GrafoJoyeria : "_grafo (Consulta de red vial)"
    CalculadorRutas ..> ResultadoCalculo : "produce"
    EstrategiaNavegacion <|-- EstrategiaRutaMasCorta : "Hereda / Implementa"
    EstrategiaNavegacion <|-- EstrategiaRutaMasRapida : "Hereda / Implementa"
    GrafoJoyeria *-- Nodo : "1..* nodos"
    GrafoJoyeria *-- Arista : "1..* aristas"
    EstrategiaNavegacion ..> Arista : "evalúa pesos (distanciaKm / tiempoMinutos)"
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
graph TD
    subgraph CapaPresentacion ["Capa de Presentación (UI & Visualización)"]
        UI["index.html\n(Dashboard & Viewport)"]
        CSS["styles.css\n(Tokens de Diseño & Modales)"]
        MapaLeaflet["js/mapa.js\n(ModuloMapa: Leaflet Engine)"]
    end

    subgraph CapaControlador ["Capa de Control & Orquestación"]
        AppController["js/app.js\n(Eventos, Modales & Comparador)"]
    end

    subgraph CapaDominio ["Capa de Lógica de Negocio & Algoritmos (GoF)"]
        Contexto["CalculadorRutas\n(Contexto de Navegación)"]
        EstrategiaBase["<<interface>>\nEstrategiaNavegacion"]
        EstratCorta["EstrategiaRutaMasCorta\n(Peso: distanciaKm)"]
        EstratRapida["EstrategiaRutaMasRapida\n(Peso: tiempoMinutos)"]
    end

    subgraph CapaDatos ["Capa de Datos Geoespaciales"]
        GrafoModel["js/grafo.js\n(GrafoJoyeria)"]
        RedNodos["Subgrafos Multiciudad\n(Bogotá, Medellín, Bucaramanga)"]
    end

    subgraph ServiciosExternos ["Servicios Externos & CDN (100% Libres de API Keys)"]
        OSRM["OSRM Public Routing API\n(router.project-osrm.org)"]
        LeafletCDN["Leaflet.js v1.9.4 CDN\n(Cartografía base OpenStreetMap)"]
        LucideCDN["Lucide Icons v0.344.0\n(Iconografía SVG limpia)"]
        GoogleFonts["Google Fonts\n(Cormorant Garamond & Manrope)"]
    end

    UI --> AppController
    CSS -.-> UI
    AppController --> Contexto
    AppController --> MapaLeaflet
    Contexto --> EstrategiaBase
    EstrategiaBase <|-- EstratCorta
    EstrategiaBase <|-- EstratRapida
    EstratCorta --> GrafoModel
    EstratRapida --> GrafoModel
    GrafoModel *-- RedNodos
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
        Mapa ->> OSRM: GET /route/v1/driving/{coords}?geometries=geojson
        OSRM -->> Mapa: Retorna coordenadas viales reales (calles y curvas)
        Mapa ->> UI: Renderiza polilínea vial real + vincula tooltip interactivo
        deactivate Mapa

    else Caso B: Comparativa Real ("Comparar Ambas Estrategias")
        Operador ->> UI: 2b. Clic en "Comparar Ambas Estrategias"
        UI ->> App: Evento click ('btn-comparar')
        App ->> Contexto: setEstrategia(EstrategiaRutaMasCorta)
        App ->> Contexto: ejecutarCalculo(origenId, destinoId) -> resCorta
        App ->> Contexto: setEstrategia(EstrategiaRutaMasRapida)
        App ->> Contexto: ejecutarCalculo(origenId, destinoId) -> resRapida
        Note over App: Evalúa: resCorta.rutaIds === resRapida.rutaIds

        alt ¿Ambas estrategias son la misma ruta?
            App ->> UI: Configura alerta de "Coincidencia Total"
            App ->> Mapa: trazarComparativa(resCorta, resRapida) -> Trazo unificado
        else ¿Son rutas diferentes?
            App ->> UI: Configura cuadrícula lado a lado + Análisis de Trade-Off
            App ->> Mapa: trazarComparativa(resCorta, resRapida) -> Doble trazo (Dorado vs Azul)
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
stateDiagram-v2
    [*] --> Inicializacion: Carga inicial de la aplicación

    state Inicializacion {
        [*] --> ConfigurarTema: Cargar tema claro/oscuro de localStorage
        ConfigurarTema --> InicializarMapa: Instanciar Leaflet y capas base OSM
        InicializarMapa --> CargarCiudadDefecto: Activar red vial de Bogotá D.C.
        CargarCiudadDefecto --> PoblarSelectores: Llenar origen y destino con exclusión mutua
        PoblarSelectores --> TrazarDefecto: Ejecutar cálculo y trazo inicial
        TrazarDefecto --> [*]
    }

    Inicializacion --> EsperaAccionUsuario: Sistema listo

    state EsperaAccionUsuario {
        [*] --> SeleccionarCiudad: Usuario cambia de ciudad
        [*] --> CambiarPuntos: Usuario modifica origen/destino
        [*] --> InvertirSentido: Clic en botón "Invertir"
        [*] --> SolicitarCalculo: Clic en "Calcular Ruta Óptima"
        [*] --> SolicitarComparativa: Clic en "Comparar Ambas Estrategias"
    }

    SeleccionarCiudad --> ActualizarGrafoCiudad: ModuloMapa.cambiarCiudad()
    ActualizarGrafoCiudad --> EsperaAccionUsuario: Re-poblar selectores y centrar mapa

    CambiarPuntos --> ValidarSeleccion: Exclusión mutua (origen !== destino)
    ValidarSeleccion --> EsperaAccionUsuario: Puntos validados

    InvertirSentido --> IntercambiarNodos: Origen <-> Destino
    IntercambiarNodos --> EsperaAccionUsuario: Re-calcular navegación

    SolicitarCalculo --> FlujoCalculoIndividual
    SolicitarComparativa --> FlujoComparativaEstrategias

    state FlujoCalculoIndividual {
        [*] --> SincronizarEstrategia: Inyectar estrategia seleccionada (Radio button)
        SincronizarEstrategia --> MedirPerformance: Iniciar performance.now()
        MedirPerformance --> AlgoritmoDijkstra: Dijkstra con metricaPrincipal
        AlgoritmoDijkstra --> FinalizarMedicion: Registrar latencia en ms
        FinalizarMedicion --> RenderizarItinerarioUI: Mostrar lista de sedes
        RenderizarItinerarioUI --> RenderizarMapaLeaflet: Trazar polyline preliminar
        RenderizarMapaLeaflet --> PeticionOSRM: Fetch geometría vial real
        PeticionOSRM --> ActualizarPolylineVial: Dibujar trazado calle a calle
        ActualizarPolylineVial --> [*]
    }

    state FlujoComparativaEstrategias {
        [*] --> EjecutarCorta: Dijkstra con métrica 'distanciaKm'
        EjecutarCorta --> EjecutarRapida: Dijkstra con métrica 'tiempoMinutos'
        EjecutarRapida --> EvaluarIgualdad: ¿resCorta.rutaIds == resRapida.rutaIds?

        state EvaluarIgualdad <<choice>>
        EvaluarIgualdad --> FlujoMismaRuta: Si (Son idénticas)
        EvaluarIgualdad --> FlujoRutasDiferentes: No (Son diferentes)

        state FlujoMismaRuta {
            [*] --> GenerarBannerCoincidencia: Alerta "Coincidencia Total"
            GenerarBannerCoincidencia --> TrazoUnificadoMapa: ModuloMapa.trazarComparativa()
            TrazoUnificadoMapa --> [*]
        }

        state FlujoRutasDiferentes {
            [*] --> GenerarTarjetasLadoALado: Tarjeta Corta (Oro) vs Rápida (Azul)
            GenerarTarjetasLadoALado --> ComputarTradeOff: Δ km vs Ahorro min (%)
            ComputarTradeOff --> TrazoDobleMapa: Trazo simultáneo Dorado + Azul segmentado
            TrazoDobleMapa --> [*]
        }

        FlujoMismaRuta --> MostrarModalYBanner: Abrir #modal-comparativa-estrategias
        FlujoRutasDiferentes --> MostrarModalYBanner: Abrir #modal-comparativa-estrategias
        MostrarModalYBanner --> [*]
    }

    FlujoCalculoIndividual --> InspeccionAuditoria: Ruta disponible en mapa
    FlujoComparativaEstrategias --> InspeccionAuditoria: Comparativa visible en mapa

    state InspeccionAuditoria {
        [*] --> ClicEnPolyline: Operador hace clic sobre la línea en el mapa
        ClicEnPolyline --> AbrirModalAuditoria: Invoca modal técnico
        AbrirModalAuditoria --> ConsultarViasCrucesHitos: Tramo a tramo
        ConsultarViasCrucesHitos --> CerrarModal: Operador termina auditoría
        CerrarModal --> [*]
    }

    InspeccionAuditoria --> EsperaAccionUsuario: Continúa monitoreo logístico
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
