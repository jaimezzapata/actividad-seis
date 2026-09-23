# Guión de Sustentación en Video: Joyería Nudo de Oro
## Módulo de Logística y Optimización de Rutas de Despacho Blindado
### Asignatura: Arquitectura de Software • Unidad 3: Estrategias de Navegación
**Duración Total Estimada:** 12 - 14 minutos (Rango objetivo: 10 - 15 minutos)

---

## 👥 Integrantes y Distribución de Responsabilidades

| Integrante | Rol en la Sustentación | Bloque Temático | Tiempo Estimado |
| :--- | :--- | :--- | :---: |
| **Jaime Zapata Valencia** | **Apertura & Arquitectura Base** | Contexto del problema, Justificación del Patrón Strategy, Diagrama de Clases y Diagrama de Componentes. | 00:00 - 04:30 (~4.5 min) |
| **Rafael David Ramírez Saavedra** | **Dinámica de Ejecución & Pruebas** | Diagrama de Secuencia, Diagrama de Actividad/Flujo y Demostración en Código del Patrón Strategy (`estrategias.js` y Suite de Pruebas). | 04:30 - 09:00 (~4.5 min) |
| **Angela Yurany Rosero** | **Demostración Práctica & Conclusiones** | Demo en vivo del aplicativo web (multiciudad, cálculo individual, comparativa de rutas, modal técnico en mapa) y Cierre Académico. | 09:00 - 13:30 (~4.5 min) |

> [!NOTE]
> **Enfoque colaborativo:** Aunque todos los integrantes participamos activamente en el análisis, modelado, implementación del grafo, algoritmos y diseño visual, la distribución asigna liderazgos específicos para una exposición fluida y coordinada.

---

## ⏱️ Estructura y Cronograma del Video (13:30 min)

```
00:00 ── 01:30 | 1. Introducción y Contexto del Despacho de Joyas (Jaime)
01:30 ── 04:30 | 2. Arquitectura: Patrón Strategy, Clases y Componentes (Jaime)
04:30 ── 07:00 | 3. Dinámica del Sistema: Diagramas de Secuencia y Actividad (Rafael)
07:00 ── 09:00 | 4. Sustentación en Código y Pruebas Unitarias (Rafael)
09:00 ── 12:30 | 5. Demostración en Vivo del Prototipo Web y Casos de Uso (Angela)
12:30 ── 13:30 | 6. Conclusiones y Cierre Académico (Equipo)
```

---

## 🎬 Guión Detallado Escena por Escena

---

### PARTE 1: Introducción y Contexto de Negocio (00:00 - 01:30)
**Responsable:** Jaime Zapata Valencia  
**Qué mostrar en pantalla:** Cámara de los 3 integrantes saludando / Diapositiva de portada con el logo de *Joyería Nudo de Oro*, título de la Unidad 3 de Arquitectura de Software y nombres del equipo.

**[00:00 - 00:45] Bienvenida y Presentación:**
> **Jaime:**  
> "Un cordial saludo al docente y a los compañeros. Mi nombre es **Jaime Zapata Valencia**, y junto a mis compañeros **Rafael David Ramírez Saavedra** y **Angela Yurany Rosero**, presentamos la sustentación del proyecto final de la Unidad 3: *Estrategias de Navegación en la Arquitectura de Software*.  
> 
> Nuestro proyecto se titula: **'Módulo de Logística y Optimización de Rutas de Despacho - Joyería Nudo de Oro'**. Como equipo abordamos de forma integral todo el ciclo de desarrollo: desde el levantamiento de requisitos y modelado UML, hasta la codificación en JavaScript ES6+, algoritmos de grafos y la interfaz interactiva con Leaflet.js."

