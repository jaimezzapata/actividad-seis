# Joyería Nudo de Oro — Sistema de Logística y Rutas

Aplicación web para el cálculo y optimización de rutas de transporte y despacho de joyas entre talleres, proveedores, sucursales y clientes.

El proyecto implementa el **Patrón de Diseño Strategy (GoF)** para alternar de forma dinámica entre diferentes criterios de enrutamiento utilizando el algoritmo **Dijkstra** y visualización interactiva sobre mapas de **OpenStreetMap** con **Leaflet.js**.

---

## Características Principales

- **Patrón Strategy (GoF):**
  - **Ruta Más Corta:** Prioriza la menor distancia física en kilómetros.
  - **Ruta Más Rápida:** Prioriza el menor tiempo en minutos considerando el tráfico vehicular.
- **Comparación de Estrategias:** Módulo para evaluar simultáneamente ambas opciones, mostrando diferencias de distancia, tiempo y trazado en el mapa.
- **Cobertura Multiciudad:** Redes viales modeladas para Bogotá D.C., Medellín y Bucaramanga.
- **Visualización Geoespacial:** Mapa interactivo con marcadores vectoriales, seguimiento vial real y panel de itinerario paso a paso.
- **Tecnologías Abiertas:** Sin dependencias de servicios de pago ni claves API comerciales.

---

## Estructura del Proyecto

```text
actividad-seis/
├── index.html              # Interfaz principal de usuario
├── css/
│   └── styles.css          # Estilos del sistema de diseño
├── js/
│   ├── grafo.js            # Modelo de datos y conexiones viales
│   ├── estrategias.js      # Implementación del Patrón Strategy y Dijkstra
│   ├── mapa.js             # Integración con Leaflet.js y trazado de rutas
│   └── app.js              # Controlador de la aplicación
├── test/
│   └── test_estrategias.js # Pruebas unitarias
└── docs/
    ├── DIAGRAMAS_UML.md    # Diagramas UML (Clases, Componentes, Secuencia, Flujo)
    └── GUION_SUSTENTACION.md # Guión para la exposición y sustentación
```

---

## Ejecución del Proyecto

### 1. Visualizar la Aplicación Web
Puedes abrir directamente el archivo `index.html` en cualquier navegador web moderno, o iniciar un servidor local:

**Con Node.js (opcional):**
```bash
npx serve .
```

**Con Python (opcional):**
```bash
python -m http.server 8000
```

Luego abre en tu navegador `http://localhost:8000`.

### 2. Ejecutar Pruebas Unitarias
El proyecto cuenta con una suite de pruebas para verificar el funcionamiento de las clases abstractas, las estrategias y los cálculos Dijkstra:

```bash
node test/test_estrategias.js
```

---

## Documentación Adicional

- [Diagramas UML del Sistema](docs/DIAGRAMAS_UML.md): Diagrama de Clases, Componentes, Secuencia y Actividad.
- [Guión de Sustentación](docs/GUION_SUSTENTACION.md): Estructura para la presentación en video del proyecto.

---

## Integrantes del Proyecto

- Jaime Zapata Valencia
- Rafael David Ramírez Saavedra
- Angela Yurany Rosero
