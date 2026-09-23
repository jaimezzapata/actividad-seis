# Guión de Sustentación en Video: Joyería Nudo de Oro
## Módulo de Logística y Optimización de Rutas con Patrón Strategy (GoF)
**Modalidad:** Exposición individual en representación del equipo de trabajo.  
**Duración Estimada:** 11 a 13 minutos (Rango permitido: 10 a 15 minutos).

---

### [00:00 - 01:15] Introducción y Presentación del Equipo

**En pantalla:** Portada de la presentación con el título del proyecto y los nombres de los integrantes.

**Texto para leer:**  
"Un cordial saludo al docente y a los compañeros. Mi nombre es Jaime Zapata Valencia y en esta oportunidad tengo el gusto de realizar la sustentación del proyecto final de la Unidad 3: *Estrategias de Navegación en la Arquitectura de Software*.

Esta actividad fue desarrollada de manera colaborativa e integral por tres personas:
- Mi persona, **Jaime Zapata Valencia**
- Mi compañero, **Rafael David Ramírez Saavedra**
- Mi compañera, **Angela Yurany Rosero**

Como equipo, todos participamos activamente en cada una de las fases del proyecto: desde el análisis arquitectónico y diseño de diagramas UML, hasta la codificación del grafo vial, la implementación del algoritmo Dijkstra, la interfaz gráfica con Leaflet y la elaboración de pruebas unitarias.

Nuestro proyecto se titula: **'Módulo de Logística y Optimización de Rutas de Despacho — Joyería Nudo de Oro'**."

---

### [01:15 - 02:45] Contexto del Problema y Justificación del Patrón Strategy

**En pantalla:** Diapositiva del problema de negocio y modelo de despacho joyero.

**Texto para leer:**  
"El contexto del problema se centra en una joyería de alta gama que despacha metales preciosos, piezas en oro de 18 kilates y gemas certificadas entre talleres centrales de fundición, proveedores mayoristas, sucursales en centros comerciales y clientes VIP.

En una operación logística de esta naturaleza, el concepto de 'ruta óptima' no es estático, sino situacional:
1. En traslados regulares de insumos o en horarios sin congestión, el objetivo es **minimizar la distancia física en kilómetros**, reduciendo el consumo de combustible y el kilometraje de la flota.
2. Sin embargo, en traslados de alta cuantía en horas de alto flujo vehicular, la prioridad de seguridad es **minimizar el tiempo de permanencia en las vías públicas**, canalizando la carga por corredores arteriales fluidos aunque representen mayor kilometraje.

Para resolver este desafío sin acoplar la interfaz de usuario ni crear código rígido, implementamos el **Patrón de Diseño de Comportamiento Strategy de Gang of Four (GoF)**. Este patrón nos permite encapsular la familia de algoritmos de cálculo, hacerlos intercambiables en tiempo de ejecución y variar el criterio de decisión sin modificar las clases que lo consumen."

---

### [02:45 - 04:30] Diagrama de Clases y Diagrama de Componentes

**En pantalla:** Abrir el documento `docs/DIAGRAMAS_UML.md` y enfocar el **Diagrama de Clases** y el **Diagrama de Componentes**.

**Texto para leer:**  
"A continuación, revisamos la arquitectura del sistema plasmada en nuestros diagramas UML obligatorios.

Observando el **Diagrama de Clases**:
- Contamos con la clase base abstracta `EstrategiaNavegacion`, la cual establece el contrato común `calcularRuta()` y encapsula el algoritmo genérico `_ejecutarDijkstra()`.
- De ella heredan dos estrategias concretas:
  - `EstrategiaRutaMasCorta`, que ejecuta el cálculo ponderando las aristas por la métrica física `distanciaKm`.
  - `EstrategiaRutaMasRapida`, que ejecuta el cálculo ponderando por `tiempoMinutos`, incorporando congestión y semaforización.
- La clase `CalculadorRutas` actúa como el **Contexto**. Esta clase mantiene una referencia polimórfica a la estrategia activa y provee el método `setEstrategia()`, permitiendo alternar el algoritmo en caliente sin alterar el estado del sistema.
- Finalmente, la clase `GrafoJoyeria` administra los nodos y las conexiones viales con sus atributos de distancia, tiempo, vía principal y cruces.

