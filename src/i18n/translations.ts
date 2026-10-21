// "ar" is kept as a deprecated alias (mapped to "en") to avoid breaking
// legacy dashboard/admin components that still inline-check `lang === "ar"`.
// Public-facing surfaces use en | fr | es | ru.
export type Lang = "en" | "fr" | "es" | "ru" | "ar";

export const translations: Record<Lang, Record<string, string>> = {

  en: {
    // Navbar
    "nav.howItWorks": "How it works",
    "nav.signIn": "Sign In",

    // Hero

    // Trust bar

    // Mid CTA

    // Final CTA

    // Logo bar

    // Stats

    // Market Data 2025

    // Platform features

    // Why Dubai

    // Storytelling

    // Benefits

    // How it works

    // Why Sofara

    // AI Advantage

    // Investor Metrics

    // Testimonials

    // FAQ
    "faq.label": "FAQ",
    "faq.title": "Everything you need to",
    "faq.titleHighlight": "know",
    "faq.q1": "How are my contacts protected?",
    "faq.a1": "Each contact you submit or who signs up through your link is tied to your ambassador account for 12 months, even if they later contact Sofara or Cevitas directly.",
    "faq.q2": "Can I refer people who live outside the UAE?",
    "faq.a2": "Yes. Buyers of any nationality can purchase freehold property in Dubai, and Sofara ambassadors refer clients from more than 40 countries. Viewings can be done on site or by video.",
    "faq.q3": "How much can I realistically earn?",
    "faq.a3": "Between 1% and 3% of the property price, depending on the project: for example AED 15,000 to 45,000 on an AED 1.5 million apartment, and AED 40,000 to 120,000 on an AED 4 million villa. The rate of each project is shown in your dashboard before you refer.",
    "faq.q4": "Do I need a real estate license?",
    "faq.a4": "No. You introduce buyers; Cevitas Real Estate LLC, a RERA-licensed brokerage, carries out every regulated step (advice, viewings, contracts). Declare your commissions according to the rules of your country of residence.",
    "faq.q5": "How are commissions paid?",
    "faq.a5": "The commission is earned when the buyer signs the SPA and pays the down payment with the DLD fees. It is paid in AED by bank transfer within 7 days of the developer paying Cevitas, against an invoice issued from your dashboard.",
    "faq.q6": "Is the program free?",
    "faq.a6": "Yes, 100% free. No registration fees, no subscription, no hidden costs. Sofara only earns from completed transactions.",

    // CTA

    // Commissions

    // Auth

    // Legal pages
    "legal.back": "Back",
    "legal.lastUpdated": "Last updated: March 2025",
    "legal.privacy.title": "Privacy Policy",
    "legal.privacy.content": `<p>Sofara (www.sofara.io) is a brand operated by Cevitas Real Estate LLC, a company based in Dubai (United Arab Emirates) ("we").</p>
<h2>Data collected</h2>
<p>We may collect:</p>
<ul>
<li>Identity (first name, last name)</li>
<li>Contact details (email, phone/WhatsApp)</li>
<li>Information related to your real estate project (budget, preferences, location)</li>
<li>Browsing data (cookies, IP address, logs)</li>
<li>Any content you send us via forms, WhatsApp or email</li>
</ul>
<h2>Purposes</h2>
<p>Your data is used to: contact you, qualify your request, offer you real estate opportunities, improve our services and website, manage security, comply with legal obligations and prevent fraud.</p>
<h2>Legal basis</h2>
<p>Depending on the case: your consent, pre-contractual/contractual measures, our legitimate interest (service, security, improvement), and/or a legal obligation.</p>
<h2>Sharing</h2>
<p>We may share certain data with: internal teams, partners (brokers, agents, developers) strictly to process your request, technical providers (hosting, CRM, messaging), and authorities if required by law. <strong>We do not sell your data.</strong></p>
<h2>Retention</h2>
<p>We retain data only for as long as necessary for the purposes above and in accordance with applicable legal deadlines.</p>
<h2>International transfers</h2>
<p>Your data may be processed in the United Arab Emirates and/or other countries through our providers. We implement appropriate protective measures.</p>
<h2>Your rights</h2>
<p>You may request access, rectification, deletion, objection, or withdrawal of consent (where applicable).</p>
<p>Contact: <strong>privacy@sofara.io</strong> (or via the contact form).</p>
<h2>Security</h2>
<p>We apply technical and organizational measures to protect your data (restricted access, logging, encryption where relevant).</p>`,

    "legal.terms.title": "Terms & Conditions",
    "legal.terms.content": `<p>By accessing www.sofara.io, you agree to these Terms & Conditions.</p>
<h2>1. Purpose</h2>
<p>The Sofara website provides information and services related to real estate (request qualification, matchmaking, informational content).</p>
<h2>2. Eligibility and accuracy</h2>
<p>You agree to provide accurate information and not to use the site for illegal, fraudulent or abusive purposes.</p>
<h2>3. No guaranteed advice</h2>
<p>Content is provided for informational purposes only. Performance, returns, availability, prices and timelines may change. <strong>No guarantee of results is given.</strong></p>
<h2>4. Intellectual property</h2>
<p>All elements of the site (texts, design, logos, content) are the property of Cevitas Real Estate LLC or its licensors. Unauthorized reproduction is prohibited.</p>
<h2>5. Third-party links and services</h2>
<p>The site may contain links to third-party services (e.g., messaging, forms, platforms). We do not control their content.</p>
<h2>6. Liability</h2>
<p>We shall not be held liable for indirect damages, data loss, or temporary service unavailability.</p>
<h2>7. Modifications</h2>
<p>We may modify these Terms at any time. The version published on the site prevails.</p>
<h2>8. Applicable law</h2>
<p>These Terms are governed by the laws applicable in Dubai, United Arab Emirates.</p>`,

    "legal.cookies.title": "Cookie Policy",
    "legal.cookies.content": `<h2>What is a cookie?</h2>
<p>A cookie is a small file stored on your device that helps the site function and improve your experience.</p>
<h2>Cookies used</h2>
<ul>
<li><strong>Essential:</strong> functionality, security, basic preferences</li>
<li><strong>Analytics:</strong> traffic statistics and performance</li>
<li><strong>Marketing (if enabled):</strong> campaign tracking and advertising optimization</li>
</ul>
<h2>Managing your choices</h2>
<p>You can accept/refuse certain cookies via the cookie banner (if available) and/or via your browser settings. Essential cookies cannot be disabled without affecting site functionality.</p>
<h2>Duration</h2>
<p>Cookies may be automatically deleted at the end of a session or remain for a limited period depending on their purpose.</p>`,

    // Footer
    "footer.description": "The first ambassador platform for real estate in Dubai and the UAE.",
    "footer.platform": "Platform",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "footer.cookies": "Cookies",
    "footer.rights": "© 2026 Sofara. All rights reserved.",
    "footer.regulated": "Sofara is a platform owned by Cevitas Real Estate LLC. Real estate transactions are handled by RERA-licensed agents.",
  },

  fr: {
    // Navbar
    "nav.howItWorks": "Comment ça marche",
    "nav.signIn": "Connexion",

















    "faq.label": "FAQ",
    "faq.title": "Tout ce que vous devez",
    "faq.titleHighlight": "savoir",
    "faq.q1": "Comment mes contacts sont-ils protégés ?",
    "faq.a1": "Chaque contact que vous enregistrez ou qui s'inscrit via votre lien est rattaché à votre compte ambassadeur pendant 12 mois, même s'il contacte ensuite Sofara ou Cevitas directement.",
    "faq.q2": "Puis-je recommander des personnes qui vivent hors des Émirats ?",
    "faq.a2": "Oui. Toute nationalité peut acheter en pleine propriété à Dubaï, et les ambassadeurs Sofara recommandent des clients dans plus de 40 pays. Les visites se font sur place ou en vidéo.",
    "faq.q3": "Combien puis-je gagner réellement ?",
    "faq.a3": "Entre 1 % et 3 % du prix du bien selon le projet : par exemple 15 000 à 45 000 AED sur un appartement à 1,5 million d'AED, et 40 000 à 120 000 AED sur une villa à 4 millions. Le taux de chaque projet est affiché dans votre espace avant de recommander.",
    "faq.q4": "Ai-je besoin d'une licence immobilière ?",
    "faq.a4": "Non. Vous présentez des acheteurs ; Cevitas Real Estate LLC, agence agréée RERA, réalise toutes les étapes réglementées (conseil, visites, contrats). Déclarez vos commissions selon les règles de votre pays de résidence.",
    "faq.q5": "Comment les commissions sont-elles versées ?",
    "faq.a5": "La commission est acquise lorsque l'acheteur signe le SPA et règle l'apport avec les frais DLD. Elle est versée en AED par virement sous 7 jours après le paiement du promoteur à Cevitas, contre une facture émise depuis votre espace.",
    "faq.q6": "Le programme est-il gratuit ?",
    "faq.a6": "Oui, 100% gratuit. Aucun frais d'inscription, aucun abonnement, aucun coût caché. Sofara ne se rémunère que sur les transactions abouties.",




    "legal.back": "Retour",
    "legal.lastUpdated": "Dernière mise à jour : mars 2025",
    "legal.privacy.title": "Politique de confidentialité",
    "legal.privacy.content": `<p>Sofara (www.sofara.io) est une marque exploitée par Cevitas Real Estate LLC, société basée à Dubaï (Émirats Arabes Unis) (« nous »).</p>
<h2>Données collectées</h2>
<p>Nous pouvons collecter :</p>
<ul>
<li>Identité (prénom, nom)</li>
<li>Coordonnées (email, téléphone/WhatsApp)</li>
<li>Informations relatives à votre projet immobilier (budget, préférences, localisation)</li>
<li>Données de navigation (cookies, adresse IP, logs)</li>
<li>Tout contenu envoyé via formulaires, WhatsApp ou email</li>
</ul>
<h2>Finalités</h2>
<p>Vos données servent à : vous contacter, qualifier votre demande, vous proposer des opportunités immobilières, améliorer nos services et notre site, gérer la sécurité, respecter les obligations légales et prévenir la fraude.</p>
<h2>Base légale</h2>
<p>Selon le cas : votre consentement, des mesures pré-contractuelles/contractuelles, notre intérêt légitime (service, sécurité, amélioration), et/ou une obligation légale.</p>
<h2>Partage</h2>
<p>Nous pouvons partager certaines données avec : les équipes internes, les partenaires (brokers, agents, promoteurs) strictement pour traiter votre demande, les prestataires techniques (hébergement, CRM, messagerie) et les autorités si la loi l'exige. <strong>Nous ne vendons pas vos données.</strong></p>
<h2>Conservation</h2>
<p>Nous conservons les données uniquement le temps nécessaire aux finalités ci-dessus et conformément aux délais légaux applicables.</p>
<h2>Transferts internationaux</h2>
<p>Vos données peuvent être traitées aux Émirats Arabes Unis et/ou dans d'autres pays via nos prestataires. Nous mettons en place des mesures de protection appropriées.</p>
<h2>Vos droits</h2>
<p>Vous pouvez demander l'accès, la rectification, la suppression, l'opposition ou le retrait du consentement (le cas échéant).</p>
<p>Contact : <strong>privacy@sofara.io</strong> (ou via le formulaire de contact).</p>
<h2>Sécurité</h2>
<p>Nous appliquons des mesures techniques et organisationnelles pour protéger vos données (accès restreint, journalisation, chiffrement le cas échéant).</p>`,

    "legal.terms.title": "Conditions Générales",
    "legal.terms.content": `<p>En accédant à www.sofara.io, vous acceptez ces Conditions Générales.</p>
<h2>1. Objet</h2>
<p>Le site Sofara fournit des informations et des services liés à l'immobilier (qualification de demandes, mise en relation, contenu informatif).</p>
<h2>2. Éligibilité et exactitude</h2>
<p>Vous vous engagez à fournir des informations exactes et à ne pas utiliser le site à des fins illégales, frauduleuses ou abusives.</p>
<h2>3. Pas de conseil garanti</h2>
<p>Le contenu est fourni à titre informatif uniquement. Performances, rendements, disponibilités, prix et délais peuvent évoluer. <strong>Aucune garantie de résultat n'est donnée.</strong></p>
<h2>4. Propriété intellectuelle</h2>
<p>Tous les éléments du site (textes, design, logos, contenus) sont la propriété de Cevitas Real Estate LLC ou de ses concédants. Toute reproduction non autorisée est interdite.</p>
<h2>5. Liens et services tiers</h2>
<p>Le site peut contenir des liens vers des services tiers (ex. messagerie, formulaires, plateformes). Nous n'en contrôlons pas le contenu.</p>
<h2>6. Responsabilité</h2>
<p>Nous ne saurons être tenus responsables de dommages indirects, perte de données ou indisponibilité temporaire du service.</p>
<h2>7. Modifications</h2>
<p>Nous pouvons modifier ces Conditions à tout moment. La version publiée sur le site prévaut.</p>
<h2>8. Droit applicable</h2>
<p>Ces Conditions sont régies par les lois applicables à Dubaï, Émirats Arabes Unis.</p>`,

    "legal.cookies.title": "Politique de cookies",
    "legal.cookies.content": `<h2>Qu'est-ce qu'un cookie ?</h2>
<p>Un cookie est un petit fichier stocké sur votre appareil qui aide le site à fonctionner et à améliorer votre expérience.</p>
<h2>Cookies utilisés</h2>
<ul>
<li><strong>Essentiels :</strong> fonctionnalité, sécurité, préférences de base</li>
<li><strong>Analytics :</strong> statistiques de trafic et de performance</li>
<li><strong>Marketing (si activé) :</strong> tracking de campagne et optimisation publicitaire</li>
</ul>
<h2>Gestion de vos choix</h2>
<p>Vous pouvez accepter/refuser certains cookies via le bandeau cookie (s'il est disponible) et/ou via les paramètres de votre navigateur. Les cookies essentiels ne peuvent pas être désactivés sans affecter le fonctionnement du site.</p>
<h2>Durée</h2>
<p>Les cookies peuvent être supprimés automatiquement à la fin d'une session ou rester pour une durée limitée selon leur finalité.</p>`,

    "footer.description": "La première plateforme d'ambassadeurs pour l'immobilier à Dubaï et aux Émirats.",
    "footer.platform": "Plateforme",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Politique de confidentialité",
    "footer.terms": "Conditions générales",
    "footer.cookies": "Cookies",
    "footer.rights": "© 2026 Sofara. Tous droits réservés.",
    "footer.regulated": "Sofara est une plateforme détenue par Cevitas Real Estate LLC. Les transactions immobilières sont gérées par des agents licenciés RERA.",
  },

  es: {
    "nav.howItWorks": "Cómo funciona",
    "nav.signIn": "Iniciar sesión",

















    "faq.label": "FAQ",
    "faq.title": "Todo lo que necesitas",
    "faq.titleHighlight": "saber",
    "faq.q1": "¿Cómo se protegen mis contactos?",
    "faq.a1": "Cada contacto que registras o que se inscribe con tu enlace queda vinculado a tu cuenta de embajador durante 12 meses, aunque después contacte directamente con Sofara o Cevitas.",
    "faq.q2": "¿Puedo recomendar a personas que viven fuera de los Emiratos?",
    "faq.a2": "Sí. Cualquier nacionalidad puede comprar en plena propiedad en Dubái, y los embajadores de Sofara recomiendan clientes en más de 40 países. Las visitas se hacen en persona o por vídeo.",
    "faq.q3": "¿Cuánto puedo ganar realmente?",
    "faq.a3": "Entre el 1 % y el 3 % del precio según el proyecto: por ejemplo 15.000 a 45.000 AED por un apartamento de 1,5 millones de AED, y 40.000 a 120.000 AED por una villa de 4 millones. La tasa de cada proyecto aparece en tu panel antes de recomendar.",
    "faq.q4": "¿Necesito una licencia inmobiliaria?",
    "faq.a4": "No. Tú presentas compradores; Cevitas Real Estate LLC, agencia autorizada por la RERA, realiza todas las etapas reguladas (asesoría, visitas, contratos). Declara tus comisiones según las normas de tu país de residencia.",
    "faq.q5": "¿Cómo se pagan las comisiones?",
    "faq.a5": "La comisión se genera cuando el comprador firma el SPA y paga la entrada con las tasas DLD. Se abona en AED por transferencia en 7 días desde que el promotor paga a Cevitas, contra una factura emitida desde tu panel.",
    "faq.q6": "¿El programa es gratuito?",
    "faq.a6": "Sí, 100% gratuito. Sin cuotas de inscripción, sin suscripción, sin costes ocultos. Sofara solo gana en las transacciones cerradas.",




    "legal.back": "Volver",
    "legal.lastUpdated": "Última actualización: marzo 2025",
    "legal.privacy.title": "Política de privacidad",
    "legal.privacy.content": `<p>Sofara (www.sofara.io) es una marca operada por Cevitas Real Estate LLC, empresa con sede en Dubái (Emiratos Árabes Unidos) («nosotros»).</p>
<h2>Datos recopilados</h2>
<p>Podemos recopilar:</p>
<ul>
<li>Identidad (nombre, apellido)</li>
<li>Datos de contacto (email, teléfono/WhatsApp)</li>
<li>Información sobre tu proyecto inmobiliario (presupuesto, preferencias, ubicación)</li>
<li>Datos de navegación (cookies, dirección IP, logs)</li>
<li>Cualquier contenido enviado por formularios, WhatsApp o email</li>
</ul>
<h2>Finalidades</h2>
<p>Tus datos se usan para: contactarte, cualificar tu solicitud, ofrecerte oportunidades inmobiliarias, mejorar nuestros servicios y web, gestionar la seguridad, cumplir obligaciones legales y prevenir el fraude.</p>
<h2>Base legal</h2>
<p>Según el caso: tu consentimiento, medidas precontractuales/contractuales, nuestro interés legítimo (servicio, seguridad, mejora) y/o una obligación legal.</p>
<h2>Compartición</h2>
<p>Podemos compartir ciertos datos con: equipos internos, partners (brokers, agentes, promotores) estrictamente para tramitar tu solicitud, proveedores técnicos (hosting, CRM, mensajería) y autoridades si la ley lo exige. <strong>No vendemos tus datos.</strong></p>
<h2>Conservación</h2>
<p>Conservamos los datos solo el tiempo necesario para las finalidades anteriores y conforme a los plazos legales aplicables.</p>
<h2>Transferencias internacionales</h2>
<p>Tus datos pueden tratarse en los Emiratos Árabes Unidos y/u otros países a través de nuestros proveedores. Aplicamos medidas de protección adecuadas.</p>
<h2>Tus derechos</h2>
<p>Puedes solicitar acceso, rectificación, supresión, oposición o retirada del consentimiento (cuando aplique).</p>
<p>Contacto: <strong>privacy@sofara.io</strong> (o vía el formulario de contacto).</p>
<h2>Seguridad</h2>
<p>Aplicamos medidas técnicas y organizativas para proteger tus datos (acceso restringido, registro, cifrado cuando aplica).</p>`,

    "legal.terms.title": "Términos y Condiciones",
    "legal.terms.content": `<p>Al acceder a www.sofara.io, aceptas estos Términos y Condiciones.</p>
<h2>1. Objeto</h2>
<p>El sitio Sofara ofrece información y servicios relacionados con el sector inmobiliario (cualificación de solicitudes, intermediación, contenido informativo).</p>
<h2>2. Elegibilidad y exactitud</h2>
<p>Te comprometes a proporcionar información exacta y a no usar el sitio con fines ilegales, fraudulentos o abusivos.</p>
<h2>3. Sin asesoramiento garantizado</h2>
<p>El contenido se proporciona solo con fines informativos. Rendimientos, disponibilidades, precios y plazos pueden cambiar. <strong>No se garantiza ningún resultado.</strong></p>
<h2>4. Propiedad intelectual</h2>
<p>Todos los elementos del sitio (textos, diseño, logos, contenidos) son propiedad de Cevitas Real Estate LLC o de sus licenciantes. La reproducción no autorizada está prohibida.</p>
<h2>5. Enlaces y servicios de terceros</h2>
<p>El sitio puede contener enlaces a servicios de terceros (p. ej., mensajería, formularios, plataformas). No controlamos su contenido.</p>
<h2>6. Responsabilidad</h2>
<p>No seremos responsables de daños indirectos, pérdida de datos o indisponibilidad temporal del servicio.</p>
<h2>7. Modificaciones</h2>
<p>Podemos modificar estos Términos en cualquier momento. La versión publicada en el sitio prevalece.</p>
<h2>8. Ley aplicable</h2>
<p>Estos Términos se rigen por las leyes aplicables en Dubái, Emiratos Árabes Unidos.</p>`,

    "legal.cookies.title": "Política de cookies",
    "legal.cookies.content": `<h2>¿Qué es una cookie?</h2>
<p>Una cookie es un pequeño archivo almacenado en tu dispositivo que ayuda al sitio a funcionar y a mejorar tu experiencia.</p>
<h2>Cookies utilizadas</h2>
<ul>
<li><strong>Esenciales:</strong> funcionalidad, seguridad, preferencias básicas</li>
<li><strong>Analítica:</strong> estadísticas de tráfico y rendimiento</li>
<li><strong>Marketing (si está activado):</strong> seguimiento de campañas y optimización publicitaria</li>
</ul>
<h2>Gestión de tus elecciones</h2>
<p>Puedes aceptar/rechazar ciertas cookies vía el banner de cookies (si está disponible) y/o vía la configuración de tu navegador. Las cookies esenciales no pueden desactivarse sin afectar al funcionamiento del sitio.</p>
<h2>Duración</h2>
<p>Las cookies pueden borrarse automáticamente al final de una sesión o permanecer un tiempo limitado según su finalidad.</p>`,

    "footer.description": "La primera plataforma de embajadores para el inmobiliario en Dubái y los Emiratos.",
    "footer.platform": "Plataforma",
    "footer.legal": "Legal",
    "footer.privacy": "Política de privacidad",
    "footer.terms": "Términos y Condiciones",
    "footer.cookies": "Cookies",
    "footer.rights": "© 2026 Sofara. Todos los derechos reservados.",
    "footer.regulated": "Sofara es una plataforma propiedad de Cevitas Real Estate LLC. Las transacciones inmobiliarias son gestionadas por agentes licenciados RERA.",
  },

  ru: {
    "nav.howItWorks": "Как это работает",
    "nav.signIn": "Войти",

















    "faq.label": "FAQ",
    "faq.title": "Всё, что вам нужно",
    "faq.titleHighlight": "знать",
    "faq.q1": "Как защищены мои контакты?",
    "faq.a1": "Каждый контакт, который вы зарегистрировали или который пришёл по вашей ссылке, закреплён за вашим аккаунтом на 12 месяцев, даже если потом он обратится в Sofara или Cevitas напрямую.",
    "faq.q2": "Можно ли рекомендовать людей, которые живут не в ОАЭ?",
    "faq.a2": "Да. Граждане любой страны могут купить недвижимость в Дубае в полную собственность, а амбассадоры Sofara рекомендуют клиентов более чем из 40 стран. Показы проходят на месте или по видео.",
    "faq.q3": "Сколько я могу реально заработать?",
    "faq.a3": "От 1% до 3% от цены объекта в зависимости от проекта: например, от 15 000 до 45 000 AED с квартиры за 1,5 млн AED и от 40 000 до 120 000 AED с виллы за 4 млн. Ставка по каждому проекту указана в личном кабинете до рекомендации.",
    "faq.q4": "Нужна ли мне лицензия риелтора?",
    "faq.a4": "Нет. Вы знакомите покупателей с агентством; Cevitas Real Estate LLC с лицензией RERA выполняет все регулируемые этапы (консультации, показы, договоры). Декларируйте комиссии по правилам страны вашего резидентства.",
    "faq.q5": "Как выплачиваются комиссии?",
    "faq.a5": "Комиссия начисляется, когда покупатель подписывает SPA и вносит первый взнос со сборами DLD. Выплата производится в AED банковским переводом в течение 7 дней после оплаты девелопера компании Cevitas, по счёту из личного кабинета.",
    "faq.q6": "Программа бесплатная?",
    "faq.a6": "Да, 100% бесплатная. Никаких регистрационных сборов, подписки или скрытых платежей. Sofara зарабатывает только на закрытых сделках.",




    "legal.back": "Назад",
    "legal.lastUpdated": "Последнее обновление: март 2025",
    "legal.privacy.title": "Политика конфиденциальности",
    "legal.privacy.content": `<p>Sofara (www.sofara.io) — бренд, управляемый Cevitas Real Estate LLC, компанией, базирующейся в Дубае (ОАЭ) («мы»).</p>
<h2>Собираемые данные</h2>
<p>Мы можем собирать:</p>
<ul>
<li>Идентификационные данные (имя, фамилия)</li>
<li>Контактные данные (email, телефон/WhatsApp)</li>
<li>Информацию о вашем проекте недвижимости (бюджет, предпочтения, локация)</li>
<li>Данные навигации (cookies, IP-адрес, логи)</li>
<li>Любой контент, отправленный через формы, WhatsApp или email</li>
</ul>
<h2>Цели</h2>
<p>Ваши данные используются для: связи с вами, квалификации запроса, предложения возможностей в недвижимости, улучшения наших сервисов и сайта, обеспечения безопасности, соблюдения юридических обязательств и предотвращения мошенничества.</p>
<h2>Юридическое основание</h2>
<p>В зависимости от случая: ваше согласие, преддоговорные/договорные меры, наш законный интерес (сервис, безопасность, улучшение) и/или юридическое обязательство.</p>
<h2>Передача данных</h2>
<p>Мы можем передавать определённые данные: внутренним командам, партнёрам (брокерам, агентам, застройщикам) исключительно для обработки вашего запроса, техническим провайдерам (хостинг, CRM, мессенджеры) и властям, если это требуется по закону. <strong>Мы не продаём ваши данные.</strong></p>
<h2>Хранение</h2>
<p>Мы храним данные только в течение времени, необходимого для указанных целей и в соответствии с применимыми правовыми сроками.</p>
<h2>Международная передача</h2>
<p>Ваши данные могут обрабатываться в ОАЭ и/или других странах через наших провайдеров. Мы применяем соответствующие меры защиты.</p>
<h2>Ваши права</h2>
<p>Вы можете запросить доступ, исправление, удаление, возражение или отзыв согласия (где применимо).</p>
<p>Контакт: <strong>privacy@sofara.io</strong> (или через форму обратной связи).</p>
<h2>Безопасность</h2>
<p>Мы применяем технические и организационные меры для защиты ваших данных (ограниченный доступ, журналирование, шифрование где применимо).</p>`,

    "legal.terms.title": "Условия использования",
    "legal.terms.content": `<p>Используя www.sofara.io, вы соглашаетесь с этими Условиями использования.</p>
<h2>1. Цель</h2>
<p>Сайт Sofara предоставляет информацию и услуги, связанные с недвижимостью (квалификация запросов, подбор, информационный контент).</p>
<h2>2. Право на использование и точность</h2>
<p>Вы соглашаетесь предоставлять точную информацию и не использовать сайт в незаконных, мошеннических или абьюзивных целях.</p>
<h2>3. Отсутствие гарантированных советов</h2>
<p>Контент предоставляется только в информационных целях. Доходность, доступность, цены и сроки могут меняться. <strong>Никакой гарантии результата не даётся.</strong></p>
<h2>4. Интеллектуальная собственность</h2>
<p>Все элементы сайта (тексты, дизайн, логотипы, контент) являются собственностью Cevitas Real Estate LLC или её лицензиаров. Несанкционированное воспроизведение запрещено.</p>
<h2>5. Сторонние ссылки и сервисы</h2>
<p>Сайт может содержать ссылки на сторонние сервисы (например, мессенджеры, формы, платформы). Мы не контролируем их содержимое.</p>
<h2>6. Ответственность</h2>
<p>Мы не несём ответственности за косвенный ущерб, потерю данных или временную недоступность сервиса.</p>
<h2>7. Изменения</h2>
<p>Мы можем изменять эти Условия в любое время. Версия, опубликованная на сайте, имеет приоритет.</p>
<h2>8. Применимое право</h2>
<p>Эти Условия регулируются законами, применимыми в Дубае, ОАЭ.</p>`,

    "legal.cookies.title": "Политика cookies",
    "legal.cookies.content": `<h2>Что такое cookie?</h2>
<p>Cookie — это небольшой файл, хранящийся на вашем устройстве, который помогает сайту работать и улучшает ваш опыт.</p>
<h2>Используемые cookies</h2>
<ul>
<li><strong>Обязательные:</strong> функциональность, безопасность, базовые настройки</li>
<li><strong>Аналитика:</strong> статистика трафика и производительности</li>
<li><strong>Маркетинг (если включено):</strong> отслеживание кампаний и оптимизация рекламы</li>
</ul>
<h2>Управление выбором</h2>
<p>Вы можете принять/отклонить определённые cookies через баннер cookies (если доступен) и/или через настройки вашего браузера. Обязательные cookies нельзя отключить без влияния на работу сайта.</p>
<h2>Срок хранения</h2>
<p>Cookies могут автоматически удаляться по окончании сессии или храниться ограниченное время в зависимости от их назначения.</p>`,

    "footer.description": "Первая платформа амбассадоров недвижимости в Дубае и ОАЭ.",
    "footer.platform": "Платформа",
    "footer.legal": "Правовая информация",
    "footer.privacy": "Политика конфиденциальности",
    "footer.terms": "Условия использования",
    "footer.cookies": "Cookies",
    "footer.rights": "© 2026 Sofara. Все права защищены.",
    "footer.regulated": "Sofara — платформа, принадлежащая Cevitas Real Estate LLC. Сделки с недвижимостью обрабатываются агентами, лицензированными RERA.",
  },
  // Deprecated alias kept for legacy dashboard/admin code paths.
  get ar() { return this.en; },
};
