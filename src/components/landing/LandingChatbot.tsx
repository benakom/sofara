import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";

/* ── Types ─────────────────────────────────────────── */
interface QAItem {
  id: string;
  keywords: Record<Lang, string[]>;
  answer: Record<Lang, string>;
  chips: Record<Lang, string[]>;
}

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  ts: Date;
}

/* ── Translations ──────────────────────────────────── */
const t = (lang: Lang) => ({
  welcome: {
    fr: "Salut ! Je suis l'assistant Sofara. Que vous soyez curieux d'investir à Dubai, de devenir ambassadeur, ou de comprendre comment nous fonctionnons — je suis là pour vous aider. Que souhaitez-vous savoir ?",
    en: "Hi! I'm Sofara's assistant. Whether you're curious about investing in Dubai, becoming an ambassador, or learning how we work — I'm here to help. What would you like to know?",
    ar: "مرحبًا! أنا مساعد Sofara. سواء كنت مهتمًا بالاستثمار في دبي أو أن تصبح سفيرًا أو تعرف كيف نعمل — أنا هنا للمساعدة. ماذا تريد أن تعرف؟",
    es: "¡Hola! Soy el asistente de Sofara. Ya sea que te interese invertir en Dubái, ser embajador o saber cómo trabajamos — estoy aquí para ayudarte. ¿Qué te gustaría saber?",
    ru: "Привет! Я ассистент Sofara. Хотите узнать об инвестициях в Дубай, стать амбассадором или понять, как мы работаем — я здесь, чтобы помочь. Что бы вы хотели узнать?",
  }[lang],
  initialChips: {
    fr: ["C'est quoi Sofara ?", "Devenir ambassadeur", "Investir à Dubai", "Combien puis-je gagner ?"],
    en: ["What is Sofara?", "Become an ambassador", "Invest in Dubai", "How much can I earn?"],
    ar: ["ما هو Sofara؟", "كن سفيرًا", "استثمر في دبي", "كم يمكنني أن أكسب؟"],
    es: ["¿Qué es Sofara?", "Ser embajador", "Invertir en Dubái", "¿Cuánto puedo ganar?"],
    ru: ["Что такое Sofara?", "Стать амбассадором", "Инвестировать в Дубай", "Сколько можно заработать?"],
  }[lang],
  fallback: {
    fr: "Je n'ai pas encore de réponse spécifique pour ça ! Pour des questions détaillées, contactez notre équipe à hello@sofara.io ou via le formulaire de contact sur cette page. Puis-je vous aider avec autre chose ?",
    en: "I don't have a specific answer for that just yet! For detailed questions, reach our team at hello@sofara.io or use the contact form on this page. Can I help with something else?",
    ar: "ليس لدي إجابة محددة لذلك بعد! للأسئلة التفصيلية، تواصل مع فريقنا على hello@sofara.io أو استخدم نموذج الاتصال. هل يمكنني مساعدتك بشيء آخر؟",
    es: "¡Aún no tengo una respuesta específica! Para preguntas detalladas, contacta a nuestro equipo en hello@sofara.io o usa el formulario de contacto. ¿Puedo ayudarte con algo más?",
    ru: "У меня пока нет конкретного ответа! Для подробных вопросов свяжитесь с нашей командой по hello@sofara.io или через форму на странице. Могу ли я помочь с чем-то ещё?",
  }[lang],
  fallbackChips: {
    fr: ["C'est quoi Sofara ?", "Comment gagner des commissions ?", "Investir à Dubai", "Contacter Sofara"],
    en: ["What is Sofara?", "How to earn commissions?", "Invest in Dubai", "Contact Sofara"],
    ar: ["ما هو Sofara؟", "كيف أكسب عمولات؟", "استثمر في دبي", "تواصل مع Sofara"],
    es: ["¿Qué es Sofara?", "¿Cómo ganar comisiones?", "Invertir en Dubái", "Contactar Sofara"],
    ru: ["Что такое Sofara?", "Как заработать комиссии?", "Инвестировать в Дубай", "Связаться с Sofara"],
  }[lang],
  placeholder: {
    fr: "Tapez votre question...", en: "Type your question...", ar: "اكتب سؤالك...", es: "Escribe tu pregunta...", ru: "Введите ваш вопрос...",
  }[lang],
  online: { fr: "En ligne", en: "Online", ar: "متصل", es: "En línea", ru: "Онлайн" }[lang],
  poweredBy: "Powered by Sofara",
});

