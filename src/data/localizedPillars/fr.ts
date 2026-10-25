import type { AnyPageKey } from "@/i18n/locales";
import type { PillarContent } from "./types";

/*
 * Rules for this file: no money amounts (only « de 1 % à 3 % du prix », « jusqu'à 3 % »),
 * no unsourced statistics, no developer names with rates, official rules with the authority named
 * (RERA, DLD, DREI) and without fee amounts, 100 % French, positive tone, no competitor named.
 */
export const FR_PILLARS: Partial<Record<AnyPageKey, PillarContent>> = {
  ambassadors: {
    title: "Réseau d'ambassadeurs immobilier Dubaï, sans licence",
    description:
      "Réseau d'ambassadeurs immobilier à Dubaï : présentez des acheteurs depuis votre pays, gratuitement, sans licence ni société, et touchez de 1 % à 3 % du prix.",
    h1: "Réseau d'ambassadeurs immobilier à Dubaï : recommandez, l'agence agréée vend",
    eyebrow: "Réseau d'ambassadeurs · Dubaï et Émirats arabes unis",
    intro:
      "Le **réseau d'ambassadeurs immobilier à Dubaï** de Sofara permet à n'importe qui, depuis n'importe quel pays, de présenter des acheteurs à Cevitas Real Estate LLC, agence agréée par la RERA, qui conseille et conclut la vente. L'ambassadeur touche **de 1 % à 3 % du prix du bien**, avec une inscription gratuite, sans abonnement, sans licence et sans société exigée.",
    sections: [
      {
        h2: "Qu'est-ce qu'un ambassadeur immobilier à Dubaï ?",
        blocks: [
          { p: "Un ambassadeur est une personne de confiance qui met en relation quelqu'un de son entourage, intéressé par un achat à Dubaï ou aux Émirats, avec une agence agréée. Beaucoup d'acheteurs ne commencent pas leur recherche sur un portail : ils en parlent d'abord à un proche, à un collègue ou à un conseiller qu'ils connaissent. L'ambassadeur est ce premier contact, et une équipe agréée à Dubaï s'occupe de tout le reste." },
          { p: "Le réseau réunit aujourd'hui **plus de 700 ambassadeurs actifs**, avec une même équipe de vente, un même espace de suivi et une politique de commission connue à l'avance." },
        ],
      },
      {
        h2: "Ambassadeur, apporteur d'affaires, agent : quelles différences ?",
        blocks: [
          { table: {
            head: ["Critère", "Ambassadeur Sofara", "Apporteur d'affaires", "Agent agréé RERA"],
            rows: [
              ["Rôle", "Présente un acheteur", "Présente un acheteur", "Conseille, fait visiter, négocie, suit la vente"],
              ["Licence", "Aucune", "Aucune lorsque la vente est conclue par une agence agréée", "Carte de broker délivrée par la RERA"],
              ["Résidence aux Émirats", "Non requise", "Non requise", "Visa de résidence requis"],
              ["Société", "Non exigée", "Selon la structure choisie", "Rattaché à une agence enregistrée"],
              ["Coût d'entrée", "Gratuit, sans abonnement", "Variable selon les réseaux", "Formation DREI, examen et carte RERA"],
              ["Rémunération", "De 1 % à 3 % du prix du bien", "Part de commission convenue", "Part de la commission de l'agence"],
            ],
          } },
          { p: "En pratique, ambassadeur et [apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai) désignent le même rôle : présenter un acheteur et être rémunéré si la vente se conclut. Le métier d'agent agréé est expliqué dans notre guide [devenir agent immobilier à Dubaï](/fr/devenir-agent-immobilier-dubai)." },
        ],
      },
      {
        h2: "Est-ce légal ? Le cadre à Dubaï",
        blocks: [
          { p: "À Dubaï, l'activité de courtage immobilier est réservée aux agences et aux agents enregistrés auprès de la RERA, l'autorité de régulation rattachée au Dubai Land Department (DLD). L'ambassadeur ne fait pas de courtage : il ne négocie pas les prix, ne rédige aucun contrat, ne signe rien au nom de l'acheteur et ne manipule jamais ses fonds. Toutes les étapes réglementées sont réalisées par Cevitas Real Estate LLC, agence agréée par la RERA." },
          { p: "C'est pour cette raison qu'aucune licence RERA n'est nécessaire pour être ambassadeur, et que l'activité peut s'exercer depuis la France, la Belgique, la Suisse, le Canada, le Maroc ou tout autre pays. Si vous exercez déjà une profession réglementée dans votre pays, faites valider votre situation par votre conseiller. Pour aller plus loin : [devenir agent immobilier à Dubaï sans licence](/blog/devenir-agent-immobilier-dubai-sans-licence)." },
        ],
      },
      {
        h2: "Ce que fait un ambassadeur, concrètement",
        blocks: [
          { ol: [
            "**Il repère un intérêt** : quelqu'un de son entourage parle d'investir à Dubaï, de s'y installer ou d'obtenir une résidence.",
            "**Il présente le contact** depuis son espace ou partage son lien personnel, après avoir obtenu l'accord de la personne.",
            "**L'équipe agréée prend le relais** : qualification, sélection de projets, visites sur place ou en vidéo, réservation et contrat de vente (SPA).",
            "**Il suit chaque étape** du dossier dans son espace, mis à jour par l'équipe Sofara.",
            "**Il reçoit sa commission** une fois la vente conclue.",
          ] },
        ],
      },
      {
        h2: "Comment est calculée et versée la commission",
        blocks: [
          { p: "Sur le neuf, les promoteurs rémunèrent l'agence agréée qui apporte l'acheteur. Sofara reverse à l'ambassadeur **de 1 % à 3 % du prix du bien**, selon le projet. Le taux de chaque projet est affiché dans votre espace avant toute recommandation." },
          { ul: [
            "**Calcul** : un pourcentage du prix de vente du bien, connu avant la recommandation.",
            "**Moment où elle est acquise** : lorsque l'acheteur signe le SPA et règle l'apport avec les frais d'enregistrement du DLD.",
            "**Versement** : par virement sous 7 jours après le paiement du promoteur à l'agence, contre une facture générée depuis votre espace.",
            "**Protection du contact** : chaque contact reste rattaché à votre compte pendant 12 mois.",
          ] },
          { p: "Le détail du mécanisme est présenté sur la page [commission de recommandation](/fr/programme-recommandation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Faut-il une société ? Combien coûte l'inscription ?",
        blocks: [
          { p: "L'inscription est **gratuite**, sans abonnement, sans droit d'entrée et sans objectif minimum. Aucune société n'est exigée : vous pouvez être payé en tant que particulier ou via votre structure dans votre pays, avec une facture générée depuis votre espace. Les conditions du programme (taux, moment où la commission est acquise, protection du contact) sont acceptées en ligne lors de l'inscription." },
          { p: "Côté fiscalité, les commissions sont à déclarer selon les règles de votre pays de résidence : renseignez-vous auprès d'un conseiller ou d'un expert-comptable dans votre pays." },
        ],
      },
      {
        h2: "Comment présenter un client",
        blocks: [
          { ol: [
            "Parlez de Dubaï naturellement, sans promesse de rendement ni de plus-value.",
            "Demandez à la personne son accord pour être contactée par l'équipe agréée.",
            "Enregistrez le contact dans votre espace ou envoyez votre lien personnel.",
            "Laissez l'équipe conseiller, proposer les projets et répondre aux questions techniques.",
          ] },
          { p: "Des modèles de messages, des fiches projets et un suivi étape par étape sont fournis dans votre espace. Pour répondre aux questions de vos contacts, partagez notre guide [investir dans l'immobilier à Dubaï](/fr/investir-immobilier-dubai)." },
        ],
      },
      {
        h2: "Qui peut rejoindre le réseau",
        blocks: [
          { p: "Toute personne majeure disposant d'un réseau intéressé par Dubaï : expatriés, membres de la diaspora, entrepreneurs, conseillers en gestion de patrimoine, agents immobiliers en France, en Belgique, en Suisse, au Canada ou au Maroc, créateurs de contenu. Vous pouvez aussi rejoindre le [programme d'affiliation immobilier](/fr/affiliation-immobilier-dubai) ou lire [comment devenir agent immobilier à Dubaï](/blog/comment-devenir-agent-immobilier-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "Comment devenir ambassadeur immobilier à Dubaï ?", a: "Créez un compte gratuit sur Sofara, vérifiez votre identité, puis présentez vos contacts depuis votre espace ou avec votre lien personnel. L'équipe agréée s'occupe du conseil et de la vente." },
      { q: "Faut-il une licence pour être ambassadeur immobilier à Dubaï ?", a: "Non. L'ambassadeur présente des acheteurs. Toutes les activités réglementées sont réalisées par Cevitas Real Estate LLC, agence agréée par la RERA à Dubaï." },
      { q: "Quelle est la différence entre ambassadeur et apporteur d'affaires ?", a: "Aucune dans la pratique : les deux présentent un acheteur et sont rémunérés si la vente se conclut. Sofara utilise le terme ambassadeur." },
      { q: "Combien gagne un ambassadeur immobilier à Dubaï ?", a: "De 1 % à 3 % du prix du bien selon le projet. Le taux est affiché dans votre espace avant toute recommandation." },
      { q: "Peut-on être ambassadeur depuis la France, la Belgique, la Suisse, le Canada ou le Maroc ?", a: "Oui. Vous agissez depuis votre pays ; les visites se font sur place à Dubaï ou en vidéo avec l'équipe agréée." },
      { q: "Faut-il créer une société pour être ambassadeur ?", a: "Non. Vous pouvez être payé en tant que particulier ou via votre structure, avec une facture générée depuis votre espace. Pour la fiscalité, renseignez-vous auprès d'un conseiller dans votre pays." },
      { q: "L'inscription au réseau d'ambassadeurs est-elle payante ?", a: "Non. L'inscription est gratuite, sans abonnement, sans droit d'entrée et sans quota. Vous êtes rémunéré uniquement sur les ventes conclues." },
      { q: "Que se passe-t-il si mon contact appelle directement l'agence ?", a: "Il reste rattaché à votre compte pendant 12 mois. La commission vous revient même s'il contacte Sofara ou l'agence sans passer par vous." },
    ],
    cta: {
      title: "Rejoignez le réseau d'ambassadeurs immobilier à Dubaï",
      text: "Plus de 700 ambassadeurs actifs. Inscription gratuite, sans licence ni société : présentez vos contacts et touchez de 1 % à 3 % du prix du bien.",
    },
    related: ["apporteur", "affiliate", "referral", "agent", "home"],
  },

  affiliate: {
    title: "Programme d'affiliation immobilier Dubaï : jusqu'à 3 %",
    description:
      "Programme d'affiliation immobilier à Dubaï : inscription gratuite, sans licence ni abonnement. Recommandez des acheteurs, touchez de 1 % à 3 % du prix.",
    h1: "Programme d'affiliation immobilier à Dubaï et aux Émirats",
    eyebrow: "Programme d'affiliation · Dubaï et Émirats arabes unis",
    intro:
      "Le **programme d'affiliation immobilier à Dubaï** de Sofara vous rémunère pour chaque acheteur que vous recommandez et qui achète un bien aux Émirats. L'agence agréée RERA Cevitas Real Estate LLC conseille et conclut la vente, et vous touchez **jusqu'à 3 % du prix du bien**, avec une inscription gratuite et sans licence.",
    sections: [
      {
        h2: "Le principe de l'affiliation immobilière",
        blocks: [
          { p: "L'affiliation consiste à être rémunéré pour avoir présenté un client. Sur le neuf à Dubaï, les promoteurs rémunèrent l'agence enregistrée qui apporte l'acheteur ; Sofara partage une part de cette rémunération avec l'affilié, selon un taux publié dans votre espace avant toute recommandation." },
          { p: "L'affilié joue le même rôle qu'un [apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai) ou qu'un membre du [réseau d'ambassadeurs immobilier à Dubaï](/fr/ambassadeurs-immobilier-dubai) : il présente, l'agence agréée vend." },
        ],
      },
      {
        h2: "Comment fonctionne le programme",
        blocks: [
          { ol: [
            "**Inscription gratuite** en deux minutes, depuis n'importe quel pays.",
            "**Recommandation** : partagez votre lien personnel ou enregistrez un acheteur depuis votre espace, avec son accord.",
            "**Accompagnement de l'acheteur** par l'équipe agréée : conseil, choix du projet, visites, réservation et SPA.",
            "**Suivi en temps réel** de chaque dossier dans votre espace.",
            "**Paiement** par virement sous 7 jours après le paiement du promoteur à l'agence.",
          ] },
        ],
      },
      {
        h2: "Comment est calculée la commission d'affiliation",
        blocks: [
          { ul: [
            "**Un pourcentage du prix du bien**, de 1 % à 3 % selon le projet.",
            "**Un taux connu à l'avance**, affiché pour chaque projet dans votre espace.",
            "**Acquise** lorsque l'acheteur signe le SPA et règle l'apport avec les frais d'enregistrement du Dubai Land Department (DLD).",
            "**Protégée** : chaque contact reste rattaché à votre compte pendant 12 mois.",
          ] },
          { p: "Le fonctionnement détaillé du versement est décrit sur la page [commission de recommandation](/fr/programme-recommandation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Ce qui est autorisé à Dubaï",
        blocks: [
          { p: "À Dubaï, seules les agences et les agents enregistrés auprès de la RERA peuvent exercer l'activité de courtage. L'affilié se limite à la mise en relation : il ne fait pas de visites, ne négocie pas et ne signe aucun document au nom de l'acheteur. Ce cadre est simple et protège à la fois l'acheteur et l'affilié." },
          { p: "Aucune société n'est exigée et l'inscription ne coûte rien. Les commissions sont à déclarer selon les règles de votre pays de résidence : renseignez-vous auprès d'un conseiller dans votre pays. Votre espace génère les factures nécessaires." },
        ],
      },
      {
        h2: "Pour qui est fait ce programme",
        blocks: [
          { ul: [
            "Les **expatriés et la diaspora** francophone, souvent sollicités par leurs proches sur l'immobilier à Dubaï.",
            "Les **conseillers en gestion de patrimoine**, experts-comptables et consultants en relocation.",
            "Les **agents immobiliers en France, en Belgique, en Suisse, au Canada ou au Maghreb** qui veulent servir leurs clients à Dubaï.",
            "Les **créateurs de contenu** finance, voyage ou entrepreneuriat.",
          ] },
          { p: "Pour répondre aux questions de vos contacts, partagez notre guide [investir dans l'immobilier à Dubaï](/fr/investir-immobilier-dubai). Pour comparer avec le métier d'agent, lisez [comment devenir agent immobilier à Dubaï](/blog/comment-devenir-agent-immobilier-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "Qu'est-ce qu'un programme d'affiliation immobilier à Dubaï ?", a: "C'est un programme qui rémunère la personne qui recommande un acheteur à une agence agréée, si la vente est conclue. Avec Sofara, l'affilié touche de 1 % à 3 % du prix du bien." },
      { q: "Combien rapporte l'affiliation immobilière à Dubaï ?", a: "Jusqu'à 3 % du prix du bien selon le projet. Le taux de chaque projet est affiché dans votre espace avant toute recommandation." },
      { q: "Faut-il une licence pour être affilié ?", a: "Non. Les étapes réglementées sont réalisées par Cevitas Real Estate LLC, agence agréée par la RERA. L'affilié présente seulement l'acheteur." },
      { q: "Faut-il créer une société aux Émirats ?", a: "Non. Vous pouvez être payé en tant que particulier ou via votre structure dans votre pays, contre une facture générée depuis votre espace." },
      { q: "Y a-t-il des frais d'inscription ?", a: "Aucun. L'inscription est gratuite, sans abonnement ni nombre minimum de recommandations." },
      { q: "Le programme couvre-t-il Abu Dhabi ?", a: "Oui. Sofara se concentre sur Dubaï et couvre aussi des projets à Abu Dhabi, Ras Al Khaimah et Sharjah." },
      { q: "Comment mes contacts sont-ils protégés ?", a: "Chaque contact est rattaché à votre compte pendant 12 mois, même s'il contacte directement Sofara ou l'agence." },
    ],
    cta: {
      title: "Rejoignez le programme d'affiliation immobilier",
      text: "Créez votre compte gratuit, partagez votre lien et laissez une équipe agréée à Dubaï transformer vos recommandations en commissions.",
    },
    related: ["ambassadors", "apporteur", "referral", "invest", "home"],
  },

  agent: {
    title: "Devenir agent immobilier à Dubaï en 2026 : le guide",
    description:
      "Comment devenir agent immobilier à Dubaï : visa, formation DREI, examen et carte RERA, rémunération. Et la voie ambassadeur, sans licence, depuis l'étranger.",
    h1: "Devenir agent immobilier à Dubaï en 2026",
    eyebrow: "Guide carrière · mis à jour en 2026",
    intro:
      "Il existe deux façons de travailler avec l'immobilier à Dubaï : devenir **agent immobilier agréé par la RERA**, ou devenir **ambassadeur** et présenter des acheteurs sans licence, depuis votre pays. Ce guide détaille les étapes officielles de la première voie et le fonctionnement de la seconde.",
    sections: [
      {
        h2: "Deux façons de travailler avec l'immobilier à Dubaï",
        blocks: [
          { table: {
            head: ["Critère", "Agent agréé (broker RERA)", "Ambassadeur Sofara"],
            rows: [
              ["Licence", "Carte de broker RERA", "Aucune"],
              ["Visa de résidence aux Émirats", "Obligatoire", "Non requis"],
              ["Coût de départ", "Formation DREI, examen et carte RERA", "Gratuit"],
              ["Délai pour démarrer", "Le temps du visa, de la formation et de l'examen", "Le jour même"],
              ["Lieu de travail", "Dubaï", "Partout dans le monde"],
              ["Rémunération", "Part de la commission d'agence", "De 1 % à 3 % du prix du bien"],
            ],
          } },
        ],
      },
      {
        h2: "Voie 1 : devenir agent immobilier agréé à Dubaï",
        blocks: [
          { h3: "1. Obtenir un visa de résidence" },
          { p: "La RERA, l'autorité de régulation rattachée au Dubai Land Department (DLD), délivre la carte de broker aux résidents des Émirats. La plupart des débutants rejoignent une agence qui parraine leur visa de travail." },
          { h3: "2. Suivre la formation DREI" },
          { p: "Le Dubai Real Estate Institute (DREI) dispense la formation obligatoire des brokers : droit immobilier de Dubaï, rôle du DLD et de la RERA, déontologie, ventes sur plan, comptes séquestres et contrats types." },
          { h3: "3. Réussir l'examen RERA" },
          { p: "Un examen portant sur le contenu de la formation. Les frais de formation, d'examen et de carte sont fixés par le DREI et la RERA : consultez leurs sites officiels pour les conditions à jour." },
          { h3: "4. Recevoir sa carte de broker" },
          { p: "Avec l'examen, un certificat de bonne conduite et le visa, l'agence vous enregistre auprès du DLD. Vous obtenez un numéro BRN et une carte RERA, à renouveler selon les règles de la RERA." },
        ],
      },
      {
        h2: "Comment est rémunéré un agent immobilier à Dubaï",
        blocks: [
          { p: "Les agents sont le plus souvent rémunérés à la commission. Sur le marché secondaire, l'agence perçoit des honoraires sur la transaction et l'agent en conserve une part qui dépend de son agence. Sur le neuf, c'est le promoteur qui rémunère l'agence. Les premiers mois servent souvent à se constituer une clientèle : prévoyez une épargne de départ." },
        ],
      },
      {
        h2: "Voie 2 : présenter des acheteurs sans licence, comme ambassadeur",
        blocks: [
          { p: "Si vous vivez hors des Émirats ou souhaitez découvrir le marché sans changer de vie, la voie ambassadeur est la plus simple. Vous présentez des acheteurs issus de votre réseau, l'agence agréée Cevitas Real Estate LLC s'occupe du conseil, des visites et de la signature, et vous touchez de 1 % à 3 % du prix du bien." },
          { ul: [
            "Inscription gratuite en deux minutes, sans licence, sans société exigée et sans quota.",
            "Lien de recommandation, fiches projets et suivi de chaque dossier.",
            "Commission acquise à la signature du SPA et au paiement de l'apport avec les frais d'enregistrement du DLD, versée sous 7 jours après le paiement du promoteur.",
          ] },
          { p: "Pour aller plus loin : le [réseau d'ambassadeurs immobilier à Dubaï](/fr/ambassadeurs-immobilier-dubai), le rôle d'[apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai) et notre article [devenir agent immobilier à Dubaï sans licence](/blog/devenir-agent-immobilier-dubai-sans-licence)." },
        ],
      },
      {
        h2: "Quelle voie choisir ?",
        blocks: [
          { ul: [
            "**Agent agréé** si vous vivez à Dubaï ou prévoyez de vous y installer, et souhaitez mener vous-même les visites.",
            "**Ambassadeur** si vous êtes à l'étranger, avez déjà un réseau intéressé par Dubaï, ou voulez un revenu complémentaire.",
            "**Les deux** : des agents en France, en Belgique, en Suisse ou au Maroc utilisent Sofara pour servir leurs clients qui achètent à Dubaï.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "Combien coûte la licence d'agent immobilier à Dubaï ?", a: "Les frais de formation DREI, d'examen et de carte RERA sont fixés par le DREI et la RERA. Consultez leurs sites officiels pour les montants à jour." },
      { q: "Peut-on être agent immobilier à Dubaï sans visa ?", a: "Pas en tant qu'agent agréé : la carte RERA exige un visa de résidence. En revanche, vous pouvez devenir ambassadeur Sofara sans visa ni licence." },
      { q: "Quelles sont les étapes pour devenir agent ?", a: "Obtenir un visa de résidence, suivre la formation du DREI, réussir l'examen RERA, puis être enregistré par une agence auprès du DLD pour recevoir sa carte." },
      { q: "Faut-il parler arabe ?", a: "Non. L'anglais est la langue de travail du secteur. Le français, l'espagnol ou le russe sont des atouts pour servir les acheteurs internationaux." },
      { q: "Combien touche un ambassadeur par vente ?", a: "De 1 % à 3 % du prix du bien selon le projet, taux affiché dans votre espace avant toute recommandation." },
      { q: "Qui signe les ventes apportées par un ambassadeur ?", a: "Cevitas Real Estate LLC, agence agréée par la RERA, réalise toutes les étapes réglementées." },
    ],
    cta: {
      title: "Commencez avec l'immobilier à Dubaï dès cette semaine",
      text: "Pas besoin d'attendre un visa, une formation et un examen pour présenter vos premiers acheteurs. Rejoignez le réseau Sofara gratuitement.",
    },
    related: ["ambassadors", "apporteur", "affiliate", "invest", "home"],
  },

  invest: {
    title: "Investir dans l'immobilier à Dubaï en 2026 : guide",
    description:
      "Investir dans l'immobilier à Dubaï en 2026 : pleine propriété, achat sur plan ou prêt, frais DLD, Golden Visa et étapes d'achat pour les non-résidents.",
    h1: "Investir dans l'immobilier à Dubaï en 2026",
    eyebrow: "Guide investisseur · Dubaï et Émirats",
    intro:
      "Dubaï attire des acheteurs du monde entier grâce à un marché ouvert aux étrangers, encadré par le Dubai Land Department (DLD) et la RERA. Ce guide résume ce qu'il faut savoir avant d'acheter, et comment le réseau Sofara oriente les acheteurs vers une agence agréée.",
    sections: [
      {
        h2: "Pourquoi investir à Dubaï",
        blocks: [
          { ul: [
            "**Pleine propriété (freehold)** pour les étrangers dans les zones désignées, enregistrée au Dubai Land Department.",
            "**Fiscalité locale** : renseignez-vous sur les règles des Émirats et de votre pays de résidence auprès d'un conseiller.",
            "**Golden Visa** : un visa de résidence de longue durée accessible par l'investissement immobilier, selon les conditions fixées par les autorités des Émirats.",
            "**Plans de paiement** échelonnés sur les projets neufs, avec des fonds versés sur un [compte séquestre](https://www.offplansimulator.com/fr/blog/escrow-account-off-plan-dubai) encadré par la RERA.",
          ] },
        ],
      },
      {
        h2: "Acheter sur plan ou un bien prêt",
        blocks: [
          { p: "L'**achat sur plan** permet de réserver avec un acompte, puis de payer par étapes pendant la construction, parfois après la remise des clés. Le **bien prêt** peut être loué immédiatement et se visite tel quel." },
          { p: "Le choix dépend de l'objectif : revenu locatif, constitution de patrimoine sur plusieurs années ou obtention d'un visa de résidence." },
        ],
      },
      {
        h2: "Les frais à prévoir",
        blocks: [
          { table: {
            head: ["Poste", "Qui le fixe"],
            rows: [
              ["Frais d'enregistrement", "Dubai Land Department (DLD)"],
              ["Frais administratifs d'enregistrement", "DLD et centres d'enregistrement agréés"],
              ["Charges de copropriété annuelles", "Selon la résidence, encadrées par la RERA"],
              ["Commission d'agence (marché secondaire)", "Convenue avec l'agence agréée"],
            ],
          } },
          { p: "Sur le neuf, la commission d'agence est payée par le promoteur, pas par l'acheteur. Les montants à jour sont publiés par le DLD." },
        ],
      },
      {
        h2: "Les quartiers les plus recherchés",
        blocks: [
          { p: "Downtown Dubai et Business Bay pour la vie de centre-ville, Dubai Marina et JBR pour le bord de mer, Dubai Hills Estate pour les familles, Jumeirah Village Circle pour des budgets plus accessibles, Dubai Creek Harbour et Dubai South pour les projets en développement. Hors de Dubaï, l'île de Saadiyat à Abu Dhabi et Al Marjan Island à Ras Al Khaimah attirent aussi les acheteurs." },
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
            "Suivre le [plan de paiement](https://www.offplansimulator.com/fr/blog/financing-off-plan-payment-plan-vs-mortgage) jusqu'à la remise des clés.",
          ] },
          { p: "Vous connaissez des personnes qui veulent investir à Dubaï ? Recommandez-les à Sofara : découvrez le [réseau d'ambassadeurs immobilier à Dubaï](/fr/ambassadeurs-immobilier-dubai), le rôle d'[apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai) et le [programme d'affiliation immobilier](/fr/affiliation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Simuler votre investissement",
        blocks: [{ p: "Testez l'opération avec vos propres chiffres grâce aux simulateurs gratuits d'OffPlanSimulator : [simulateur d'investissement immobilier à Dubaï](https://www.offplansimulator.com/fr), [simulateur de rentabilité locative](https://www.offplansimulator.com/fr/simulateur-rentabilite-locative-dubai), [calcul des frais d'achat](https://www.offplansimulator.com/fr/calcul-frais-achat-immobilier-dubai), [simulateur de crédit immobilier](https://www.offplansimulator.com/fr/simulateur-credit-immobilier-dubai)." }],
      },
    ],
    faqs: [
      { q: "Un étranger peut-il acheter un bien à Dubaï ?", a: "Oui. Toute nationalité peut acheter en pleine propriété dans les zones freehold, sans résider aux Émirats." },
      { q: "Quel budget prévoir pour investir à Dubaï ?", a: "Cela dépend du quartier, du type de bien et du plan de paiement. Un conseiller agréé vous présente les options adaptées à votre budget, et les simulateurs gratuits d'OffPlanSimulator vous aident à préparer vos calculs." },
      { q: "Quels sont les frais d'achat ?", a: "Principalement les frais d'enregistrement du DLD et des frais administratifs. Sur le neuf, l'acheteur ne paie pas de commission d'agence. Les montants à jour sont publiés par le DLD." },
      { q: "Comment obtenir le Golden Visa par l'immobilier ?", a: "En remplissant les conditions d'investissement fixées par les autorités des Émirats. Un conseiller agréé vous indique les critères à jour." },
      { q: "Faut-il résider aux Émirats pour acheter ?", a: "Non. L'achat peut se faire à distance, avec des visites en vidéo et une signature encadrée par une agence agréée." },
      { q: "Qui accompagne les acheteurs recommandés par Sofara ?", a: "Cevitas Real Estate LLC, agence agréée par la RERA à Dubaï, du choix du projet jusqu'à la remise des clés." },
    ],
    cta: {
      title: "Votre entourage veut investir à Dubaï ?",
      text: "Recommandez-le à Sofara : une équipe agréée l'accompagne de A à Z, et vous touchez de 1 % à 3 % du prix du bien sur la vente.",
    },
    related: ["ambassadors", "affiliate", "agent", "home"],
  },

  apporteur: {
    title: "Apporteur d'affaires immobilier Dubaï : gratuit, 1 à 3 %",
    description:
      "Apporteur d'affaires immobilier à Dubaï : présentez des acheteurs depuis la France, la Suisse ou le Maroc, sans licence ni frais : touchez de 1 % à 3 % du prix.",
    h1: "Apporteur d'affaires immobilier à Dubaï : statut, commission et démarrage",
    eyebrow: "Apporteur d'affaires · France, Belgique, Suisse, Canada, Maroc",
    intro:
      "Un **apporteur d'affaires immobilier à Dubaï** présente un acheteur à une agence agréée et touche une commission quand la vente se conclut, sans licence puisque c'est l'agence qui réalise la transaction. Avec Sofara, l'agence est Cevitas Real Estate LLC, agréée par la RERA, et vous touchez **de 1 % à 3 % du prix du bien**, avec une inscription gratuite, sans abonnement et sans société exigée.",
    sections: [
      {
        h2: "Définition : apporteur d'affaires, agent ou ambassadeur ?",
        blocks: [
          { p: "L'**apporteur d'affaires** (ou **apporteur de clients**) identifie une personne qui souhaite acheter et la met en relation avec un professionnel. Il ne réalise pas la transaction. L'**agent immobilier agréé** conseille, organise les visites, négocie et suit la vente : à Dubaï, il doit détenir une carte délivrée par la RERA. L'**ambassadeur** est le nom donné aux apporteurs d'affaires du [réseau d'ambassadeurs immobilier à Dubaï](/fr/ambassadeurs-immobilier-dubai) de Sofara." },
          { table: {
            head: ["", "Apporteur d'affaires / ambassadeur", "Agent agréé RERA"],
            rows: [
              ["Présente l'acheteur", "Oui", "Oui"],
              ["Visites, négociation, contrat", "Non", "Oui"],
              ["Licence RERA", "Non requise", "Obligatoire"],
              ["Résidence aux Émirats", "Non requise", "Visa de résidence requis"],
            ],
          } },
        ],
      },
      {
        h2: "Est-ce légal ? Le statut de l'apporteur d'affaires à Dubaï",
        blocks: [
          { p: "À Dubaï, le courtage immobilier est réservé aux agences et aux agents enregistrés auprès de la RERA, rattachée au Dubai Land Department (DLD). L'apporteur d'affaires se limite à la mise en relation : il ne fait pas de visites, ne négocie pas le prix, ne rédige aucun contrat et ne manipule jamais les fonds de l'acheteur. La vente est conclue par Cevitas Real Estate LLC, agence agréée par la RERA : c'est pourquoi aucune licence RERA n'est nécessaire pour l'apporteur." },
          { p: "Si vous exercez déjà une profession réglementée dans votre pays (agent immobilier, conseiller financier, avocat), faites valider votre situation par votre conseiller ou votre ordre professionnel." },
        ],
      },
      {
        h2: "Faut-il une société ? Quel coût d'entrée ?",
        blocks: [
          { ul: [
            "**Aucune société exigée** : vous pouvez être payé en tant que particulier ou via votre structure dans votre pays.",
            "**Aucun coût d'entrée** : inscription gratuite, sans abonnement, sans droit d'entrée et sans quota de ventes.",
            "**Aucune licence** ni carte professionnelle demandée pour présenter un acheteur.",
            "**Aucune installation** aux Émirats : vous agissez depuis votre pays.",
          ] },
        ],
      },
      {
        h2: "Ce que fait l'apporteur d'affaires, et ce qu'il ne fait pas",
        blocks: [
          { ul: [
            "**Vous** : repérer l'intérêt, obtenir l'accord de la personne, enregistrer le contact ou partager votre lien.",
            "**L'agence agréée** : qualification, choix du projet, visites sur place ou en vidéo, réservation, contrat de vente (SPA), suivi jusqu'à la remise des clés.",
            "**Sofara** : votre espace pour suivre chaque contact étape par étape et recevoir vos commissions.",
          ] },
        ],
      },
      {
        h2: "Comment est calculée et versée la commission",
        blocks: [
          { p: "Sur le neuf, les promoteurs de Dubaï rémunèrent l'agence qui apporte l'acheteur. Sofara reverse à l'apporteur d'affaires **de 1 % à 3 % du prix du bien** selon le projet. Le taux de chaque projet est affiché dans votre espace avant toute recommandation." },
          { ul: [
            "**Acquise** lorsque l'acheteur signe le SPA et règle l'apport avec les frais d'enregistrement du DLD.",
            "**Versée** par virement sous 7 jours après le paiement du promoteur à l'agence, contre une facture émise depuis votre espace.",
            "**Protégée** : chaque contact reste rattaché à votre compte pendant 12 mois.",
          ] },
          { p: "Voir aussi la page [commission de recommandation](/fr/programme-recommandation-immobilier-dubai) et le [programme d'affiliation immobilier](/fr/affiliation-immobilier-dubai)." },
        ],
      },
      {
        h2: "Contrat et conditions de l'apporteur d'affaires",
        blocks: [
          { p: "Les conditions du programme sont acceptées en ligne lors de l'inscription : rôle de l'apporteur limité à la mise en relation, taux par projet, moment où la commission est acquise, délai de versement et durée de protection du contact. Chaque recommandation est horodatée dans votre espace, ce qui sert de référence en cas de question sur l'origine d'un contact." },
        ],
      },
      {
        h2: "Depuis la France, la Belgique, la Suisse, le Canada ou le Maroc",
        blocks: [
          { p: "L'activité se pratique depuis n'importe quel pays. Vos contacts sont accompagnés en français par l'équipe agréée, avec des visites sur place à Dubaï ou en vidéo. Vous suivez chaque dossier à distance depuis votre espace." },
          { p: "**Fiscalité** : les commissions sont des revenus à déclarer selon les règles de votre pays de résidence. Les règles diffèrent d'un pays à l'autre : renseignez-vous auprès d'un conseiller ou d'un expert-comptable dans votre pays. Votre espace Sofara génère les factures nécessaires." },
        ],
      },
      {
        h2: "Comment présenter un client",
        blocks: [
          { ol: [
            "Écoutez le projet de la personne : investir, s'installer ou obtenir une résidence.",
            "Présentez Sofara et l'agence agréée, sans promesse de rendement ni de prix.",
            "Obtenez son accord, puis enregistrez le contact ou envoyez votre lien personnel.",
            "Laissez l'équipe agréée conseiller et proposer les projets ; suivez l'avancement dans votre espace.",
          ] },
          { p: "Pour répondre aux premières questions, partagez le guide [investir dans l'immobilier à Dubaï](/fr/investir-immobilier-dubai). Pour comparer avec le métier d'agent, lisez [comment devenir agent immobilier à Dubaï](/blog/comment-devenir-agent-immobilier-dubai) et [devenir agent immobilier à Dubaï sans licence](/blog/devenir-agent-immobilier-dubai-sans-licence)." },
        ],
      },
      {
        h2: "Comment démarrer en 10 minutes",
        blocks: [
          { ol: [
            "Créez votre compte gratuit sur Sofara.",
            "Complétez votre profil et votre vérification d'identité.",
            "Enregistrez votre premier contact ou partagez votre lien personnel.",
            "Suivez l'avancement du dossier dans votre espace, de la qualification à la signature.",
          ] },
          { p: "Vous rejoignez ainsi plus de 700 ambassadeurs actifs." },
        ],
      },
    ],
    faqs: [
      { q: "Qu'est-ce qu'un apporteur d'affaires immobilier à Dubaï ?", a: "C'est une personne qui présente un acheteur à une agence agréée et qui touche une commission si la vente est conclue. Elle ne réalise ni visite, ni négociation, ni contrat." },
      { q: "Est-il légal d'être apporteur d'affaires à Dubaï sans licence ?", a: "Oui avec Sofara : la vente est réalisée par Cevitas Real Estate LLC, agence agréée par la RERA, et vous intervenez uniquement pour la mise en relation, sans licence RERA." },
      { q: "Faut-il une société pour être apporteur d'affaires à Dubaï ?", a: "Non. Vous pouvez être payé en tant que particulier ou via votre structure dans votre pays, avec une facture générée depuis votre espace." },
      { q: "Combien coûte l'inscription comme apporteur d'affaires ?", a: "Rien. L'inscription est gratuite, sans abonnement, sans droit d'entrée et sans quota de ventes." },
      { q: "Combien touche un apporteur d'affaires immobilier à Dubaï ?", a: "De 1 % à 3 % du prix du bien selon le projet. Le taux est affiché dans votre espace avant toute recommandation." },
      { q: "Quand la commission est-elle versée ?", a: "Elle est acquise à la signature du SPA et au paiement de l'apport avec les frais DLD, puis versée par virement sous 7 jours après le paiement du promoteur à l'agence." },
      { q: "Peut-on être apporteur d'affaires depuis la France, la Belgique, la Suisse ou le Canada ?", a: "Oui. Vous agissez depuis votre pays ; les visites se font sur place à Dubaï ou en vidéo avec l'équipe agréée." },
      { q: "Comment déclarer ces commissions ?", a: "Selon les règles fiscales de votre pays de résidence. Renseignez-vous auprès d'un conseiller ou d'un expert-comptable dans votre pays." },
    ],
    cta: {
      title: "Devenez apporteur d'affaires immobilier à Dubaï",
      text: "Inscription gratuite, sans licence ni société. Présentez vos contacts, l'équipe agréée s'occupe du reste, et vous touchez de 1 % à 3 % du prix.",
    },
    related: ["ambassadors", "affiliate", "referral", "travailDubai", "home"],
  },

  travailDubai: {
    title: "Travailler dans l'immobilier à Dubaï en 2026 : le guide",
    description:
      "Travailler dans l'immobilier à Dubaï : métiers, visa, licence RERA, rémunération à la commission et la voie d'apporteur d'affaires depuis l'étranger.",
    h1: "Travailler dans l'immobilier à Dubaï : métiers, conditions et rémunération",
    eyebrow: "Carrière · francophones à Dubaï",
    intro:
      "Pour **travailler dans l'immobilier à Dubaï**, il faut soit devenir agent agréé par la RERA, soit présenter des acheteurs comme apporteur d'affaires, sans licence. Voici les métiers, les conditions officielles pour exercer, le mode de rémunération et la façon de démarrer, sur place ou depuis votre pays.",
    sections: [
      {
        h2: "Les métiers de l'immobilier à Dubaï",
        blocks: [
          { ul: [
            "**Agent immobilier (broker)** : il conseille les acheteurs et vendeurs, organise les visites et suit la vente. Il doit détenir une carte RERA.",
            "**Commercial sur le neuf (off-plan)** : spécialisé dans les lancements des promoteurs, dans une agence ou chez un promoteur.",
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
            "La formation obligatoire du Dubai Real Estate Institute (DREI).",
            "L'examen RERA, puis l'enregistrement auprès du Dubai Land Department (DLD).",
            "Une carte de broker avec numéro BRN, à renouveler selon les règles de la RERA.",
          ] },
          { p: "Les frais de formation, d'examen et de carte sont fixés par le DREI et la RERA. Le détail des étapes est dans notre guide [devenir agent immobilier à Dubaï](/fr/devenir-agent-immobilier-dubai) et dans l'article [comment devenir agent immobilier à Dubaï](/blog/comment-devenir-agent-immobilier-dubai)." },
        ],
      },
      {
        h2: "Comment on est payé dans l'immobilier à Dubaï",
        blocks: [
          { p: "La plupart des agents sont rémunérés à la commission. Sur une vente dans l'ancien, l'agence perçoit des honoraires et l'agent en conserve une part qui dépend de l'agence. Sur le neuf, le promoteur rémunère l'agence. Les premiers mois servent souvent à constituer sa clientèle : prévoyez une épargne de départ." },
          { p: "Les francophones ont un atout : une clientèle française, belge, suisse, canadienne et maghrébine qui apprécie d'être conseillée dans sa langue." },
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
          { p: "Beaucoup de francophones commencent comme **apporteurs d'affaires** depuis la France, la Belgique, la Suisse ou le Canada : ils présentent des acheteurs à une agence agréée via Sofara et touchent de 1 % à 3 % du prix du bien, sans visa, sans licence et sans frais d'inscription. C'est un moyen concret de découvrir le marché avant de s'installer." },
          { p: "Tout est expliqué sur la page [apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai), ainsi que sur le [réseau d'ambassadeurs immobilier à Dubaï](/fr/ambassadeurs-immobilier-dubai) et dans l'article [devenir agent immobilier à Dubaï sans licence](/blog/devenir-agent-immobilier-dubai-sans-licence)." },
        ],
      },
    ],
    faqs: [
      { q: "Peut-on travailler dans l'immobilier à Dubaï sans parler anglais ?", a: "L'anglais est la langue de travail. Le français est un vrai atout pour servir la clientèle francophone, mais il ne remplace pas l'anglais pour exercer comme agent." },
      { q: "Faut-il une licence pour travailler dans l'immobilier à Dubaï ?", a: "Oui pour exercer comme agent : il faut une carte RERA, obtenue après la formation DREI et l'examen. Comme apporteur d'affaires via Sofara, aucune licence n'est nécessaire." },
      { q: "Comment est rémunéré un agent immobilier à Dubaï ?", a: "Le plus souvent à la commission : l'agent touche une part de la commission perçue par l'agence. Les premiers mois servent souvent à construire sa clientèle." },
      { q: "Peut-on commencer depuis la France ?", a: "Oui, comme apporteur d'affaires : vous présentez des acheteurs via Sofara et touchez de 1 % à 3 % du prix du bien." },
      { q: "Combien coûte la licence RERA ?", a: "Les frais de formation, d'examen et de carte sont fixés par le DREI et la RERA. Consultez leurs sites officiels pour les montants à jour." },
      { q: "Les agences recrutent-elles des francophones ?", a: "Oui, la clientèle francophone est présente à Dubaï et les agences recherchent des profils capables de la conseiller dans sa langue." },
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
      "Commission de recommandation et programme de parrainage immobilier à Dubaï : recommandez un acheteur, touchez de 1 % à 3 % du prix. Gratuit, sans licence.",
    h1: "Commission de recommandation immobilier à Dubaï : le programme de parrainage Sofara",
    eyebrow: "Programme de recommandation et de parrainage · Dubaï et Émirats",
    intro:
      "La **commission de recommandation immobilier à Dubaï** est la rémunération versée à la personne qui présente un acheteur à une agence agréée, lorsque la vente se conclut. Avec Sofara, vous recommandez à Cevitas Real Estate LLC, agence agréée RERA, et vous touchez **de 1 % à 3 % du prix du bien**, gratuitement, sans licence, depuis n'importe quel pays.",
    sections: [
      {
        h2: "Comment est calculée la commission de recommandation",
        blocks: [
          { p: "Sur le neuf, les promoteurs de Dubaï rémunèrent l'agence qui apporte l'acheteur. Sofara reverse une part publiée de cette rémunération à la personne qui a recommandé l'acheteur : c'est la commission de recommandation." },
          { ul: [
            "**Un pourcentage du prix du bien** : de 1 % à 3 % selon le projet.",
            "**Un taux connu à l'avance** : affiché pour chaque projet dans votre espace, avant toute recommandation.",
            "**Aucune avance de frais** : l'inscription est gratuite, sans abonnement ni droit d'entrée.",
          ] },
        ],
      },
      {
        h2: "Quand et comment la commission est versée",
        blocks: [
          { ul: [
            "**Acquise** lorsque l'acheteur signe le SPA et règle l'apport avec les frais d'enregistrement du Dubai Land Department (DLD).",
            "**Versée** par virement sous 7 jours après le paiement du promoteur à l'agence.",
            "**Facturée** simplement : la facture est générée depuis votre espace, en tant que particulier ou via votre structure.",
            "**Protégée** : chaque contact reste rattaché à votre compte pendant 12 mois.",
          ] },
          { p: "Côté fiscalité, les commissions sont à déclarer selon les règles de votre pays de résidence : renseignez-vous auprès d'un conseiller dans votre pays." },
        ],
      },
      {
        h2: "Recommander un acheteur, étape par étape",
        blocks: [
          { ol: [
            "**Créez votre compte gratuit** et récupérez votre lien personnel.",
            "**Recommandez** : avec l'accord de la personne, partagez le lien ou enregistrez le contact depuis votre espace.",
            "**L'équipe agréée accompagne l'acheteur** : appel de qualification, sélection de projets, visites sur place ou en vidéo, réservation, contrat (SPA).",
            "**Suivez chaque étape** dans votre espace, avec une notification à chaque avancée.",
            "**Recevez votre commission** une fois la vente conclue.",
          ] },
        ],
      },
      {
        h2: "Recommandation, parrainage, apport d'affaires : quelles différences ?",
        blocks: [
          { p: "Le **parrainage** désigne souvent une prime ponctuelle offerte à un client qui en présente un autre. L'**apporteur d'affaires**, l'**affiliation** et le **programme de recommandation** reposent sur le même principe : présenter un acheteur et être rémunéré si la vente se fait. Chez Sofara, la recommandation est encadrée : taux publié, suivi en temps réel, protection du contact et paiement rapide." },
          { p: "Voir aussi le rôle d'[apporteur d'affaires immobilier à Dubaï](/fr/apporteur-affaires-immobilier-dubai), le [programme d'affiliation immobilier](/fr/affiliation-immobilier-dubai) et le [réseau d'ambassadeurs immobilier à Dubaï](/fr/ambassadeurs-immobilier-dubai)." },
        ],
      },
      {
        h2: "Est-ce légal de toucher une commission de recommandation à Dubaï ?",
        blocks: [
          { p: "Oui, dans ce cadre. À Dubaï, le courtage est réservé aux agences et agents enregistrés auprès de la RERA. La personne qui recommande se limite à la mise en relation, et toutes les étapes réglementées (conseil, visites, négociation, contrat) sont réalisées par Cevitas Real Estate LLC, agence agréée RERA. Aucune licence n'est donc nécessaire pour recommander. Pour en savoir plus : [devenir agent immobilier à Dubaï sans licence](/blog/devenir-agent-immobilier-dubai-sans-licence)." },
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
          { p: "Le programme réunit déjà plus de 700 ambassadeurs actifs. Pour comparer avec le métier d'agent, lisez [comment devenir agent immobilier à Dubaï](/blog/comment-devenir-agent-immobilier-dubai)." },
        ],
      },
    ],
    faqs: [
      { q: "Qu'est-ce qu'une commission de recommandation immobilière ?", a: "C'est la rémunération versée à la personne qui présente un acheteur à une agence agréée, si la vente se conclut." },
      { q: "Quel est le taux de la commission de recommandation immobilier à Dubaï ?", a: "De 1 % à 3 % du prix du bien selon le projet, taux affiché dans votre espace avant toute recommandation." },
      { q: "Quand la commission de recommandation est-elle versée ?", a: "Elle est acquise à la signature du SPA et au paiement de l'apport avec les frais DLD, puis versée par virement sous 7 jours après le paiement du promoteur à l'agence." },
      { q: "Quelle différence entre parrainage et recommandation immobilière ?", a: "Le parrainage est souvent une prime ponctuelle entre clients. La recommandation Sofara est un pourcentage du prix du bien, avec un taux publié et un suivi de chaque dossier." },
      { q: "Faut-il une licence pour recommander un acheteur ?", a: "Non. Vous présentez l'acheteur ; Cevitas Real Estate LLC, agence agréée RERA, réalise toutes les étapes réglementées." },
      { q: "Faut-il une société pour toucher une commission de recommandation ?", a: "Non. Vous pouvez être payé en tant que particulier ou via votre structure, avec une facture générée depuis votre espace." },
      { q: "Mon contact est-il protégé ?", a: "Oui, pendant 12 mois, même s'il contacte directement Sofara ou l'agence." },
      { q: "L'inscription est-elle payante ?", a: "Non, elle est gratuite, sans abonnement ni nombre minimum de recommandations." },
    ],
    cta: {
      title: "Recommandez un acheteur et touchez votre commission",
      text: "Inscription gratuite, sans licence ni société. Présentez vos contacts, l'équipe agréée s'occupe du reste, et vous touchez de 1 % à 3 % du prix du bien.",
    },
    related: ["apporteur", "ambassadors", "affiliate", "home"],
  },
};
