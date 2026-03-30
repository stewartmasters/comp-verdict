'use strict';

// Spanish locale
module.exports = {
  code:     'es',
  htmlLang: 'es',

  salarySection:    'salarios',
  negotiateSection: 'negociacion',
  salarySlugWord:   'salario',
  negSlugWord:      'negociacion',

  salaryHubTitle: 'Salarios del Sector Tecnológico por Puesto y Ciudad (2025)',
  salaryHubDesc:  'Benchmarks salariales actuales para Software Engineers, Product Managers, Data Scientists y más. Cubre las principales ciudades de España, Europa y EE.UU.',
  salaryHubLead:  'Datos de compensación actuales para puestos tecnológicos en España y Europa. Todas las cifras son salario bruto anual en moneda local, basadas en datos del primer trimestre de 2025.',
  negHubTitle:    'Guías de Negociación Salarial para el Sector Tech (2025)',
  negHubDesc:     'Guías de negociación salarial para Software Engineers, Product Managers y más en Barcelona, Madrid, Londres y Berlín. Conoce el mercado antes de negociar.',
  negHubLead:     'Guías de negociación específicas por mercado para perfiles tecnológicos. Conocer el rango salarial del mercado es la base de cualquier negociación exitosa.',

  salaryTitleTpl:       (role, city) => `Salario de ${role} en ${city} (2025) — Benchmarks por Experiencia`,
  salaryDescTpl:        (role, city, p25, p50, p75, sym) => `Salario de ${role} en ${city}: p25 ${sym}${Math.round(p25/1000)}k, mediana ${sym}${Math.round(p50/1000)}k, p75 ${sym}${Math.round(p75/1000)}k para nivel intermedio. Desglose completo por nivel de experiencia.`,
  salaryH1Tpl:          (role, city) => `Salario de ${role} en ${city} (2025)`,
  salaryBreadcrumb1:    'Benchmarks Salariales',
  salaryTableTitle:     (role, city) => `Salario por Nivel de Experiencia — ${city}`,
  salaryContextTitle:   (city) => `Contexto del Mercado: ${city}`,
  salaryCTATitle:       (role) => `¿Es competitiva tu oferta de ${role}?`,
  salaryCTABody:        (role) => `Introduce tu oferta en CompVerdict y obtén un veredicto instantáneo — justa, fuerte o por debajo del mercado — basado en tu puesto, ciudad y años de experiencia exactos.`,
  salaryCTABtn:         'Analizar mi oferta →',
  salaryNegTitle:       (role, city) => `Negociar tu Oferta de ${role} en ${city}`,
  salaryNegBody:        (role, city) => `Antes de aceptar, asegúrate de negociar con conocimiento. Nuestra guía cubre los puntos de palanca específicos del mercado que debes utilizar.`,
  salaryNegLink:        (role, city) => `Cómo negociar el salario de ${role} en ${city} →`,
  salaryFaqTitle:       'Preguntas Frecuentes',
  salaryRelCitiesTitle: (role) => `Salario de ${role} en Otras Ciudades`,
  salaryRelRolesTitle:  (city) => `Otros Salarios Tech en ${city}`,
  salaryTableHeaders:   ['Nivel', 'Percentil 25', 'Mediana', 'Percentil 75'],
  footerNote:           'Datos basados en encuestas salariales agregadas del primer trimestre de 2025. Todas las cifras son salario bruto anual (antes de impuestos) en moneda local.',
  footerLinkTool:       'Herramienta CompVerdict',
  footerLinkSalary:     'Benchmarks Salariales',
  footerLinkNeg:        'Guías de Negociación',

  negTitleTpl:        (role, city) => `Cómo Negociar el Salario de ${role} en ${city} (2025)`,
  negDescTpl:         (role, city, p25, p50, p75, sym) => `Guía paso a paso para negociar el salario de ${role} en ${city}. Rango de mercado: ${sym}${Math.round(p25/1000)}k–${sym}${Math.round(p75/1000)}k para nivel intermedio.`,
  negH1Tpl:           (role, city) => `Cómo Negociar el Salario de ${role} en ${city}`,
  negBreadcrumb1:     'Guías de Negociación',
  negLead:            (city) => `La mayoría de candidatos en ${city} dejan dinero sobre la mesa — no porque la empresa no pueda pagar más, sino porque no conocen el mercado o simplemente no lo piden. Esta guía te da los datos y el guión.`,
  negLeverageTitle:   (city) => `Tus Puntos de Palanca en ${city}`,
  negTableTitle:      (role, city) => `Rangos Salariales de ${role} — ${city}`,
  negTableHeaders:    ['Nivel', 'Mínimo (p25)', 'Mediana (p50)', 'Fuerte (p75)'],
  negPlaybookTitle:   'El Plan de Negociación',
  negContextTitle:    (city) => `Contexto del Mercado: ${city}`,
  negCTATitle:        'Analiza la oferta antes de negociar',
  negCTABody:         'Introduce los detalles de la oferta en CompVerdict para ver exactamente dónde se sitúa en el mercado — antes de decidir si negociar.',
  negCTABtn:          'Analizar mi oferta →',
  negSalaryLink:      (role, city) => `Ver benchmarks completos de salario de ${role} en ${city} →`,
  negRelRolesTitle:   (city) => `Más Guías de Negociación — ${city}`,
  negRelRoleLink:     (role, city) => `Negociar ${role} en ${city}`,
  negRelCitiesTitle:  (role) => `Negociar ${role} en Otras Ciudades`,
  negRelCityLink:     (role, city) => `Negociar en ${city}`,
  negStatFloor:       'Mínimo de Mercado',
  negStatMedian:      'Mediana de Mercado',
  negStatStrong:      'Oferta Fuerte',
  negStatFloorSub:    'Nivel intermedio p25',
  negStatMedianSub:   'Nivel intermedio p50',
  negStatStrongSub:   'Nivel intermedio p75',

  faqQ1: (role, city) => `¿Cuál es el salario medio de ${role} en ${city}?`,
  faqA1: (role, city, junP25, midP50, senP50, sym) =>
    `El salario mediano de ${role} en ${city} es de ${sym}${Math.round(midP50/1000)}k al año para nivel intermedio (3–5 años de experiencia). Los salarios junior parten desde aproximadamente ${sym}${Math.round(junP25/1000)}k, mientras que los seniors suelen ganar ${sym}${Math.round(senP50/1000)}k o más.`,
  faqQ2: (role, city) => `¿Qué se considera un buen salario de ${role} en ${city}?`,
  faqA2: (role, city, midP50, midP75, senP50, sym) =>
    `Un salario por encima del percentil 75 se considera fuerte. Para un ${role} de nivel intermedio en ${city}, eso significa ganar más de ${sym}${Math.round(midP75/1000)}k al año. Los candidatos senior que apuntan a ${sym}${Math.round(senP50/1000)}k+ están en la mitad superior del mercado.`,
  faqQ3: (role, city) => `¿Cuánto aumenta el salario de ${role} con la experiencia en ${city}?`,
  faqA3: (role, city, jump) =>
    jump
      ? `Pasar de nivel intermedio a senior como ${role} en ${city} supone un incremento del ${jump}% en la mediana. El salto de junior a intermedio suele ser similar.`
      : `El nivel de experiencia es el factor que más determina la compensación de ${role} en ${city}. Cada cambio de nivel suele representar un incremento del 30–50% en la mediana.`,
  faqQ4: (role, city) => `¿Es ${city} un buen mercado para trabajar como ${role}?`,
  faqA4: (role, city, midP50, sym, firstSentence) =>
    `${firstSentence} Para los perfiles de ${role}, la compensación mediana de ${sym}${Math.round(midP50/1000)}k es ${midP50 > 50000 ? 'competitiva en relación con el coste de vida' : 'representativa del nivel local del mercado'}.`,

  negSteps: (role, city, midP50, midP25, midP75, senP50, sym) => [
    {
      title: 'Conoce el rango de mercado',
      body:  `El ${role} mediano en ${city} gana ${sym}${Math.round(midP50/1000)}k en nivel intermedio y ${sym}${Math.round((senP50||0)/1000)}k en nivel senior. Establece qué banda de experiencia te corresponde antes de cualquier conversación salarial.`,
    },
    {
      title: 'Ancla por encima de tu objetivo real',
      body:  `Empieza un 10–15% por encima de tu objetivo real. Esto te da margen para ceder y aun así llegar donde quieres. Usa el percentil 75 de tu banda — ${sym}${Math.round(midP75/1000)}k para nivel intermedio — como punto de anclaje.`,
    },
    {
      title: 'Apoya tu petición en datos de mercado, no en necesidades personales',
      body:  `Di: "Según los benchmarks de mercado para ${role}s en ${city} con mi experiencia, el rango es ${sym}${Math.round(midP25/1000)}k–${sym}${Math.round(midP75/1000)}k. Me estoy orientando hacia la mitad superior de ese rango." Nunca justifiques tu petición con el alquiler u otros gastos.`,
    },
    {
      title: 'Negocia el paquete completo',
      body:  'El salario base es solo un componente. Pregunta por la estructura del bonus anual, opciones sobre acciones, bonus de incorporación, flexibilidad de trabajo remoto y presupuesto de formación. Cada uno es una negociación separada con su propio margen.',
    },
    {
      title: 'Consigue todo por escrito antes de aceptar',
      body:  'Las ofertas verbales no valen nada. Solicita la carta de oferta por escrito antes de dar tu decisión. Revisa la fecha de incorporación, el calendario de devengo de equity, los requisitos de preaviso y cualquier cláusula de no competencia antes de firmar.',
    },
  ],

  salaryLinkLabel: (role, city) => `Salario de ${role} — ${city}`,
  negLinkLabel:    (role, city) => `Negociar salario de ${role} en ${city}`,

  SALARY_CITIES: [
    'Barcelona', 'Madrid', 'Valencia', 'Seville', 'Bilbao', 'Remote (Spain)',
    'London', 'Amsterdam', 'Berlin', 'Munich', 'San Francisco', 'New York',
  ],
  NEGOTIATE_CITIES: [
    'Barcelona', 'Madrid', 'London', 'Amsterdam', 'Berlin', 'San Francisco',
  ],

  BAND_LABELS: {
    junior: 'Junior (0–2 años)',
    mid:    'Intermedio (3–5 años)',
    senior: 'Senior (6–10 años)',
    staff:  'Staff / Lead (11+ años)',
  },

  CITY_DESC: {
    'Barcelona':       "El ecosistema tecnológico de Barcelona está anclado en grandes empresas de internet de consumo, estudios de videojuegos móviles y un creciente sector fintech. La ciudad se beneficia de la movilidad de talento dentro de la UE pero compite con hubs del norte de Europa mejor remunerados.",
    'Madrid':          "Madrid es la capital financiera de España, con una mayor concentración de software empresarial y consultoras. Los salarios suelen estar entre un 5–10% por encima de Barcelona en la mayoría de perfiles tecnológicos.",
    'Valencia':        "Valencia es el tercer mercado tech de España en crecimiento, con una escena startup emergente y costes operativos significativamente más bajos que Madrid o Barcelona. Los salarios son inferiores pero el coste de vida también.",
    'Seville':         "Sevilla tiene una comunidad tecnológica creciente, especialmente en consultoría y outsourcing de software. Los salarios están por debajo de la media nacional, pero la demanda de perfiles senior está aumentando.",
    'Bilbao':          "Bilbao concentra talento tecnológico en el sector industrial, la energía y la banca. El mercado es más reducido que Madrid o Barcelona, pero los salarios en el sector industrial son competitivos.",
    'Remote (Spain)':  "Los puestos remotos en España suelen tomar como referencia los sueldos de Madrid o Barcelona. La mayoría de empresas emiten contratos laborales españoles con independencia de la ubicación del empleado dentro del país.",
    'London':          "Londres sigue siendo el hub tecnológico mejor pagado de Europa, con una fuerte demanda del sector financiero, el comercio electrónico y el software empresarial. Las ofertas iniciales casi siempre tienen margen de negociación.",
    'Amsterdam':       "Ámsterdam supera a su tamaño con una concentración de sedes EMEA de grandes empresas tecnológicas internacionales y un entorno profesional completamente en inglés. Los empleadores holandeses suelen ser transparentes sobre sus bandas salariales.",
    'Berlin':          "Berlín es la capital startup de Alemania, atrayendo talento internacional gracias a su coste de vida relativamente bajo y un fuerte apoyo en visados. Los sueldos están entre un 10–15% por debajo de Múnich pero el ecosistema de equity en startups es sólido.",
    'Munich':          "Múnich es el mercado tecnológico mejor pagado de Alemania, impulsado por el tech automotriz, el software empresarial y un clúster de grandes multinacionales. La estructura de bonos anuales crea margen para negociar más allá del salario base.",
    'San Francisco':   "San Francisco y el área de la Bahía siguen siendo el benchmark global en compensación de software. La compensación total incluyendo equity supera frecuentemente al salario base — negocia siempre el paquete completo.",
    'New York':        "Nueva York es el segundo hub tecnológico de EE.UU., con especial fortaleza en finanzas, medios y comercio electrónico. La competencia del sector financiero eleva los salarios tech en toda la ciudad.",
  },

  ROLE_DESC: {
    'Software Engineer':         "Los Software Engineers diseñan, desarrollan y mantienen sistemas de software. La compensación refleja la demanda constante de prácticamente todas las empresas tecnológicas y la amplitud de conocimiento técnico que requiere el puesto.",
    'Product Manager':           "Los Product Managers son responsables de la estrategia de producto y la ejecución del roadmap, trabajando con ingeniería, diseño y stakeholders de negocio. La alta demanda de PMs en empresas en fase de crecimiento sitúa su compensación por encima de la mediana tech.",
    'Data Scientist':            "Los Data Scientists construyen modelos y análisis estadísticos para orientar las decisiones de negocio. La demanda es más alta en internet de consumo, finanzas y grandes empresas donde las decisiones basadas en datos se traducen directamente en ingresos.",
    'Engineering Manager':       "Los Engineering Managers lideran equipos de ingenieros, combinando supervisión técnica con gestión de personas. La prima de gestión —típicamente un 20–40% sobre el IC senior— refleja la genuina escasez de líderes técnicos efectivos.",
    'Frontend Engineer':         "Los Frontend Engineers construyen la capa de experiencia de usuario de las aplicaciones web, trabajando principalmente con frameworks de JavaScript y TypeScript. Su compensación suele estar ligeramente por debajo del backend debido a una mayor oferta de candidatos en la mayoría de mercados.",
    'Backend Engineer':          "Los Backend Engineers construyen y mantienen sistemas server-side, APIs y pipelines de datos. La demanda constante en prácticamente todas las empresas tecnológicas lo convierte en uno de los perfiles más contratados.",
    'Full Stack Engineer':       "Los Full Stack Engineers trabajan tanto en frontend como en backend, un perfil generalista muy demandado en startups y empresas más pequeñas. Su compensación suele estar ligeramente por debajo de los perfiles especializados en grandes empresas.",
    'DevOps Engineer':           "Los DevOps Engineers son responsables de la infraestructura, los pipelines de CI/CD y la automatización del despliegue. A medida que la infraestructura cloud se vuelve crítica para todas las empresas, la compensación de DevOps ha aumentado considerablemente en los últimos cinco años.",
    'Machine Learning Engineer': "Los Machine Learning Engineers construyen y despliegan sistemas de ML a escala, situándose en la intersección de la ingeniería de software y la ciencia de datos. La demanda de empresas nativas de IA y grandes corporaciones genera una prima de compensación constante.",
    'UX Designer':               "Los UX Designers son responsables del proceso completo de diseño de experiencia de usuario, desde la investigación hasta el diseño de interfaces. Su compensación está por debajo de los perfiles de ingeniería, aunque el talento UX senior en empresas product-led puede obtener paquetes muy competitivos.",
  },

  CITY_LEVERAGE: {
    'Barcelona': [
      "El talento tech senior escasea — las empresas compiten activamente por candidatos con experiencia",
      "El mercado tecnológico español está madurando rápidamente, empujando los salarios al alza cada año",
      "El coste de vida moderado significa que las empresas no pueden usar la prima de ciudad como argumento en tu contra",
      "Los candidatos de reubicación e internacionales obtienen sistemáticamente primas salariales en este mercado",
    ],
    'Madrid': [
      "Las empresas madrileñas compiten con Barcelona y roles remotos internacionales por el mismo pool de talento",
      "Las grandes consultoras y empresas enterprise pagan por encima de la media para perfiles tech senior",
      "Las ofertas competidoras son cada vez más habituales en niveles senior y staff",
      "La presencia del sector financiero genera una fuerte competencia intersectorial por el talento técnico",
    ],
    'London': [
      "Los empleadores londinenses esperan negociación — las ofertas iniciales suelen dejar un 10–20% sobre la mesa",
      "Las firmas de servicios financieros pagan primas del 30–50% para habilidades técnicas específicas: úsalo como palanca",
      "Una oferta competidora es la palanca de negociación más poderosa en el mercado londinense",
      "El argumento del coste de vida funciona en ambas direcciones — úsalo, pero prepárate para empleadores experimentados con este enfoque",
    ],
    'Amsterdam': [
      "Los empleadores holandeses suelen ser transparentes sobre las bandas salariales — pregunta directamente antes de negociar",
      "La ruling del 30% para candidatos expatriados es un componente real y negociable de la compensación total",
      "El pool de talento internacional hace que los empleadores comparen habitualmente con los rangos de Londres y Alemania",
      "El fuerte ecosistema startup y scaleup crea tensión real de ofertas competidoras para candidatos senior",
    ],
    'Berlin': [
      "La cultura startup hace del equity un factor genuino y negociable más allá del salario base",
      "La prevalencia del trabajo remoto hace que las empresas berlinesas compitan con Múnich y Londres por los mismos candidatos",
      "Los costes de visado son reales — úsalos como palanca si eres candidato internacional",
      "Referencia los benchmarks de Múnich en la negociación — Berlín va un 10–15% por detrás y los empleadores lo saben",
    ],
    'San Francisco': [
      "Negocia siempre la compensación total como una cifra única: base, RSUs, bonus de incorporación y cliff de vesting",
      "Una oferta competidora es la palanca más poderosa en el tech de SF — las empresas suelen igualarla o mejorarla",
      "Los calendarios de vesting de RSUs y los períodos cliff son negociables en muchas empresas de tamaño medio",
      "Los bonos de incorporación se usan habitualmente para compensar gaps de equity no devengado en el puesto anterior",
    ],
  },
};