/* ── Q&A Data ──────────────────────────────────────── */
const QA: QAItem[] = [
  {
    id: "what_is_sofara",
    keywords: {
      en: ["what is sofara","what's sofara","tell me about sofara","how does sofara work","what do you do","about sofara"],
      fr: ["c'est quoi sofara","qu'est-ce que sofara","sofara c'est quoi","comment fonctionne sofara","parle-moi de sofara","à propos de sofara"],
      ar: ["ما هو sofara","ما هي sofara","أخبرني عن sofara","كيف يعمل sofara"],
      es: ["qué es sofara","cómo funciona sofara","cuéntame sobre sofara","sobre sofara"],
      ru: ["что такое sofara","расскажи о sofara","как работает sofara","о sofara"],
    },
    answer: {
      en: "Sofara is a global network that connects international investors to Dubai real estate opportunities. We work through ambassadors — motivated professionals in your country who introduce investors to verified projects, supported by licensed Dubai brokers.",
      fr: "Sofara est un réseau mondial qui connecte les investisseurs internationaux aux opportunités immobilières de Dubai. Nous fonctionnons à travers des ambassadeurs — des professionnels motivés dans votre pays qui présentent les investisseurs à des projets vérifiés, accompagnés par des courtiers agréés à Dubai.",
      ar: "Sofara هي شبكة عالمية تربط المستثمرين الدوليين بفرص العقارات في دبي. نعمل من خلال سفراء — محترفون في بلدك يقدمون المستثمرين لمشاريع موثقة بدعم من وسطاء مرخصين في دبي.",
      es: "Sofara es una red global que conecta inversores internacionales con oportunidades inmobiliarias en Dubái. Trabajamos a través de embajadores — profesionales motivados en tu país que presentan inversores a proyectos verificados, respaldados por corredores con licencia en Dubái.",
      ru: "Sofara — это глобальная сеть, соединяющая международных инвесторов с возможностями недвижимости в Дубае. Мы работаем через амбассадоров — мотивированных профессионалов в вашей стране, которые знакомят инвесторов с проверенными проектами при поддержке лицензированных брокеров Дубая.",
    },
    chips: {
      en: ["Who is it for?", "Is it free to join?", "What makes you different?", "Become an ambassador"],
      fr: ["Pour qui ?", "C'est gratuit ?", "Qu'est-ce qui vous distingue ?", "Devenir ambassadeur"],
      ar: ["لمن هو؟", "هل هو مجاني؟", "ما الذي يميزكم؟", "كن سفيرًا"],
      es: ["¿Para quién es?", "¿Es gratis?", "¿Qué los diferencia?", "Ser embajador"],
      ru: ["Для кого это?", "Это бесплатно?", "Чем вы отличаетесь?", "Стать амбассадором"],
    },
  },
  {
    id: "who_is_it_for",
    keywords: {
      en: ["who is sofara for","who can use","who is it for","for who","target"],
      fr: ["pour qui","qui peut utiliser","c'est pour qui","cible","à qui s'adresse"],
      ar: ["لمن","من يمكنه","الفئة المستهدفة"],
      es: ["para quién","quién puede","a quién va dirigido"],
      ru: ["для кого","кто может","целевая аудитория"],
    },
    answer: {
      en: "Sofara serves three groups: (1) Ambassadors — people who want to earn commissions by connecting investors to Dubai property. (2) Investors — people looking to buy real estate in Dubai. (3) Developers — who want international buyers for their projects.",
      fr: "Sofara s'adresse à trois groupes : (1) Ambassadeurs — des personnes qui veulent gagner des commissions en connectant des investisseurs à l'immobilier Dubai. (2) Investisseurs — des personnes qui cherchent à acheter à Dubai. (3) Promoteurs — qui veulent des acheteurs internationaux pour leurs projets.",
      ar: "تخدم Sofara ثلاث فئات: (1) السفراء — أشخاص يريدون كسب عمولات بربط المستثمرين بعقارات دبي. (2) المستثمرون — أشخاص يبحثون عن شراء عقارات في دبي. (3) المطورون — الذين يريدون مشترين دوليين.",
      es: "Sofara sirve a tres grupos: (1) Embajadores — personas que quieren ganar comisiones conectando inversores con propiedades en Dubái. (2) Inversores — personas que buscan comprar en Dubái. (3) Desarrolladores — que quieren compradores internacionales.",
      ru: "Sofara обслуживает три группы: (1) Амбассадоры — люди, желающие зарабатывать комиссии, связывая инвесторов с недвижимостью Дубая. (2) Инвесторы — люди, желающие купить недвижимость в Дубае. (3) Застройщики — которые хотят международных покупателей.",
    },
    chips: {
      en: ["Become an ambassador", "Invest in Dubai", "I'm a developer", "Is it free?"],
      fr: ["Devenir ambassadeur", "Investir à Dubai", "Je suis promoteur", "C'est gratuit ?"],
      ar: ["كن سفيرًا", "استثمر في دبي", "أنا مطور", "هل هو مجاني؟"],
      es: ["Ser embajador", "Invertir en Dubái", "Soy desarrollador", "¿Es gratis?"],
      ru: ["Стать амбассадором", "Инвестировать в Дубай", "Я застройщик", "Это бесплатно?"],
    },
  },
  {
    id: "is_it_free",
    keywords: {
      en: ["free","cost to join","price to join","free to join","how much does it cost","registration fee","no fee"],
      fr: ["gratuit","coût","prix","frais d'inscription","combien ça coûte","sans frais"],
      ar: ["مجاني","تكلفة","رسوم","بدون رسوم"],
      es: ["gratis","costo","precio","cuánto cuesta","sin costo"],
      ru: ["бесплатно","стоимость","цена","сколько стоит","без оплаты"],
    },
    answer: {
      en: "Joining the Sofara ambassador network is completely free. No registration fee, no credit card required. We also offer premium tools starting at $49/month for ambassadors who want to scale their activity.",
      fr: "Rejoindre le réseau d'ambassadeurs Sofara est entièrement gratuit. Pas de frais d'inscription, pas de carte bancaire requise. Nous proposons aussi des outils premium à partir de 49$/mois pour les ambassadeurs qui veulent développer leur activité.",
      ar: "الانضمام إلى شبكة سفراء Sofara مجاني تمامًا. لا رسوم تسجيل، لا بطاقة ائتمان مطلوبة. نقدم أيضًا أدوات متميزة تبدأ من 49$/شهر.",
      es: "Unirse a la red de embajadores de Sofara es completamente gratis. Sin cargo de registro ni tarjeta de crédito. También ofrecemos herramientas premium desde $49/mes.",
      ru: "Присоединение к сети амбассадоров Sofara полностью бесплатно. Никаких регистрационных сборов, кредитная карта не требуется. Также предлагаем премиум-инструменты от $49/мес.",
    },
    chips: {
      en: ["What do I get for free?", "How much can I earn?", "How do I start?", "What is Sofara?"],
      fr: ["Qu'est-ce que j'ai gratuitement ?", "Combien puis-je gagner ?", "Comment commencer ?", "C'est quoi Sofara ?"],
      ar: ["ماذا أحصل مجانًا؟", "كم يمكنني أن أكسب؟", "كيف أبدأ؟", "ما هو Sofara؟"],
      es: ["¿Qué obtengo gratis?", "¿Cuánto puedo ganar?", "¿Cómo empiezo?", "¿Qué es Sofara?"],
      ru: ["Что я получаю бесплатно?", "Сколько можно заработать?", "Как начать?", "Что такое Sofara?"],
    },
  },
  {
    id: "based_in_dubai",
    keywords: {
      en: ["based in","where are you","where is sofara","dubai","location","registered","legal","rera"],
      fr: ["basé","où êtes-vous","où est sofara","dubai","localisation","enregistré","légal","rera"],
      ar: ["مقرها","أين أنتم","دبي","الموقع","مسجل","قانوني"],
      es: ["ubicación","dónde están","dubái","registrado","legal","rera"],
      ru: ["где вы","где находится","дубай","местоположение","зарегистрирован","легально"],
    },
    answer: {
      en: "Yes. Sofara operates in Dubai through our licensed real estate brokerage, Cevitas Real Estate. All transactions are handled by qualified Dubai brokers under full regulatory compliance with RERA.",
      fr: "Oui. Sofara opère à Dubai via notre courtage immobilier agréé, Cevitas Real Estate. Toutes les transactions sont gérées par des courtiers qualifiés à Dubai en totale conformité réglementaire avec la RERA.",
      ar: "نعم. تعمل Sofara في دبي من خلال شركة الوساطة العقارية المرخصة لدينا Cevitas Real Estate. جميع المعاملات يتولاها وسطاء مؤهلون تحت إشراف RERA.",
      es: "Sí. Sofara opera en Dubái a través de nuestra correduría inmobiliaria con licencia, Cevitas Real Estate. Todas las transacciones son manejadas por corredores calificados bajo cumplimiento regulatorio con RERA.",
      ru: "Да. Sofara работает в Дубае через нашу лицензированную брокерскую компанию Cevitas Real Estate. Все сделки ведут квалифицированные брокеры в полном соответствии с RERA.",
    },
    chips: {
      en: ["Is Sofara legitimate?", "How does it work?", "Invest in Dubai", "Contact Sofara"],
      fr: ["Sofara est légitime ?", "Comment ça marche ?", "Investir à Dubai", "Contacter Sofara"],
      ar: ["هل Sofara شرعية؟", "كيف يعمل؟", "استثمر في دبي", "تواصل مع Sofara"],
      es: ["¿Sofara es legítima?", "¿Cómo funciona?", "Invertir en Dubái", "Contactar Sofara"],
      ru: ["Sofara легальна?", "Как это работает?", "Инвестировать в Дубай", "Связаться с Sofara"],
    },
  },
  {
    id: "what_makes_different",
    keywords: {
      en: ["different","unique","stand out","versus","vs","compared to","better than","other platform"],
      fr: ["différent","unique","distingue","par rapport","comparé","mieux que","autre plateforme"],
      ar: ["مختلف","فريد","مميز","مقارنة","أفضل من"],
      es: ["diferente","único","destaca","versus","comparado","mejor que"],
      ru: ["отличается","уникальный","выделяется","по сравнению","лучше чем"],
    },
    answer: {
      en: "Most platforms are portals — they just show listings. Sofara is a deal engine. We give ambassadors AI tools to find and qualify investors, and our licensed brokers handle the closing. You get the full pipeline, not just a listing.",
      fr: "La plupart des plateformes sont des portails — elles montrent juste des annonces. Sofara est un moteur de deals. Nous donnons aux ambassadeurs des outils IA pour trouver et qualifier des investisseurs, et nos courtiers agréés gèrent la conclusion. Vous obtenez le pipeline complet, pas juste une annonce.",
      ar: "معظم المنصات هي بوابات — تعرض فقط العقارات. Sofara هو محرك صفقات. نمنح السفراء أدوات ذكاء اصطناعي للعثور على المستثمرين وتأهيلهم، ووسطاؤنا المرخصون يتولون الإغلاق.",
      es: "La mayoría de plataformas son portales — solo muestran listados. Sofara es un motor de negocios. Damos a los embajadores herramientas de IA para encontrar y calificar inversores, y nuestros corredores con licencia manejan el cierre.",
      ru: "Большинство платформ — это порталы, они просто показывают объявления. Sofara — это движок сделок. Мы даём амбассадорам ИИ-инструменты для поиска и квалификации инвесторов, а наши лицензированные брокеры закрывают сделки.",
    },
    chips: {
      en: ["Become an ambassador", "How much can I earn?", "Who are your developers?", "Is it free?"],
      fr: ["Devenir ambassadeur", "Combien puis-je gagner ?", "Quels promoteurs ?", "C'est gratuit ?"],
      ar: ["كن سفيرًا", "كم يمكنني أن أكسب؟", "من هم المطورون؟", "هل هو مجاني؟"],
      es: ["Ser embajador", "¿Cuánto puedo ganar?", "¿Quiénes son sus desarrolladores?", "¿Es gratis?"],
      ru: ["Стать амбассадором", "Сколько можно заработать?", "Кто ваши застройщики?", "Это бесплатно?"],
    },
  },
  {
    id: "what_is_ambassador",
    keywords: {
      en: ["what is an ambassador","ambassador mean","what does ambassador do","define ambassador","ambassador role"],
      fr: ["c'est quoi un ambassadeur","ambassadeur signifie","que fait un ambassadeur","rôle ambassadeur","devenir ambassadeur"],
      ar: ["ما هو السفير","ماذا يفعل السفير","دور السفير","كن سفيرًا"],
      es: ["qué es un embajador","embajador significa","rol del embajador","ser embajador"],
      ru: ["что такое амбассадор","что делает амбассадор","роль амбассадора","стать амбассадором"],
    },
    answer: {
      en: "An ambassador is anyone who introduces potential real estate investors to Sofara. You don't need a real estate license. You use your personal network and the tools we provide to find interested buyers — and earn a commission when a deal closes.",
      fr: "Un ambassadeur est toute personne qui présente des investisseurs immobiliers potentiels à Sofara. Vous n'avez pas besoin de licence immobilière. Vous utilisez votre réseau personnel et les outils que nous fournissons pour trouver des acheteurs intéressés — et gagner une commission quand un deal se conclut.",
      ar: "السفير هو أي شخص يقدم مستثمرين عقاريين محتملين إلى Sofara. لا تحتاج إلى ترخيص عقاري. تستخدم شبكتك الشخصية وأدواتنا لإيجاد مشترين مهتمين — وتكسب عمولة عند إتمام الصفقة.",
      es: "Un embajador es cualquier persona que presenta inversores inmobiliarios potenciales a Sofara. No necesitas licencia inmobiliaria. Usas tu red personal y las herramientas que proporcionamos — y ganas una comisión cuando se cierra un trato.",
      ru: "Амбассадор — это любой человек, который знакомит потенциальных инвесторов в недвижимость с Sofara. Вам не нужна лицензия на недвижимость. Вы используете свою сеть контактов и наши инструменты — и зарабатываете комиссию при закрытии сделки.",
    },
    chips: {
      en: ["Do I need a license?", "How much can I earn?", "How do I start?", "What tools do I get?"],
      fr: ["Faut-il une licence ?", "Combien puis-je gagner ?", "Comment commencer ?", "Quels outils ?"],
      ar: ["هل أحتاج ترخيص؟", "كم يمكنني أن أكسب؟", "كيف أبدأ؟", "ما الأدوات المتاحة؟"],
      es: ["¿Necesito licencia?", "¿Cuánto puedo ganar?", "¿Cómo empiezo?", "¿Qué herramientas obtengo?"],
      ru: ["Нужна ли лицензия?", "Сколько можно заработать?", "Как начать?", "Какие инструменты?"],
    },
  },
  {
    id: "how_to_start",
    keywords: {
      en: ["get started","start quickly","how fast","when can i start","sign up","join","register","onboard","begin"],
      fr: ["commencer","démarrer","inscription","rejoindre","s'inscrire","comment commencer","quand puis-je"],
      ar: ["كيف أبدأ","البدء","التسجيل","الانضمام","كيف أسجل"],
      es: ["empezar","comenzar","registrarse","unirse","inscribirse","cómo empiezo"],
      ru: ["начать","как начать","зарегистрироваться","присоединиться","как быстро"],
    },
    answer: {
      en: "Within 24 hours. Sign up free, complete the short onboarding (about 20 minutes), get your AI outreach script, and start sharing it with your network. Most ambassadors submit their first lead within their first day.",
      fr: "En moins de 24h. Inscrivez-vous gratuitement, complétez le court onboarding (environ 20 minutes), recevez votre script de prospection IA, et commencez à le partager avec votre réseau. La plupart des ambassadeurs soumettent leur premier lead dès le premier jour.",
      ar: "خلال 24 ساعة. سجل مجانًا، أكمل التهيئة القصيرة (حوالي 20 دقيقة)، احصل على نص التواصل بالذكاء الاصطناعي، وابدأ بمشاركته مع شبكتك.",
      es: "En 24 horas. Regístrate gratis, completa la breve incorporación (unos 20 minutos), obtén tu guión de contacto con IA y comienza a compartirlo con tu red.",
      ru: "В течение 24 часов. Зарегистрируйтесь бесплатно, пройдите короткий онбординг (около 20 минут), получите ИИ-скрипт для связи и начните делиться им с вашей сетью.",
    },
    chips: {
      en: ["Is it free?", "What tools do I get?", "How much can I earn?", "Countries available"],
      fr: ["C'est gratuit ?", "Quels outils ?", "Combien puis-je gagner ?", "Pays disponibles"],
      ar: ["هل هو مجاني؟", "ما الأدوات؟", "كم يمكنني أن أكسب؟", "الدول المتاحة"],
      es: ["¿Es gratis?", "¿Qué herramientas?", "¿Cuánto puedo ganar?", "Países disponibles"],
      ru: ["Это бесплатно?", "Какие инструменты?", "Сколько можно заработать?", "Доступные страны"],
    },
  },
  {
    id: "how_much_earn",
    keywords: {
      en: ["how much earn","earn as ambassador","earning potential","income","salary","money","revenue","commission","make money"],
      fr: ["combien gagner","gagner ambassadeur","potentiel","revenu","salaire","argent","commission","combien je peux"],
      ar: ["كم أكسب","الدخل","الراتب","العمولة","كسب المال"],
      es: ["cuánto ganar","ganar como embajador","potencial","ingreso","salario","dinero","comisión"],
      ru: ["сколько заработать","доход","зарплата","комиссия","заработок","деньги"],
    },
    answer: {
      en: "On a typical deal of AED 1.5M with a 5% broker commission, an ambassador earns approximately AED 37,500 (around $10,000 USD). Top ambassadors closing 3–5 deals per year earn AED 100,000–250,000 annually. The more active your network, the higher your potential.",
      fr: "Sur un deal typique de 1,5M AED avec une commission de courtage de 5%, un ambassadeur gagne environ 37 500 AED (environ 10 000$ USD). Les meilleurs ambassadeurs qui closent 3 à 5 deals par an gagnent 100 000 à 250 000 AED annuellement. Plus votre réseau est actif, plus votre potentiel est élevé.",
      ar: "في صفقة نموذجية بقيمة 1.5 مليون درهم مع عمولة وساطة 5%، يكسب السفير حوالي 37,500 درهم (حوالي 10,000 دولار). أفضل السفراء يكسبون 100,000-250,000 درهم سنويًا.",
      es: "En un trato típico de AED 1.5M con una comisión del 5%, un embajador gana aproximadamente AED 37,500 ($10,000 USD). Los mejores embajadores que cierran 3-5 tratos al año ganan AED 100,000-250,000 anualmente.",
      ru: "При типичной сделке на AED 1.5M с комиссией брокера 5%, амбассадор зарабатывает примерно AED 37,500 ($10,000 USD). Лучшие амбассадоры, закрывающие 3-5 сделок в год, зарабатывают AED 100,000-250,000 ежегодно.",
    },
    chips: {
      en: ["How does commission split?", "When do I get paid?", "Is there a limit to leads?", "How do I start?"],
      fr: ["Comment est répartie la commission ?", "Quand suis-je payé ?", "Y a-t-il une limite de leads ?", "Comment commencer ?"],
      ar: ["كيف تُقسم العمولة؟", "متى أحصل على المال؟", "هل هناك حد للعملاء؟", "كيف أبدأ؟"],
      es: ["¿Cómo se divide la comisión?", "¿Cuándo me pagan?", "¿Hay límite de leads?", "¿Cómo empiezo?"],
      ru: ["Как делится комиссия?", "Когда я получу оплату?", "Есть ли лимит лидов?", "Как начать?"],
    },
  },
  {
    id: "commission_split",
    keywords: {
      en: ["commission split","how split","percentage","breakdown","who gets what","50%","sofara take"],
      fr: ["répartition commission","partage","pourcentage","qui reçoit quoi","50%","sofara prend"],
      ar: ["تقسيم العمولة","النسبة","من يحصل على ماذا"],
      es: ["división comisión","porcentaje","quién recibe qué"],
      ru: ["разделение комиссии","процент","кто получает что"],
    },
    answer: {
      en: "When a deal closes: 50% goes to the ambassador who introduced the investor, 35% to the Cevitas broker who managed the transaction, and 15% to the Sofara platform. This is calculated on the total broker commission from the sale.",
      fr: "Quand un deal se conclut : 50% va à l'ambassadeur qui a présenté l'investisseur, 35% au courtier Cevitas qui a géré la transaction, et 15% à la plateforme Sofara. Ceci est calculé sur la commission totale du courtier sur la vente.",
      ar: "عند إتمام الصفقة: 50% للسفير، 35% لوسيط Cevitas، و15% لمنصة Sofara. يُحسب ذلك من إجمالي عمولة الوسيط.",
      es: "Cuando se cierra un trato: 50% para el embajador, 35% para el corredor Cevitas, y 15% para la plataforma Sofara. Se calcula sobre la comisión total del corredor.",
      ru: "При закрытии сделки: 50% идёт амбассадору, 35% — брокеру Cevitas, и 15% — платформе Sofara. Рассчитывается от общей брокерской комиссии.",
    },
    chips: {
      en: ["How much can I earn?", "When do I get paid?", "How do I start?", "Is it free to join?"],
      fr: ["Combien puis-je gagner ?", "Quand suis-je payé ?", "Comment commencer ?", "C'est gratuit ?"],
      ar: ["كم يمكنني أن أكسب؟", "متى أحصل على المال؟", "كيف أبدأ؟", "هل هو مجاني؟"],
      es: ["¿Cuánto puedo ganar?", "¿Cuándo me pagan?", "¿Cómo empiezo?", "¿Es gratis?"],
      ru: ["Сколько можно заработать?", "Когда я получу оплату?", "Как начать?", "Это бесплатно?"],
    },
  },
  {
    id: "invest_dubai",
    keywords: {
      en: ["invest in dubai","want to invest","buy property","how to invest","real estate dubai","purchase property","buy in dubai"],
      fr: ["investir à dubai","investir dubai","acheter","immobilier dubai","comment investir","acheter à dubai"],
      ar: ["استثمر في دبي","أريد الاستثمار","شراء عقار","عقارات دبي"],
      es: ["invertir en dubái","quiero invertir","comprar propiedad","inmobiliaria dubái"],
      ru: ["инвестировать в дубай","хочу инвестировать","купить недвижимость","недвижимость дубай"],
    },
    answer: {
      en: "Start by speaking with your local Sofara ambassador or reaching out directly. We'll connect you with a Cevitas licensed broker who will understand your budget, goals, and recommend the best projects — off-plan and ready units.",
      fr: "Commencez par parler à votre ambassadeur Sofara local ou contactez-nous directement. Nous vous mettrons en relation avec un courtier agréé Cevitas qui comprendra votre budget, vos objectifs, et vous recommandera les meilleurs projets — sur plan et prêts à habiter.",
      ar: "ابدأ بالتحدث مع سفير Sofara المحلي أو تواصل معنا مباشرة. سنربطك بوسيط مرخص من Cevitas يفهم ميزانيتك وأهدافك ويوصي بأفضل المشاريع.",
      es: "Comienza hablando con tu embajador Sofara local o contactándonos directamente. Te conectaremos con un corredor con licencia de Cevitas que entenderá tu presupuesto y recomendará los mejores proyectos.",
      ru: "Начните с разговора с вашим местным амбассадором Sofara или свяжитесь с нами напрямую. Мы соединим вас с лицензированным брокером Cevitas, который поймёт ваш бюджет и порекомендует лучшие проекты.",
    },
    chips: {
      en: ["Minimum budget?", "Do I need to travel?", "Rental yields?", "Golden Visa?"],
      fr: ["Budget minimum ?", "Dois-je me déplacer ?", "Rendements locatifs ?", "Golden Visa ?"],
      ar: ["الحد الأدنى للميزانية؟", "هل يجب أن أسافر؟", "عوائد الإيجار؟", "التأشيرة الذهبية؟"],
      es: ["¿Presupuesto mínimo?", "¿Debo viajar?", "¿Rentabilidad?", "¿Golden Visa?"],
      ru: ["Минимальный бюджет?", "Нужно ли ехать?", "Доходность аренды?", "Золотая виза?"],
    },
  },
  {
    id: "golden_visa",
    keywords: {
      en: ["golden visa","visa","residency","resident","stay in uae","live in dubai","10 year"],
      fr: ["golden visa","visa","résidence","résident","vivre à dubai","10 ans"],
      ar: ["التأشيرة الذهبية","فيزا","إقامة","العيش في دبي"],
      es: ["golden visa","visa","residencia","vivir en dubái","10 años"],
      ru: ["золотая виза","виза","резидентство","жить в дубае","10 лет"],
    },
    answer: {
      en: "Yes. Purchasing property worth AED 2M or more qualifies you for the UAE Golden Visa — a 10-year renewable residency. Our broker team can guide you through this process alongside your property purchase.",
      fr: "Oui. L'achat d'un bien d'une valeur de 2M AED ou plus vous qualifie pour le Golden Visa UAE — une résidence renouvelable de 10 ans. Notre équipe de courtiers peut vous accompagner dans ce processus en parallèle de votre achat immobilier.",
      ar: "نعم. شراء عقار بقيمة 2 مليون درهم أو أكثر يؤهلك للتأشيرة الذهبية — إقامة متجددة لمدة 10 سنوات. فريق الوسطاء لدينا يرشدك خلال هذه العملية.",
      es: "Sí. Comprar una propiedad de AED 2M o más te califica para la Golden Visa de EAU — una residencia renovable de 10 años. Nuestro equipo de corredores puede guiarte en este proceso.",
      ru: "Да. Покупка недвижимости стоимостью AED 2M и более даёт право на Золотую визу ОАЭ — возобновляемый вид на жительство на 10 лет. Наша команда брокеров проведёт вас через этот процесс.",
    },
    chips: {
      en: ["Minimum budget?", "Rental yields?", "Foreign ownership?", "Contact a broker"],
      fr: ["Budget minimum ?", "Rendements locatifs ?", "Propriété étrangère ?", "Contacter un courtier"],
      ar: ["الحد الأدنى للميزانية؟", "عوائد الإيجار؟", "ملكية أجنبية؟", "تواصل مع وسيط"],
      es: ["¿Presupuesto mínimo?", "¿Rentabilidad?", "¿Propiedad extranjera?", "Contactar corredor"],
      ru: ["Минимальный бюджет?", "Доходность аренды?", "Иностранная собственность?", "Связаться с брокером"],
    },
  },
  {
    id: "rental_yields",
    keywords: {
      en: ["return","yield","roi","profit","rental income","appreciation","capital gain","investment return","how profitable"],
      fr: ["rendement","roi","profit","revenu locatif","plus-value","rentabilité","retour sur investissement"],
      ar: ["العائد","الربح","الدخل الإيجاري","التقدير","عائد الاستثمار"],
      es: ["rendimiento","roi","rentabilidad","ingreso por alquiler","plusvalía"],
      ru: ["доходность","рентабельность","прибыль","арендный доход","рои"],
    },
    answer: {
      en: "Rental yields in Dubai typically range between 5% and 9% per year depending on location and property type — among the highest globally. Capital appreciation on off-plan projects has averaged 15–30% between purchase and completion in recent years.",
      fr: "Les rendements locatifs à Dubai varient généralement entre 5% et 9% par an selon l'emplacement et le type de bien — parmi les plus élevés au monde. La plus-value sur les projets off-plan a atteint en moyenne 15 à 30% entre l'achat et la livraison ces dernières années.",
      ar: "عوائد الإيجار في دبي تتراوح عادة بين 5% و9% سنويًا حسب الموقع ونوع العقار — من بين الأعلى عالميًا. التقدير الرأسمالي للمشاريع على المخطط بلغ 15-30% في المتوسط.",
      es: "Los rendimientos de alquiler en Dubái van del 5% al 9% anual según la ubicación — entre los más altos del mundo. La plusvalía en proyectos sobre plano ha promediado 15-30% entre compra y entrega.",
      ru: "Арендная доходность в Дубае обычно составляет 5-9% годовых в зависимости от местоположения — одна из самых высоких в мире. Прирост капитала на off-plan проектах в среднем 15-30%.",
    },
    chips: {
      en: ["Minimum budget?", "Golden Visa?", "Foreign ownership?", "Contact a broker"],
      fr: ["Budget minimum ?", "Golden Visa ?", "Propriété étrangère ?", "Contacter un courtier"],
      ar: ["الحد الأدنى للميزانية؟", "التأشيرة الذهبية؟", "ملكية أجنبية؟", "تواصل مع وسيط"],
      es: ["¿Presupuesto mínimo?", "¿Golden Visa?", "¿Propiedad extranjera?", "Contactar corredor"],
      ru: ["Минимальный бюджет?", "Золотая виза?", "Иностранная собственность?", "Связаться с брокером"],
    },
  },
  {
    id: "minimum_budget",
    keywords: {
      en: ["minimum","budget","how much to buy","price of property","afford","starting price","entry price","cheapest"],
      fr: ["minimum","budget","combien pour acheter","prix","à partir de","moins cher","entrée"],
      ar: ["الحد الأدنى","الميزانية","كم للشراء","أقل سعر"],
      es: ["mínimo","presupuesto","cuánto para comprar","precio","más barato"],
      ru: ["минимум","бюджет","сколько стоит","начальная цена","самый дешёвый"],
    },
    answer: {
      en: "Dubai offers investment options starting from AED 400,000 (approximately $110,000 USD) for smaller apartments in growing areas. Premium units and villas start from AED 1.5M. Your Cevitas broker will match available options to your exact budget.",
      fr: "Dubai offre des options d'investissement à partir de 400 000 AED (environ 110 000$ USD) pour des appartements dans des zones en croissance. Les unités premium et villas commencent à 1,5M AED. Votre courtier Cevitas trouvera les options adaptées à votre budget exact.",
      ar: "تقدم دبي خيارات استثمارية تبدأ من 400,000 درهم (حوالي 110,000 دولار) للشقق الصغيرة. الوحدات المميزة والفلل تبدأ من 1.5 مليون درهم.",
      es: "Dubái ofrece opciones de inversión desde AED 400,000 ($110,000 USD) para apartamentos pequeños. Unidades premium y villas desde AED 1.5M.",
      ru: "Дубай предлагает инвестиции от AED 400,000 ($110,000 USD) за небольшие квартиры. Премиум-юниты и виллы от AED 1.5M.",
    },
    chips: {
      en: ["Foreign ownership?", "Rental yields?", "Golden Visa?", "Do I need to travel?"],
      fr: ["Propriété étrangère ?", "Rendements locatifs ?", "Golden Visa ?", "Dois-je me déplacer ?"],
      ar: ["ملكية أجنبية؟", "عوائد الإيجار؟", "التأشيرة الذهبية؟", "هل يجب أن أسافر؟"],
      es: ["¿Propiedad extranjera?", "¿Rentabilidad?", "¿Golden Visa?", "¿Debo viajar?"],
      ru: ["Иностранная собственность?", "Доходность аренды?", "Золотая виза?", "Нужно ли ехать?"],
    },
  },
  {
    id: "is_legitimate",
    keywords: {
      en: ["legitimate","real company","is sofara real","trustworthy","scam","fraud","verified","official","rera","licensed"],
      fr: ["légitime","vraie entreprise","sofara est réel","fiable","arnaque","fraude","vérifié","officiel","rera","agréé"],
      ar: ["شرعي","شركة حقيقية","موثوق","احتيال","نصب","مرخص"],
      es: ["legítima","empresa real","confiable","estafa","fraude","verificado","oficial"],
      ru: ["легальна","настоящая компания","надёжная","мошенничество","обман","лицензированная"],
    },
    answer: {
      en: "Yes. Sofara operates through Cevitas Real Estate, a licensed Dubai brokerage registered with RERA (Real Estate Regulatory Agency). All transactions comply with Dubai Law and UAE financial regulations.",
      fr: "Oui. Sofara opère via Cevitas Real Estate, un courtage immobilier agréé à Dubai enregistré auprès de la RERA (Real Estate Regulatory Agency). Toutes les transactions sont conformes à la loi de Dubai et aux réglementations financières des EAU.",
      ar: "نعم. تعمل Sofara من خلال Cevitas Real Estate، وساطة عقارية مرخصة في دبي مسجلة لدى RERA. جميع المعاملات تتوافق مع قانون دبي ولوائح الإمارات المالية.",
      es: "Sí. Sofara opera a través de Cevitas Real Estate, una correduría con licencia registrada en RERA. Todas las transacciones cumplen con la ley de Dubái y las regulaciones financieras de EAU.",
      ru: "Да. Sofara работает через Cevitas Real Estate — лицензированную брокерскую компанию, зарегистрированную в RERA. Все сделки соответствуют законодательству Дубая и финансовым нормам ОАЭ.",
    },
    chips: {
      en: ["Is my data safe?", "What if something goes wrong?", "Contact Sofara", "What is Sofara?"],
      fr: ["Mes données sont en sécurité ?", "Et si ça ne marche pas ?", "Contacter Sofara", "C'est quoi Sofara ?"],
      ar: ["هل بياناتي آمنة؟", "ماذا لو حدث خطأ؟", "تواصل مع Sofara", "ما هو Sofara؟"],
      es: ["¿Mis datos están seguros?", "¿Y si algo sale mal?", "Contactar Sofara", "¿Qué es Sofara?"],
      ru: ["Мои данные в безопасности?", "Что если что-то пойдёт не так?", "Связаться с Sofara", "Что такое Sofara?"],
    },
  },
  {
    id: "contact_sofara",
    keywords: {
      en: ["contact","reach you","email","whatsapp","support","help me","speak to someone","talk to","phone","get in touch"],
      fr: ["contact","joindre","email","whatsapp","support","aide","parler à quelqu'un","téléphone"],
      ar: ["تواصل","اتصل","بريد","واتساب","دعم","ساعدني","تحدث مع"],
      es: ["contacto","contactar","correo","whatsapp","soporte","ayuda","hablar con"],
      ru: ["контакт","связаться","email","whatsapp","поддержка","помогите","поговорить"],
    },
    answer: {
      en: "You can reach our team via the contact form on this page, by email at hello@sofara.io, or through WhatsApp. Our support team responds within 24 hours on business days.",
      fr: "Vous pouvez joindre notre équipe via le formulaire de contact sur cette page, par email à hello@sofara.io, ou par WhatsApp. Notre équipe de support répond sous 24h les jours ouvrés.",
      ar: "يمكنك الوصول إلى فريقنا عبر نموذج الاتصال في هذه الصفحة، أو بالبريد الإلكتروني على hello@sofara.io، أو عبر WhatsApp. فريق الدعم يرد خلال 24 ساعة.",
      es: "Puedes contactar a nuestro equipo a través del formulario de contacto, por email a hello@sofara.io o por WhatsApp. Nuestro equipo responde en 24 horas hábiles.",
      ru: "Вы можете связаться с нашей командой через форму на странице, по email hello@sofara.io или через WhatsApp. Наша команда отвечает в течение 24 часов в рабочие дни.",
    },
    chips: {
      en: ["What is Sofara?", "Become an ambassador", "Invest in Dubai", "Is Sofara legitimate?"],
      fr: ["C'est quoi Sofara ?", "Devenir ambassadeur", "Investir à Dubai", "Sofara est légitime ?"],
      ar: ["ما هو Sofara؟", "كن سفيرًا", "استثمر في دبي", "هل Sofara شرعية؟"],
      es: ["¿Qué es Sofara?", "Ser embajador", "Invertir en Dubái", "¿Sofara es legítima?"],
      ru: ["Что такое Sofara?", "Стать амбассадором", "Инвестировать в Дубай", "Sofara легальна?"],
    },
  },
  {
    id: "no_license_needed",
    keywords: {
      en: ["license","licensed","need a license","legal to be","compliance","certification"],
      fr: ["licence","agréé","besoin d'une licence","légal","conformité","certification"],
      ar: ["ترخيص","مرخص","هل أحتاج ترخيص","قانوني"],
      es: ["licencia","necesito licencia","legal","certificación"],
      ru: ["лицензия","нужна лицензия","легально","сертификация"],
    },
    answer: {
      en: "No license required. Ambassadors act as introducers — not brokers. You connect people to Sofara. Our licensed Cevitas brokers handle all regulatory, legal, and transaction aspects of the deal.",
      fr: "Aucune licence requise. Les ambassadeurs agissent comme des introducteurs — pas des courtiers. Vous connectez des personnes à Sofara. Nos courtiers agréés Cevitas gèrent tous les aspects réglementaires, juridiques et transactionnels du deal.",
      ar: "لا يلزم ترخيص. السفراء يعملون كمقدمين — ليسوا وسطاء. وسطاء Cevitas المرخصون يتولون جميع الجوانب التنظيمية والقانونية.",
      es: "No se requiere licencia. Los embajadores actúan como presentadores — no corredores. Nuestros corredores Cevitas manejan todos los aspectos legales.",
      ru: "Лицензия не требуется. Амбассадоры выступают как представители — не брокеры. Наши лицензированные брокеры Cevitas ведут все юридические аспекты.",
    },
    chips: {
      en: ["How do I start?", "How much can I earn?", "Is Sofara legitimate?", "What is an ambassador?"],
      fr: ["Comment commencer ?", "Combien puis-je gagner ?", "Sofara est légitime ?", "C'est quoi un ambassadeur ?"],
      ar: ["كيف أبدأ؟", "كم يمكنني أن أكسب؟", "هل Sofara شرعية؟", "ما هو السفير؟"],
      es: ["¿Cómo empiezo?", "¿Cuánto puedo ganar?", "¿Sofara es legítima?", "¿Qué es un embajador?"],
      ru: ["Как начать?", "Сколько можно заработать?", "Sofara легальна?", "Что такое амбассадор?"],
    },
  },
  {
    id: "countries_available",
    keywords: {
      en: ["countries","country","where can i join","which markets","available in","my country","morocco","france","canada","uk"],
      fr: ["pays","quel pays","où","disponible","maroc","france","canada","royaume-uni"],
      ar: ["الدول","أي بلد","أين","متاح","المغرب","فرنسا","كندا"],
      es: ["países","dónde puedo","disponible","marruecos","francia","canadá"],
      ru: ["страны","где доступно","марокко","франция","канада","великобритания"],
    },
    answer: {
      en: "Sofara is currently active in Morocco, France, Canada, UK, and UAE. We're expanding to more countries shortly. If your country isn't listed yet, register your interest and we'll notify you when we open your market.",
      fr: "Sofara est actuellement actif au Maroc, en France, au Canada, au Royaume-Uni et aux EAU. Nous nous étendons bientôt à d'autres pays. Si votre pays n'est pas encore listé, inscrivez votre intérêt et nous vous notifierons à l'ouverture de votre marché.",
      ar: "Sofara نشطة حاليًا في المغرب وفرنسا وكندا والمملكة المتحدة والإمارات. نتوسع قريبًا لدول أخرى.",
      es: "Sofara está actualmente activo en Marruecos, Francia, Canadá, Reino Unido y EAU. Estamos expandiéndonos a más países próximamente.",
      ru: "Sofara сейчас работает в Марокко, Франции, Канаде, Великобритании и ОАЭ. Скоро расширяемся на другие страны.",
    },
    chips: {
      en: ["How do I join?", "Is it free?", "How much can I earn?", "What is Sofara?"],
      fr: ["Comment rejoindre ?", "C'est gratuit ?", "Combien puis-je gagner ?", "C'est quoi Sofara ?"],
      ar: ["كيف أنضم؟", "هل هو مجاني؟", "كم يمكنني أن أكسب؟", "ما هو Sofara؟"],
      es: ["¿Cómo me uno?", "¿Es gratis?", "¿Cuánto puedo ganar?", "¿Qué es Sofara?"],
      ru: ["Как присоединиться?", "Это бесплатно?", "Сколько можно заработать?", "Что такое Sofara?"],
    },
  },
  {
    id: "when_paid",
    keywords: {
      en: ["when paid","get paid","payment","payout","when do i receive","how long","payment timeline","30 days"],
      fr: ["quand payé","paiement","quand je reçois","combien de temps","délai de paiement","30 jours"],
      ar: ["متى أحصل","الدفع","كم من الوقت","30 يوم"],
      es: ["cuándo me pagan","pago","cuándo recibo","cuánto tiempo","30 días"],
      ru: ["когда оплата","выплата","когда получу","сколько ждать","30 дней"],
    },
    answer: {
      en: "Commissions are released within 30 days of the Sale and Purchase Agreement (SPA) being signed. You can track your deal status and expected payout in real time from your ambassador dashboard.",
      fr: "Les commissions sont versées dans les 30 jours suivant la signature du contrat de vente (SPA). Vous pouvez suivre le statut de votre deal et le paiement attendu en temps réel depuis votre tableau de bord ambassadeur.",
      ar: "تُصرف العمولات خلال 30 يومًا من توقيع اتفاقية البيع والشراء (SPA). يمكنك متابعة حالة صفقتك من لوحة التحكم.",
      es: "Las comisiones se liberan dentro de 30 días de la firma del SPA. Puedes rastrear el estado en tiempo real desde tu dashboard de embajador.",
      ru: "Комиссии выплачиваются в течение 30 дней после подписания SPA. Вы можете отслеживать статус сделки в реальном времени из дашборда.",
    },
    chips: {
      en: ["How much can I earn?", "Commission split?", "Is there a limit to leads?", "How do I start?"],
      fr: ["Combien puis-je gagner ?", "Répartition commission ?", "Limite de leads ?", "Comment commencer ?"],
      ar: ["كم يمكنني أن أكسب؟", "تقسيم العمولة؟", "حد العملاء؟", "كيف أبدأ؟"],
      es: ["¿Cuánto puedo ganar?", "¿División comisión?", "¿Límite de leads?", "¿Cómo empiezo?"],
      ru: ["Сколько можно заработать?", "Разделение комиссии?", "Лимит лидов?", "Как начать?"],
    },
  },
  {
    id: "foreign_ownership",
    keywords: {
      en: ["foreign","foreigner","ownership","non-resident","expat own","can i buy","allowed to buy","international buyer"],
      fr: ["étranger","propriété étrangère","non-résident","expatrié","puis-je acheter","autorisé"],
      ar: ["أجنبي","ملكية أجنبية","غير مقيم","هل يمكنني الشراء"],
      es: ["extranjero","propiedad extranjera","no residente","puedo comprar"],
      ru: ["иностранец","иностранная собственность","нерезидент","могу ли я купить"],
    },
    answer: {
      en: "Yes. Dubai allows 100% foreign freehold ownership in designated areas — which covers most popular investment zones including Downtown Dubai, Dubai Marina, Palm Jumeirah, and Business Bay.",
      fr: "Oui. Dubai autorise la propriété étrangère à 100% en pleine propriété dans les zones désignées — ce qui couvre la plupart des zones d'investissement populaires dont Downtown Dubai, Dubai Marina, Palm Jumeirah et Business Bay.",
      ar: "نعم. تسمح دبي بملكية أجنبية 100% في المناطق المخصصة — والتي تشمل معظم مناطق الاستثمار الشائعة.",
      es: "Sí. Dubái permite 100% de propiedad extranjera en zonas designadas — que cubre las zonas de inversión más populares.",
      ru: "Да. Дубай разрешает 100% иностранную собственность в обозначенных зонах — это большинство популярных инвестиционных районов.",
    },
    chips: {
      en: ["Minimum budget?", "Rental yields?", "Golden Visa?", "Do I need to travel?"],
      fr: ["Budget minimum ?", "Rendements locatifs ?", "Golden Visa ?", "Dois-je me déplacer ?"],
      ar: ["الحد الأدنى للميزانية؟", "عوائد الإيجار؟", "التأشيرة الذهبية؟", "هل يجب أن أسافر؟"],
      es: ["¿Presupuesto mínimo?", "¿Rentabilidad?", "¿Golden Visa?", "¿Debo viajar?"],
      ru: ["Минимальный бюджет?", "Доходность аренды?", "Золотая виза?", "Нужно ли ехать?"],
    },
  },
];

