import type { AnyPageKey } from "@/i18n/locales";
import type { PillarContent } from "./types";

export const FR_PILLARS: Partial<Record<AnyPageKey, PillarContent>> = {
  ambassadors: {
    title: "Ambassadeur immobilier Dubaï : le réseau Sofara aux Émirats",
    description:
      "Devenez ambassadeur immobilier à Dubaï avec Sofara : recommandez des acheteurs depuis votre pays, sans licence, et touchez jusqu'à 3 % de commission en AED.",
    h1: "Ambassadeur immobilier à Dubaï : le réseau des ambassadeurs aux Émirats",
    eyebrow: "Réseau d'ambassadeurs · Dubaï et Émirats arabes unis",
    intro:
      "Un **ambassadeur immobilier à Dubaï** met en relation des personnes qui veulent acheter un bien aux Émirats avec une agence agréée. Il n'a besoin ni de licence ni de résider aux Émirats. Sofara, le réseau créé par Cevitas Real Estate LLC, réunit ces ambassadeurs sur une même plateforme, avec une même équipe de vente et une politique de commission publiée à l'avance.",
    sections: [
      {
        h2: "Pourquoi Dubaï a besoin d'ambassadeurs",
        blocks: [
          { p: "Dubaï vend des biens à des acheteurs de plus de 180 nationalités. La plupart ne commencent pas leur recherche sur un portail immobilier : ils en parlent d'abord à un proche, à un conseiller financier ou à un créateur de contenu en qui ils ont confiance, dans leur propre pays. L'ambassadeur est cette personne de confiance. Il présente l'acheteur, et une équipe agréée à Dubaï s'occupe du reste." },
          { p: "Le modèle convient particulièrement aux communautés francophones : Français, Belges, Suisses, Canadiens, Marocains, Algériens, Tunisiens ou Sénégalais, nombreux à s'intéresser au **Golden Visa**, à la fiscalité des Émirats et aux rendements locatifs de Dubaï." },
        ],
      },
      {
        h2: "Ce que fait un ambassadeur, concrètement",
        blocks: [
          { ol: [
            "**Il repère un intérêt** : quelqu'un de son entourage parle d'investir à Dubaï, de s'y installer ou d'obtenir une résidence.",
            "**Il transmet le contact** depuis son tableau de bord ou partage son lien personnel.",
            "**L'équipe Cevitas prend le relais** : qualification, sélection de projets, visites sur place ou en vidéo, réservation et contrat de vente (SPA).",
            "**Il suit chaque étape** du dossier dans son tableau de bord, mise à jour par l'équipe Sofara.",
            "**Il est payé en AED** une fois la vente conclue.",
          ] },
          { p: "L'ambassadeur ne négocie pas les prix, ne rédige aucun contrat et ne manipule jamais les fonds de l'acheteur. C'est pour cela qu'aucune licence n'est nécessaire et que l'activité peut s'exercer depuis n'importe quel pays." },
        ],
      },
      {
        h2: "Combien gagne un ambassadeur immobilier à Dubaï",
        blocks: [
          { p: "Les promoteurs de Dubaï versent aux agences agréées une commission sur chaque vente sur plan, généralement entre 2 % et 5 % du prix. Sofara reverse jusqu'à 3 % du prix du bien à l'ambassadeur qui a présenté l'acheteur." },
          { table: {
            head: ["Promoteur", "Taux ambassadeur", "Appartement à 1,5 M AED", "Villa à 4 M AED"],
            rows: [
              ["Emaar Properties", "3 %", "45 000 AED", "120 000 AED"],
              ["Sobha Realty", "3 %", "45 000 AED", "120 000 AED"],
              ["DAMAC Properties", "2,5 %", "37 500 AED", "100 000 AED"],
            ],
          } },
          { p: "La commission est acquise lorsque le client signe le SPA et règle l'apport avec les frais du Dubai Land Department (DLD). Elle est ensuite versée en AED par virement sous 7 jours après le paiement du promoteur à Cevitas, contre une facture émise depuis votre tableau de bord. Chaque contact reste rattaché à votre compte pendant 12 mois." },
        ],
      },
      {
        h2: "Les outils fournis aux ambassadeurs",
        blocks: [
          { ul: [
            "Un **lien de recommandation personnel** et un formulaire pour enregistrer un acheteur en quelques secondes.",
            "Un **suivi des dossiers** étape par étape, du premier contact au paiement de l'apport.",
            "Des **modèles de messages WhatsApp** et des argumentaires pour présenter un projet à vos contacts.",
            "Une **bibliothèque de projets** (Emaar, DAMAC, Sobha et d'autres promoteurs) avec brochures, plans de paiement et prix.",
            "Une **communauté** d'ambassadeurs dans plus de 40 pays et un accompagnement par l'équipe Sofara.",
          ] },
        ],
      },
      {
        h2: "Qui peut devenir ambassadeur",
        blocks: [
          { p: "Toute personne majeure disposant d'un réseau intéressé par Dubaï : expatriés, membres de la diaspora, entrepreneurs, conseillers en gestion de patrimoine, agents immobiliers en France, en Belgique, en Suisse ou au Maroc, créateurs de contenu. L'inscription est gratuite, sans engagement et sans objectif minimum." },
          { p: "Pour comparer avec le métier d'agent agréé, lisez notre guide pour [devenir agent immobilier à Dubaï](/fr/devenir-agent-immobilier-dubai). Pour comprendre la logique de rémunération, consultez la page consacrée à l'[affiliation immobilière à Dubaï](/fr/affiliation-immobilier-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "Faut-il une licence pour être ambassadeur immobilier à Dubaï ?", a: "Non. L'ambassadeur présente des acheteurs. Toutes les activités réglementées sont réalisées par Cevitas Real Estate LLC, agence agréée par la RERA à Dubaï." },
      { q: "Peut-on être ambassadeur depuis la France, la Belgique ou le Maroc ?", a: "Oui. Le réseau compte des ambassadeurs dans plus de 40 pays. Vous travaillez depuis chez vous, l'équipe de Dubaï gère les visites et la signature." },
      { q: "Combien rapporte une vente ?", a: "Jusqu'à 3 % du prix du bien selon le promoteur, soit par exemple 45 000 AED pour un appartement à 1,5 million d'AED vendu par Emaar ou Sobha." },
      { q: "Quand la commission est-elle versée ?", a: "Elle est acquise à la signature du SPA et au paiement de l'apport avec les frais DLD, puis versée en AED sous 7 jours après le paiement du promoteur à Cevitas." },
      { q: "L'inscription est-elle payante ?", a: "Non. L'inscription est gratuite, sans abonnement ni quota. Vous êtes rémunéré uniquement sur les ventes conclues." },
      { q: "Que se passe-t-il si mon contact appelle directement l'agence ?", a: "Il reste rattaché à votre compte pendant 12 mois. La commission vous revient même s'il contacte Sofara ou Cevitas sans passer par vous." },
    ],
    cta: {
      title: "Devenez ambassadeur immobilier à Dubaï",
      text: "Rejoignez plus de 700 ambassadeurs dans plus de 40 pays. Recommandez des acheteurs, suivez chaque dossier et soyez payé en AED.",
    },
    related: ["affiliate", "agent", "invest", "home"],
  },

  affiliate: {
    title: "Programme d'affiliation immobilier Dubaï : jusqu'à 3 %",
    description:
      "Programme d'affiliation immobilière à Dubaï et aux Émirats : devenez apporteur d'affaires, recommandez des acheteurs et touchez jusqu'à 3 % en AED.",
    h1: "Programme d'affiliation immobilier à Dubaï et aux Émirats",
    eyebrow: "Programme d'affiliation · Dubaï, Abu Dhabi, Ras Al Khaimah",
    intro:
      "Sofara est un **programme d'affiliation immobilière** dédié à Dubaï et aux Émirats arabes unis. Vous devenez apporteur d'affaires : vous recommandez des acheteurs, l'agence agréée Cevitas Real Estate conseille et conclut la vente, et vous percevez jusqu'à 3 % du prix du bien.",
    sections: [
      {
        h2: "Le principe de l'affiliation immobilière",
        blocks: [
          { p: "L'affiliation consiste à être rémunéré pour avoir présenté un client. À Dubaï, le principe s'applique à des transactions de plusieurs centaines de milliers, voire de millions de dirhams. Une seule recommandation peut donc représenter plusieurs mois de revenus." },
          { p: "Les promoteurs (Emaar, DAMAC, Sobha, Binghatti, Ellington et bien d'autres) rémunèrent les agences enregistrées sur chaque vente sur plan. Sofara partage une grande partie de cette commission avec l'apporteur d'affaires, de façon transparente et selon un barème publié." },
        ],
      },
      {
        h2: "Comment fonctionne le programme",
        blocks: [
          { ol: [
            "**Inscription gratuite** en deux minutes, depuis n'importe quel pays.",
            "**Recommandation** : partagez votre lien personnel ou enregistrez un acheteur depuis votre tableau de bord.",
            "**Accompagnement de l'acheteur** par l'équipe Cevitas : conseil, choix du projet, visites, réservation et SPA.",
            "**Suivi en temps réel** de chaque dossier dans votre espace.",
            "**Paiement en AED** par virement sous 7 jours après le paiement du promoteur à Cevitas.",
          ] },
        ],
      },
      {
        h2: "Barème des commissions",
        blocks: [
          { table: {
            head: ["Prix du bien", "Commission à 2,5 %", "Commission à 3 %"],
            rows: [
              ["800 000 AED", "20 000 AED", "24 000 AED"],
              ["1 500 000 AED", "37 500 AED", "45 000 AED"],
              ["3 000 000 AED", "75 000 AED", "90 000 AED"],
            ],
          } },
          { p: "Le taux dépend du promoteur, par exemple 3 % pour Emaar et Sobha et 2,5 % pour DAMAC. La commission est acquise lorsque le client signe le SPA et règle l'apport avec les frais DLD." },
        ],
      },
      {
        h2: "Apporteur d'affaires à Dubaï : ce qui est autorisé",
        blocks: [
          { p: "À Dubaï, seules les agences et les agents enregistrés auprès de la RERA peuvent exercer l'activité de courtage. L'apporteur d'affaires, lui, se limite à la mise en relation : il ne fait pas de visites, ne négocie pas et ne signe aucun document au nom de l'acheteur. Ce cadre est simple et protège à la fois l'acheteur et l'apporteur." },
          { p: "Sur le plan fiscal, les commissions perçues sont à déclarer selon les règles de votre pays de résidence. Votre tableau de bord génère les factures nécessaires." },
        ],
      },
      {
        h2: "Pour qui est fait ce programme",
        blocks: [
          { ul: [
            "Les **expatriés et la diaspora** francophone, souvent sollicités par leurs proches sur l'immobilier à Dubaï.",
            "Les **conseillers en gestion de patrimoine**, experts-comptables et consultants en relocation.",
            "Les **agents immobiliers en France, en Belgique, en Suisse ou au Maghreb** qui veulent servir leurs clients à Dubaï.",
            "Les **créateurs de contenu** finance, voyage ou entrepreneuriat.",
          ] },
          { p: "Découvrez aussi le fonctionnement du [réseau d'ambassadeurs immobiliers à Dubaï](/fr/ambassadeurs-immobilier-dubai) et notre guide pour [investir dans l'immobilier à Dubaï](/fr/investir-immobilier-dubai), utile pour répondre aux questions de vos contacts." },
        ],
      },
    ],
    faqs: [
      { q: "Qu'est-ce qu'un apporteur d'affaires immobilier à Dubaï ?", a: "C'est une personne qui met en relation un acheteur avec une agence agréée et qui perçoit une commission si la vente est conclue. Avec Sofara, l'apporteur d'affaires est appelé ambassadeur." },
      { q: "Combien gagne un apporteur d'affaires à Dubaï ?", a: "Jusqu'à 3 % du prix du bien, soit 45 000 AED pour un appartement vendu 1,5 million d'AED par un promoteur comme Emaar ou Sobha." },
      { q: "Faut-il créer une société aux Émirats ?", a: "Non. Vous pouvez être payé en tant que particulier ou via votre société dans votre pays, contre une facture générée depuis votre tableau de bord." },
      { q: "Le programme couvre-t-il Abu Dhabi ?", a: "Oui. Sofara se concentre sur Dubaï et couvre aussi des projets à Abu Dhabi, Ras Al Khaimah et Sharjah via Cevitas." },
      { q: "Y a-t-il des frais d'inscription ?", a: "Aucun. L'inscription est gratuite, sans abonnement ni nombre minimum de recommandations." },
      { q: "Comment mes contacts sont-ils protégés ?", a: "Chaque contact est rattaché à votre compte pendant 12 mois, même s'il contacte directement Sofara ou Cevitas." },
    ],
    cta: {
      title: "Rejoignez le programme d'affiliation immobilière",
      text: "Créez votre compte gratuit, partagez votre lien et laissez une équipe agréée à Dubaï transformer vos recommandations en commissions.",
    },
    related: ["ambassadors", "agent", "invest", "home"],
  },

  agent: {
    title: "Devenir agent immobilier à Dubaï en 2026 : le guide",
    description:
      "Comment devenir agent immobilier à Dubaï en 2026 : visa, formation DREI, examen RERA, coût, revenus. Et la voie ambassadeur, sans licence, depuis l'étranger.",
    h1: "Devenir agent immobilier à Dubaï en 2026",
    eyebrow: "Guide carrière · mis à jour en 2026",
    intro:
      "Dubaï est l'un des rares marchés où un nouvel arrivant motivé peut gagner très bien sa vie dans l'immobilier dès la première année. Ce guide présente les deux façons d'y parvenir : devenir **agent immobilier agréé par la RERA**, ou devenir **ambassadeur** et toucher des commissions sans licence, depuis votre pays.",
    sections: [
      {
        h2: "Deux façons de gagner sa vie avec l'immobilier à Dubaï",
        blocks: [
          { table: {
            head: ["Critère", "Agent agréé (broker RERA)", "Ambassadeur Sofara"],
            rows: [
              ["Licence", "Carte de broker RERA", "Aucune"],
              ["Visa de résidence aux Émirats", "Obligatoire", "Non requis"],
              ["Coût de départ", "Environ 4 000 à 7 000 AED", "Gratuit"],
              ["Délai pour démarrer", "4 à 8 semaines", "Le jour même"],
              ["Lieu de travail", "Dubaï", "Partout dans le monde"],
              ["Rémunération", "Part de la commission d'agence", "Jusqu'à 3 % du prix du bien"],
            ],
          } },
        ],
      },
      {
        h2: "Voie 1 : devenir agent immobilier agréé à Dubaï",
        blocks: [
          { h3: "1. Obtenir un visa de résidence" },
          { p: "La RERA, l'autorité de régulation rattachée au Dubai Land Department (DLD), ne délivre la carte de broker qu'aux résidents des Émirats. La plupart des débutants rejoignent une agence qui parraine leur visa de travail." },
          { h3: "2. Suivre la formation DREI" },
          { p: "Le Dubai Real Estate Institute dispense la formation obligatoire des brokers, sur environ quatre jours : droit immobilier de Dubaï, rôle du DLD et de la RERA, déontologie, ventes sur plan, comptes séquestres et contrats types (Form A, B et F)." },
          { h3: "3. Réussir l'examen RERA" },
          { p: "Un QCM portant sur le contenu de la formation. Les résultats arrivent en quelques jours. Le coût total, formation et carte comprises, se situe généralement entre 4 000 et 7 000 AED." },
          { h3: "4. Recevoir sa carte de broker" },
          { p: "Avec l'examen, un certificat de bonne conduite et le visa, l'agence vous enregistre auprès du DLD. Vous obtenez un numéro BRN et une carte RERA, renouvelée chaque année." },
        ],
      },
      {
        h2: "Combien gagne un agent immobilier à Dubaï",
        blocks: [
          { p: "Les agents sont presque toujours rémunérés à la commission. Sur le marché secondaire, les honoraires d'agence sont généralement de 2 % du prix, dont l'agent conserve 40 % à 70 % selon l'agence. Sur le neuf, les promoteurs versent à l'agence entre 2 % et 5 %. Les meilleurs agents dépassent le million d'AED par an, mais les six premiers mois servent souvent à se constituer une clientèle." },
        ],
      },
      {
        h2: "Voie 2 : gagner des commissions sans licence, comme ambassadeur",
        blocks: [
          { p: "Si vous vivez hors des Émirats ou souhaitez tester le marché sans changer de vie, la voie ambassadeur supprime toutes les barrières. Vous présentez des acheteurs issus de votre réseau, l'agence agréée Cevitas Real Estate s'occupe du conseil, des visites et de la signature, et vous touchez jusqu'à 3 % du prix du bien." },
          { ul: [
            "Inscription gratuite en deux minutes, sans licence ni quota.",
            "Lien de recommandation, brochures projets et suivi de chaque dossier.",
            "Commission acquise à la signature du SPA et au paiement de l'apport avec les frais DLD, versée en AED sous 7 jours après le paiement du promoteur.",
          ] },
          { p: "Pour aller plus loin : [le réseau des ambassadeurs immobiliers à Dubaï](/fr/ambassadeurs-immobilier-dubai) et [l'affiliation immobilière à Dubaï](/fr/affiliation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Quelle voie choisir ?",
        blocks: [
          { ul: [
            "**Agent agréé** si vous vivez à Dubaï ou prévoyez de vous y installer, et souhaitez mener vous-même les visites.",
            "**Ambassadeur** si vous êtes à l'étranger, avez déjà un réseau ou une audience intéressée par Dubaï, ou voulez un revenu complémentaire.",
            "**Les deux** : de nombreux agents en France, en Belgique, en Suisse ou au Maroc utilisent Sofara pour servir leurs clients qui achètent à Dubaï.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "Combien coûte la licence d'agent immobilier à Dubaï ?", a: "Comptez environ 4 000 à 7 000 AED pour la formation DREI, l'examen RERA et la carte de broker, hors visa." },
      { q: "Peut-on être agent immobilier à Dubaï sans visa ?", a: "Pas en tant qu'agent agréé : la carte RERA exige un visa de résidence. En revanche, vous pouvez devenir ambassadeur Sofara sans visa ni licence." },
      { q: "Combien de temps faut-il pour devenir agent ?", a: "En général 4 à 8 semaines entre le visa, la formation de quatre jours, l'examen et l'enregistrement de la carte." },
      { q: "Faut-il parler arabe ?", a: "Non. L'anglais est la langue de travail du secteur. Le français, l'espagnol ou le russe sont des atouts pour servir les acheteurs internationaux." },
      { q: "Combien gagne un ambassadeur par vente ?", a: "Jusqu'à 3 % du prix du bien selon le promoteur, soit 45 000 AED pour un bien à 1,5 million d'AED." },
      { q: "Qui signe les ventes apportées par un ambassadeur ?", a: "Cevitas Real Estate LLC, agence agréée par la RERA, réalise toutes les étapes réglementées." },
    ],
    cta: {
      title: "Commencez à gagner avec l'immobilier à Dubaï dès cette semaine",
      text: "Pas besoin d'attendre un visa, une formation et un examen pour toucher votre première commission. Rejoignez le réseau Sofara et recommandez des acheteurs de votre entourage.",
    },
    related: ["ambassadors", "affiliate", "invest", "home"],
  },

  invest: {
    title: "Investir dans l'immobilier à Dubaï en 2026 : guide",
    description:
      "Investir dans l'immobilier à Dubaï en 2026 : rendements, quartiers, achat sur plan, frais DLD, Golden Visa et étapes d'achat pour les non-résidents.",
    h1: "Investir dans l'immobilier à Dubaï en 2026",
    eyebrow: "Guide investisseur · Dubaï et Émirats",
    intro:
      "Dubaï attire des investisseurs du monde entier pour une raison simple : un marché ouvert aux étrangers, sans impôt foncier annuel, avec des rendements locatifs parmi les plus élevés des grandes villes internationales. Ce guide résume ce qu'il faut savoir avant d'acheter, et comment le réseau Sofara accompagne les acheteurs avec Cevitas Real Estate.",
    sections: [
      {
        h2: "Pourquoi investir à Dubaï",
        blocks: [
          { ul: [
            "**Pleine propriété (freehold)** pour les étrangers dans les zones désignées, enregistrée au Dubai Land Department.",
            "**Pas d'impôt foncier annuel** ni d'impôt sur le revenu locatif pour les particuliers aux Émirats.",
            "**Rendements locatifs** souvent compris entre 5 % et 8 % brut selon le quartier et le type de bien.",
            "**Golden Visa de 10 ans** pour un investissement immobilier d'au moins 2 millions d'AED.",
            "**Plans de paiement** échelonnés sur les projets neufs, avec des fonds versés sur un compte séquestre contrôlé par la RERA.",
          ] },
        ],
      },
      {
        h2: "Acheter sur plan ou un bien prêt",
        blocks: [
          { p: "L'**achat sur plan** permet de réserver avec 10 % à 20 % du prix, puis de payer par étapes pendant la construction, parfois après la remise des clés. Il offre des prix d'entrée plus bas et un potentiel de plus-value à la livraison. Le **bien prêt** génère un loyer immédiat et se visite tel quel." },
          { p: "Le choix dépend de l'objectif : revenu locatif rapide, constitution de patrimoine sur plusieurs années ou obtention d'un visa de résidence." },
        ],
      },
      {
        h2: "Les frais à prévoir",
        blocks: [
          { table: {
            head: ["Poste", "Montant indicatif"],
            rows: [
              ["Frais d'enregistrement DLD", "4 % du prix du bien"],
              ["Frais administratifs d'enregistrement", "Environ 2 000 à 4 000 AED"],
              ["Charges de copropriété annuelles", "Selon la résidence, au m²"],
              ["Commission d'agence (marché secondaire)", "Généralement 2 % du prix"],
            ],
          } },
          { p: "Sur le neuf, la commission d'agence est payée par le promoteur, pas par l'acheteur." },
        ],
      },
      {
        h2: "Les quartiers les plus recherchés",
        blocks: [
          { p: "Downtown Dubai et Business Bay pour la demande locative de centre-ville, Dubai Marina et JBR pour la vie en bord de mer, Dubai Hills Estate pour les familles, Jumeirah Village Circle pour des tickets d'entrée plus accessibles, Dubai Creek Harbour et Dubai South pour les projets d'avenir. Hors de Dubaï, l'île de Saadiyat à Abu Dhabi et Al Marjan Island à Ras Al Khaimah attirent aussi les investisseurs." },
        ],
      },
      {
        h2: "Les étapes d'un achat à Dubaï",
        blocks: [
          { ol: [
            "Définir le budget, l'objectif et le quartier avec un conseiller agréé.",
            "Réserver le bien (formulaire de réservation et acompte).",
            "Signer le contrat de vente (SPA) et payer l'apport avec les frais DLD.",
            "Enregistrer la vente au DLD (Oqood pour le neuf, titre de propriété pour l'ancien).",
            "Suivre le plan de paiement jusqu'à la remise des clés.",
          ] },
          { p: "Vous connaissez des personnes qui veulent investir à Dubaï ? Recommandez-les à Sofara et touchez une commission : découvrez le [réseau d'ambassadeurs](/fr/ambassadeurs-immobilier-dubai) et l'[affiliation immobilière](/fr/affiliation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Simuler votre investissement",
        blocks: [{ p: "Testez l'opération avec vos propres chiffres grâce aux simulateurs gratuits d'OffPlanSimulator : [simulateur d'investissement immobilier à Dubaï](https://www.offplansimulator.com/fr), [simulateur de rentabilité locative](https://www.offplansimulator.com/fr/simulateur-rentabilite-locative-dubai), [calcul des frais d'achat](https://www.offplansimulator.com/fr/calcul-frais-achat-immobilier-dubai), [simulateur de crédit immobilier](https://www.offplansimulator.com/fr/simulateur-credit-immobilier-dubai)." }],
      },
    ],
    faqs: [
      { q: "Un étranger peut-il acheter un bien à Dubaï ?", a: "Oui. Toute nationalité peut acheter en pleine propriété dans les zones freehold, sans résider aux Émirats." },
      { q: "Quel budget minimum pour investir à Dubaï ?", a: "On trouve des studios et petits appartements sur plan à partir de 600 000 à 800 000 AED dans des quartiers comme Jumeirah Village Circle ou Dubai South." },
      { q: "Quels sont les frais d'achat ?", a: "Principalement 4 % de frais DLD et des frais administratifs d'enregistrement. Sur le neuf, l'acheteur ne paie pas de commission d'agence." },
      { q: "Comment obtenir le Golden Visa par l'immobilier ?", a: "En détenant un ou plusieurs biens d'une valeur totale d'au moins 2 millions d'AED, y compris sur plan sous conditions." },
      { q: "Quel rendement locatif espérer ?", a: "Souvent entre 5 % et 8 % brut selon le quartier, la taille du bien et le mode de location (longue durée ou courte durée)." },
      { q: "Qui accompagne les acheteurs recommandés par Sofara ?", a: "Cevitas Real Estate LLC, agence agréée par la RERA à Dubaï, du choix du projet jusqu'à la remise des clés." },
    ],
    cta: {
      title: "Votre entourage veut investir à Dubaï ?",
      text: "Recommandez-le à Sofara : une équipe agréée l'accompagne de A à Z, et vous touchez jusqu'à 3 % de commission sur la vente.",
    },
    related: ["ambassadors", "affiliate", "agent", "home"],
  },

  apporteur: {
    title: "Apporteur d'affaires immobilier Dubaï et apporteur de clients",
    description:
      "Devenez apporteur d'affaires ou apporteur de clients immobilier à Dubaï et aux Émirats, depuis la France, la Belgique, la Suisse ou le Canada : 1 à 3 % du prix.",
    h1: "Apporteur d'affaires immobilier Dubaï : devenir apporteur de clients aux Émirats",
    eyebrow: "Apporteur d'affaires · France, Belgique, Suisse, Canada, Maroc",
    intro:
      "Un **apporteur d'affaires** (ou **apporteur de clients**) **immobilier à Dubaï et aux Émirats** met en relation un acheteur avec une agence agréée et touche une commission quand la vente se conclut. Avec Sofara, l'agence est Cevitas Real Estate LLC, agréée par la RERA à Dubaï, et votre rémunération va de **1 % à 3 % du prix du bien**. Vous n'avez besoin ni de carte professionnelle ni de vous installer aux Émirats.",
    sections: [
      {
        h2: "Ce que fait un apporteur d'affaires, et ce qu'il ne fait pas",
        blocks: [
          { p: "Le rôle de l'apporteur d'affaires est simple : il identifie une personne qui souhaite acheter à Dubaï et la présente à l'agence. Il ne fait pas de visites, ne négocie pas le prix, ne rédige aucun contrat et ne manipule jamais les fonds de l'acheteur. Tout le travail réglementé est réalisé par les agents agréés de Cevitas." },
          { ul: [
            "**Vous** : repérer l'intérêt, présenter Sofara, enregistrer le contact ou partager votre lien.",
            "**Cevitas** : qualification, choix du projet, visites sur place ou en vidéo, réservation, contrat de vente (SPA), suivi jusqu'à la remise des clés.",
            "**Sofara** : votre espace pour suivre chaque contact étape par étape et recevoir vos commissions.",
          ] },
        ],
      },
      {
        h2: "Quelle rémunération pour un apporteur d'affaires à Dubaï ?",
        blocks: [
          { p: "Sur le neuf, les promoteurs de Dubaï rémunèrent les agences sur chaque vente. Sofara reverse à l'apporteur d'affaires entre 1 % et 3 % du prix du bien selon le projet. Le taux de chaque projet est affiché dans votre espace avant toute recommandation." },
          { table: {
            head: ["Prix du bien", "Commission à 1 %", "Commission à 3 %"],
            rows: [
              ["800 000 AED", "8 000 AED", "24 000 AED"],
              ["1 500 000 AED", "15 000 AED", "45 000 AED"],
              ["3 000 000 AED", "30 000 AED", "90 000 AED"],
            ],
          } },
          { p: "La commission est acquise lorsque l'acheteur signe le SPA et règle l'apport avec les frais du Dubai Land Department (DLD). Elle est versée en AED par virement sous 7 jours après le paiement du promoteur à Cevitas, contre une facture émise depuis votre espace." },
        ],
      },
      {
        h2: "Faut-il une carte professionnelle ?",
        blocks: [
          { p: "En France, la loi Hoguet encadre l'activité d'intermédiaire pour les biens situés en France. Pour un bien situé à Dubaï, la transaction est réalisée par Cevitas, agence agréée par la RERA, et vous intervenez uniquement comme apporteur d'affaires. Si vous exercez déjà dans l'immobilier en France, en Belgique ou en Suisse, faites valider votre situation par votre conseiller." },
        ],
      },
      {
        h2: "Votre statut selon votre pays",
        blocks: [
          { p: "Les commissions d'apporteur d'affaires sont des revenus à déclarer dans votre pays de résidence. En France, beaucoup d'apporteurs les déclarent via une micro-entreprise ; en Belgique, en Suisse, au Canada ou au Maroc, les règles sont propres à chaque pays. Votre espace Sofara génère les factures nécessaires. Un expert-comptable vous indiquera le statut le plus adapté." },
        ],
      },
      {
        h2: "Pourquoi vos contacts veulent acheter à Dubaï",
        blocks: [
          { ul: [
            "Pleine propriété ouverte aux étrangers dans les zones dédiées.",
            "Pas d'impôt sur les loyers ni sur les plus-values pour les particuliers aux Émirats.",
            "Rendements locatifs autour de 5 à 8 % brut selon le quartier.",
            "Golden Visa de 10 ans à partir de 2 millions d'AED investis.",
            "Plans de paiement échelonnés sur le neuf, fonds sur compte séquestre contrôlé par la RERA.",
          ] },
          { p: "Pour répondre à leurs questions, partagez notre guide [investir dans l'immobilier à Dubaï](/fr/investir-immobilier-dubai)." },
        ],
      },
      {
        h2: "Comment démarrer en 10 minutes",
        blocks: [
          { ol: [
            "Créez votre compte gratuit sur Sofara.",
            "Complétez votre profil et votre vérification d'identité.",
            "Enregistrez votre premier contact ou partagez votre lien personnel.",
            "Suivez l'avancement du dossier dans votre espace, de la qualification au closing.",
          ] },
          { p: "Comparez aussi avec le [réseau d'ambassadeurs immobiliers à Dubaï](/fr/ambassadeurs-immobilier-dubai) et notre page sur l'[affiliation immobilière](/fr/affiliation-immobilier-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "Apporteur d'affaires ou apporteur de clients : quelle différence ?", a: "Aucune dans la pratique : les deux termes désignent la personne qui présente un acheteur à une agence agréée et qui est rémunérée si la vente se conclut. Chez Sofara, on parle aussi d'ambassadeur." },
      { q: "Combien touche un apporteur d'affaires immobilier à Dubaï ?", a: "De 1 % à 3 % du prix du bien selon le projet, par exemple 15 000 à 45 000 AED pour un appartement à 1,5 million d'AED." },
      { q: "Faut-il une carte professionnelle pour être apporteur d'affaires à Dubaï ?", a: "Non pour Sofara : la vente est réalisée par Cevitas, agence agréée RERA, et vous intervenez comme apporteur d'affaires. Si vous êtes déjà agent immobilier en France, faites valider votre situation par votre conseiller." },
      { q: "Quand la commission est-elle versée ?", a: "Elle est acquise à la signature du SPA et au paiement de l'apport avec les frais DLD, puis versée en AED sous 7 jours après le paiement du promoteur à Cevitas." },
      { q: "Peut-on être apporteur d'affaires depuis la France ou le Canada ?", a: "Oui. Vous travaillez depuis votre pays ; les visites se font sur place à Dubaï ou en vidéo avec l'équipe Cevitas." },
      { q: "Comment déclarer ces commissions ?", a: "Selon les règles fiscales de votre pays de résidence. En France, beaucoup d'apporteurs utilisent une micro-entreprise. Votre espace génère les factures." },
      { q: "Mon contact peut-il passer directement par l'agence ?", a: "Il reste rattaché à votre compte pendant 12 mois, même s'il contacte directement Sofara ou Cevitas." },
    ],
    cta: {
      title: "Devenez apporteur d'affaires immobilier à Dubaï",
      text: "Inscription gratuite, sans engagement. Présentez vos contacts, l'équipe agréée de Cevitas s'occupe du reste, et vous touchez de 1 % à 3 % du prix.",
    },
    related: ["affiliate", "ambassadors", "travailDubai", "invest", "home"],
  },

  travailDubai: {
    title: "Travailler dans l'immobilier à Dubaï en 2026 : le guide",
    description:
      "Travailler dans l'immobilier à Dubaï : métiers, visa, licence RERA, rémunération à la commission et la voie d'apporteur d'affaires depuis l'étranger.",
    h1: "Travailler dans l'immobilier à Dubaï : métiers, conditions et revenus",
    eyebrow: "Carrière · francophones à Dubaï",
    intro:
      "Dubaï attire chaque année des commerciaux francophones qui veulent **travailler dans l'immobilier**. Le marché est actif, les acheteurs viennent du monde entier et les francophones y sont recherchés. Voici les métiers, les conditions pour exercer, le mode de rémunération et la façon de démarrer, sur place ou depuis votre pays.",
    sections: [
      {
        h2: "Les métiers de l'immobilier à Dubaï",
        blocks: [
          { ul: [
            "**Agent immobilier (broker)** : il conseille les acheteurs et vendeurs, organise les visites et suit la vente. Il doit détenir une carte RERA.",
            "**Commercial sur le neuf (off-plan)** : spécialisé dans les lancements des promoteurs, souvent dans une agence ou chez un promoteur.",
            "**Gestionnaire locatif (property manager)** : gestion des locations pour le compte des propriétaires.",
            "**Apporteur d'affaires / ambassadeur** : il présente des acheteurs à une agence agréée, sans licence, souvent depuis l'étranger.",
          ] },
        ],
      },
      {
        h2: "Les conditions pour exercer comme agent",
        blocks: [
          { ol: [
            "Un visa de résidence aux Émirats, le plus souvent parrainé par l'agence qui vous recrute.",
            "La formation obligatoire du Dubai Real Estate Institute (environ quatre jours).",
            "L'examen RERA, puis l'enregistrement auprès du Dubai Land Department.",
            "Une carte de broker avec numéro BRN, renouvelée chaque année.",
          ] },
          { p: "Comptez en général entre 4 000 et 7 000 AED pour la formation, l'examen et la carte, hors visa. Le détail est dans notre guide [devenir agent immobilier à Dubaï](/fr/devenir-agent-immobilier-dubai)." },
        ],
      },
      {
        h2: "Comment on est payé dans l'immobilier à Dubaï",
        blocks: [
          { p: "La grande majorité des agents sont rémunérés à la commission. Sur une vente dans l'ancien, l'agence facture en général 2 % du prix ; l'agent en conserve une part qui dépend de l'agence. Sur le neuf, le promoteur rémunère l'agence. Les premiers mois servent souvent à constituer sa clientèle : prévoyez une épargne de départ." },
          { p: "Les francophones ont un atout : une clientèle française, belge, suisse, canadienne et maghrébine qui préfère être conseillée dans sa langue." },
        ],
      },
      {
        h2: "Trouver une agence à Dubaï",
        blocks: [
          { ul: [
            "Vérifiez que l'agence est enregistrée auprès de la RERA.",
            "Demandez le partage de commission, l'accompagnement à la formation et le soutien marketing.",
            "Privilégiez une agence qui a déjà une clientèle internationale et francophone.",
          ] },
        ],
      },
      {
        h2: "Commencer depuis votre pays, avant de vous installer",
        blocks: [
          { p: "Beaucoup de francophones commencent comme **apporteurs d'affaires** depuis la France, la Belgique, la Suisse ou le Canada : ils présentent des acheteurs à Cevitas Real Estate via Sofara et touchent de 1 % à 3 % du prix du bien, sans visa ni licence. C'est un moyen concret de tester le marché avant de s'installer." },
          { p: "Tout est expliqué sur la page [apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "Peut-on travailler dans l'immobilier à Dubaï sans parler anglais ?", a: "L'anglais est la langue de travail. Le français est un vrai atout pour servir la clientèle francophone, mais il ne remplace pas l'anglais pour exercer comme agent." },
      { q: "Faut-il une licence pour travailler dans l'immobilier à Dubaï ?", a: "Oui pour exercer comme agent : il faut une carte RERA, obtenue après la formation DREI et l'examen. Comme apporteur d'affaires via Sofara, aucune licence n'est nécessaire." },
      { q: "Combien gagne un agent immobilier à Dubaï ?", a: "Les revenus dépendent des ventes : les agents touchent une part de la commission de l'agence. Les premiers mois sont souvent plus faibles le temps de construire sa clientèle." },
      { q: "Peut-on commencer depuis la France ?", a: "Oui, comme apporteur d'affaires : vous présentez des acheteurs à Cevitas via Sofara et touchez de 1 % à 3 % du prix du bien." },
      { q: "Combien coûte la licence RERA ?", a: "Environ 4 000 à 7 000 AED pour la formation, l'examen et la carte, hors visa." },
      { q: "Les agences recrutent-elles des francophones ?", a: "Oui, la clientèle francophone est importante à Dubaï et les agences cherchent des profils capables de la conseiller dans sa langue." },
    ],
    cta: {
      title: "Commencez dans l'immobilier à Dubaï dès aujourd'hui",
      text: "Sans visa ni licence : devenez apporteur d'affaires avec Sofara, présentez vos contacts et touchez de 1 % à 3 % du prix du bien.",
    },
    related: ["apporteur", "agent", "ambassadors", "affiliate", "home"],
  },

  referral: {
    title: "Commission de recommandation immobilier Dubaï : 1 à 3 %",
    description:
      "Programme de recommandation immobilier à Dubaï et aux Émirats : recommandez un acheteur, touchez une commission de 1 à 3 % du prix, versée en AED sous 7 jours.",
    h1: "Commission de recommandation immobilier à Dubaï : le programme Sofara",
    eyebrow: "Programme de recommandation · Dubaï et Émirats",
    intro:
      "Vous connaissez quelqu'un qui veut acheter à Dubaï ? Avec le **programme de recommandation immobilier** de Sofara, vous le présentez à Cevitas Real Estate, agence agréée RERA, et vous touchez une **commission de recommandation de 1 % à 3 % du prix du bien** quand la vente se conclut. Gratuit, sans licence, depuis n'importe quel pays.",
    sections: [
      {
        h2: "Comment fonctionne la commission de recommandation à Dubaï",
        blocks: [
          { p: "Sur le neuf, les promoteurs de Dubaï rémunèrent l'agence qui apporte l'acheteur. Sofara reverse une part publiée de cette rémunération à la personne qui a recommandé l'acheteur : c'est la commission de recommandation. Son taux dépend du projet, entre 1 % et 3 % du prix, et il est affiché dans votre espace avant toute recommandation." },
          { table: {
            head: ["Prix du bien", "Commission à 1 %", "Commission à 3 %"],
            rows: [
              ["800 000 AED", "8 000 AED", "24 000 AED"],
              ["1 500 000 AED", "15 000 AED", "45 000 AED"],
              ["4 000 000 AED", "40 000 AED", "120 000 AED"],
            ],
          } },
        ],
      },
      {
        h2: "Recommander un acheteur, étape par étape",
        blocks: [
          { ol: [
            "**Créez votre compte gratuit** et récupérez votre lien personnel.",
            "**Recommandez** : partagez le lien ou enregistrez le contact depuis votre espace.",
            "**Cevitas accompagne l'acheteur** : appel de qualification, sélection de projets, visites sur place ou en vidéo, réservation, contrat (SPA).",
            "**Suivez chaque étape** dans votre espace, avec une notification à chaque avancée.",
            "**Recevez votre commission** en AED par virement sous 7 jours après le paiement du promoteur à Cevitas.",
          ] },
          { p: "La commission est acquise lorsque l'acheteur signe le SPA et règle l'apport avec les frais du Dubai Land Department (DLD). Chaque contact reste rattaché à votre compte pendant 12 mois." },
        ],
      },
      {
        h2: "Recommandation, parrainage, apport d'affaires : quelles différences ?",
        blocks: [
          { p: "Le **parrainage** désigne souvent une prime ponctuelle versée par un promoteur à un propriétaire. L'**apporteur d'affaires** et le **programme de recommandation** reposent sur le même principe : présenter un acheteur et être rémunéré si la vente se fait. Chez Sofara, la recommandation est encadrée : taux publié, suivi en temps réel, protection du contact et paiement rapide. Voir aussi [apporteur d'affaires immobilier Dubaï](/fr/apporteur-affaires-immobilier-dubai) et le [programme d'affiliation](/fr/affiliation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Qui peut recommander des acheteurs",
        blocks: [
          { ul: [
            "Les expatriés et la diaspora souvent interrogés sur l'immobilier à Dubaï.",
            "Les conseillers en patrimoine, experts-comptables et consultants en relocation.",
            "Les agents immobiliers en France, en Belgique, en Suisse, au Canada ou au Maghreb.",
            "Les créateurs de contenu et entrepreneurs dont l'audience s'intéresse à Dubaï.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "Quel est le montant de la commission de recommandation immobilier à Dubaï ?", a: "De 1 % à 3 % du prix du bien selon le projet, par exemple 15 000 à 45 000 AED pour un appartement à 1,5 million d'AED." },
      { q: "Quand la commission de recommandation est-elle versée ?", a: "Elle est acquise à la signature du SPA et au paiement de l'apport avec les frais DLD, puis versée en AED sous 7 jours après le paiement du promoteur à Cevitas." },
      { q: "Faut-il une licence pour recommander un acheteur ?", a: "Non. Vous présentez l'acheteur ; Cevitas Real Estate LLC, agence agréée RERA, réalise toutes les étapes réglementées." },
      { q: "Le programme couvre-t-il tous les Émirats ?", a: "Oui : Dubaï en priorité, mais aussi Abu Dhabi, Ras Al Khaimah et Sharjah via Cevitas." },
      { q: "Mon contact est-il protégé ?", a: "Oui, pendant 12 mois, même s'il contacte directement Sofara ou Cevitas." },
      { q: "L'inscription est-elle payante ?", a: "Non, elle est gratuite, sans abonnement ni nombre minimum de recommandations." },
    ],
    cta: {
      title: "Recommandez un acheteur et touchez votre commission",
      text: "Inscription gratuite. Présentez vos contacts, l'équipe agréée de Cevitas s'occupe du reste, et vous touchez de 1 % à 3 % du prix du bien.",
    },
    related: ["apporteur", "affiliate", "ambassadors", "home"],
  },
};