**[00:45 - 01:30] Planteamiento del Problema:**
> **Jaime:**  
> "El contexto del negocio corresponde a una joyería de alta gama que despacha piezas de oro fundido, piedras preciosas y productos de alta cuantía entre talleres centrales, sucursales y clientes VIP.  
> 
> En este escenario, el concepto de **'mejor ruta' es ambiguo y situacional**:
> - En traslados rutinarios de insumos o en horarios nocturnos, la prioridad es **minimizar la distancia física en kilómetros** para reducir costos de combustible y desgaste de flota.
> - Sin embargo, en traslados de alta cuantía con tráfico pesado, la prioridad crítica de seguridad es **minimizar el tiempo de exposición en vía pública**, canalizando los vehículos blindados por vías arterias rápidas aunque el trayecto implique mayor kilometraje.
> 
> Para solucionar este dilema sin acoplar la interfaz gráfica ni reinventar el código, aplicamos formalmente el **Patrón de Diseño de Comportamiento Strategy de la banda de los cuatro (Gang of Four - GoF)**."

---

### PARTE 2: Diagrama de Clases y Diagrama de Componentes (01:30 - 04:30)
**Responsable:** Jaime Zapata Valencia  
**Qué mostrar en pantalla:** Documento [`docs/DIAGRAMAS_UML.md`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/docs/DIAGRAMAS_UML.md) mostrando el Diagrama de Clases y el Diagrama de Componentes renderizados en Mermaid.

**[01:30 - 03:00] Diagrama de Clases (Patrón Strategy GoF):**
> **Jaime:**  
> *(Señalando el Diagrama de Clases en pantalla)*  
> "En este primer diagrama se evidencia la estructura del patrón Strategy:
> 
> 1. **La Abstracción (`EstrategiaNavegacion`):** Es una clase abstracta que define el contrato `calcularRuta()`. Además, encapsula el método protegido `_ejecutarDijkstra()`, permitiendo reutilizar el algoritmo de camino mínimo de Dijkstra pero parametrizando la función de costo según la estrategia activa.
> 2. **Las Estrategias Concretas:** 
>    - `EstrategiaRutaMasCorta`: Configura a Dijkstra para ponderar las aristas por la métrica `distanciaKm`.
>    - `EstrategiaRutaMasRapida`: Pondera las aristas por la métrica `tiempoMinutos`, considerando la congestión y semaforización urbana.
> 3. **El Contexto (`CalculadorRutas`):** Mantiene una referencia polimórfica a `EstrategiaNavegacion` mediante composición. Posee el método `setEstrategia()` para cambiar de algoritmo en caliente (*runtime*), y en `ejecutarCalculo()` delega el procesamiento cronometrándolo con la API de alta resolución `performance.now()`.
> 4. **El Modelo de Datos:** `GrafoJoyeria` administra los nodos (`Nodo`) y aristas viales (`Arista`), que contienen no solo los pesos sino también los nombres de vías, cruces semafóricos e hitos urbanos."

**[03:00 - 04:30] Diagrama de Componentes:**
> **Jaime:**  
> *(Pasando al Diagrama de Componentes)*  
> "A nivel de arquitectura general, estructuramos la aplicación bajo un desacoplamiento estricto en cinco capas:
> - **Capa de Presentación:** Compuesta por `index.html`, la hoja de estilos corporativa `styles.css` inspirada en la joyería (oro, marfil y carbón), y el módulo `mapa.js` montado sobre Leaflet.js.
> - **Capa de Control:** El archivo `app.js` orquesta eventos, valida exclusión mutua de sedes y gestiona los modales.
> - **Capa de Dominio:** Donde reside el núcleo matemático: el Contexto `CalculadorRutas` y la jerarquía Strategy en `estrategias.js`.
> - **Capa de Datos:** `grafo.js`, que implementa la topología vial multiciudad para Bogotá, Medellín y Bucaramanga.
> - **Servicios Externos Libres:** El motor de enrutamiento OSRM de OpenStreetMap para obtener la geometría real calle a calle, y CDN de Leaflet y Lucide Icons, garantizando un despliegue **100% libre sin requerimiento de API keys**.
> 
> Le doy paso a mi compañero Rafael para explicar la interacción temporal y la implementación en código."

---