Al pasar al **Diagrama de Componentes**, podemos apreciar la separación estricta en capas:
- La **Capa de Presentación** con `index.html`, la hoja de estilos `styles.css` y el motor cartográfico `mapa.js` con Leaflet.
- La **Capa de Control** en `app.js` que gestiona eventos y modales.
- La **Capa de Dominio** donde residen el contexto `CalculadorRutas` y las estrategias de enrutamiento.
- La **Capa de Datos** con la topología de `grafo.js`.
- Y los **Servicios Externos Libres**, utilizando la API pública OSRM para la geometría vial real, y las librerías de OpenStreetMap y Lucide Icons, garantizando una solución 100% funcional sin claves comerciales ni costos de licenciamiento."

---

### [04:30 - 06:15] Diagrama de Secuencia y Diagrama de Actividad

**En pantalla:** Enfocar en `docs/DIAGRAMAS_UML.md` el **Diagrama de Secuencia** y el **Diagrama de Actividad / Flujo**.

**Texto para leer:**  
"En el **Diagrama de Secuencia** se describe la interacción temporal ante dos eventos del operador:
- Cuando se solicita el cálculo de una ruta individual, el controlador invoca `setEstrategia()` en el contexto, el cual delega en la estrategia concreta. Esta consulta al grafo, ejecuta Dijkstra y cronometra la latencia con la API `performance.now()`. Con el resultado, el mapa grafica la ruta preliminar y consulta a OSRM para calcar las curvas reales de las calles.
- Cuando el operador presiona el botón de comparar ambas estrategias, el controlador ejecuta secuencialmente la estrategia más corta y la más rápida sobre los mismos puntos de origen y destino, comparando los vectores de nodos para determinar si las rutas son distintas o si coinciden totalmente.

En el **Diagrama de Actividad o Flujo del Recorrido**, se modela el proceso operativo:
1. El usuario selecciona la ciudad activa y la sede de origen.
2. El sistema aplica automáticamente una regla de exclusión mutua, eliminando el origen de la lista de destinos para evitar trayectos redundantes.
3. Se selecciona la estrategia y se procesa el algoritmo.
4. Si se activa la comparativa, el flujo evalúa si ambas rutas son idénticas para desplegar un mensaje de coincidencia total o las dos tarjetas enfrentadas.
5. El operador puede hacer clic sobre el mapa para desplegar el modal de auditoría técnica con la justificación del recorrido."

---

### [06:15 - 08:00] Revisión de Código Fuente y Pruebas Unitarias

**En pantalla:** Abrir el editor en `js/estrategias.js` y la terminal de comandos.

**Texto para leer:**  
"Pasemos a revisar la implementación en el código fuente.

En el archivo `js/estrategias.js`:
- Apreciamos la clase `EstrategiaNavegacion`. En su constructor verificamos si se intenta instanciar directamente y arrojamos un error de tipo, emulando formalmente el comportamiento de una clase abstracta en JavaScript.
- En las clases `EstrategiaRutaMasCorta` y `EstrategiaRutaMasRapida` observamos cómo ambas sobrescriben el método `calcularRuta()` llamando al método protegido `_ejecutarDijkstra()` pero suministrando como parámetro la métrica correspondiente: `'distanciaKm'` o `'tiempoMinutos'`.
- En la clase `CalculadorRutas`, el método `setEstrategia()` valida que la nueva estrategia sea instancia de la clase base antes de asignarla, y el método `ejecutarCalculo()` cronometra con precisión de microsegundos el tiempo de procesamiento.

Ahora, abro la terminal y ejecuto la suite de pruebas unitarias con el comando:
`node test/test_estrategias.js`.

Como podemos ver en pantalla, se superan **12 de 12 pruebas exitosamente**:
- Se valida la imposibilidad de instanciar la clase abstracta.
- Se confirma la herencia de las estrategias concretas.
- Se verifica el intercambio dinámico de estrategia en el contexto.
- Se comprueba la consistencia matemática de los resultados en kilómetros y minutos.
- Y se valida la cobertura en las tres ciudades del sistema: Bogotá, Medellín y Bucaramanga."

---

### [08:00 - 11:30] Demostración Práctica en Vivo de la Aplicación Web

**En pantalla:** Cambiar al navegador web con `index.html` en pantalla completa.

**Texto para leer:**  
"A continuación realizaremos la demostración práctica e interactiva del aplicativo web.

Como pueden observar, la interfaz refleja la identidad corporativa de la Joyería Nudo de Oro, con una paleta sobria en tonos dorados y marfil, soporte de modo claro y oscuro, y sin uso de emojis, empleando iconografía vectorial técnica.

