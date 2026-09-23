document.addEventListener("DOMContentLoaded", () => {
  const estrategiaCorta = new EstrategiaRutaMasCorta();
  const estrategiaRapida = new EstrategiaRutaMasRapida();
  const calculador = new CalculadorRutas(GrafoJoyeria, estrategiaCorta);

  const selectOrigen = document.getElementById("select-origen");
  const selectDestino = document.getElementById("select-destino");
  const radioCorta = document.getElementById("strat-corta");
  const radioRapida = document.getElementById("strat-rapida");
  const btnCalcular = document.getElementById("btn-calcular");
  const btnComparar = document.getElementById("btn-comparar");
  const themeToggleBtn = document.getElementById("theme-toggle");

  const listPasos = document.getElementById("route-steps-list");

  const modalComparativa = document.getElementById("modal-comparativa-estrategias");
  const comparativaTitulo = document.getElementById("comparativa-titulo");
  const comparativaTrayectoSub = document.getElementById("comparativa-trayecto-sub");
  const comparativaBodyContent = document.getElementById("comparativa-body-content");
  const comparativaBtnCerrarX = document.getElementById("comparativa-btn-cerrar-x");
  const comparativaBtnCerrar = document.getElementById("comparativa-btn-cerrar");

  const bannerComparativa = document.getElementById("map-comparison-banner");
  const resumenComparativa = document.getElementById("map-comparison-resumen");
  const btnReabrirComparativa = document.getElementById("btn-reabrir-comparativa");
  const btnCerrarBannerComparativa = document.getElementById("btn-cerrar-banner-comparativa");

  function refrescarIconos() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  function inicializarTema() {
    const root = document.documentElement;
    const preferedTheme = localStorage.getItem("nudo-de-oro-theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    aplicarTema(preferedTheme);

    themeToggleBtn.addEventListener("click", () => {
      const actual = root.getAttribute("data-theme") || "light";
      const nuevo = actual === "dark" ? "light" : "dark";
      aplicarTema(nuevo);
    });
  }

  function aplicarTema(tema) {
    const root = document.documentElement;
    root.setAttribute("data-theme", tema);
    localStorage.setItem("nudo-de-oro-theme", tema);

    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = tema === "dark" 
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';
      themeToggleBtn.setAttribute("aria-label", tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      refrescarIconos();
    }
  }

  const btnInvertir = document.getElementById("btn-invertir");

  ModuloMapa.inicializar("map", GrafoJoyeria);

  function obtenerNodosCiudad() {
    return Object.values(GrafoJoyeria.nodos);
  }

  function crearOptionNodo(nodo) {
    const tipoLabel = nodo.tipo.charAt(0).toUpperCase() + nodo.tipo.slice(1);
    const opt = document.createElement("option");
    opt.value = nodo.id;
    opt.textContent = `${nodo.nombre} [${tipoLabel}]`;
    return opt;
  }

  function actualizarOpcionesDestino(origenExcluido) {
    const valorPrevio = selectDestino.value;
    selectDestino.innerHTML = "";

    const nodosCiudad = obtenerNodosCiudad();
    const disponibles = nodosCiudad.filter(n => n.id !== origenExcluido);
    disponibles.forEach(nodo => {
      selectDestino.appendChild(crearOptionNodo(nodo));
    });

    if (valorPrevio && valorPrevio !== origenExcluido && disponibles.some(n => n.id === valorPrevio)) {
      selectDestino.value = valorPrevio;
    } else if (disponibles.length > 0) {
      selectDestino.value = disponibles[0].id;
    }
  }

  function actualizarOpcionesOrigen(destinoExcluido) {
    const valorPrevio = selectOrigen.value;
    selectOrigen.innerHTML = "";

    const nodosCiudad = obtenerNodosCiudad();
    const disponibles = nodosCiudad.filter(n => n.id !== destinoExcluido);
    disponibles.forEach(nodo => {
      selectOrigen.appendChild(crearOptionNodo(nodo));
    });

    if (valorPrevio && valorPrevio !== destinoExcluido && disponibles.some(n => n.id === valorPrevio)) {
      selectOrigen.value = valorPrevio;
    } else if (disponibles.length > 0) {
      selectOrigen.value = disponibles[0].id;
    }
  }

  const cityButtons = document.querySelectorAll(".btn-city-pill");

  const RUTAS_POR_DEFECTO = {
    BOGOTA: { origen: "TALLER_CENTRAL", destino: "CLI_USAQUEN" },
    MEDELLIN: { origen: "MED_TALLER", destino: "MED_CLI_LLANOGRANDE" },
    BUCARAMANGA: { origen: "BUC_TALLER", destino: "BUC_CLI_RUITOQUE" }
  };

  function inicializarSelectores(origenCustom, destinoCustom) {
    const ciudadId = GrafoJoyeria.ciudadActivaId;
    const def = RUTAS_POR_DEFECTO[ciudadId] || {
      origen: Object.keys(GrafoJoyeria.nodos)[0],
      destino: Object.keys(GrafoJoyeria.nodos)[1]
    };

    const origenInicial = origenCustom || def.origen;
    const destinoInicial = destinoCustom || def.destino;

    actualizarOpcionesOrigen(destinoInicial);
    selectOrigen.value = origenInicial;

    actualizarOpcionesDestino(origenInicial);
    selectDestino.value = destinoInicial;
  }

  cityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const cityId = btn.getAttribute("data-city-id");
      if (!cityId || cityId === GrafoJoyeria.ciudadActivaId) return;

      cityButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const nuevaCiudad = GrafoJoyeria.setCiudadActiva(cityId);
      ModuloMapa.cambiarCiudad(nuevaCiudad, GrafoJoyeria);

      const def = RUTAS_POR_DEFECTO[cityId] || {
        origen: Object.keys(GrafoJoyeria.nodos)[0],
        destino: Object.keys(GrafoJoyeria.nodos)[1]
      };

      inicializarSelectores(def.origen, def.destino);
      ejecutarNavegacion();
    });
  });

  inicializarSelectores();
  inicializarTema();

  const modalElement = document.getElementById("modal-notificacion");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalMensaje = document.getElementById("modal-mensaje");
  const modalKicker = document.getElementById("modal-kicker");
  const modalBtnCerrarX = document.getElementById("modal-btn-cerrar-x");
  const modalBtnAceptar = document.getElementById("modal-btn-aceptar");
  const modalIconBadge = document.getElementById("modal-icon-badge");

  function mostrarModal({ titulo, mensaje, kicker = "Aviso de Operación", tipo = "alerta" }) {
    if (!modalElement) return;

    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    modalKicker.textContent = kicker;

    let iconName = "alert-circle";
    if (tipo === "alerta") iconName = "alert-triangle";
    if (tipo === "info") iconName = "info";
    if (tipo === "exito") iconName = "check-circle-2";

    modalIconBadge.innerHTML = `<i data-lucide="${iconName}"></i>`;
    refrescarIconos();

    modalElement.classList.add("active");
    modalElement.setAttribute("aria-hidden", "false");
    modalBtnAceptar.focus();
  }

  function cerrarModal() {
    if (!modalElement) return;
    modalElement.classList.remove("active");
    modalElement.setAttribute("aria-hidden", "true");
  }

  modalBtnCerrarX?.addEventListener("click", cerrarModal);
  modalBtnAceptar?.addEventListener("click", cerrarModal);

  modalElement?.addEventListener("click", (e) => {
    if (e.target === modalElement) {
      cerrarModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalElement?.classList.contains("active")) {
      cerrarModal();
    }
  });

  function sincronizarEstrategiaContexto() {
    if (radioRapida.checked) {
      calculador.setEstrategia(estrategiaRapida);
    } else {
      calculador.setEstrategia(estrategiaCorta);
    }
  }

  function ejecutarNavegacion() {
    const origenId = selectOrigen.value;
    const destinoId = selectDestino.value;

    if (!origenId || !destinoId) {
      mostrarModal({
        kicker: "Validación de Ruta",
        titulo: "Puntos Incompletos",
        mensaje: "Por favor seleccione tanto el punto de origen como el punto de destino para trazar el despacho.",
        tipo: "alerta"
      });
      return;
    }

    if (origenId === destinoId) {
      mostrarModal({
        kicker: "Logística Nudo de Oro",
        titulo: "Misma Sede Seleccionada",
        mensaje: "El origen y el destino son la misma sede. Seleccione puntos diferentes para calcular la ruta.",
        tipo: "alerta"
      });
      return;
    }

    sincronizarEstrategiaContexto();

    const resultado = calculador.ejecutarCalculo(origenId, destinoId);
    ultimoResultadoRuta = resultado;

    if (bannerComparativa) bannerComparativa.style.display = "none";

    renderizarItinerario(resultado);
    ModuloMapa.trazarRuta(resultado);

    refrescarIconos();
  }

  let ultimoResultadoRuta = null;

  const modalInforme = document.getElementById("modal-informe-ruta");
  const btnAbrirInforme = document.getElementById("btn-abrir-informe");
  const informeBtnCerrarX = document.getElementById("informe-btn-cerrar-x");
  const informeBtnCerrar = document.getElementById("informe-btn-cerrar");
  const informeTrayectoSub = document.getElementById("informe-trayecto-sub");
  const informeJustificacionTexto = document.getElementById("informe-justificacion-texto");
  const informeViasContainer = document.getElementById("informe-vias-container");
  const informeMetricDistancia = document.getElementById("informe-metric-distancia");
  const informeMetricTiempo = document.getElementById("informe-metric-tiempo");
  const informeMetricLatencia = document.getElementById("informe-metric-latencia");
  const informeItinerarioList = document.getElementById("informe-itinerario-list");

  function abrirModalInformeRuta() {
    if (!ultimoResultadoRuta || !ultimoResultadoRuta.rutaIds || ultimoResultadoRuta.rutaIds.length === 0) {
      mostrarModal({
        kicker: "Aviso de Operación",
        titulo: "Ruta No Calculada",
        mensaje: "Calcule una ruta entre dos sedes antes de solicitar el informe técnico.",
        tipo: "info"
      });
      return;
    }

    const res = ultimoResultadoRuta;
    const ciudadActual = GrafoJoyeria.getCiudadActiva().nombre;
    const esCorta = res.estrategia.includes("Corta");

    informeTrayectoSub.innerHTML = `<strong>${res.origenNombre}</strong> &rarr; <strong>${res.destinoNombre}</strong> &bull; <span style="color: ${esCorta ? 'var(--color-primary)' : '#2563eb'}">${res.estrategia}</span> (${ciudadActual})`;
    informeMetricDistancia.textContent = `${res.distanciaTotalKm} km`;
    informeMetricTiempo.textContent = `${res.tiempoTotalMinutos} min`;
    informeMetricLatencia.textContent = `${res.tiempoProcesamientoMs} ms`;

    if (esCorta) {
      informeJustificacionTexto.innerHTML = `
        <p style="margin-bottom: 0.5rem;">
          <strong>Criterio de Optimización:</strong> El algoritmo Dijkstra evaluó todas las combinaciones viales del grafo de <em>${ciudadActual}</em> priorizando estrictamente la <strong>menor distancia física acumulada (${res.distanciaTotalKm} km)</strong>.
        </p>
        <p style="margin-bottom: 0.5rem;">
          <strong>¿Por qué se descartaron otras alternativas?</strong> Aunque corredores periféricos ofrecen mayor velocidad promedio, implican rodeos de mayor kilometraje. Esta estrategia descarta desvíos innecesarios para <strong>reducir al mínimo el consumo de combustible, la huella kilométrica de la flota y el costo operativo por kilómetro recorrido</strong>.
        </p>
        <p style="margin: 0; color: var(--color-primary); font-weight: 700;">
          Resultado: Es la trayectoria geográficamente más directa entre la sede de salida y el punto de entrega.
        </p>
      `;
    } else {
      informeJustificacionTexto.innerHTML = `
        <p style="margin-bottom: 0.5rem;">
          <strong>Criterio de Optimización:</strong> El algoritmo Dijkstra evaluó las alternativas viales priorizando la <strong>mínima exposición temporal con tráfico (${res.tiempoTotalMinutos} min)</strong> en <em>${ciudadActual}</em>.
        </p>
        <p style="margin-bottom: 0.5rem;">
          <strong>¿Por qué se descartaron otras alternativas?</strong> A pesar de existir trayectorias con menor distancia física en kilómetros, el sistema descartó vías céntricas saturadas debido a su <strong>alta densidad semafórica, paradas forzadas y riesgo crítico de embotellamientos</strong>. El vehículo es canalizado por vías arteriales fluidas y corredores rápidos.
        </p>
        <p style="margin: 0; color: #2563eb; font-weight: 700;">
          Resultado: Máxima seguridad logística para joyas de alto valor minimizando el tiempo de permanencia en el espacio público.
        </p>
      `;
    }

    informeViasContainer.innerHTML = "";
    for (let i = 0; i < res.rutaIds.length - 1; i++) {
      const u = res.rutaIds[i];
      const v = res.rutaIds[i + 1];
      const nodoU = GrafoJoyeria.nodos[u];
      const nodoV = GrafoJoyeria.nodos[v];
      const arista = GrafoJoyeria.obtenerArista(u, v);

      const tramoDiv = document.createElement("div");
      tramoDiv.className = "informe-tramo-card";
      tramoDiv.innerHTML = `
        <div class="informe-tramo-header">
          <span>Tramo ${i + 1}: ${nodoU.nombre} &harr; ${nodoV.nombre}</span>
          <span class="tramo-metricas">${arista ? arista.distanciaKm : 0} km &bull; ${arista ? arista.tiempoMinutos : 0} min</span>
        </div>
        <div class="informe-tramo-detail">
          <i data-lucide="compass"></i>
          <span><strong>Vía Principal:</strong> ${arista?.via || 'Corredor vial urbano primario'}</span>
        </div>
        <div class="informe-tramo-detail">
          <i data-lucide="git-commit"></i>
          <span><strong>Cruce / Intersección:</strong> ${arista?.cruce || 'Intersección con flujo semaforizado'}</span>
        </div>
        <div class="informe-tramo-detail">
          <i data-lucide="landmark"></i>
          <span><strong>Hitos Urbanos:</strong> ${arista?.hitos || 'Zona de alta seguridad y comercio joyero'}</span>
        </div>
      `;
      informeViasContainer.appendChild(tramoDiv);
    }

    informeItinerarioList.innerHTML = "";
    res.rutaIds.forEach((nodoId, idx) => {
      const nodo = GrafoJoyeria.nodos[nodoId];
      const li = document.createElement("li");
      li.className = "route-step-item";
      let iconName = "map-pin";
      if (nodo.tipo === "taller") iconName = "gem";
      if (nodo.tipo === "proveedor") iconName = "landmark";
      if (nodo.tipo === "sucursal") iconName = "store";
      if (nodo.tipo === "cliente") iconName = "user-check";

      li.innerHTML = `
        <span class="step-num">${idx + 1}</span>
        <i data-lucide="${iconName}" class="step-icon"></i>
        <div style="display: flex; flex-direction: column;">
          <span class="step-name">${nodo.nombre}</span>
          <span style="font-size: 0.7rem; color: var(--color-text-muted);">${nodo.categoria} &bull; ${nodo.descripcion}</span>
        </div>
      `;
      informeItinerarioList.appendChild(li);
    });

    modalInforme.classList.add("active");
    modalInforme.setAttribute("aria-hidden", "false");
    refrescarIconos();
  }

  function cerrarModalInforme() {
    if (!modalInforme) return;
    modalInforme.classList.remove("active");
    modalInforme.setAttribute("aria-hidden", "true");
  }

  btnAbrirInforme?.addEventListener("click", abrirModalInformeRuta);
  informeBtnCerrarX?.addEventListener("click", cerrarModalInforme);
  informeBtnCerrar?.addEventListener("click", cerrarModalInforme);

  modalInforme?.addEventListener("click", (e) => {
    if (e.target === modalInforme) {
      cerrarModalInforme();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalInforme?.classList.contains("active")) {
      cerrarModalInforme();
    }
  });

  window.abrirModalInformeRuta = abrirModalInformeRuta;

  function renderizarItinerario(resultado) {
    listPasos.innerHTML = "";

    if (!resultado.rutaIds || resultado.rutaIds.length === 0) {
      listPasos.innerHTML = `
        <li class="route-step-item" style="color: var(--color-text-faint);">
          No se encontró una ruta vial conectada entre los puntos seleccionados.
        </li>
      `;
      return;
    }

    resultado.rutaIds.forEach((nodoId, index) => {
      const nodo = GrafoJoyeria.nodos[nodoId];
      const li = document.createElement("li");
      li.className = "route-step-item";
      li.title = "Haz clic para centrar en el mapa";

      let iconName = "map-pin";
      if (nodo.tipo === "taller") iconName = "gem";
      if (nodo.tipo === "proveedor") iconName = "landmark";
      if (nodo.tipo === "sucursal") iconName = "store";
      if (nodo.tipo === "cliente") iconName = "user-check";

      li.innerHTML = `
        <span class="step-num">${index + 1}</span>
        <i data-lucide="${iconName}" class="step-icon"></i>
        <span class="step-name">${nodo.nombre}</span>
      `;

      li.addEventListener("click", () => {
        ModuloMapa.enfocarNodo(nodoId);
      });

      listPasos.appendChild(li);
    });

    refrescarIconos();
  }

  function abrirModalComparativa() {
    if (!modalComparativa) return;
    modalComparativa.classList.add("active");
    modalComparativa.setAttribute("aria-hidden", "false");
  }

  function cerrarModalComparativa() {
    if (!modalComparativa) return;
    modalComparativa.classList.remove("active");
    modalComparativa.setAttribute("aria-hidden", "true");
  }

  comparativaBtnCerrarX?.addEventListener("click", cerrarModalComparativa);
  comparativaBtnCerrar?.addEventListener("click", cerrarModalComparativa);

  modalComparativa?.addEventListener("click", (e) => {
    if (e.target === modalComparativa) {
      cerrarModalComparativa();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalComparativa?.classList.contains("active")) {
      cerrarModalComparativa();
    }
  });

  function compararEstrategias() {
    const origenId = selectOrigen.value;
    const destinoId = selectDestino.value;

    if (!origenId || !destinoId) {
      mostrarModal({
        kicker: "Comparativa GoF",
        titulo: "Puntos Incompletos",
        mensaje: "Por favor seleccione el punto de origen y el punto de destino para comparar las dos estrategias de navegación.",
        tipo: "alerta"
      });
      return;
    }

    if (origenId === destinoId) {
      mostrarModal({
        kicker: "Comparativa GoF",
        titulo: "Sedes Duplicadas",
        mensaje: "Seleccione dos puntos distintos para realizar la comparación entre la ruta más corta y la más rápida.",
        tipo: "alerta"
      });
      return;
    }

    calculador.setEstrategia(estrategiaCorta);
    const resCorta = calculador.ejecutarCalculo(origenId, destinoId);

    calculador.setEstrategia(estrategiaRapida);
    const resRapida = calculador.ejecutarCalculo(origenId, destinoId);

    sincronizarEstrategiaContexto();

    const ciudadActual = GrafoJoyeria.getCiudadActiva().nombre;
    comparativaTrayectoSub.innerHTML = `<strong>${resCorta.origenNombre}</strong> &rarr; <strong>${resCorta.destinoNombre}</strong> &bull; Red Vial de ${ciudadActual}`;

    function obtenerViasRuta(rutaIds) {
      const nombresVias = [];
      for (let i = 0; i < rutaIds.length - 1; i++) {
        const arista = GrafoJoyeria.obtenerArista(rutaIds[i], rutaIds[i + 1]);
        if (arista && arista.via && !nombresVias.includes(arista.via)) {
          nombresVias.push(arista.via);
        }
      }
      return nombresVias.length > 0 ? nombresVias.join(" &bull; ") : "Corredores viales principales";
    }

    const sonIguales = resCorta.rutaIds.join("->") === resRapida.rutaIds.join("->");

    ModuloMapa.trazarComparativa(resCorta, resRapida, abrirModalComparativa);

    if (bannerComparativa && resumenComparativa) {
      if (sonIguales) {
        resumenComparativa.innerHTML = `Rutas Idénticas: Coinciden en <strong>${resCorta.distanciaTotalKm} km</strong> y <strong>${resCorta.tiempoTotalMinutos} min</strong>`;
      } else {
        resumenComparativa.innerHTML = `Ruta Más Corta: <strong>${resCorta.distanciaTotalKm} km</strong> (${resCorta.tiempoTotalMinutos} min) &bull; Ruta Más Rápida: <strong>${resRapida.tiempoTotalMinutos} min</strong> (${resRapida.distanciaTotalKm} km)`;
      }
      bannerComparativa.style.display = "flex";
    }

    if (sonIguales) {
      const viasComunes = obtenerViasRuta(resCorta.rutaIds);
      const nombresNodos = resCorta.rutaIds.map(id => GrafoJoyeria.nodos[id].nombre).join(" &rarr; ");

      comparativaBodyContent.innerHTML = `
        <div class="comparativa-misma-ruta-box">
          <div class="comparativa-misma-ruta-header">
            <i data-lucide="check-check"></i>
            <span>Coincidencia Total: Ambas Estrategias Convergen en la Misma Ruta</span>
          </div>
          <p class="comparativa-misma-ruta-text">
            Para el trayecto seleccionado entre <strong>${resCorta.origenNombre}</strong> y <strong>${resCorta.destinoNombre}</strong>, la trayectoria con <strong>menor distancia física (${resCorta.distanciaTotalKm} km)</strong> es simultáneamente el <strong>corredor más rápido (${resCorta.tiempoTotalMinutos} min)</strong>.
          </p>
          <p class="comparativa-misma-ruta-text" style="color: var(--color-text-muted); font-size: 0.82rem; margin-top: -0.2rem;">
            <strong>Fundamento Arquitectónico (GoF):</strong> Tanto <code>EstrategiaRutaMasCorta</code> (función de costo = distancia) como <code>EstrategiaRutaMasRapida</code> (función de costo = tiempo) encontraron el mismo camino óptimo global en el grafo vial de <em>${ciudadActual}</em>. Esto ocurre porque este corredor vial representa la única arteria directa eficiente, de modo que no existen desvíos periféricos que ganen velocidad ni atajos que ahorren distancia sin colapsar el tiempo.
          </p>
        </div>

        <div class="comparativa-card card-corta" style="margin-top: 0.2rem;">
          <div class="comparativa-card-header">
            <h4 class="comparativa-card-title">
              <i data-lucide="award"></i>
              Ruta Óptima Unificada
            </h4>
            <span class="comparativa-badge badge-gold">Óptima en Distancia y Velocidad</span>
          </div>

          <div class="comparativa-metrics-row" style="grid-template-columns: repeat(4, 1fr);">
            <div class="comparativa-metric-item">
              <span class="comparativa-metric-label">Distancia Total</span>
              <span class="comparativa-metric-val highlight-gold">${resCorta.distanciaTotalKm} km</span>
            </div>
            <div class="comparativa-metric-item">
              <span class="comparativa-metric-label">Tiempo Estimado</span>
              <span class="comparativa-metric-val highlight-gold">${resCorta.tiempoTotalMinutos} min</span>
            </div>
            <div class="comparativa-metric-item">
              <span class="comparativa-metric-label">Puntos / Sedes</span>
              <span class="comparativa-metric-val">${resCorta.cantidadNodos}</span>
            </div>
            <div class="comparativa-metric-item">
              <span class="comparativa-metric-label">Latencia Dijkstra</span>
              <span class="comparativa-metric-val" style="font-size: 1.05rem;">${resCorta.tiempoProcesamientoMs} ms</span>
            </div>
          </div>

          <div class="comparativa-route-preview">
            <p style="margin: 0 0 0.4rem 0;"><strong>Itinerario:</strong> ${nombresNodos}</p>
            <p style="margin: 0; color: var(--color-primary);"><strong>Vías Recorridas:</strong> ${viasComunes}</p>
          </div>

          <button id="btn-trazar-unificada" class="btn btn-primary btn-sm" type="button">
            <i data-lucide="navigation"></i>
            Trazar Esta Ruta en el Mapa
          </button>
        </div>
      `;

      document.getElementById("btn-trazar-unificada")?.addEventListener("click", () => {
        cerrarModalComparativa();
        ejecutarNavegacion();
      });

    } else {
      const viasCorta = obtenerViasRuta(resCorta.rutaIds);
      const viasRapida = obtenerViasRuta(resRapida.rutaIds);
      const nombresCorta = resCorta.rutaIds.map(id => GrafoJoyeria.nodos[id].nombre).join(" &rarr; ");
      const nombresRapida = resRapida.rutaIds.map(id => GrafoJoyeria.nodos[id].nombre).join(" &rarr; ");

      const diffKm = (resRapida.distanciaTotalKm - resCorta.distanciaTotalKm).toFixed(1);
      const ahorroMin = (resCorta.tiempoTotalMinutos - resRapida.tiempoTotalMinutos).toFixed(1);
      const pctTiempo = Math.max(1, Math.round((ahorroMin / resCorta.tiempoTotalMinutos) * 100));
      const pctDist = Math.max(1, Math.round((diffKm / resCorta.distanciaTotalKm) * 100));

      comparativaBodyContent.innerHTML = `
        <div class="comparativa-grid">
          
          <div class="comparativa-card card-corta">
            <div class="comparativa-card-header">
              <h4 class="comparativa-card-title">
                <i data-lucide="ruler"></i>
                Ruta Más Corta
              </h4>
              <span class="comparativa-badge badge-gold">Menor Distancia Física</span>
            </div>

            <div class="comparativa-metrics-row">
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Distancia</span>
                <span class="comparativa-metric-val highlight-gold">${resCorta.distanciaTotalKm} km</span>
              </div>
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Tiempo</span>
                <span class="comparativa-metric-val">${resCorta.tiempoTotalMinutos} min</span>
              </div>
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Puntos / Paradas</span>
                <span class="comparativa-metric-val">${resCorta.cantidadNodos}</span>
              </div>
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Cómputo Algorítmico</span>
                <span class="comparativa-metric-val" style="font-size: 1.05rem;">${resCorta.tiempoProcesamientoMs} ms</span>
              </div>
            </div>

            <div class="comparativa-route-preview">
              <p style="margin: 0 0 0.35rem 0;"><strong>Itinerario:</strong> ${nombresCorta}</p>
              <p style="margin: 0; color: var(--color-primary);"><strong>Vías:</strong> ${viasCorta}</p>
            </div>

            <button id="btn-aplicar-corta" class="btn btn-secondary btn-sm" type="button">
              <i data-lucide="check"></i>
              Seleccionar y Ver en Mapa
            </button>
          </div>

          <div class="comparativa-card card-rapida">
            <div class="comparativa-card-header">
              <h4 class="comparativa-card-title">
                <i data-lucide="clock"></i>
                Ruta Más Rápida
              </h4>
              <span class="comparativa-badge badge-blue">Menor Tiempo / Tráfico</span>
            </div>

            <div class="comparativa-metrics-row">
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Distancia</span>
                <span class="comparativa-metric-val">${resRapida.distanciaTotalKm} km</span>
              </div>
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Tiempo</span>
                <span class="comparativa-metric-val highlight-blue">${resRapida.tiempoTotalMinutos} min</span>
              </div>
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Puntos / Paradas</span>
                <span class="comparativa-metric-val">${resRapida.cantidadNodos}</span>
              </div>
              <div class="comparativa-metric-item">
                <span class="comparativa-metric-label">Cómputo Algorítmico</span>
                <span class="comparativa-metric-val" style="font-size: 1.05rem;">${resRapida.tiempoProcesamientoMs} ms</span>
              </div>
            </div>

            <div class="comparativa-route-preview">
              <p style="margin: 0 0 0.35rem 0;"><strong>Itinerario:</strong> ${nombresRapida}</p>
              <p style="margin: 0; color: #2563eb;"><strong>Vías:</strong> ${viasRapida}</p>
            </div>

            <button id="btn-aplicar-rapida" class="btn btn-secondary btn-sm" type="button">
              <i data-lucide="check"></i>
              Seleccionar y Ver en Mapa
            </button>
          </div>

        </div>

        <div class="comparativa-balance-card">
          <div class="comparativa-balance-header">
            <i data-lucide="scale"></i>
            <span>Balance de Compensación y Recomendación Logística</span>
          </div>
          <p class="comparativa-balance-text">
            <strong>Diferencial Operativo:</strong> Al seleccionar la <strong>Ruta Más Rápida</strong>, la unidad de despacho ahorra <strong>${ahorroMin} minutos (${pctTiempo}% menos tiempo)</strong>, asumiendo un sobre-recorrido de <strong>+${diffKm} km adicionales (+${pctDist}%)</strong> al utilizar corredores arteriales y vías de flujo ágil.
          </p>
          <p class="comparativa-balance-text" style="color: var(--color-text-muted);">
            <strong>Criterio Logístico Joyería Nudo de Oro:</strong> Para cargamentos de alta cuantía (oro, gemas preciosas, alta joyería), se recomienda priorizar la <strong>Ruta Más Rápida</strong> para minimizar la exposición en vía pública y evitar semáforos céntricos propensos a asaltos. En traslados de bajo riesgo o insumos de taller, la <strong>Ruta Más Corta</strong> optimiza el combustible y el kilometraje de la flota.
          </p>
        </div>
      `;

      document.getElementById("btn-aplicar-corta")?.addEventListener("click", () => {
        radioCorta.checked = true;
        cerrarModalComparativa();
        ejecutarNavegacion();
      });

      document.getElementById("btn-aplicar-rapida")?.addEventListener("click", () => {
        radioRapida.checked = true;
        cerrarModalComparativa();
        ejecutarNavegacion();
      });
    }

    abrirModalComparativa();
    refrescarIconos();
  }

  btnReabrirComparativa?.addEventListener("click", abrirModalComparativa);
  btnCerrarBannerComparativa?.addEventListener("click", () => {
    if (bannerComparativa) bannerComparativa.style.display = "none";
    ejecutarNavegacion();
  });

  btnCalcular.addEventListener("click", ejecutarNavegacion);
  btnComparar.addEventListener("click", compararEstrategias);

  radioCorta.addEventListener("change", ejecutarNavegacion);
  radioRapida.addEventListener("change", ejecutarNavegacion);

  selectOrigen.addEventListener("change", () => {
    actualizarOpcionesDestino(selectOrigen.value);
    ejecutarNavegacion();
  });

  selectDestino.addEventListener("change", () => {
    actualizarOpcionesOrigen(selectDestino.value);
    ejecutarNavegacion();
  });

  btnInvertir?.addEventListener("click", () => {
    const origenActual = selectOrigen.value;
    const destinoActual = selectDestino.value;

    if (!origenActual || !destinoActual) return;

    actualizarOpcionesOrigen(origenActual);
    selectOrigen.value = destinoActual;

    actualizarOpcionesDestino(destinoActual);
    selectDestino.value = origenActual;

    ejecutarNavegacion();
  });

  setTimeout(() => {
    ejecutarNavegacion();
    refrescarIconos();
  }, 200);
});