### PARTE 3: Diagramas de Secuencia y Actividad (04:30 - 07:00)
**Responsable:** Rafael David Ramírez Saavedra  
**Qué mostrar en pantalla:** Documento [`docs/DIAGRAMAS_UML.md`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/docs/DIAGRAMAS_UML.md) mostrando el Diagrama de Secuencia y el Diagrama de Actividad/Flujo.

**[04:30 - 05:45] Diagrama de Secuencia:**
> **Rafael:**  
> "Muchas gracias, Jaime. Mi nombre es **Rafael Ramírez**, y a continuación analizaremos el comportamiento dinámico del sistema.
> 
> En el **Diagrama de Secuencia** observamos dos flujos principales:
> - **Caso A (Cálculo Individual):** Cuando el operador hace clic en *'Calcular Ruta Óptima'*, el controlador invoca `setEstrategia()` en el contexto `CalculadorRutas`. Al disparar `ejecutarCalculo()`, se inicia un cronómetro con `performance.now()`, la estrategia concreta consulta al grafo los nodos adyacentes, ejecuta Dijkstra y retorna la ruta óptima. El mapa Leaflet dibuja un trazo preliminar y de forma asíncrona consulta la API OSRM para renderizar las curvas y sentidos viales reales.
> - **Caso B (Comparativa Real):** Si el operador hace clic en *'Comparar Ambas Estrategias'*, el controlador ejecuta secuencialmente la estrategia más corta y la más rápida sobre el mismo origen y destino. El sistema compara los vectores de nodos recorridos: si son idénticos, dispara el estado de *Coincidencia Total*; si son diferentes, traza ambas rutas simultáneamente en el mapa (Dorado sólido para la más corta y Azul segmentado para la más rápida) y abre el modal de trade-off."

**[05:45 - 07:00] Diagrama de Actividad / Flujo del Recorrido:**
> **Rafael:**  
> *(Pasando al Diagrama de Actividad)*  
> "En este Diagrama de Actividad modelamos el ciclo completo de despacho:
> 1. Inicia con la carga del mapa y la activación de la ciudad seleccionada.
> 2. El usuario selecciona la sede de origen, lo que automáticamente filtra y excluye ese nodo del selector de destino para evitar despachos nulos.
> 3. Al procesar, el sistema toma una bifurcación: cálculo individual o comparativa.
> 4. En la comparativa se incluye un punto de decisión crucial: ¿Ambas estrategias arrojaron la misma secuencia de nodos? Esto resuelve el caso real donde un trayecto corto es también la vía más rápida porque no existen autopistas alternas.
> 5. Finalmente, el operador puede hacer clic interactivo sobre la polilínea del mapa para auditar calles, cruces y latencia computacional."

---

### PARTE 4: Demostración en Código y Pruebas Unitarias (07:00 - 09:00)
**Responsable:** Rafael David Ramírez Saavedra  
**Qué mostrar en pantalla:** Editor de código (VS Code) en [`js/estrategias.js`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/estrategias.js) y Terminal ejecutando `node test/test_estrategias.js`.

**[07:00 - 08:15] Inspección del Código Fuente (`js/estrategias.js`):**
> **Rafael:**  
> *(Mostrando en el editor `js/estrategias.js`)*  
> "Veamos la materialización técnica del patrón en el código fuente:
> - En la línea 14 tenemos `class EstrategiaNavegacion`. Si intentamos instanciarla directamente, el constructor arroja una excepción, emulando una clase abstracta pura en JavaScript.
> - En la línea 162 está `EstrategiaRutaMasCorta`, que extiende la clase base e invoca `this._ejecutarDijkstra()` pasando `'distanciaKm'` como criterio de peso.
> - En la línea 198 encontramos `EstrategiaRutaMasRapida`, que invoca el mismo algoritmo pero parametrizado con `'tiempoMinutos'`.
> - En la línea 243 implementamos la clase `CalculadorRutas` como Contexto. Observen cómo `setEstrategia()` permite la sustitución en caliente sin reiniciar estado, y en `ejecutarCalculo()` encapsulamos la medición de microsegundos con `performance.now()`."

