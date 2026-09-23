/**
 * MÓDULO DE DATOS: GRAFO GEOESPACIAL MULTICIUDAD EN MEMORIA
 * Joyería Nudo de Oro - Red Logística Nacional
 * 
 * Cobertura en:
 * 1. BOGOTÁ D.C. (Red expandida con cobertura ampliada en múltiples zonas urbanas)
 * 2. MEDELLÍN (Valle de Aburrá y Oriente cercano)
 * 3. BUCARAMANGA (Área Metropolitana y Meseta)
 * 
 * Cada arista cuenta con doble ponderación:
 * - distanciaKm: Longitud física de la vía.
 * - tiempoMinutos: Duración estimada con tráfico vehicular y factores de seguridad.
 */

const GrafoJoyeria = {
  ciudadActivaId: "BOGOTA",

  ciudades: {
    // =========================================================================
    // 1. CIUDAD: BOGOTÁ D.C. (Red Expandida con Cobertura Metropolitana)
    // =========================================================================
    "BOGOTA": {
      id: "BOGOTA",
      nombre: "Bogotá D.C.",
      centro: [4.6520, -74.0650],
      zoom: 12,
      nodos: {
        "TALLER_CENTRAL": {
          id: "TALLER_CENTRAL",
          nombre: "Taller Central Nudo de Oro",
          tipo: "taller",
          categoria: "Sede Principal de Fundición y Orfebrería",
          lat: 4.5981,
          lng: -74.0758,
          descripcion: "Bóveda principal y taller de alta orfebrería (La Candelaria)."
        },
        "PROV_CENTRO": {
          id: "PROV_CENTRO",
          nombre: "Proveedor Centro Oro",
          tipo: "proveedor",
          categoria: "Distribuidor Mayorista de Metales y Gemas",
          lat: 4.6015,
          lng: -74.0722,
          descripcion: "Suministro de oro de 18k y esmeraldas (Plaza del Rosario)."
        },
        "PROV_ESMERALDAS": {
          id: "PROV_ESMERALDAS",
          nombre: "Proveedor Gemas del Eje",
          tipo: "proveedor",
          categoria: "Bolsa de Esmeraldas y Piedras Preciosas",
          lat: 4.6042,
          lng: -74.0710,
          descripcion: "Tallado y certificación gemológica internacional."
        },
        "SUC_GALERIAS": {
          id: "SUC_GALERIAS",
          nombre: "Sucursal Galerías",
          tipo: "sucursal",
          categoria: "Boutique y Taller de Engaste Rápido",
          lat: 4.6419,
          lng: -74.0735,
          descripcion: "Punto de venta y atención al cliente (Teusaquillo)."
        },
        "SUC_GRAN_ESTACION": {
          id: "SUC_GRAN_ESTACION",
          nombre: "Sucursal Gran Estación",
          tipo: "sucursal",
          categoria: "Boutique Centro Comercial Salitre",
          lat: 4.6485,
          lng: -74.1030,
          descripcion: "Isla de joyas de alta gama y recolección rápida."
        },
        "CLI_CHAPINERO": {
          id: "CLI_CHAPINERO",
          nombre: "Cliente VIP Chapinero",
          tipo: "cliente",
          categoria: "Cliente Corporativo Zona Financiera",
          lat: 4.6542,
          lng: -74.0560,
          descripcion: "Despacho programado de argollas y collares de diamantes."
        },
        "CLI_ROSALES": {
          id: "CLI_ROSALES",
          nombre: "Cliente Rosales Alto",
          tipo: "cliente",
          categoria: "Residencia Exclusiva Cerros",
          lat: 4.6490,
          lng: -74.0515,
          descripcion: "Entrega privada bajo custodia de piezas exclusivas."
        },
        "CLI_PARQUE93": {
          id: "CLI_PARQUE93",
          nombre: "Cliente Parque de la 93",
          tipo: "cliente",
          categoria: "Coleccionista Privado Chicó",
          lat: 4.6766,
          lng: -74.0483,
          descripcion: "Entrega bajo custodia blindada de esmeraldas colombianas."
        },
        "CLI_SANTA_ANA": {
          id: "CLI_SANTA_ANA",
          nombre: "Cliente Santa Ana Exclusive",
          tipo: "cliente",
          categoria: "Club Privado y Joyería de Autor",
          lat: 4.6880,
          lng: -74.0375,
          descripcion: "Despacho de dijes y pulseras en hilo con balines 18k."
        },
        "CLI_USAQUEN": {
          id: "CLI_USAQUEN",
          nombre: "Cliente Boutique Usaquén",
          tipo: "cliente",
          categoria: "Galería de Arte y Joyería Contemporánea",
          lat: 4.6978,
          lng: -74.0315,
          descripcion: "Exhibición especial de piezas de autor."
        },
        "CLI_UNICENTRO": {
          id: "CLI_UNICENTRO",
          nombre: "Cliente Unicentro Norte",
          tipo: "cliente",
          categoria: "Local Joyero Multimarca",
          lat: 4.7015,
          lng: -74.0410,
          descripcion: "Recepción de pedidos de temporada de alta orfebrería."
        },
        "CLI_CEDRITOS": {
          id: "CLI_CEDRITOS",
          nombre: "Cliente Cedritos Boutique",
          tipo: "cliente",
          categoria: "Comprador Frecuente Oro Laminado y 18k",
          lat: 4.7240,
          lng: -74.0320,
          descripcion: "Entrega directa de referencias tejidas a mano."
        },
        "CLI_COLINA": {
          id: "CLI_COLINA",
          nombre: "Cliente Colina Campestre",
          tipo: "cliente",
          categoria: "Residencia Campestre Suba",
          lat: 4.7290,
          lng: -74.0670,
          descripcion: "Despacho de joyas nupciales y anillos de compromiso."
        },
        "CLI_SUBA_CENTRO": {
          id: "CLI_SUBA_CENTRO",
          nombre: "Cliente Plaza Suba",
          tipo: "cliente",
          categoria: "Distribuidor Minorista Local",
          lat: 4.7435,
          lng: -74.0850,
          descripcion: "Entrega de pulseras ajustables y dijes variados."
        },
        "CLI_SALITRE": {
          id: "CLI_SALITRE",
          nombre: "Cliente Salitre Plaza",
          tipo: "cliente",
          categoria: "Centro Comercial de Lujo",
          lat: 4.6534,
          lng: -74.1105,
          descripcion: "Entrega de lotes para joyería de centro comercial."
        },
        "CLI_MODELIA": {
          id: "CLI_MODELIA",
          nombre: "Cliente Modelia Occidental",
          tipo: "cliente",
          categoria: "Residencia de Diseñador de Joyas",
          lat: 4.6620,
          lng: -74.1240,
          descripcion: "Recepción de insumos y piezas fundidas."
        },
        "CLI_KENNEDY": {
          id: "CLI_KENNEDY",
          nombre: "Cliente Kennedy Central",
          tipo: "cliente",
          categoria: "Boutique Comercial Sur-Occidente",
          lat: 4.6280,
          lng: -74.1530,
          descripcion: "Punto de entrega comercial de piezas de catálogo."
        },
        "CLI_STA_BARBARA": {
          id: "CLI_STA_BARBARA",
          nombre: "Cliente Santa Bárbara",
          tipo: "cliente",
          categoria: "Residencia Exclusiva",
          lat: 4.6931,
          lng: -74.0422,
          descripcion: "Despacho privado de piezas personalizadas."
        }
      },
      conexiones: [
        { origen: "TALLER_CENTRAL", destino: "PROV_CENTRO", distanciaKm: 1.2, tiempoMinutos: 8, via: "Carrera 7ma y Eje Ambiental", cruce: "Cra 7ma con Calle 12", hitos: "Plaza de Bolívar y Pasaje del Rosario" },
        { origen: "PROV_CENTRO", destino: "PROV_ESMERALDAS", distanciaKm: 0.8, tiempoMinutos: 5, via: "Av. Jiménez (Eje Ambiental)", cruce: "Av. Jiménez con Cra 6ta", hitos: "Bolsa de Esmeraldas y Museo del Oro" },
        { origen: "TALLER_CENTRAL", destino: "SUC_GALERIAS", distanciaKm: 5.4, tiempoMinutos: 22, via: "Carrera 10ma y Calle 53", cruce: "Calle 53 con Cra 24", hitos: "Parque Teusaquillo y Galerías" },
        { origen: "TALLER_CENTRAL", destino: "SUC_GRAN_ESTACION", distanciaKm: 6.8, tiempoMinutos: 17, via: "Av. Calle 26 (El Dorado)", cruce: "Calle 26 con Cra 66", hitos: "Corredor Aeropuerto y Gran Estación" },
        { origen: "TALLER_CENTRAL", destino: "CLI_SALITRE", distanciaKm: 7.8, tiempoMinutos: 18, via: "Av. Calle 26 y Av. La Esperanza", cruce: "Av. Esperanza con Cra 68", hitos: "Terminal Salitre y Centro Comercial Salitre Plaza" },
        { origen: "PROV_CENTRO", destino: "CLI_CHAPINERO", distanciaKm: 6.2, tiempoMinutos: 34, via: "Carrera 7ma Norte", cruce: "Cra 7ma con Calle 67", hitos: "Parque de los Hippies y Zona G (Congestión céntrica severa)" },
        { origen: "PROV_ESMERALDAS", destino: "CLI_ROSALES", distanciaKm: 5.9, tiempoMinutos: 28, via: "Circunvalar y Calle 72", cruce: "Circunvalar con Calle 72", hitos: "Quebrada La Vieja y Cerros Orientales" },
        { origen: "SUC_GALERIAS", destino: "CLI_CHAPINERO", distanciaKm: 3.1, tiempoMinutos: 11, via: "Calle 53 y Calle 63", cruce: "Calle 63 con Cra 13", hitos: "Parque de Lourdes y Zona Financiera" },
        { origen: "SUC_GALERIAS", destino: "SUC_GRAN_ESTACION", distanciaKm: 3.4, tiempoMinutos: 10, via: "Av. NQS y Calle 26", cruce: "NQS con Calle 53", hitos: "Estadio El Campín y Rampa Calle 26" },
        { origen: "SUC_GRAN_ESTACION", destino: "CLI_SALITRE", distanciaKm: 1.5, tiempoMinutos: 6, via: "Av. La Esperanza", cruce: "Av. Esperanza con Cra 68B", hitos: "Paso vehicular Salitre Oriental" },
        { origen: "CLI_SALITRE", destino: "CLI_MODELIA", distanciaKm: 2.2, tiempoMinutos: 8, via: "Av. Boyacá y Calle 24", cruce: "Boyacá con Esperanza", hitos: "Zona residencial y hotelera de Modelia" },
        { origen: "CLI_SALITRE", destino: "CLI_KENNEDY", distanciaKm: 5.8, tiempoMinutos: 19, via: "Av. Boyacá y Av. Primero de Mayo", cruce: "Boyacá con Av. Américas", hitos: "Monumento a las Banderas y Hospital Kennedy" },
        { origen: "CLI_ROSALES", destino: "CLI_CHAPINERO", distanciaKm: 1.4, tiempoMinutos: 6, via: "Calle 72 y Cra 5ta", cruce: "Calle 72 con Cra 7ma", hitos: "Distrito Financiero Calle 72" },
        { origen: "CLI_CHAPINERO", destino: "CLI_PARQUE93", distanciaKm: 3.8, tiempoMinutos: 16, via: "Carrera 11 y Calle 85", cruce: "Cra 11 con Calle 93A", hitos: "Zona T, Andino y Parque de la 93" },
        { origen: "CLI_SALITRE", destino: "CLI_PARQUE93", distanciaKm: 8.9, tiempoMinutos: 19, via: "Av. 68 y Av. NQS Norte", cruce: "Calle 100 con Cra 15", hitos: "Vía arterial rápida periférica sin semáforos céntricos" },
        { origen: "CLI_MODELIA", destino: "CLI_COLINA", distanciaKm: 11.2, tiempoMinutos: 24, via: "Av. Boyacá hacia el Norte", cruce: "Boyacá con Calle 134", hitos: "Club Los Lagartos y Centro Comercial Parque La Colina" },
        { origen: "CLI_PARQUE93", destino: "CLI_SANTA_ANA", distanciaKm: 2.1, tiempoMinutos: 8, via: "Carrera 9na y Calle 108", cruce: "Cra 9na con Calle 110", hitos: "Cantón Norte y Santa Ana Oriental" },
        { origen: "CLI_PARQUE93", destino: "CLI_STA_BARBARA", distanciaKm: 2.7, tiempoMinutos: 9, via: "Carrera 15 y Calle 116", cruce: "Cra 15 con Calle 116", hitos: "Corredor gastronómico Pepe Sierra" },
        { origen: "CLI_SANTA_ANA", destino: "CLI_USAQUEN", distanciaKm: 1.8, tiempoMinutos: 6, via: "Carrera 7ma Norte", cruce: "Cra 7ma con Calle 119", hitos: "Hacienda Santa Bárbara y Plaza de Usaquén" },
        { origen: "CLI_STA_BARBARA", destino: "CLI_USAQUEN", distanciaKm: 2.1, tiempoMinutos: 7, via: "Calle 116 y Cra 7ma", cruce: "Calle 116 con Cra 7ma", hitos: "Centro Médico Santa Fe y Plaza Fundacional" },
        { origen: "CLI_STA_BARBARA", destino: "CLI_UNICENTRO", distanciaKm: 1.3, tiempoMinutos: 5, via: "Av. Calle 127", cruce: "Calle 127 con Cra 15", hitos: "Centro Comercial Unicentro Entrada 4" },
        { origen: "CLI_UNICENTRO", destino: "CLI_CEDRITOS", distanciaKm: 3.2, tiempoMinutos: 12, via: "Carrera 15 y Calle 140", cruce: "Calle 140 con Cra 19", hitos: "Corredor comercial Cedritos" },
        { origen: "CLI_USAQUEN", destino: "CLI_CEDRITOS", distanciaKm: 3.5, tiempoMinutos: 14, via: "Carrera 7ma y Calle 140", cruce: "Cra 7ma con Calle 140", hitos: "Zona comercial Calle 140" },
        { origen: "CLI_UNICENTRO", destino: "CLI_COLINA", distanciaKm: 4.8, tiempoMinutos: 15, via: "Calle 127 y Av. Suba", cruce: "Av. Suba con Calle 128", hitos: "Humedal Córdoba y Bulevar Niza" },
        { origen: "CLI_COLINA", destino: "CLI_SUBA_CENTRO", distanciaKm: 3.1, tiempoMinutos: 11, via: "Calle 134 y Av. Cali", cruce: "Av. Cali con Calle 145", hitos: "Plaza Imperial y Portal Suba" },
        { origen: "CLI_PARQUE93", destino: "CLI_USAQUEN", distanciaKm: 3.9, tiempoMinutos: 20, via: "Carrera 7ma Norte (Angosta)", cruce: "Cra 7ma con Calle 100", hitos: "Semáforo Museo del Chicó y Calle 100" },
        { origen: "CLI_SALITRE", destino: "CLI_STA_BARBARA", distanciaKm: 9.8, tiempoMinutos: 21, via: "Av. Boyacá y Calle 116", cruce: "Boyacá con Calle 116", hitos: "Vía rápida periférica occidental" }
      ]
    },

    // =========================================================================
    // 2. CIUDAD: MEDELLÍN (Valle de Aburrá y Oriente)
    // =========================================================================
    "MEDELLIN": {
      id: "MEDELLIN",
      nombre: "Medellín",
      centro: [6.2250, -75.5720],
      zoom: 12,
      nodos: {
        "MED_TALLER": {
          id: "MED_TALLER",
          nombre: "Taller Nudo de Oro El Poblado",
          tipo: "taller",
          categoria: "Sede Principal Orfebrería Antioquia",
          lat: 6.2088,
          lng: -75.5684,
          descripcion: "Milla de Oro El Poblado. Bóveda y taller de diseño."
        },
        "MED_PROV_CENTRO": {
          id: "MED_PROV_CENTRO",
          nombre: "Proveedor Junín Joyero",
          tipo: "proveedor",
          categoria: "Mayorista de Oro y Fundición Centro",
          lat: 6.2518,
          lng: -75.5665,
          descripcion: "Pasaje Junín y La Candelaria Medellín."
        },
        "MED_SUC_LAURELES": {
          id: "MED_SUC_LAURELES",
          nombre: "Sucursal Parque Laureles",
          tipo: "sucursal",
          categoria: "Boutique y Taller Rápido",
          lat: 6.2428,
          lng: -75.5925,
          descripcion: "Segundo Parque de Laureles. Atención personalizada."
        },
        "MED_CLI_TESORO": {
          id: "MED_CLI_TESORO",
          nombre: "Cliente El Tesoro Parque Comercial",
          tipo: "cliente",
          categoria: "Boutique de Lujo Loma El Tesoro",
          lat: 6.1973,
          lng: -75.5582,
          descripcion: "Despacho de piezas exclusivas de oro de 18k."
        },
        "MED_CLI_ENVIGADO": {
          id: "MED_CLI_ENVIGADO",
          nombre: "Cliente Envigado Jardines",
          tipo: "cliente",
          categoria: "Residencia y Galería de Diseño",
          lat: 6.1728,
          lng: -75.5862,
          descripcion: "Entrega de referencias de autor y pulseras tejidas."
        },
        "MED_CLI_SABANETA": {
          id: "MED_CLI_SABANETA",
          nombre: "Cliente Parque Sabaneta",
          tipo: "cliente",
          categoria: "Comprador Coleccionista Sur",
          lat: 6.1516,
          lng: -75.6152,
          descripcion: "Despacho seguro de dijes en oro laminado y 18k."
        },
        "MED_CLI_BELEN": {
          id: "MED_CLI_BELEN",
          nombre: "Cliente Belén Rosales",
          tipo: "cliente",
          categoria: "Residencia Occidental",
          lat: 6.2312,
          lng: -75.5978,
          descripcion: "Entrega de accesorios personalizados."
        },
        "MED_CLI_LLANOGRANDE": {
          id: "MED_CLI_LLANOGRANDE",
          nombre: "Cliente Finca Llanogrande",
          tipo: "cliente",
          categoria: "Residencia Exclusiva Rionegro",
          lat: 6.1265,
          lng: -75.4285,
          descripcion: "Entrega bajo custodia privada vía Túnel de Oriente."
        }
      },
      conexiones: [
        { origen: "MED_TALLER", destino: "MED_PROV_CENTRO", distanciaKm: 6.5, tiempoMinutos: 26, via: "Av. El Poblado y Av. Las Vegas", cruce: "Cra 43A con Calle 30", hitos: "Parque del Poblado y Parque San Antonio" },
        { origen: "MED_TALLER", destino: "MED_CLI_TESORO", distanciaKm: 2.1, tiempoMinutos: 8, via: "Loma de El Tesoro (Cra 29)", cruce: "Calle 10A con Cra 29", hitos: "Parque Comercial El Tesoro y Loma San Lucas" },
        { origen: "MED_TALLER", destino: "MED_SUC_LAURELES", distanciaKm: 5.8, tiempoMinutos: 18, via: "Av. 33 y Calle San Juan", cruce: "Av. 33 con Cra 65", hitos: "Puente Guayaquil y Glorieta de Bulerías" },
        { origen: "MED_TALLER", destino: "MED_CLI_ENVIGADO", distanciaKm: 4.6, tiempoMinutos: 14, via: "Av. El Poblado hacia el Sur", cruce: "Calle 25 Sur con Cra 43A", hitos: "Paisa Mall y Barrio Jardines" },
        { origen: "MED_PROV_CENTRO", destino: "MED_SUC_LAURELES", distanciaKm: 4.2, tiempoMinutos: 19, via: "Calle 44 (San Juan) y Av. 70", cruce: "San Juan con Av. 70", hitos: "La Alpujarra y Estadio Atanasio Girardot" },
        { origen: "MED_SUC_LAURELES", destino: "MED_CLI_BELEN", distanciaKm: 1.9, tiempoMinutos: 7, via: "Av. 80 y Cra 76", cruce: "Av. 80 con Calle 30", hitos: "Parque de Belén y Rosales Occidental" },
        { origen: "MED_CLI_BELEN", destino: "MED_CLI_ENVIGADO", distanciaKm: 6.8, tiempoMinutos: 20, via: "Av. 80 y Av. Regional", cruce: "Av. Regional con Calle 37 Sur", hitos: "Puente Gilberto Echeverri" },
        { origen: "MED_CLI_ENVIGADO", destino: "MED_CLI_SABANETA", distanciaKm: 3.5, tiempoMinutos: 11, via: "Carrera 43A hacia Sabaneta", cruce: "Cra 43A con Calle 75 Sur", hitos: "Mayorista y Parque Principal de Sabaneta" },
        { origen: "MED_CLI_TESORO", destino: "MED_CLI_ENVIGADO", distanciaKm: 4.9, tiempoMinutos: 16, via: "Transversal Intermedia", cruce: "Transversal con Calle 27 Sur", hitos: "Colegio Cumbres y Mall La Sebastiana" },
        { origen: "MED_TALLER", destino: "MED_CLI_LLANOGRANDE", distanciaKm: 21.5, tiempoMinutos: 28, via: "Vía Las Palmas y Túnel de Oriente", cruce: "Palmas con Variante Aeropuerto", hitos: "Túnel de Oriente y Llanogrande Mall" },
        { origen: "MED_CLI_TESORO", destino: "MED_CLI_LLANOGRANDE", distanciaKm: 20.2, tiempoMinutos: 27, via: "Loma El Campestre y Las Palmas", cruce: "Loma con Vía Las Palmas", hitos: "Mirador Las Palmas y Corredor Rionegro" },
        { origen: "MED_CLI_SABANETA", destino: "MED_TALLER", distanciaKm: 7.2, tiempoMinutos: 19, via: "Av. Las Vegas Norte", cruce: "Las Vegas con Calle 10", hitos: "Estación Poblado y Milla de Oro" }
      ]
    },

    // =========================================================================
    // 3. CIUDAD: BUCARAMANGA (Área Metropolitana y Meseta de Bucaramanga)
    // =========================================================================
    "BUCARAMANGA": {
      id: "BUCARAMANGA",
      nombre: "Bucaramanga",
      centro: [7.1120, -73.1180],
      zoom: 13,
      nodos: {
        "BUC_TALLER": {
          id: "BUC_TALLER",
          nombre: "Taller Nudo de Oro Cabecera",
          tipo: "taller",
          categoria: "Sede Orfebrería y Diseño Santander",
          lat: 7.1165,
          lng: -73.1098,
          descripcion: "Carrera 33 con Calle 48, Cabecera del Llano."
        },
        "BUC_PROV_CENTRO": {
          id: "BUC_PROV_CENTRO",
          nombre: "Proveedor Joyero Calle 35",
          tipo: "proveedor",
          categoria: "Distribuidor Mayorista Metales Preciosos",
          lat: 7.1245,
          lng: -73.1285,
          descripcion: "Centro Comercial Joyero Plaza Cívica Luis Carlos Galán."
        },
        "BUC_SUC_CANAVERAL": {
          id: "BUC_SUC_CANAVERAL",
          nombre: "Sucursal Cañaveral Mall",
          tipo: "sucursal",
          categoria: "Boutique Floridablanca",
          lat: 7.0658,
          lng: -73.1052,
          descripcion: "Centro Comercial Cañaveral. Vitrina y despacho."
        },
        "BUC_CLI_SOTOMAYOR": {
          id: "BUC_CLI_SOTOMAYOR",
          nombre: "Cliente Sotomayor Exclusivo",
          tipo: "cliente",
          categoria: "Residencia y Galería de Arte",
          lat: 7.1198,
          lng: -73.1162,
          descripcion: "Despacho de piezas en oro de 18k y balines diamantados."
        },
        "BUC_CLI_SAN_FRANCISCO": {
          id: "BUC_CLI_SAN_FRANCISCO",
          nombre: "Cliente San Francisco",
          tipo: "cliente",
          categoria: "Taller Aliado y Distribuidor Norte",
          lat: 7.1352,
          lng: -73.1195,
          descripcion: "Entrega de fornituras y piezas semiacabadas."
        },
        "BUC_CLI_PROVENZA": {
          id: "BUC_CLI_PROVENZA",
          nombre: "Cliente Provenza Real",
          tipo: "cliente",
          categoria: "Cliente Comercial Diamante 2",
          lat: 7.0915,
          lng: -73.1118,
          descripcion: "Entrega de pulseras ajustables en hilo negro y rojo."
        },
        "BUC_CLI_GIRON": {
          id: "BUC_CLI_GIRON",
          nombre: "Cliente Girón Monumental",
          tipo: "cliente",
          categoria: "Joyería Filigrana y Tradición Colonial",
          lat: 7.0722,
          lng: -73.1698,
          descripcion: "Casco histórico de San Juan de Girón."
        },
        "BUC_CLI_RUITOQUE": {
          id: "BUC_CLI_RUITOQUE",
          nombre: "Cliente Ruitoque Country Club",
          tipo: "cliente",
          categoria: "Condominio Exclusivo Alta Seguridad",
          lat: 7.0225,
          lng: -73.1182,
          descripcion: "Entrega bajo custodia privada en la meseta de Ruitoque."
        }
      },
      conexiones: [
        { origen: "BUC_TALLER", destino: "BUC_PROV_CENTRO", distanciaKm: 3.2, tiempoMinutos: 15, via: "Calle 36 y Carrera 27", cruce: "Calle 36 con Cra 27", hitos: "Parque García Rovira y Gobernación" },
        { origen: "BUC_TALLER", destino: "BUC_CLI_SOTOMAYOR", distanciaKm: 1.1, tiempoMinutos: 5, via: "Calle 48 y Cra 29", cruce: "Calle 48 con Cra 29", hitos: "Parque San Pío y Club del Comercio" },
        { origen: "BUC_PROV_CENTRO", destino: "BUC_CLI_SAN_FRANCISCO", distanciaKm: 2.1, tiempoMinutos: 9, via: "Carrera 22 Norte", cruce: "Cra 22 con Calle 14", hitos: "Plaza San Francisco y Bulevar Bolívar" },
        { origen: "BUC_TALLER", destino: "BUC_CLI_SAN_FRANCISCO", distanciaKm: 2.8, tiempoMinutos: 11, via: "Carrera 33 Norte", cruce: "Cra 33 con Calle 28", hitos: "Viaducto La Flora y Megamall" },
        { origen: "BUC_CLI_SOTOMAYOR", destino: "BUC_CLI_PROVENZA", distanciaKm: 3.9, tiempoMinutos: 13, via: "Carrera 27 y Viaducto García Cadena", cruce: "Cra 27 con Calle 67", hitos: "Viaducto y Parque Turbay" },
        { origen: "BUC_TALLER", destino: "BUC_CLI_PROVENZA", distanciaKm: 4.2, tiempoMinutos: 14, via: "Carrera 33 Sur y Calle 105", cruce: "Cra 33 con Calle 105", hitos: "Puerta del Sol y Barrio Diamante" },
        { origen: "BUC_CLI_PROVENZA", destino: "BUC_SUC_CANAVERAL", distanciaKm: 3.4, tiempoMinutos: 10, via: "Autopista Bucaramanga - Floridablanca", cruce: "Autopista con Cañaveral", hitos: "Centro Comercial El Caracolí y Cañaveral" },
        { origen: "BUC_SUC_CANAVERAL", destino: "BUC_CLI_RUITOQUE", distanciaKm: 7.2, tiempoMinutos: 16, via: "Autopista y Subida a Ruitoque", cruce: "Autopista con Rampa Ruitoque", hitos: "Mesa de Ruitoque y Campo de Golf" },
        { origen: "BUC_PROV_CENTRO", destino: "BUC_CLI_GIRON", distanciaKm: 9.1, tiempoMinutos: 22, via: "Calle 45 hacia Chimitá", cruce: "Calle 45 con Palenque", hitos: "Cárcel Modelo y Rincón de Girón" },
        { origen: "BUC_CLI_PROVENZA", destino: "BUC_CLI_GIRON", distanciaKm: 7.8, tiempoMinutos: 19, via: "Anillo Vial de Floridablanca a Girón", cruce: "Anillo Vial con Palenque", hitos: "Zona Industrial Chimitá y Malecón de Girón" },
        { origen: "BUC_SUC_CANAVERAL", destino: "BUC_CLI_GIRON", distanciaKm: 8.5, tiempoMinutos: 18, via: "Anillo Vial Metropolitano", cruce: "Anillo Vial con El Bosque", hitos: "Parque Industrial y Río de Oro" },
        { origen: "BUC_TALLER", destino: "BUC_SUC_CANAVERAL", distanciaKm: 6.8, tiempoMinutos: 20, via: "Carrera 33 y Autopista Floridablanca", cruce: "Cra 33 con Autopista", hitos: "Puerta del Sol y Tráfico de Cañaveral" }
      ]
    }
  },

  /**
   * Cambia la ciudad activa
   * @param {string} ciudadId 
   */
  setCiudadActiva(ciudadId) {
    if (!this.ciudades[ciudadId]) {
      throw new Error(`La ciudad ${ciudadId} no existe en el sistema.`);
    }
    this.ciudadActivaId = ciudadId;
    return this.ciudades[ciudadId];
  },

  /**
   * Obtiene la ciudad activa actual
   */
  getCiudadActiva() {
    return this.ciudades[this.ciudadActivaId];
  },

  // Getters compatibles con el código existente
  get nodos() {
    return this.ciudades[this.ciudadActivaId].nodos;
  },

  get conexiones() {
    return this.ciudades[this.ciudadActivaId].conexiones;
  },

  /**
   * Obtiene los vecinos directos de un nodo en la ciudad activa
   * @param {string} nodoId 
   */
  obtenerVecinos(nodoId) {
    const conexiones = this.conexiones;
    const vecinos = [];
    for (const c of conexiones) {
      if (c.origen === nodoId) {
        vecinos.push({
          nodoId: c.destino,
          distanciaKm: c.distanciaKm,
          tiempoMinutos: c.tiempoMinutos
        });
      } else if (c.destino === nodoId) {
        vecinos.push({
          nodoId: c.origen,
          distanciaKm: c.distanciaKm,
          tiempoMinutos: c.tiempoMinutos
        });
      }
    }
    return vecinos;
  },

  /**
   * Obtiene la arista entre dos nodos adyacentes en la ciudad activa
   * @param {string} u 
   * @param {string} v 
   */
  obtenerArista(u, v) {
    const conexion = this.conexiones.find(
      c => (c.origen === u && c.destino === v) || (c.origen === v && c.destino === u)
    );
    return conexion || null;
  }
};

if (typeof window !== "undefined") {
  window.GrafoJoyeria = GrafoJoyeria;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = GrafoJoyeria;
}