**1. Cobertura Multiciudad:**  
En la parte superior disponemos del selector de ciudades:
- Actualmente estamos en **Bogotá D.C.** con una red de 18 sedes comerciales, talleres y clientes.
- Si hacemos clic en **Medellín**, el mapa se traslada suavemente al Valle de Aburrá, cargando 8 puntos estratégicos como El Poblado, Laureles, Envigado y Llanogrande.
- Si seleccionamos **Bucaramanga**, la cartografía se ubica en el área metropolitana, conectando Cabecera, Floridablanca, Cañaveral y Ruitoque.
- Cada ciudad tiene su propia red vial independiente y sus propios puntos de origen y destino.

**2. Caso 1: Rutas Diferentes y Comparativa de Estrategias:**  
Regresamos a Bogotá. Seleccionamos como origen el **Taller Central en La Candelaria** y como destino el **Cliente Boutique en Usaquén**:
- Al elegir **Ruta Más Corta** y pulsar 'Calcular Ruta Óptima', el sistema genera un trayecto de **15.1 kilómetros** que tarda **78 minutos** debido a la congestión de las vías céntricas.
- Al alternar a **Ruta Más Rápida**, el contexto cambia en caliente: la ruta toma vías arterias hacia el occidente y norte, recorriendo **19.7 kilómetros**, pero reduciendo el tiempo a **46 minutos**.
- Ahora presionamos el botón **'Comparar Ambas Estrategias'**. Observen cómo en el mapa se trazan ambas rutas de manera simultánea: la línea dorada sólida representa la más corta y la línea azul con guiones representa la más rápida.
- Al mismo tiempo, se abre el modal de comparativa lado a lado, que detalla un análisis de balance logístico: le indica al operador que con la ruta más rápida ahorra **32 minutos (un 41% menos de tiempo)** a cambio de **4.6 kilómetros adicionales**, siendo la opción recomendada para reducir la exposición ante riesgos de asalto en semáforos.

**3. Caso 2: Coincidencia Total de Rutas:**  
Cerramos la comparativa y cambiamos el destino a una sede cercana: el **Proveedor Centro Oro**.
- Al presionar **'Comparar Ambas Estrategias'**, el sistema evalúa ambos algoritmos y detecta que la secuencia de nodos es exactamente la misma.
- El modal informa explícitamente la **'Coincidencia Total'**, explicando que en este tramo la ruta físicamente más corta (1.2 km) es simultáneamente la más rápida (8 minutos), pues no existen corredores alternos que permitan ganar velocidad sin desviarse excesivamente.

**4. Modal de Justificación e Informe Técnico al Clic en Mapa:**  
Cerramos el modal y hacemos clic directamente sobre la polilínea de la ruta trazada en el mapa:
- Se despliega el **Informe Técnico de Despacho y Auditoría**, donde se presenta la justificación algorítmica de por qué se eligió esta ruta y no otra.
- Se detallan tramo a tramo las calles y avenidas recorridas, los cruces semafóricos y los hitos urbanos.
- Y se visualizan las métricas de latencia de cómputo, las cuales rondan fracciones de milisegundo gracias a la eficiencia de la estructura del grafo."

---

### [11:30 - 12:30] Conclusiones y Cierre

**En pantalla:** Diapositiva final con conclusiones y agradecimientos.

**Texto para leer:**  
"Para finalizar nuestra sustentación, destacamos las siguientes conclusiones:

1. **A Nivel Arquitectónico:** El Patrón Strategy demostró ser la solución idónea para este problema, ya que cumple con los principios SOLID, en particular el principio de Abierto/Cerrado (OCP), pues permite incorporar futuras estrategias —como una ruta de máxima cobertura de cámaras de seguridad— sin modificar el contexto ni la interfaz de usuario.
2. **A Nivel Técnico y de Rendimiento:** La combinación del algoritmo Dijkstra parametrizado sobre un grafo en memoria, junto con la medición precisa mediante `performance.now()`, garantiza respuestas en menos de un milisegundo, permitiendo comparativas en tiempo real.
3. **A Nivel Logístico:** El sistema proporciona a la Joyería Nudo de Oro una herramienta cuantitativa para tomar decisiones entre eficiencia de combustible y mitigación de riesgos de seguridad.

En nombre de mis compañeros **Rafael David Ramírez Saavedra**, **Angela Yurany Rosero** y en el mío propio, **Jaime Zapata Valencia**, agradecemos profundamente su atención. Muchas gracias."