**[08:15 - 09:00] Ejecución de Pruebas Automatizadas:**
> **Rafael:**  
> *(Abriendo la terminal y ejecutando `node test/test_estrategias.js`)*  
> "Para certificar la integridad arquitectónica, desarrollamos una suite de pruebas unitarias automatizadas con Node.js.  
> Procedo a ejecutar: `node test/test_estrategias.js`.  
> 
> Como pueden apreciar en pantalla, se superan **12 de 12 pruebas exitosas**:
> - Se valida que la clase base no sea instanciable.
> - Se verifica la herencia de ambas estrategias.
> - Se prueba la mutabilidad del contexto en caliente.
> - Se verifica la consistencia matemática: la ruta más corta siempre produce $\le$ distancia en km, y la más rápida siempre produce $\le$ tiempo en minutos.
> - Y se comprueba el cálculo en las redes de Bogotá, Medellín y Bucaramanga.
> 
> Ahora le cedo la palabra a mi compañera Angela para la demostración práctica en vivo."

---

### PARTE 5: Demostración Práctica en Vivo del Prototipo (09:00 - 12:30)
**Responsable:** Angela Yurany Rosero  
**Qué mostrar en pantalla:** Navegador web ejecutando `index.html`. Interactuar en vivo con la interfaz, cambiar de ciudad, calcular rutas y abrir los modales.

**[09:00 - 10:00] Interfaz de Usuario y Cobertura Multiciudad:**
> **Angela:**  
> "Muchas gracias, Rafael. Mi nombre es **Angela Yurany Rosero**, y voy a guiarlos por el funcionamiento interactivo de la aplicación.
> 
> *(Mostrando la página `index.html`)*  
> La interfaz fue diseñada siguiendo la estética corporativa de Joyería Nudo de Oro: tipografía serif editorial *Cormorant Garamond*, tonos dorados, marfil y carbón, modo claro y oscuro conmemorativo, y **cero emojis**, utilizando iconografía técnica con Lucide Icons.
> 
> Observen en la parte superior el selector de ciudades:
> - Actualmente estamos en **Bogotá D.C.** con 18 nodos viales.
> - Si cambio a **Medellín**, el mapa vuela fluidamente al Valle de Aburrá con 8 sedes exclusivas (como El Poblado, Junín y Llanogrande).
> - Si cambio a **Bucaramanga**, la red se actualiza a la meseta metropolitana con Cabecera, Ruitoque y Cañaveral.
> 
> Regresamos a Bogotá para el caso principal de estudio."

**[10:00 - 11:15] Caso 1: Rutas Diferentes y Comparativa Real (Trade-Off):**
> **Angela:**  
> *(Selecciona Origen: Taller Central Candelaria -> Destino: Cliente Boutique Usaquén)*  
> "En este trayecto emblemático:
> 1. Si seleccionamos **Ruta Más Corta** y calculamos, la ruta trazada prioriza la distancia física: **15.1 km**, pero tarda **78 minutos** debido a la congestión de la Carrera 7ma y el centro.
> 2. Si cambiamos a **Ruta Más Rápida**, el vehículo blindado es desviado por la Calle 26 y la Autopista Norte: recorre **19.7 km**, pero reduce el tiempo a tan solo **46 minutos**.
> 
> Ahora, pulsemos el botón destacado **'Comparar Ambas Estrategias'**:
> *(Clic en 'btn-comparar')*  
> Observen lo que ocurre simultáneamente:
> - En el mapa aparece un banner superior indicando la comparativa activa y **se dibujan ambas rutas a la vez**: la dorada sólida para la más corta y la azul segmentada para la más rápida.
> - Se abre el modal corporativo de comparativa que presenta las dos tarjetas lado a lado y un **Balance de Trade-Off Logístico**: le explica al oficial de despacho que la ruta rápida ahorra **32 minutos (41% menos tiempo)** a cambio de recorrer **4.6 km adicionales**, recomendando esta opción para salvaguardar cargamentos millonarios contra asaltos en semáforos."

