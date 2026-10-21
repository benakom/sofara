import type { PageKey } from "@/i18n/locales";
import type { PillarContent } from "./types";

export const ES_PILLARS: Partial<Record<PageKey, PillarContent>> = {
  ambassadors: {
    title: "Embajadores inmobiliarios en Dubái: la red Sofara",
    description:
      "Hazte embajador inmobiliario en Dubái con Sofara: recomienda compradores desde tu país, sin licencia, y gana hasta un 3 % de comisión en AED.",
    h1: "Embajadores inmobiliarios en Dubái: así funciona la red",
    eyebrow: "Red de embajadores · Dubái y Emiratos Árabes Unidos",
    intro:
      "Un **embajador inmobiliario en Dubái** conecta a personas que quieren comprar una propiedad en los Emiratos con una agencia autorizada. No necesita licencia ni residir en los Emiratos. Sofara, la red creada por Cevitas Real Estate LLC, reúne a estos embajadores en una misma plataforma, con un mismo equipo de ventas y una política de comisiones publicada de antemano.",
    sections: [
      {
        h2: "Por qué Dubái necesita embajadores",
        blocks: [
          { p: "Dubái vende propiedades a compradores de más de 180 nacionalidades. La mayoría no empieza su búsqueda en un portal inmobiliario: primero lo consultan con un familiar, un asesor financiero o un creador de contenido de confianza en su propio país. El embajador es esa persona de confianza. Presenta al comprador y un equipo autorizado en Dubái se encarga del resto." },
          { p: "El modelo funciona especialmente bien en España y en América Latina, donde crece el interés por la **Golden Visa**, la fiscalidad de los Emiratos y la rentabilidad del alquiler en Dubái." },
        ],
      },
      {
        h2: "Qué hace un embajador en el día a día",
        blocks: [
          { ol: [
            "**Detecta el interés**: alguien de su entorno habla de invertir en Dubái, mudarse o conseguir la residencia.",
            "**Envía el contacto** desde su panel o comparte su enlace personal.",
            "**El equipo de Cevitas toma el relevo**: cualificación, selección de proyectos, visitas presenciales o por vídeo, reserva y contrato de compraventa (SPA).",
            "**Sigue cada etapa** del expediente en su panel, actualizado por el equipo de Sofara.",
            "**Cobra en AED** una vez cerrada la venta.",
          ] },
          { p: "El embajador no negocia precios, no redacta contratos y nunca maneja el dinero del comprador. Por eso no necesita licencia y puede trabajar desde cualquier país." },
        ],
      },
      {
        h2: "Cuánto gana un embajador inmobiliario en Dubái",
        blocks: [
          { p: "Los promotores de Dubái pagan a las agencias registradas una comisión por cada venta sobre plano, normalmente entre el 2 % y el 5 % del precio. Sofara entrega hasta el 3 % del precio de la propiedad al embajador que presentó al comprador." },
          { table: {
            head: ["Promotor", "Tasa del embajador", "Apartamento de 1,5 M AED", "Villa de 4 M AED"],
            rows: [
              ["Emaar Properties", "3 %", "45.000 AED", "120.000 AED"],
              ["Sobha Realty", "3 %", "45.000 AED", "120.000 AED"],
              ["DAMAC Properties", "2,5 %", "37.500 AED", "100.000 AED"],
            ],
          } },
          { p: "La comisión se genera cuando el cliente firma el SPA y paga la entrada junto con las tasas del Dubai Land Department (DLD). Se abona en AED por transferencia en un plazo de 7 días desde que el promotor paga a Cevitas, contra una factura emitida desde tu panel. Cada contacto queda vinculado a tu cuenta durante 12 meses." },
        ],
      },
      {
        h2: "Herramientas para los embajadores",
        blocks: [
          { ul: [
            "Un **enlace de recomendación personal** y un formulario para registrar a un comprador en segundos.",
            "**Seguimiento de cada expediente**, desde el primer contacto hasta el pago de la entrada.",
            "**Plantillas de WhatsApp** y argumentarios para presentar un proyecto a tus contactos.",
            "Una **biblioteca de proyectos** (Emaar, DAMAC, Sobha y otros promotores) con folletos, planes de pago y precios.",
            "Una **comunidad** de embajadores en más de 40 países y el acompañamiento del equipo de Sofara.",
          ] },
        ],
      },
      {
        h2: "Quién puede ser embajador",
        blocks: [
          { p: "Cualquier persona mayor de edad con una red interesada en Dubái: expatriados, emprendedores, asesores patrimoniales, agentes inmobiliarios en España o Latinoamérica y creadores de contenido. El registro es gratuito, sin compromiso y sin objetivos mínimos." },
          { p: "Para comparar con la profesión de agente con licencia, lee nuestra guía sobre [cómo ser agente inmobiliario en Dubái](/es/como-ser-agente-inmobiliario-dubai). Para entender la remuneración, consulta el [programa de afiliados inmobiliarios](/es/programa-afiliados-inmobiliarios-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "¿Necesito una licencia para ser embajador inmobiliario en Dubái?", a: "No. El embajador presenta compradores. Todas las actividades reguladas las realiza Cevitas Real Estate LLC, agencia autorizada por la RERA en Dubái." },
      { q: "¿Puedo ser embajador desde España o Latinoamérica?", a: "Sí. La red cuenta con embajadores en más de 40 países. Trabajas desde casa y el equipo de Dubái gestiona las visitas y la firma." },
      { q: "¿Cuánto se gana por venta?", a: "Hasta el 3 % del precio según el promotor, por ejemplo 45.000 AED por un apartamento de 1,5 millones de AED de Emaar o Sobha." },
      { q: "¿Cuándo se paga la comisión?", a: "Se genera con la firma del SPA y el pago de la entrada con las tasas DLD, y se abona en AED en 7 días desde el pago del promotor a Cevitas." },
      { q: "¿El registro tiene algún coste?", a: "No. Es gratuito, sin suscripción ni cuotas. Solo cobras por ventas cerradas." },
      { q: "¿Qué pasa si mi contacto llama directamente a la agencia?", a: "Sigue vinculado a tu cuenta durante 12 meses. La comisión es tuya aunque contacte con Sofara o Cevitas sin pasar por ti." },
    ],
    cta: {
      title: "Hazte embajador inmobiliario en Dubái",
      text: "Únete a más de 700 embajadores en más de 40 países. Recomienda compradores, sigue cada expediente y cobra en AED.",
    },
    related: ["affiliate", "agent", "invest", "home"],
  },

  affiliate: {
    title: "Programa de afiliados inmobiliarios en Dubái | Sofara",
    description:
      "Programa de afiliados inmobiliarios en Dubái y EAU: recomienda compradores, sigue cada operación y gana hasta un 3 % de comisión en AED, sin licencia.",
    h1: "Programa de afiliados inmobiliarios en Dubái y EAU",
    eyebrow: "Programa de afiliados · Dubái, Abu Dabi, Ras al Jaima",
    intro:
      "Sofara es un **programa de afiliados inmobiliarios** pensado para Dubái y los Emiratos Árabes Unidos. Recomiendas compradores, la agencia autorizada Cevitas Real Estate asesora y cierra la venta, y tú recibes hasta el 3 % del precio de la propiedad.",
    sections: [
      {
        h2: "Qué es un programa de afiliados inmobiliarios",
        blocks: [
          { p: "La afiliación consiste en cobrar por presentar a un cliente. En Dubái, este principio se aplica a operaciones de cientos de miles o incluso millones de dírhams, por lo que una sola recomendación puede equivaler a varios meses de ingresos." },
          { p: "Los promotores (Emaar, DAMAC, Sobha, Binghatti, Ellington y muchos más) pagan a las agencias registradas por cada venta sobre plano. Sofara comparte gran parte de esa comisión con el afiliado, de forma transparente y con tarifas publicadas." },
        ],
      },
      {
        h2: "Cómo funciona",
        blocks: [
          { ol: [
            "**Registro gratuito** en dos minutos desde cualquier país.",
            "**Recomendación**: comparte tu enlace o registra al comprador desde tu panel.",
            "**Acompañamiento del comprador** por el equipo de Cevitas: asesoría, elección del proyecto, visitas, reserva y SPA.",
            "**Seguimiento en tiempo real** de cada expediente.",
            "**Pago en AED** por transferencia en 7 días desde que el promotor paga a Cevitas.",
          ] },
        ],
      },
      {
        h2: "Tabla de comisiones",
        blocks: [
          { table: {
            head: ["Precio de la propiedad", "Comisión al 2,5 %", "Comisión al 3 %"],
            rows: [
              ["800.000 AED", "20.000 AED", "24.000 AED"],
              ["1.500.000 AED", "37.500 AED", "45.000 AED"],
              ["3.000.000 AED", "75.000 AED", "90.000 AED"],
            ],
          } },
          { p: "La tasa depende del promotor, por ejemplo 3 % con Emaar y Sobha y 2,5 % con DAMAC. La comisión se genera cuando el cliente firma el SPA y paga la entrada con las tasas DLD." },
        ],
      },
      {
        h2: "Qué puede hacer un afiliado en Dubái",
        blocks: [
          { p: "En Dubái, solo las agencias y los agentes registrados en la RERA pueden ejercer la intermediación. El afiliado se limita a presentar al comprador: no hace visitas, no negocia y no firma documentos en su nombre. Este marco es sencillo y protege tanto al comprador como al afiliado." },
          { p: "Las comisiones cobradas se declaran según las normas de tu país de residencia. Tu panel genera las facturas necesarias." },
        ],
      },
      {
        h2: "Para quién es este programa",
        blocks: [
          { ul: [
            "**Expatriados y comunidades hispanohablantes** a quienes sus contactos preguntan por Dubái.",
            "**Asesores financieros**, gestores patrimoniales y consultores de reubicación.",
            "**Agentes inmobiliarios en España y Latinoamérica** que quieren atender a clientes que compran en Dubái.",
            "**Creadores de contenido** sobre finanzas, viajes o emprendimiento.",
          ] },
          { p: "Descubre también la [red de embajadores inmobiliarios en Dubái](/es/embajadores-inmobiliarios-dubai) y nuestra guía para [invertir en inmobiliario en Dubái](/es/invertir-inmobiliario-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "¿Qué es un afiliado inmobiliario en Dubái?", a: "Una persona que presenta a un comprador a una agencia autorizada y cobra una comisión si la venta se cierra. En Sofara, los afiliados se llaman embajadores." },
      { q: "¿Cuánto gana un afiliado inmobiliario en Dubái?", a: "Hasta el 3 % del precio, es decir 45.000 AED por un apartamento de 1,5 millones de AED vendido por Emaar o Sobha." },
      { q: "¿Necesito una empresa en los Emiratos?", a: "No. Puedes cobrar como particular o a través de tu empresa en tu país, contra una factura generada desde tu panel." },
      { q: "¿El programa incluye Abu Dabi?", a: "Sí. Sofara se centra en Dubái y también cubre proyectos en Abu Dabi, Ras al Jaima y Sharjah a través de Cevitas." },
      { q: "¿Hay que pagar para unirse?", a: "No. El registro es gratuito, sin suscripción ni número mínimo de recomendaciones." },
      { q: "¿Cómo se protegen mis contactos?", a: "Cada contacto queda vinculado a tu cuenta durante 12 meses, aunque contacte directamente con Sofara o Cevitas." },
    ],
    cta: {
      title: "Únete al programa de afiliados inmobiliarios",
      text: "Crea tu cuenta gratis, comparte tu enlace y deja que un equipo autorizado en Dubái convierta tus recomendaciones en comisiones.",
    },
    related: ["ambassadors", "agent", "invest", "home"],
  },

  agent: {
    title: "Cómo ser agente inmobiliario en Dubái en 2026",
    description:
      "Cómo ser agente inmobiliario en Dubái en 2026: visado, curso DREI, examen RERA, costes e ingresos. Y la vía de embajador, sin licencia y desde tu país.",
    h1: "Cómo ser agente inmobiliario en Dubái en 2026",
    eyebrow: "Guía profesional · actualizada en 2026",
    intro:
      "Dubái es uno de los pocos mercados donde alguien motivado puede ganar muy bien en el sector inmobiliario desde el primer año. Esta guía explica los dos caminos: ser **agente inmobiliario con licencia de la RERA** o ser **embajador** y cobrar comisiones sin licencia, desde tu país.",
    sections: [
      {
        h2: "Dos formas de ganar dinero con el inmobiliario en Dubái",
        blocks: [
          { table: {
            head: ["Criterio", "Agente con licencia (broker RERA)", "Embajador Sofara"],
            rows: [
              ["Licencia", "Tarjeta de broker RERA", "Ninguna"],
              ["Visado de residencia en EAU", "Obligatorio", "No necesario"],
              ["Coste inicial", "Unos 4.000 a 7.000 AED", "Gratis"],
              ["Tiempo para empezar", "4 a 8 semanas", "El mismo día"],
              ["Lugar de trabajo", "Dubái", "Cualquier país"],
              ["Ingresos", "Parte de la comisión de la agencia", "Hasta el 3 % del precio"],
            ],
          } },
        ],
      },
      {
        h2: "Vía 1: agente inmobiliario con licencia en Dubái",
        blocks: [
          { h3: "1. Conseguir un visado de residencia" },
          { p: "La RERA, el regulador vinculado al Dubai Land Department (DLD), solo emite la tarjeta de broker a residentes en los Emiratos. La mayoría de los principiantes se incorporan a una agencia que patrocina su visado de trabajo." },
          { h3: "2. Hacer el curso DREI" },
          { p: "El Dubai Real Estate Institute imparte la formación obligatoria de unos cuatro días: legislación inmobiliaria de Dubái, funciones del DLD y la RERA, ética, ventas sobre plano, cuentas de garantía (escrow) y los contratos Form A, B y F." },
          { h3: "3. Aprobar el examen RERA" },
          { p: "Un test sobre el contenido del curso. Los resultados llegan en pocos días. El coste total, con curso y tarjeta, suele estar entre 4.000 y 7.000 AED." },
          { h3: "4. Obtener la tarjeta de broker" },
          { p: "Con el examen, un certificado de antecedentes y el visado, la agencia te registra en el DLD. Recibes un número BRN y una tarjeta RERA que se renueva cada año." },
        ],
      },
      {
        h2: "Cuánto gana un agente inmobiliario en Dubái",
        blocks: [
          { p: "Los agentes cobran casi siempre a comisión. En el mercado secundario, los honorarios de agencia suelen ser del 2 % del precio, y el agente se queda entre el 40 % y el 70 % según la agencia. En obra nueva, los promotores pagan a la agencia entre el 2 % y el 5 %. Los mejores agentes superan el millón de AED al año, aunque los primeros meses sirven para crear cartera." },
        ],
      },
      {
        h2: "Vía 2: cobrar comisiones sin licencia como embajador",
        blocks: [
          { p: "Si vives fuera de los Emiratos o quieres probar el mercado sin cambiar de vida, la vía de embajador elimina las barreras. Presentas compradores de tu red, la agencia autorizada Cevitas Real Estate se encarga de la asesoría, las visitas y la firma, y tú recibes hasta el 3 % del precio." },
          { ul: [
            "Registro gratuito en dos minutos, sin licencia ni cuotas.",
            "Enlace de recomendación, folletos de proyectos y seguimiento de cada expediente.",
            "Comisión generada con la firma del SPA y el pago de la entrada con las tasas DLD, abonada en AED en 7 días desde el pago del promotor.",
          ] },
          { p: "Más información: [la red de embajadores inmobiliarios en Dubái](/es/embajadores-inmobiliarios-dubai) y [el programa de afiliados](/es/programa-afiliados-inmobiliarios-dubai)." },
        ],
      },
      {
        h2: "¿Qué camino elegir?",
        blocks: [
          { ul: [
            "**Agente con licencia** si vives en Dubái o vas a mudarte y quieres hacer tú mismo las visitas.",
            "**Embajador** si estás en el extranjero, ya tienes una red o audiencia interesada en Dubái, o buscas un ingreso complementario.",
            "**Ambos**: muchos agentes en España y Latinoamérica usan Sofara para atender a sus clientes que compran en Dubái.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "¿Cuánto cuesta la licencia de agente inmobiliario en Dubái?", a: "Entre 4.000 y 7.000 AED aproximadamente por el curso DREI, el examen RERA y la tarjeta de broker, sin contar el visado." },
      { q: "¿Se puede ser agente en Dubái sin visado?", a: "No como agente con licencia: la tarjeta RERA exige visado de residencia. Sí puedes ser embajador de Sofara sin visado ni licencia." },
      { q: "¿Cuánto tiempo se tarda en ser agente?", a: "Normalmente de 4 a 8 semanas entre visado, curso de cuatro días, examen y registro de la tarjeta." },
      { q: "¿Hace falta hablar árabe?", a: "No. El inglés es el idioma de trabajo del sector. El español es una ventaja para atender a compradores internacionales." },
      { q: "¿Cuánto gana un embajador por venta?", a: "Hasta el 3 % del precio según el promotor, es decir 45.000 AED por una propiedad de 1,5 millones de AED." },
      { q: "¿Quién firma las ventas de un embajador?", a: "Cevitas Real Estate LLC, agencia autorizada por la RERA, realiza todas las etapas reguladas." },
    ],
    cta: {
      title: "Empieza a ganar con el inmobiliario de Dubái esta semana",
      text: "No necesitas esperar a un visado, un curso y un examen para cobrar tu primera comisión. Únete a la red Sofara y recomienda compradores de tu entorno.",
    },
    related: ["ambassadors", "affiliate", "invest", "home"],
  },

  invest: {
    title: "Invertir en inmobiliario en Dubái en 2026: guía",
    description:
      "Invertir en inmobiliario en Dubái en 2026: rentabilidad, zonas, compra sobre plano, tasas DLD, Golden Visa y pasos de compra para no residentes.",
    h1: "Invertir en inmobiliario en Dubái en 2026",
    eyebrow: "Guía del inversor · Dubái y Emiratos",
    intro:
      "Dubái atrae a inversores de todo el mundo por una razón sencilla: un mercado abierto a extranjeros, sin impuesto anual sobre la propiedad y con una rentabilidad por alquiler de las más altas entre las grandes ciudades internacionales. Esta guía resume lo esencial antes de comprar y cómo la red Sofara acompaña a los compradores junto a Cevitas Real Estate.",
    sections: [
      {
        h2: "Por qué invertir en Dubái",
        blocks: [
          { ul: [
            "**Plena propiedad (freehold)** para extranjeros en las zonas designadas, inscrita en el Dubai Land Department.",
            "**Sin impuesto anual sobre la propiedad** ni impuesto sobre los alquileres para particulares en los Emiratos.",
            "**Rentabilidad por alquiler** que suele situarse entre el 5 % y el 8 % bruto según la zona y el tipo de inmueble.",
            "**Golden Visa de 10 años** con una inversión inmobiliaria de al menos 2 millones de AED.",
            "**Planes de pago** escalonados en obra nueva, con fondos depositados en cuentas de garantía supervisadas por la RERA.",
          ] },
        ],
      },
      {
        h2: "Comprar sobre plano o una propiedad terminada",
        blocks: [
          { p: "La **compra sobre plano** permite reservar con el 10 % o el 20 % del precio y pagar por etapas durante la construcción, a veces también después de la entrega. Ofrece precios de entrada más bajos y potencial de revalorización. La **propiedad terminada** genera alquiler desde el primer día y se puede visitar tal como es." },
          { p: "La elección depende del objetivo: ingresos rápidos, crecimiento patrimonial a varios años u obtención de la residencia." },
        ],
      },
      {
        h2: "Costes a tener en cuenta",
        blocks: [
          { table: {
            head: ["Concepto", "Importe orientativo"],
            rows: [
              ["Tasa de registro del DLD", "4 % del precio"],
              ["Gastos administrativos de registro", "Unos 2.000 a 4.000 AED"],
              ["Gastos de comunidad anuales", "Según el edificio, por m²"],
              ["Comisión de agencia (mercado secundario)", "Normalmente el 2 % del precio"],
            ],
          } },
          { p: "En obra nueva, la comisión de la agencia la paga el promotor, no el comprador." },
        ],
      },
      {
        h2: "Las zonas más buscadas",
        blocks: [
          { p: "Downtown Dubai y Business Bay por la demanda de alquiler en el centro, Dubai Marina y JBR por la vida frente al mar, Dubai Hills Estate para familias, Jumeirah Village Circle para presupuestos más accesibles, y Dubai Creek Harbour y Dubai South para los proyectos de futuro. Fuera de Dubái, la isla de Saadiyat en Abu Dabi y Al Marjan Island en Ras al Jaima también atraen a inversores." },
        ],
      },
      {
        h2: "Pasos para comprar en Dubái",
        blocks: [
          { ol: [
            "Definir presupuesto, objetivo y zona con un asesor autorizado.",
            "Reservar la propiedad (formulario de reserva y depósito).",
            "Firmar el contrato de compraventa (SPA) y pagar la entrada con las tasas DLD.",
            "Registrar la operación en el DLD (Oqood en obra nueva, título de propiedad en reventa).",
            "Seguir el plan de pagos hasta la entrega de llaves.",
          ] },
          { p: "¿Conoces a personas que quieren invertir en Dubái? Recomiéndalas a Sofara y cobra una comisión: descubre la [red de embajadores](/es/embajadores-inmobiliarios-dubai) y el [programa de afiliados](/es/programa-afiliados-inmobiliarios-dubai)." },
        ],
      },
      {
        h2: "Simule su inversión",
        blocks: [{ p: "Pruebe la operación con sus propias cifras con la [calculadora de rentabilidad inmobiliaria en Dubái](https://www.offplansimulator.com/es/calculadora-rentabilidad-inmobiliaria-dubai) de OffPlanSimulator, gratuita." }],
      },
    ],
    faqs: [
      { q: "¿Puede un extranjero comprar una propiedad en Dubái?", a: "Sí. Cualquier nacionalidad puede comprar en plena propiedad en las zonas freehold, sin residir en los Emiratos." },
      { q: "¿Cuál es el presupuesto mínimo para invertir en Dubái?", a: "Hay estudios y apartamentos pequeños sobre plano desde unos 600.000 a 800.000 AED en zonas como Jumeirah Village Circle o Dubai South." },
      { q: "¿Qué gastos tiene la compra?", a: "Principalmente el 4 % de tasa DLD y los gastos administrativos de registro. En obra nueva, el comprador no paga comisión de agencia." },
      { q: "¿Cómo obtener la Golden Visa con una propiedad?", a: "Con uno o varios inmuebles por un valor total de al menos 2 millones de AED, incluidos proyectos sobre plano bajo ciertas condiciones." },
      { q: "¿Qué rentabilidad se puede esperar?", a: "Suele estar entre el 5 % y el 8 % bruto según la zona, el tamaño y el tipo de alquiler (larga o corta estancia)." },
      { q: "¿Quién acompaña a los compradores recomendados por Sofara?", a: "Cevitas Real Estate LLC, agencia autorizada por la RERA en Dubái, desde la elección del proyecto hasta la entrega de llaves." },
    ],
    cta: {
      title: "¿Tu entorno quiere invertir en Dubái?",
      text: "Recomiéndalo a Sofara: un equipo autorizado lo acompaña de principio a fin y tú recibes hasta el 3 % de comisión por la venta.",
    },
    related: ["ambassadors", "affiliate", "agent", "home"],
  },

  referral: {
    title: "Programa de referidos inmobiliario en Dubái: 1 % a 3 %",
    description:
      "Programa de referidos inmobiliario en Dubái y EAU: recomienda un comprador y cobra del 1 % al 3 % del precio, en AED, en 7 días desde el pago del promotor.",
    h1: "Programa de referidos inmobiliario en Dubái y EAU",
    eyebrow: "Programa de referidos · Dubái y Emiratos",
    intro:
      "¿Conoces a alguien que quiere comprar en Dubái? Con el **programa de referidos inmobiliario** de Sofara lo presentas a Cevitas Real Estate, agencia autorizada por la RERA, y cobras una **comisión del 1 % al 3 % del precio** cuando se cierra la venta. Gratis, sin licencia, desde cualquier país.",
    sections: [
      {
        h2: "Cómo funciona la comisión por referido en Dubái",
        blocks: [
          { p: "En obra nueva, los promotores de Dubái pagan a la agencia que aporta al comprador. Sofara entrega una parte publicada de ese pago a quien recomendó al comprador. La tasa depende del proyecto, entre el 1 % y el 3 % del precio, y aparece en tu panel antes de recomendar." },
          { table: {
            head: ["Precio de la propiedad", "Comisión al 1 %", "Comisión al 3 %"],
            rows: [
              ["800.000 AED", "8.000 AED", "24.000 AED"],
              ["1.500.000 AED", "15.000 AED", "45.000 AED"],
              ["4.000.000 AED", "40.000 AED", "120.000 AED"],
            ],
          } },
        ],
      },
      {
        h2: "Cómo referir a un comprador",
        blocks: [
          { ol: [
            "**Crea tu cuenta gratis** y obtén tu enlace personal.",
            "**Recomienda**: comparte el enlace o registra el contacto desde tu panel.",
            "**Cevitas acompaña al comprador**: cualificación, selección de proyectos, visitas presenciales o por vídeo, reserva y contrato (SPA).",
            "**Sigue cada etapa** en tu panel.",
            "**Cobra tu comisión** en AED por transferencia en 7 días desde el pago del promotor a Cevitas.",
          ] },
          { p: "La comisión se genera cuando el comprador firma el SPA y paga la entrada con las tasas del Dubai Land Department (DLD). Cada contacto queda vinculado a tu cuenta durante 12 meses." },
        ],
      },
      {
        h2: "Para quién es el programa",
        blocks: [
          { ul: [
            "Expatriados y comunidades hispanohablantes interesadas en Dubái.",
            "Asesores financieros, gestores patrimoniales y consultores de reubicación.",
            "Agentes inmobiliarios en España y Latinoamérica.",
            "Creadores de contenido y emprendedores con una red interesada en invertir.",
          ] },
          { p: "Consulta también el [programa de afiliados inmobiliarios](/es/programa-afiliados-inmobiliarios-dubai) y la [red de embajadores](/es/embajadores-inmobiliarios-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "¿Cuánto paga el programa de referidos inmobiliario en Dubái?", a: "Del 1 % al 3 % del precio según el proyecto, por ejemplo 15.000 a 45.000 AED por un apartamento de 1,5 millones de AED." },
      { q: "¿Cuándo se paga la comisión?", a: "Se genera con la firma del SPA y el pago de la entrada con las tasas DLD, y se abona en AED en 7 días desde el pago del promotor a Cevitas." },
      { q: "¿Necesito licencia para referir un comprador?", a: "No. Tú presentas al comprador; Cevitas Real Estate LLC, agencia autorizada por la RERA, realiza todas las etapas reguladas." },
      { q: "¿Funciona en todos los Emiratos?", a: "Sí: Dubái en prioridad, y también Abu Dabi, Ras al Jaima y Sharjah a través de Cevitas." },
      { q: "¿Mi contacto está protegido?", a: "Sí, durante 12 meses, aunque contacte directamente con Sofara o Cevitas." },
      { q: "¿El registro tiene coste?", a: "No, es gratuito, sin suscripción ni mínimo de recomendaciones." },
    ],
    cta: {
      title: "Refiere un comprador y cobra tu comisión",
      text: "Registro gratuito. Presenta a tus contactos, el equipo autorizado de Cevitas se encarga del resto y tú cobras del 1 % al 3 % del precio.",
    },
    related: ["affiliate", "ambassadors", "agent", "home"],
  },
};