/* ── Fuzzy keyword matching ─────────────────────────── */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[''?!.,;:—–\-]/g, "").trim();
}

function findAnswer(input: string, lang: Lang): { answer: string; chips: string[] } | null {
  const norm = normalize(input);
  let bestMatch: QAItem | null = null;
  let bestScore = 0;

  for (const qa of QA) {
    const kws = qa.keywords[lang] || qa.keywords.en;
    for (const kw of kws) {
      const nkw = normalize(kw);
      // Exact match
      if (norm === nkw) return { answer: qa.answer[lang] || qa.answer.en, chips: qa.chips[lang] || qa.chips.en };
      // Contained
      if (norm.includes(nkw) || nkw.includes(norm)) {
        const score = nkw.length;
        if (score > bestScore) { bestScore = score; bestMatch = qa; }
      }
      // Word overlap
      const inputWords = norm.split(/\s+/);
      const kwWords = nkw.split(/\s+/);
      const overlap = kwWords.filter(w => w.length > 2 && inputWords.some(iw => iw.includes(w) || w.includes(iw))).length;
      if (overlap >= 2 && overlap > bestScore) { bestScore = overlap; bestMatch = qa; }
    }
  }

  if (bestMatch) return { answer: bestMatch.answer[lang] || bestMatch.answer.en, chips: bestMatch.chips[lang] || bestMatch.chips.en };
  return null;
}