**[11:15 - 12:00] Caso 2: Coincidencia de Rutas y Exclusión Mutua:**
> **Angela:**  
> *(Cierra el modal y cambia Destino a: Proveedor Centro Oro)*  
> "Noten primero cómo al seleccionar *Taller Central* como origen, este desaparece automáticamente de la lista de destinos, garantizando la **exclusión mutua** solicitada en los requisitos.
> 
> Ahora probemos la comparativa en un trayecto adyacente: *Taller Central* hacia *Proveedor Centro Oro*.
> *(Clic en 'Comparar Ambas Estrategias')*  
> Miren el resultado: el sistema detecta de forma autónoma que ambas estrategias convergen exactamente en la misma secuencia de nodos. El modal despliega el mensaje de **'Coincidencia Total'**, explicando arquitectónicamente que la ruta físicamente más corta (1.2 km) es a su vez la más rápida (8 min) al no existir atajos ni vías arteriales que mejoren uno de los factores."

**[12:00 - 12:30] Auditoría e Informe Técnico por Clic en el Mapa:**
> **Angela:**  
> *(Cierra el modal comparativo y hace clic directamente sobre la polilínea dorada en el mapa)*  
> "Por último, implementamos interactividad directa sobre la cartografía: al hacer clic sobre cualquier línea de ruta en el mapa Leaflet, se abre el **Informe Técnico de Despacho y Auditoría GoF**:
> - Contiene la justificación operativa (*¿Por qué esta ruta y no otra?*).
> - Detalla tramo a tramo las vías arterias (como Carrera 7ma, Calle 100), los cruces semafóricos y los hitos de seguridad.
> - Y documenta la complejidad asintótica del algoritmo ($O(E + V \log V)$) y la latencia real en milisegundos con `performance.now()`, que fue de solo **0.15 milisegundos**."

---

### PARTE 6: Conclusiones y Cierre Académico (12:30 - 13:30)
**Responsables:** Jaime Zapata, Rafael Ramírez y Angela Rosero  
**Qué mostrar en pantalla:** Los 3 integrantes en cámara o Diapositiva de Conclusiones y Agradecimientos.

**[12:30 - 12:50] Conclusión Teórica:**
> **Jaime:**  
> "Como conclusión arquitectónica, el patrón Strategy demostró ser la solución idónea para sistemas logísticos de alta variabilidad, cumpliendo cabalmente con el principio de responsabilidad única (SRP) y el principio abierto/cerrado (OCP), permitiendo añadir nuevas estrategias (como una ruta de máxima seguridad por cámaras) sin alterar el contexto ni la interfaz."

**[12:50 - 13:10] Conclusión Técnica:**
> **Rafael:**  
> "Técnicamente, la integración entre modelos de grafos matemáticos ponderados, la medición con `performance.now()` y APIs abiertas como Leaflet y OSRM demuestra que es viable construir software empresarial de primer nivel, eficiente y con costo cero en licencias."

**[13:10 - 13:30] Despedida:**
> **Angela:**  
> "Agradecemos la atención prestada por el profesor y los compañeros. Esperamos que este recorrido interactivo y arquitectónico por la Joyería Nudo de Oro haya sido de su total agrado. ¡Muchas gracias y un feliz día!"

---

## 📋 Lista de Chequeo Previa a la Grabación (Checklist)

- [ ] **Entorno Local:** Tener abierto el archivo `index.html` en el navegador (Google Chrome o Edge) en pantalla completa (F11).
- [ ] **Documentos Listos:** Pestaña abierta con [`docs/DIAGRAMAS_UML.md`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/docs/DIAGRAMAS_UML.md) mostrando los 4 diagramas ya renderizados.
- [ ] **Código y Terminal:** VS Code abierto en [`js/estrategias.js`](file:///c:/Users/Jaime%20Zapata/Documents/actividad-seis/js/estrategias.js) con terminal integrada limpia lista para escribir `node test/test_estrategias.js`.
- [ ] **Audio y Video:** Micrófono probado para los tres participantes con volumen equilibrado.
- [ ] **Temporizador:** Cronómetro a la vista para mantenerse entre los **11 y 14 minutos**.
