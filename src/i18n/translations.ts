export type Lang = "fr" | "en";

export const translations: Record<Lang, Record<string, string>> = {
  fr: {
    // Navbar
    "nav.platform": "Plateforme",
    "nav.benefits": "Avantages",
    "nav.whyDubai": "Pourquoi Dubai",
    "nav.howItWorks": "Comment ça marche",
    "nav.apply": "Postuler",
    "nav.join": "Rejoindre",

    // Hero
    "hero.badge": "Programme Ambassadeur 2025",
    "hero.slide1.headline": "Monétisez votre réseau grâce à l'immobilier de Dubai.",
    "hero.slide1.sub": "Devenez ambassadeur Sofara et touchez des commissions exceptionnelles sur chaque transaction. Aucune licence requise.",
    "hero.slide2.headline": "L'immobilier de luxe, accessible à votre réseau.",
    "hero.slide2.sub": "Penthouses, villas sur Palm — offrez à vos contacts l'accès au marché immobilier le plus dynamique au monde.",
    "hero.slide3.headline": "Dubai : le placement n°1 des investisseurs mondiaux en 2025.",
    "hero.slide3.sub": "0% d'impôt, rendements locatifs de 8 à 15%, +32% de transactions en 2025. Le moment est maintenant.",
    "hero.cta": "Devenir Ambassadeur",
    "hero.ctaSecondary": "",
    "hero.trust": "Rejoignez 60+ ambassadeurs actifs",
    "hero.metric1": "Commissions versées",
    "hero.metric2": "Ambassadeurs dans 12 pays",
    "hero.metric3": "Rendement locatif moyen",

    // Logo bar
    "logos.title": "Dubai dans la presse internationale",

    // Stats
    "stats.ambassadors": "Ambassadeurs actifs",
    "stats.commissions": "Commissions versées",
    "stats.satisfaction": "Taux de satisfaction",
    "stats.countries": "Présence mondiale",
    "stats.countriesValue": "12 pays",
    "stats.avgConversion": "Conversion moyenne",

    // Market Data 2025
    "market.label": "Données marché 2025",
    "market.title": "Dubai en chiffres :",
    "market.titleHighlight": "2025",
    "market.description": "Le marché immobilier de Dubai continue de battre tous les records. Les chiffres parlent d'eux-mêmes.",
    "market.transactions": "Transactions immobilières",
    "market.transactionsSub": "+32% vs 2023 (DLD, 2025)",
    "market.volume": "Volume de transactions",
    "market.volumeSub": "Record historique en 2025",
    "market.units": "Unités vendues en 2025",
    "market.unitsSub": "Plus haut niveau jamais atteint",
    "market.foreign": "Investisseurs étrangers",
    "market.foreignSub": "+41% d'acheteurs internationaux",
    "market.pricePerSqm": "Prix moyen / m²",
    "market.pricePerSqmSub": "70% moins cher que Londres",
    "market.nationalities": "Nationalités d'acheteurs",
    "market.nationalitiesSub": "Un marché véritablement global",
    "market.source": "Sources : Dubai Land Department (DLD), Knight Frank, CBRE, Property Finder — Données 2025",

    // Platform features
    "platform.label": "La plateforme",
    "platform.title": "Une technologie conçue pour",
    "platform.titleHighlight": "protéger vos intérêts",
    "platform.description": "Sofara n'est pas un simple programme d'affiliation. C'est une plateforme technologique de nouvelle génération qui protège votre identité, vos leads et vos commissions.",
    "platform.anonymity": "Anonymat garanti",
    "platform.anonymityDesc": "Votre identité n'est jamais révélée aux promoteurs. Vous restez invisible.",
    "platform.leadProtection": "Protection des leads",
    "platform.leadProtectionDesc": "Vos contacts sont cryptés et protégés. Impossible de contourner votre lien.",
    "platform.discretion": "Discrétion totale",
    "platform.discretionDesc": "Aucune trace publique. Votre réseau ne saura pas que vous touchez une commission.",
    "platform.dashboard": "Dashboard temps réel",
    "platform.dashboardDesc": "Suivez vos leads, conversions et commissions en temps réel depuis votre espace.",
    "platform.compliance": "Conformité légale",
    "platform.complianceDesc": "Structure juridique solide. Paiements conformes aux réglementations internationales.",
    "platform.instant": "Paiement instantané",
    "platform.instantDesc": "Commissions versées automatiquement dès la clôture de la transaction.",

    // Why Dubai
    "dubai.label": "Pourquoi Dubai",
    "dubai.title": "Le marché immobilier le plus",
    "dubai.titleHighlight": "attractif",
    "dubai.titleEnd": "au monde",
    "dubai.description": "Dubai n'est pas juste une ville — c'est une opportunité générationnelle. Avec une croissance de +32% en 2025, 0% d'impôts et des rendements locatifs imbattables, c'est LE marché où vos contacts veulent investir.",
    "dubai.growth": "Croissance 2025",
    "dubai.growthSub": "Marché immobilier de Dubai",
    "dubai.tax": "0% d'impôt",
    "dubai.taxDesc": "Aucun impôt sur le revenu, les plus-values ou les revenus locatifs.",
    "dubai.yield": "8-15% de rendement",
    "dubai.yieldDesc": "Des rendements locatifs parmi les plus élevés au monde.",
    "dubai.market": "Marché en croissance",
    "dubai.marketDesc": "+32% de transactions en 2025, une demande qui ne faiblit pas.",
    "dubai.hub": "Hub international",
    "dubai.hubDesc": "Un carrefour entre l'Europe, l'Asie et l'Afrique. Accès mondial.",
    "dubai.secure": "Cadre sécurisé",
    "dubai.secureDesc": "Réglementation solide, visa investisseur, stabilité politique.",
    "dubai.lifestyle": "Qualité de vie",
    "dubai.lifestyleDesc": "365 jours de soleil, infrastructures de classe mondiale.",

    // Storytelling
    "story.label": "Votre opportunité",
    "story.title": "Votre réseau est votre",
    "story.titleHighlight": "plus grand actif",
    "story.description": "Vous connaissez des personnes qui cherchent à investir, à diversifier leur patrimoine, ou à s'expatrier à Dubai ? Avec Sofara, transformez chaque recommandation en revenu. Pas besoin d'être agent immobilier — juste un connecteur.",
    "story.point1": "Vous recommandez Sofara à votre réseau (amis, famille, collègues, followers).",
    "story.point2": "Vos contacts investissent dans l'immobilier de Dubai via notre plateforme sécurisée.",
    "story.point3": "Vous touchez une commission généreuse sur chaque transaction — en toute discrétion.",
    "story.point4": "Plus votre réseau investit, plus vos revenus augmentent — sans plafond, sans limite.",
    "story.cta": "Rejoindre le programme",
    "story.statLabel": "Commission moy. par transaction",

    // Benefits
    "benefits.label": "Avantages",
    "benefits.title": "Pourquoi nous",
    "benefits.titleHighlight": "rejoindre",
    "benefits.description": "Un programme pensé pour récompenser votre engagement et accélérer votre succès. Conçu par des entrepreneurs, pour des entrepreneurs.",
    "benefits.commissions": "Commission de 2,5%",
    "benefits.commissionsDesc": "Touchez 2,5% sur la valeur de chaque bien vendu via vos recommandations. Sans plafond, sans limite.",
    "benefits.tools": "Outils marketing IA",
    "benefits.toolsDesc": "Kit complet avec contenus personnalisés, liens trackés et dashboard analytics en temps réel, propulsé par l'IA.",
    "benefits.community": "Transparence totale",
    "benefits.communityDesc": "Suivez chaque lead, chaque transaction et chaque commission en temps réel. Pas de frais cachés, pas de surprises.",
    "benefits.recognition": "Reconnaissance",
    "benefits.recognitionDesc": "Badges, classements et mise en avant sur nos canaux officiels. Programme VIP pour les top performers.",
    "benefits.perks": "Avantages exclusifs",
    "benefits.perksDesc": "Voyages immersifs à Dubai, accès anticipé aux projets off-market et invitations VIP.",
    "benefits.growth": "Formation continue",
    "benefits.growthDesc": "Masterclasses en marketing digital, personal branding et négociation immobilière.",

    // How it works
    "how.label": "Comment ça marche",
    "how.title": "4 étapes vers le",
    "how.titleHighlight": "succès",
    "how.step1": "Postulez",
    "how.step1Desc": "Remplissez le formulaire en 2 minutes. Nous sélectionnons soigneusement chaque ambassadeur.",
    "how.step2": "Onboarding",
    "how.step2Desc": "Formation complète, accès au dashboard et kit marketing personnalisé en 24h.",
    "how.step3": "Uploadez vos leads",
    "how.step3Desc": "Ajoutez vos contacts directement sur la plateforme. Chaque lead est protégé et rattaché à votre compte ambassadeur.",
    "how.step4": "Récoltez",
    "how.step4Desc": "Commissions versées automatiquement. Suivi transparent en temps réel.",

    // Investor Metrics
    "investor.label": "Métriques clés",
    "investor.title": "Des résultats qui parlent aux",
    "investor.titleHighlight": "ambassadeurs",
    "investor.description": "Sofara affiche une croissance rapide dès son lancement. Un programme qui récompense vraiment votre engagement.",
    "investor.paid": "Commissions versées",
    "investor.paidTrend": "En croissance",
    "investor.ambassadors": "Ambassadeurs actifs",
    "investor.ambassadorsTrend": "+25 ce trimestre",
    "investor.countries": "Pays couverts",
    "investor.countriesTrend": "En expansion",
    "investor.mrr": "Commission moy./mois",
    "investor.mrrTrend": "Top ambassadeurs",
    "investor.ltv": "LTV/CAC ratio",
    "investor.ltvTrend": "Excellent",
    "investor.conversion": "Temps de conversion",
    "investor.conversionTrend": "Lead → Transaction",
    "investor.cta": "Rejoindre le programme",

    // Testimonials
    "testimonials.label": "Témoignages",
    "testimonials.title": "Ils ont rejoint",
    "testimonials.titleHighlight": "Sofara",
    "testimonials.subtitle": "Des ambassadeurs du monde entier témoignent de leur succès.",
    "testimonials.earned": "gagnés",
    "testimonials.t1.name": "Karim B.",
    "testimonials.t1.role": "Ambassadeur · Dubai",
    "testimonials.t1.text": "En 3 mois, j'ai recommandé Sofara à 8 contacts. 3 ont investi. Résultat : plus de €8 000 de commissions. Le système est transparent et ultra simple.",
    "testimonials.t2.name": "Sarah M.",
    "testimonials.t2.role": "Influenceuse · Paris",
    "testimonials.t2.text": "La discrétion de Sofara est ce qui m'a convaincue. Mes followers ne savent pas que je touche une commission — ils me remercient juste pour la recommandation.",
    "testimonials.t3.name": "Jean-Pierre D.",
    "testimonials.t3.role": "Entrepreneur · Genève",
    "testimonials.t3.text": "Avec mon réseau d'entrepreneurs, les commissions sont tombées naturellement. J'apprécie la protection de mes leads — personne ne peut les contourner.",
    "testimonials.t4.name": "Amina K.",
    "testimonials.t4.role": "Consultante · Casablanca",
    "testimonials.t4.text": "Je conseille déjà mes clients sur la diversification patrimoniale. Sofara m'a permis de monétiser cette expertise avec un outil professionnel.",

    // FAQ
    "faq.label": "Questions fréquentes",
    "faq.title": "Tout ce que vous devez",
    "faq.titleHighlight": "savoir",
    "faq.q1": "Comment mes leads sont-ils protégés ?",
    "faq.a1": "Chaque lead est associé de manière cryptographique à votre lien unique. Même si un prospect contacte Sofara directement, il reste lié à votre compte ambassadeur pendant 12 mois. Impossible de contourner votre attribution.",
    "faq.q2": "Mon identité est-elle visible par les acheteurs ?",
    "faq.a2": "Non. Votre identité est 100% protégée. Les acheteurs ne voient jamais votre nom ni ne savent que vous touchez une commission. La discrétion est au cœur de notre plateforme.",
    "faq.q3": "Combien puis-je gagner concrètement ?",
    "faq.a3": "Les commissions varient de €6 000 à €30 000 par transaction selon le bien et le projet. Nos top ambassadeurs dépassent €5 000/mois.",
    "faq.q4": "Faut-il une licence immobilière ?",
    "faq.a4": "Non. Vous n'êtes pas agent immobilier, vous êtes un apporteur d'affaires. La structure juridique de Sofara est conçue pour que vous exerciez cette activité en toute légalité dans votre pays.",
    "faq.q5": "Comment sont versées les commissions ?",
    "faq.a5": "Les commissions sont versées par virement bancaire international dans les 7 jours suivant la clôture de la transaction. Vous pouvez suivre le statut en temps réel sur votre dashboard.",
    "faq.q6": "Le programme est-il gratuit ?",
    "faq.a6": "Oui, 100% gratuit. Aucun frais d'inscription, aucun abonnement, aucun coût caché. Sofara se rémunère uniquement sur les transactions conclues.",

    // CTA
    "cta.title": "Prêt à faire partie de",
    "cta.titleHighlight": "l'élite",
    "cta.description": "Les places sont limitées. Postulez maintenant et recevez une réponse sous 48h.",
    "cta.lastNameLabel": "Nom",
    "cta.lastNamePlaceholder": "Votre nom",
    "cta.firstNameLabel": "Prénom",
    "cta.firstNamePlaceholder": "Votre prénom",
    "cta.emailLabel": "Email",
    "cta.emailPlaceholder": "Votre adresse email",
    "cta.phoneLabel": "Téléphone",
    "cta.phonePlaceholder": "Numéro de téléphone",
    "cta.countryLabel": "Pays de résidence",
    "cta.countryPlaceholder": "Sélectionnez votre pays",
    "cta.profileLabel": "Votre profil",
    "cta.profilePlaceholder": "Sélectionnez votre profil",
    "cta.linkedinLabel": "LinkedIn ou Instagram (optionnel)",
    "cta.linkedinPlaceholder": "Lien vers votre profil",
    "cta.motivationLabel": "Motivation",
    "cta.motivationPlaceholder": "Pourquoi souhaitez-vous devenir ambassadeur Sofara ? Décrivez brièvement votre réseau et votre expérience...",
    "cta.profileInfluencer": "Influenceur / Créateur de contenu",
    "cta.profileAgent": "Agent immobilier",
    "cta.profileConsultant": "Consultant / Conseiller",
    "cta.profileEntrepreneur": "Entrepreneur",
    "cta.profileInvestor": "Investisseur",
    "cta.profileOther": "Autre",
    "cta.submit": "Soumettre ma candidature",
    "cta.terms": "En soumettant ce formulaire, vous acceptez nos conditions générales. Vos données sont protégées et ne seront jamais partagées.",
    "cta.errorFill": "Veuillez remplir tous les champs obligatoires",
    "cta.successTitle": "Candidature envoyée !",
    "cta.successDesc": "Nous reviendrons vers vous sous 48h.",
    "cta.successHeading": "Candidature reçue !",
    "cta.successMessage": "Notre équipe analyse votre profil. Vous recevrez une réponse dans les 48 prochaines heures.",

    // Commissions
    "commission.label": "Transparence totale",
    "commission.title": "Une commission unique,",
    "commission.titleHighlight": "claire et généreuse",
    "commission.description": "Chez Sofara, pas de surprise. Un taux unique, public et garanti. Vous savez exactement ce que vous gagnez, avant même de recommander.",
    "commission.badgeSingle": "Commission unique",
    "commission.singleDesc": "Sur chaque transaction conclue grâce à votre recommandation, vous touchez 2,5% de la valeur totale du bien. Simple, transparent, sans condition cachée.",
    "commission.ofValue": "de la valeur du bien",
    "commission.note": "Les commissions sont calculées sur la valeur totale du bien vendu et versées automatiquement après la clôture de la transaction.",

    // Legal pages
    "legal.back": "Retour",
    "legal.lastUpdated": "Dernière mise à jour : mars 2025",
    "legal.privacy.title": "Politique de confidentialité",
    "legal.privacy.content": `<p>Sofara (www.sofara.ae) est une marque exploitée par Cevitas Real Estate LLC, société basée à Dubaï (Émirats Arabes Unis) (« nous »).</p>
<h2>Données collectées</h2>
<p>Nous pouvons collecter :</p>
<ul>
<li>Identité (nom, prénom)</li>
<li>Coordonnées (email, téléphone/WhatsApp)</li>
<li>Informations liées à votre projet immobilier (budget, préférences, localisation)</li>
<li>Données de navigation (cookies, adresse IP, logs)</li>
<li>Tout contenu que vous nous envoyez via formulaires, WhatsApp ou email</li>
</ul>
<h2>Finalités</h2>
<p>Vos données sont utilisées pour : vous contacter, qualifier votre demande, vous proposer des opportunités immobilières, améliorer nos services et notre site, gérer la sécurité, respecter nos obligations légales et lutter contre la fraude.</p>
<h2>Base légale</h2>
<p>Selon les cas : votre consentement, l'exécution de mesures précontractuelles/contractuelles, notre intérêt légitime (service, sécurité, amélioration), et/ou une obligation légale.</p>
<h2>Partage</h2>
<p>Nous pouvons partager certaines données avec : équipes internes, partenaires (brokers, agents, promoteurs) strictement pour traiter votre demande, prestataires techniques (hébergement, CRM, messagerie), et autorités si requis par la loi. <strong>Nous ne vendons pas vos données.</strong></p>
<h2>Conservation</h2>
<p>Nous conservons les données uniquement le temps nécessaire aux finalités ci-dessus et selon les délais légaux applicables.</p>
<h2>Transferts internationaux</h2>
<p>Vos données peuvent être traitées aux Émirats Arabes Unis et/ou dans d'autres pays via nos prestataires. Nous mettons en place des mesures de protection appropriées.</p>
<h2>Vos droits</h2>
<p>Vous pouvez demander l'accès, la rectification, la suppression, l'opposition, ou le retrait du consentement (quand applicable).</p>
<p>Contact : <strong>privacy@sofara.ae</strong> (ou via le formulaire de contact).</p>
<h2>Sécurité</h2>
<p>Nous appliquons des mesures techniques et organisationnelles pour protéger vos données (accès restreint, journalisation, chiffrement lorsque pertinent).</p>`,

    "legal.terms.title": "Conditions générales d'utilisation",
    "legal.terms.content": `<p>En accédant à www.sofara.ae, vous acceptez les présentes CGU.</p>
<h2>1. Objet</h2>
<p>Le site Sofara fournit des informations et services liés à l'immobilier (qualification de demande, mise en relation, contenu informatif).</p>
<h2>2. Éligibilité et exactitude</h2>
<p>Vous vous engagez à fournir des informations exactes et à ne pas utiliser le site à des fins illégales, frauduleuses ou abusives.</p>
<h2>3. Absence de conseil garanti</h2>
<p>Les contenus sont fournis à titre informatif. Les performances, rendements, disponibilités, prix et délais peuvent évoluer. <strong>Aucune garantie de résultat n'est donnée.</strong></p>
<h2>4. Propriété intellectuelle</h2>
<p>Tous les éléments du site (textes, design, logos, contenus) sont la propriété de Cevitas Real Estate LLC ou de ses concédants. Toute reproduction non autorisée est interdite.</p>
<h2>5. Liens et services tiers</h2>
<p>Le site peut contenir des liens vers des services tiers (ex : messageries, formulaires, plateformes). Nous ne contrôlons pas leurs contenus.</p>
<h2>6. Responsabilité</h2>
<p>Nous ne saurions être tenus responsables des dommages indirects, pertes de données, ou indisponibilités temporaires du service.</p>
<h2>7. Modification</h2>
<p>Nous pouvons modifier les CGU à tout moment. La version publiée sur le site prévaut.</p>
<h2>8. Droit applicable</h2>
<p>Ces CGU sont régies par les lois applicables à Dubaï, Émirats Arabes Unis.</p>`,

    "legal.cookies.title": "Politique Cookies",
    "legal.cookies.content": `<h2>Qu'est-ce qu'un cookie ?</h2>
<p>Un cookie est un petit fichier stocké sur votre appareil qui aide à faire fonctionner le site et à améliorer votre expérience.</p>
<h2>Cookies utilisés</h2>
<ul>
<li><strong>Essentiels :</strong> fonctionnement, sécurité, préférences de base</li>
<li><strong>Mesure d'audience :</strong> statistiques de fréquentation et performance</li>
<li><strong>Marketing (si activé) :</strong> suivi de campagnes et optimisation publicitaire</li>
</ul>
<h2>Gestion de vos choix</h2>
<p>Vous pouvez accepter/refuser certains cookies via le bandeau cookies (si disponible) et/ou via les réglages de votre navigateur. Les cookies essentiels ne peuvent pas être désactivés sans affecter le fonctionnement du site.</p>
<h2>Durée</h2>
<p>Les cookies peuvent être supprimés automatiquement à la fin de session ou rester pour une durée limitée selon leur finalité.</p>`,

    // Footer
    "footer.description": "La première plateforme d'ambassadeurs pour l'immobilier à Dubai et aux Émirats.",
    "footer.platform": "Plateforme",
    "footer.legal": "Légal",
    "footer.privacy": "Politique de confidentialité",
    "footer.terms": "Conditions générales",
    "footer.cookies": "Cookies",
    "footer.rights": "© 2026 Sofara. Tous droits réservés.",
    "footer.regulated": "Sofara est une plateforme appartenant à Cevitas Real Estate LLC. Les transactions immobilières sont gérées par des agents agréés RERA.",
  },
  en: {
    // Navbar
    "nav.platform": "Platform",
    "nav.benefits": "Benefits",
    "nav.whyDubai": "Why Dubai",
    "nav.howItWorks": "How it works",
    "nav.apply": "Apply",
    "nav.join": "Join",

    // Hero
    "hero.badge": "Ambassador Program 2025",
    "hero.slide1.headline": "Turn your connections\ninto commissions.",
    "hero.slide1.sub": "Become a Sofara ambassador and earn exceptional commissions on every transaction. No license required.",
    "hero.slide2.headline": "Luxury real estate, accessible to your network.",
    "hero.slide2.sub": "Penthouses, Palm villas — give your contacts access to the world's most dynamic real estate market.",
    "hero.slide3.headline": "Dubai: the #1 investment destination worldwide in 2025.",
    "hero.slide3.sub": "0% tax, rental yields of 8-15%, +32% transactions in 2025. The time is now.",
    "hero.cta": "Become an Ambassador",
    "hero.ctaSecondary": "",
    "hero.trust": "Join 60+ active ambassadors",
    "hero.metric1": "Commissions paid out",
    "hero.metric2": "Ambassadors in 12 countries",
    "hero.metric3": "Average rental yield",

    // Logo bar
    "logos.title": "Dubai in international press",

    // Stats
    "stats.ambassadors": "Active ambassadors",
    "stats.commissions": "Commissions paid",
    "stats.satisfaction": "Satisfaction rate",
    "stats.countries": "Global presence",
    "stats.countriesValue": "12 countries",
    "stats.avgConversion": "Average conversion",

    // Market Data 2025
    "market.label": "2025 Market Data",
    "market.title": "Dubai by the numbers:",
    "market.titleHighlight": "2025",
    "market.description": "Dubai's real estate market continues to break all records. The numbers speak for themselves.",
    "market.transactions": "Real estate transactions",
    "market.transactionsSub": "+32% vs 2023 (DLD, 2025)",
    "market.volume": "Transaction volume",
    "market.volumeSub": "All-time record in 2025",
    "market.units": "Units sold in 2025",
    "market.unitsSub": "Highest level ever recorded",
    "market.foreign": "Foreign investors",
    "market.foreignSub": "+41% international buyers",
    "market.pricePerSqm": "Average price / sqm",
    "market.pricePerSqmSub": "70% cheaper than London",
    "market.nationalities": "Buyer nationalities",
    "market.nationalitiesSub": "A truly global market",
    "market.source": "Sources: Dubai Land Department (DLD), Knight Frank, CBRE, Property Finder — 2025 Data",

    // Platform features
    "platform.label": "The Platform",
    "platform.title": "Technology built to",
    "platform.titleHighlight": "protect your interests",
    "platform.description": "Sofara isn't just an affiliate program. It's a next-generation technology platform that protects your identity, your leads, and your commissions.",
    "platform.anonymity": "Guaranteed anonymity",
    "platform.anonymityDesc": "Your identity is never revealed to developers. You remain invisible.",
    "platform.leadProtection": "Lead protection",
    "platform.leadProtectionDesc": "Your contacts are encrypted and protected. Impossible to bypass your link.",
    "platform.discretion": "Total discretion",
    "platform.discretionDesc": "No public trace. Your network won't know you earn a commission.",
    "platform.dashboard": "Real-time dashboard",
    "platform.dashboardDesc": "Track your leads, conversions and commissions in real-time from your space.",
    "platform.compliance": "Legal compliance",
    "platform.complianceDesc": "Solid legal structure. Payments compliant with international regulations.",
    "platform.instant": "Instant payment",
    "platform.instantDesc": "Commissions paid automatically upon transaction closing.",

    // Why Dubai
    "dubai.label": "Why Dubai",
    "dubai.title": "The world's most",
    "dubai.titleHighlight": "attractive",
    "dubai.titleEnd": "real estate market",
    "dubai.description": "Dubai is not just a city — it's a generational opportunity. With +32% growth in 2025, 0% taxes and unbeatable rental yields, it's THE market where your contacts want to invest.",
    "dubai.growth": "2025 Growth",
    "dubai.growthSub": "Dubai real estate market",
    "dubai.tax": "0% Tax",
    "dubai.taxDesc": "No income tax, capital gains tax or rental income tax.",
    "dubai.yield": "8-15% Yield",
    "dubai.yieldDesc": "Among the highest rental yields in the world.",
    "dubai.market": "Growing market",
    "dubai.marketDesc": "+32% transactions in 2025, demand keeps rising.",
    "dubai.hub": "International hub",
    "dubai.hubDesc": "A crossroads between Europe, Asia and Africa. Global access.",
    "dubai.secure": "Secure framework",
    "dubai.secureDesc": "Strong regulation, investor visa, political stability.",
    "dubai.lifestyle": "Quality of life",
    "dubai.lifestyleDesc": "365 days of sunshine, world-class infrastructure.",

    // Storytelling
    "story.label": "Your opportunity",
    "story.title": "Your network is your",
    "story.titleHighlight": "greatest asset",
    "story.description": "Do you know people looking to invest, diversify their wealth, or relocate to Dubai? With Sofara, turn every referral into income. No need to be a real estate agent — just a connector.",
    "story.point1": "You recommend Sofara to your network (friends, family, colleagues, followers).",
    "story.point2": "Your contacts invest in Dubai real estate through our secure platform.",
    "story.point3": "You earn a generous commission on every transaction — in complete discretion.",
    "story.point4": "The more your network invests, the more you earn — no cap, no limit.",
    "story.cta": "Join the program",
    "story.statLabel": "Avg. commission per transaction",

    // Benefits
    "benefits.label": "Benefits",
    "benefits.title": "Why",
    "benefits.titleHighlight": "join us",
    "benefits.description": "A program designed to reward your commitment and accelerate your success. Built by entrepreneurs, for entrepreneurs.",
    "benefits.commissions": "2.5% Commission",
    "benefits.commissionsDesc": "Earn 2.5% on the total value of every property sold through your referrals. No cap, no limit.",
    "benefits.tools": "AI marketing tools",
    "benefits.toolsDesc": "Complete kit with personalized content, tracked links and real-time analytics dashboard powered by AI.",
    "benefits.community": "Total transparency",
    "benefits.communityDesc": "Track every lead, every transaction and every commission in real-time. No hidden fees, no surprises.",
    "benefits.recognition": "Recognition",
    "benefits.recognitionDesc": "Badges, rankings and visibility on our official channels. VIP program for top performers.",
    "benefits.perks": "Exclusive perks",
    "benefits.perksDesc": "Immersive trips to Dubai, early access to off-market projects and VIP invitations.",
    "benefits.growth": "Continuous training",
    "benefits.growthDesc": "Masterclasses in digital marketing, personal branding and real estate negotiation.",

    // How it works
    "how.label": "How it works",
    "how.title": "4 steps to",
    "how.titleHighlight": "success",
    "how.step1": "Apply",
    "how.step1Desc": "Fill out the form in 2 minutes. We carefully select every ambassador.",
    "how.step2": "Onboarding",
    "how.step2Desc": "Full training, dashboard access and personalized marketing kit within 24h.",
    "how.step3": "Upload your leads",
    "how.step3Desc": "Add your contacts directly on the platform. Each lead is protected and linked to your ambassador account.",
    "how.step4": "Earn",
    "how.step4Desc": "Commissions paid automatically. Transparent real-time tracking.",

    // Investor Metrics
    "investor.label": "Key Metrics",
    "investor.title": "Results that speak to",
    "investor.titleHighlight": "ambassadors",
    "investor.description": "Sofara shows rapid growth since launch. A program that truly rewards your commitment.",
    "investor.paid": "Commissions paid out",
    "investor.paidTrend": "Growing",
    "investor.ambassadors": "Active ambassadors",
    "investor.ambassadorsTrend": "+25 this quarter",
    "investor.countries": "Countries covered",
    "investor.countriesTrend": "Expanding",
    "investor.mrr": "Avg. commission/month",
    "investor.mrrTrend": "Top ambassadors",
    "investor.ltv": "LTV/CAC ratio",
    "investor.ltvTrend": "Excellent",
    "investor.conversion": "Conversion time",
    "investor.conversionTrend": "Lead → Transaction",
    "investor.cta": "Join the program",

    // Testimonials
    "testimonials.label": "Testimonials",
    "testimonials.title": "They joined",
    "testimonials.titleHighlight": "Sofara",
    "testimonials.subtitle": "Ambassadors from around the world share their success stories.",
    "testimonials.earned": "earned",
    "testimonials.t1.name": "Karim B.",
    "testimonials.t1.role": "Ambassador · Dubai",
    "testimonials.t1.text": "In 3 months, I referred Sofara to 8 contacts. 3 invested. Result: over €8,000 in commissions. The system is transparent and ultra simple.",
    "testimonials.t2.name": "Sarah M.",
    "testimonials.t2.role": "Influencer · Paris",
    "testimonials.t2.text": "Sofara's discretion is what convinced me. My followers don't know I earn a commission — they just thank me for the recommendation.",
    "testimonials.t3.name": "Jean-Pierre D.",
    "testimonials.t3.role": "Entrepreneur · Geneva",
    "testimonials.t3.text": "With my network of entrepreneurs, commissions came naturally. I appreciate the lead protection — nobody can bypass them.",
    "testimonials.t4.name": "Amina K.",
    "testimonials.t4.role": "Consultant · Casablanca",
    "testimonials.t4.text": "I already advise my clients on wealth diversification. Sofara allowed me to monetize this expertise with a professional tool.",

    // FAQ
    "faq.label": "FAQ",
    "faq.title": "Everything you need to",
    "faq.titleHighlight": "know",
    "faq.q1": "How are my leads protected?",
    "faq.a1": "Each lead is cryptographically linked to your unique referral link. Even if a prospect contacts Sofara directly, they remain tied to your ambassador account for 12 months. Impossible to bypass your attribution.",
    "faq.q2": "Is my identity visible to buyers?",
    "faq.a2": "No. Your identity is 100% protected. Buyers never see your name or know that you earn a commission. Discretion is at the core of our platform.",
    "faq.q3": "How much can I realistically earn?",
    "faq.a3": "Commissions range from €6,000 to €30,000 per transaction depending on the property and project. Our top ambassadors exceed €5,000/month.",
    "faq.q4": "Do I need a real estate license?",
    "faq.a4": "No. You're not a real estate agent, you're a business introducer. Sofara's legal structure is designed so you can exercise this activity legally in your country.",
    "faq.q5": "How are commissions paid?",
    "faq.a5": "Commissions are paid via international bank transfer within 7 days of transaction closing. You can track the status in real-time on your dashboard.",
    "faq.q6": "Is the program free?",
    "faq.a6": "Yes, 100% free. No registration fees, no subscription, no hidden costs. Sofara only earns from completed transactions.",

    // CTA
    "cta.title": "Ready to join the",
    "cta.titleHighlight": "elite",
    "cta.description": "Spots are limited. Apply now and receive a response within 48 hours.",
    "cta.lastNameLabel": "Last name",
    "cta.lastNamePlaceholder": "Your last name",
    "cta.firstNameLabel": "First name",
    "cta.firstNamePlaceholder": "Your first name",
    "cta.emailLabel": "Email",
    "cta.emailPlaceholder": "Your email address",
    "cta.phoneLabel": "Phone",
    "cta.phonePlaceholder": "Phone number",
    "cta.countryLabel": "Country of residence",
    "cta.countryPlaceholder": "Select your country",
    "cta.profileLabel": "Your profile",
    "cta.profilePlaceholder": "Select your profile",
    "cta.linkedinLabel": "LinkedIn or Instagram (optional)",
    "cta.linkedinPlaceholder": "Link to your profile",
    "cta.motivationLabel": "Motivation",
    "cta.motivationPlaceholder": "Why do you want to become a Sofara ambassador? Briefly describe your network and experience...",
    "cta.profileInfluencer": "Influencer / Content creator",
    "cta.profileAgent": "Real estate agent",
    "cta.profileConsultant": "Consultant / Advisor",
    "cta.profileEntrepreneur": "Entrepreneur",
    "cta.profileInvestor": "Investor",
    "cta.profileOther": "Other",
    "cta.submit": "Submit my application",
    "cta.terms": "By submitting this form, you agree to our terms and conditions. Your data is protected and will never be shared.",
    "cta.errorFill": "Please fill in all required fields",
    "cta.successTitle": "Application sent!",
    "cta.successDesc": "We'll get back to you within 48 hours.",
    "cta.successHeading": "Application received!",
    "cta.successMessage": "Our team is reviewing your profile. You'll receive a response within the next 48 hours.",

    // Commissions
    "commission.label": "Full transparency",
    "commission.title": "One commission,",
    "commission.titleHighlight": "clear and generous",
    "commission.description": "At Sofara, no surprises. A single, public and guaranteed rate. You know exactly what you earn, before you even refer.",
    "commission.badgeSingle": "Single commission",
    "commission.singleDesc": "On every transaction closed through your referral, you earn 2.5% of the total property value. Simple, transparent, no hidden conditions.",
    "commission.ofValue": "of property value",
    "commission.note": "Commissions are calculated on the total property value and paid automatically after transaction closing.",

    // Legal pages
    "legal.back": "Back",
    "legal.lastUpdated": "Last updated: March 2025",
    "legal.privacy.title": "Privacy Policy",
    "legal.privacy.content": `<p>Sofara (www.sofara.ae) is a brand operated by Cevitas Real Estate LLC, a company based in Dubai (United Arab Emirates) ("we").</p>
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
<p>Contact: <strong>privacy@sofara.ae</strong> (or via the contact form).</p>
<h2>Security</h2>
<p>We apply technical and organizational measures to protect your data (restricted access, logging, encryption where relevant).</p>`,

    "legal.terms.title": "Terms & Conditions",
    "legal.terms.content": `<p>By accessing www.sofara.ae, you agree to these Terms & Conditions.</p>
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
};
