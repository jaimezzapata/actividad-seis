const ModuloMapa = (function() {
  let mapInstance = null;
  let layerRedLogistica = null;
  let layerRutaActiva = null;
  let layerMarcadores = null;
  let marcadoresNodos = {};

  const CENTRO_BOGOTA = [4.6520, -74.0650];
  const ZOOM_INICIAL = 12;

  const SVG_ICONS = {
    taller: `
      <svg class="marker-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9z"/>
        <path d="M11 3 8 9l4 12 4-12-3-6"/>
        <path d="M2 9h20"/>
      </svg>
    `,
    proveedor: `
      <svg class="marker-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21h18"/>
        <path d="M3 10h18"/>
        <path d="M5 6l7-3 7 3"/>
        <path d="M4 10v11"/>
        <path d="M20 10v11"/>
        <path d="M8 14v3"/>
        <path d="M12 14v3"/>
        <path d="M16 14v3"/>
      </svg>
    `,
    sucursal: `
      <svg class="marker-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
      </svg>
    `,
    cliente: `
      <svg class="marker-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    `
  };

  function crearIconoPersonalizado(tipo) {
    const iconClass = `marker-${tipo}`;
    const svgContent = SVG_ICONS[tipo] || SVG_ICONS.cliente;

    return L.divIcon({
      className: "custom-leaflet-marker-wrapper",
      html: `
        <div class="custom-marker-pin ${iconClass}">
          ${svgContent}
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -36]
    });
  }

  function inicializar(containerId, grafo) {
    if (mapInstance) {
      mapInstance.remove();
    }

    mapInstance = L.map(containerId, {
      center: CENTRO_BOGOTA,
      zoom: ZOOM_INICIAL,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | Nudo de Oro Logística'
    }).addTo(mapInstance);

    layerRedLogistica = L.layerGroup().addTo(mapInstance);
    layerRutaActiva = L.layerGroup().addTo(mapInstance);
    layerMarcadores = L.layerGroup().addTo(mapInstance);

    dibujarRedLogistica(grafo);
    renderizarMarcadores(grafo);

    return mapInstance;
  }

  function dibujarRedLogistica(grafo) {
    layerRedLogistica.clearLayers();

    grafo.conexiones.forEach(conexion => {
      const nodoOrigen = grafo.nodos[conexion.origen];
      const nodoDestino = grafo.nodos[conexion.destino];

      if (nodoOrigen && nodoDestino) {
        const puntos = [
          [nodoOrigen.lat, nodoOrigen.lng],
          [nodoDestino.lat, nodoDestino.lng]
        ];

        const lineaConexion = L.polyline(puntos, {
          color: "#9e7a27",
          weight: 1.5,
          opacity: 0.25,
          dashArray: "3, 6"
        });

        layerRedLogistica.addLayer(lineaConexion);
      }
    });
  }

  function renderizarMarcadores(grafo) {
    layerMarcadores.clearLayers();
    marcadoresNodos = {};

    Object.values(grafo.nodos).forEach(nodo => {
      const icono = crearIconoPersonalizado(nodo.tipo);
      const marker = L.marker([nodo.lat, nodo.lng], { icon: icono });

      marker.bindTooltip(nodo.nombre, {
        direction: "top",
        offset: [0, -36],
        className: "mini-tooltip-nodo",
        opacity: 0.95
      });

      const popupHtml = `
        <div class="popup-compacto">
          <span class="popup-tipo-pill">${nodo.tipo.toUpperCase()}</span>
          <div class="popup-nombre">${nodo.nombre}</div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 200,
        className: "custom-popup-compact-wrapper",
        closeButton: false
      });

      layerMarcadores.addLayer(marker);
      marcadoresNodos[nodo.id] = marker;
    });
  }

  let solicitudRutaActual = 0;

  async function trazarRuta(resultado) {
    layerRutaActiva.clearLayers();

    if (!resultado || !resultado.coordenadasRuta || resultado.coordenadasRuta.length < 2) {
      return;
    }

    const coords = resultado.coordenadasRuta;
    const esRutaMasCorta = resultado.estrategia.includes("Corta");
    const colorPrimario = esRutaMasCorta ? "#9e7a27" : "#2563eb";

    const idSolicitud = ++solicitudRutaActual;

    dibujarLineasRuta(coords, colorPrimario);

    try {
      const waypoints = coords.map(([lat, lng]) => `${lng},${lat}`).join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Respuesta OSRM no exitosa");

      const data = await response.json();

      if (idSolicitud !== solicitudRutaActual) return;

      if (data.routes && data.routes.length > 0 && data.routes[0].geometry) {
        const coordenadasVialesReales = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        layerRutaActiva.clearLayers();
        dibujarLineasRuta(coordenadasVialesReales, colorPrimario);
      }
    } catch (err) {
      console.warn("Utilizando geometría directa de nodos (fallback):", err);
    }
  }

  function dibujarLineasRuta(puntos, color) {
    const glowLine = L.polyline(puntos, {
      color: color,
      weight: 8,
      opacity: 0.22,
      lineCap: "round",
      lineJoin: "round",
      interactive: false
    });

    const mainLine = L.polyline(puntos, {
      color: color,
      weight: 5,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
      interactive: true,
      className: "polyline-ruta-activa"
    });

    mainLine.bindTooltip("Haz clic para ver el informe técnico y justificación de la ruta", {
      sticky: true,
      direction: "top",
      className: "mini-tooltip-nodo"
    });

    mainLine.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (typeof window.abrirModalInformeRuta === "function") {
        window.abrirModalInformeRuta();
      }
    });

    layerRutaActiva.addLayer(glowLine);
    layerRutaActiva.addLayer(mainLine);

    mapInstance.fitBounds(mainLine.getBounds(), {
      padding: [70, 70],
      maxZoom: 15,
      animate: true,
      duration: 0.8
    });
  }

  async function trazarComparativa(resCorta, resRapida, onAbrirComparativa) {
    layerRutaActiva.clearLayers();

    if (!resCorta?.coordenadasRuta || !resRapida?.coordenadasRuta) return;

    const sonIguales = resCorta.rutaIds.join("->") === resRapida.rutaIds.join("->");
    const idSolicitud = ++solicitudRutaActual;

    if (sonIguales) {
      const puntos = resCorta.coordenadasRuta;
      const glowLine = L.polyline(puntos, {
        color: "#9e7a27",
        weight: 9,
        opacity: 0.35,
        lineCap: "round",
        lineJoin: "round",
        interactive: false
      });
      const mainLine = L.polyline(puntos, {
        color: "#9e7a27",
        weight: 5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        interactive: true
      });

      mainLine.bindTooltip(`Ruta Única Óptima (Ambas coinciden: ${resCorta.distanciaTotalKm} km • ${resCorta.tiempoTotalMinutos} min)`, {
        sticky: true,
        direction: "top",
        className: "mini-tooltip-nodo"
      });

      mainLine.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        if (typeof onAbrirComparativa === "function") {
          onAbrirComparativa();
        }
      });

      layerRutaActiva.addLayer(glowLine);
      layerRutaActiva.addLayer(mainLine);

      mapInstance.fitBounds(mainLine.getBounds(), {
        padding: [70, 70],
        maxZoom: 15,
        animate: true,
        duration: 0.8
      });

      try {
        const waypoints = puntos.map(([lat, lng]) => `${lng},${lat}`).join(";");
        const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (res.ok && idSolicitud === solicitudRutaActual) {
          const data = await res.json();
          if (data.routes?.[0]?.geometry) {
            const geom = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            glowLine.setLatLngs(geom);
            mainLine.setLatLngs(geom);
          }
        }
      } catch (e) {
      }
      return;
    }

    const puntosCorta = resCorta.coordenadasRuta;
    const glowCorta = L.polyline(puntosCorta, {
      color: "#9e7a27",
      weight: 8,
      opacity: 0.25,
      lineCap: "round",
      lineJoin: "round",
      interactive: false
    });
    const lineCorta = L.polyline(puntosCorta, {
      color: "#9e7a27",
      weight: 5,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
      interactive: true
    });
    lineCorta.bindTooltip(`Ruta Más Corta: ${resCorta.distanciaTotalKm} km (${resCorta.tiempoTotalMinutos} min)`, {
      sticky: true,
      direction: "top",
      className: "mini-tooltip-nodo"
    });
    lineCorta.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (typeof onAbrirComparativa === "function") onAbrirComparativa();
    });

    const puntosRapida = resRapida.coordenadasRuta;
    const glowRapida = L.polyline(puntosRapida, {
      color: "#2563eb",
      weight: 8,
      opacity: 0.25,
      lineCap: "round",
      lineJoin: "round",
      interactive: false
    });
    const lineRapida = L.polyline(puntosRapida, {
      color: "#2563eb",
      weight: 5,
      opacity: 0.95,
      dashArray: "10, 8",
      lineCap: "round",
      lineJoin: "round",
      interactive: true
    });
    lineRapida.bindTooltip(`Ruta Más Rápida: ${resRapida.tiempoTotalMinutos} min (${resRapida.distanciaTotalKm} km)`, {
      sticky: true,
      direction: "top",
      className: "mini-tooltip-nodo"
    });
    lineRapida.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (typeof onAbrirComparativa === "function") onAbrirComparativa();
    });

    layerRutaActiva.addLayer(glowCorta);
    layerRutaActiva.addLayer(lineCorta);
    layerRutaActiva.addLayer(glowRapida);
    layerRutaActiva.addLayer(lineRapida);

    const groupBounds = L.featureGroup([lineCorta, lineRapida]).getBounds();
    mapInstance.fitBounds(groupBounds, {
      padding: [70, 70],
      maxZoom: 15,
      animate: true,
      duration: 0.8
    });

    try {
      const wpCorta = puntosCorta.map(([lat, lng]) => `${lng},${lat}`).join(";");
      const wpRapida = puntosRapida.map(([lat, lng]) => `${lng},${lat}`).join(";");

      const [resOSRM1, resOSRM2] = await Promise.all([
        fetch(`https://router.project-osrm.org/route/v1/driving/${wpCorta}?overview=full&geometries=geojson`).catch(() => null),
        fetch(`https://router.project-osrm.org/route/v1/driving/${wpRapida}?overview=full&geometries=geojson`).catch(() => null)
      ]);

      if (idSolicitud !== solicitudRutaActual) return;

      if (resOSRM1?.ok) {
        const d1 = await resOSRM1.json();
        if (d1.routes?.[0]?.geometry) {
          const geom1 = d1.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          glowCorta.setLatLngs(geom1);
          lineCorta.setLatLngs(geom1);
        }
      }

      if (resOSRM2?.ok) {
        const d2 = await resOSRM2.json();
        if (d2.routes?.[0]?.geometry) {
          const geom2 = d2.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          glowRapida.setLatLngs(geom2);
          lineRapida.setLatLngs(geom2);
        }
      }
    } catch (e) {
    }
  }

  function enfocarNodo(nodoId) {
    const marker = marcadoresNodos[nodoId];
    if (marker && mapInstance) {
      mapInstance.panTo(marker.getLatLng(), { animate: true, duration: 0.8 });
      marker.openTooltip();
    }
  }

  function cambiarCiudad(ciudad, grafo) {
    if (!mapInstance) return;
    layerRutaActiva.clearLayers();
    dibujarRedLogistica(grafo);
    renderizarMarcadores(grafo);
    mapInstance.flyTo(ciudad.centro, ciudad.zoom, {
      duration: 1.2
    });
  }

  return {
    inicializar,
    trazarRuta,
    trazarComparativa,
    enfocarNodo,
    cambiarCiudad,
    getMap: () => mapInstance
  };
})();

if (typeof window !== "undefined") {
  window.ModuloMapa = ModuloMapa;
}