/* ── Timestamp format ───────────────────────────────── */
function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let msgCounter = 0;
function uid() { return `msg-${++msgCounter}-${Date.now()}`; }

/* ── Component ──────────────────────────────────────── */
export default function LandingChatbot() {
  const { lang } = useLanguage();
  const tr = t(lang);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chips, setChips] = useState<string[]>(tr.initialChips);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = useCallback((text: string, followChips: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: uid(), role: "bot", text, ts: new Date() }]);
      setChips(followChips);
    }, 500 + Math.random() * 300);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setTimeout(() => {
        addBotMessage(tr.welcome, tr.initialChips);
      }, 600);
    }
    setTimeout(() => inputRef.current?.focus(), 400);
  }, [hasOpened, tr, addBotMessage]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", text: text.trim(), ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setChips([]);

    const result = findAnswer(text, lang);
    if (result) {
      addBotMessage(result.answer, result.chips);
    } else {
      addBotMessage(tr.fallback, tr.fallbackChips);
    }
  }, [lang, tr, addBotMessage]);

  const handleChipClick = useCallback((chip: string) => {
    handleSend(chip);
  }, [handleSend]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  /* ── Collapsed button ─────────────────────────────── */
  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-110"
            style={{ background: "#0B1D3A" }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          {/* Gold notification dot */}
          <div
            className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2"
            style={{ background: "#C9A84C", borderColor: "#0B1D3A" }}
          />
        </div>
      </button>
    );
  }

  /* ── Expanded chat window ─────────────────────────── */
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: "min(360px, calc(90vw))",
          height: 500,
          maxHeight: "calc(100dvh - 6rem)",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* ── Header ────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: "#0B1D3A" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "rgba(201, 168, 76, 0.15)", color: "#C9A84C", border: "1.5px solid rgba(201, 168, 76, 0.3)" }}
          >
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">Sofara Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[10px] text-white/60">{tr.online}</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Messages ──────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3"
          style={{ background: "#F5F3EE" }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] flex flex-col gap-0.5">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "#0B1D3A", color: "#fff" }
                      : { background: "#fff", color: "#0B1D3A", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                  }
                >
                  {msg.text}
                </div>
                <span
                  className={`text-[10px] px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}
                  style={{ color: "#9CA3AF" }}
                >
                  {formatTime(msg.ts)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1"
                style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#0B1D3A", animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggestion chips ──────────────────────── */}
        {chips.length > 0 && !isTyping && (
          <div
            className="flex gap-2 px-4 py-2.5 overflow-x-auto shrink-0"
            style={{ background: "#fff", borderTop: "1px solid #E5E7EB", scrollbarWidth: "none" }}
          >
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="text-[11px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full border transition-all duration-200 shrink-0 hover:text-[#0B1D3A]"
                style={{ borderColor: "#0B1D3A", color: "#0B1D3A" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "#C9A84C";
                  (e.target as HTMLElement).style.borderColor = "#C9A84C";
                  (e.target as HTMLElement).style.color = "#0B1D3A";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.borderColor = "#0B1D3A";
                  (e.target as HTMLElement).style.color = "#0B1D3A";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* ── Input row ─────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2.5 shrink-0"
          style={{ background: "#fff", borderTop: "1px solid #E5E7EB" }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tr.placeholder}
            disabled={isTyping}
            className="flex-1 min-w-0 h-9 px-3.5 rounded-full text-[13px] border focus:outline-none focus:ring-2 transition-all"
            style={{
              background: "#F9FAFB",
              borderColor: "#E5E7EB",
              color: "#0B1D3A",
            }}
            onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "#C9A84C"; }}
            onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "#E5E7EB"; }}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40"
            style={{ background: "#C9A84C" }}
          >
            <Send className="w-4 h-4" style={{ color: "#0B1D3A" }} />
          </button>
        </form>

        {/* ── Footer ────────────────────────────────── */}
        <div
          className="text-center py-1.5 shrink-0"
          style={{ background: "#fff", borderTop: "1px solid #F3F4F6" }}
        >
          <span className="text-[9px] font-medium tracking-wide" style={{ color: "#9CA3AF" }}>
            {tr.poweredBy}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
