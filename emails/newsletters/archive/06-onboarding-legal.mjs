import { closing } from "../common.mjs";

export default {
  id: "06-onboarding-legal",
  sequence: "onboarding",
  day: 16,
  subject: {
    en: "What the law lets you do as an ambassador (and what it does not)",
    fr: "Ce que la loi vous autorise à faire en tant qu'ambassadeur (et ce qu'elle interdit)",
  },
  preview: {
    en: "No licence needed, because you introduce and we transact. The five rules.",
    fr: "Aucune licence nécessaire, car vous introduisez et nous concluons. Les cinq règles.",
  },
  blocks: {
    en: [
      ["h1", "Legal: your role, your protection"],
      ["p", "Dubai real estate is regulated by the Real Estate Regulatory Agency (RERA), part of the Dubai Land Department. Only licensed brokers may negotiate, advise on or conclude property transactions. This is exactly why the Sofara model works: **you are a business introducer, Cevitas Real Estate LLC is the licensed broker.**"],
      ["h2", "Five rules that keep you safe"],
      ["ol", [
        "**Introduce, do not transact.** You may say \"I know a licensed team in Dubai, I'll connect you\". You may not negotiate prices, promise returns, draft or sign anything on a buyer's behalf.",
        "**Never promise a return.** \"Guaranteed 10%\" is both illegal and false. Say \"yields in Dubai are typically 6% to 9% gross, the team will show you real numbers on specific units\".",
        "**Get consent before you share a contact.** When you add a lead to your pipeline you confirm the person agreed to be contacted. This is a GDPR and UAE PDPL requirement, and Sofara may verify it.",
        "**Use approved material only.** The Sofara and Cevitas names, logos and brochures are licensed to you for this programme. Custom posts or ads mentioning them need written approval first.",
        "**Never handle client money.** All payments go from the buyer to the developer's DLD escrow account or to Cevitas as broker. If anyone asks you to receive funds, stop and contact us.",
      ]],
      ["h2", "What protects the buyer, which protects your reputation"],
      ["ul", [
        "Off-plan payments go to a **DLD-controlled escrow account** (Law 8 of 2007), released to the developer only against certified construction progress.",
        "Every off-plan sale is registered in **Oqood**; every completed sale produces a **title deed** from DLD.",
        "Every broker on a transaction must hold a **RERA broker card**. Cevitas does; buyers can verify it on the Dubai REST app.",
      ]],
      ["h2", "Your agreement in brief"],
      ["p", "Your ambassador agreement is with Cevitas Real Estate LLC under Dubai law. It is non-exclusive, free, renews yearly, and either side can end it with 30 days' notice. Commission is due on transactions actually completed and paid by the developer, within 7 days of closing, in AED, against your invoice."],
      ["callout", "**This framework is your selling point.** Your contacts are not dealing with an anonymous intermediary; they are being introduced to a RERA-licensed brokerage that has facilitated more than AED 100 million in transactions. Say so."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Juridique : votre rôle, votre protection"],
      ["p", "L'immobilier à Dubaï est réglementé par la Real Estate Regulatory Agency (RERA), rattachée au Dubai Land Department. Seuls les courtiers licenciés peuvent négocier, conseiller ou conclure des transactions immobilières. C'est précisément pour cela que le modèle Sofara fonctionne : **vous êtes apporteur d'affaires, Cevitas Real Estate LLC est le courtier licencié.**"],
      ["h2", "Cinq règles qui vous protègent"],
      ["ol", [
        "**Introduisez, ne transigez pas.** Vous pouvez dire « je connais une équipe licenciée à Dubaï, je te mets en contact ». Vous ne pouvez pas négocier des prix, promettre des rendements, rédiger ou signer quoi que ce soit au nom d'un acheteur.",
        "**Ne promettez jamais un rendement.** « 10 % garantis » est à la fois illégal et faux. Dites « les rendements à Dubaï sont généralement de 6 % à 9 % bruts, l'équipe te montrera les vrais chiffres sur des unités précises ».",
        "**Obtenez le consentement avant de partager un contact.** En ajoutant un lead à votre pipeline, vous confirmez que la personne a accepté d'être contactée. C'est une exigence RGPD et PDPL des Émirats, et Sofara peut le vérifier.",
        "**Utilisez uniquement les supports approuvés.** Les noms, logos et brochures Sofara et Cevitas vous sont concédés pour ce programme. Toute publication ou publicité personnalisée les mentionnant nécessite une approbation écrite préalable.",
        "**Ne manipulez jamais l'argent des clients.** Tous les paiements vont de l'acheteur au compte séquestre DLD du promoteur ou à Cevitas en tant que courtier. Si quelqu'un vous demande de recevoir des fonds, arrêtez et contactez-nous.",
      ]],
      ["h2", "Ce qui protège l'acheteur, et donc votre réputation"],
      ["ul", [
        "Les paiements off-plan vont sur un **compte séquestre contrôlé par le DLD** (loi 8 de 2007), libéré au promoteur uniquement contre un avancement de construction certifié.",
        "Chaque vente off-plan est enregistrée dans **Oqood** ; chaque vente de bien livré produit un **titre de propriété** du DLD.",
        "Chaque courtier sur une transaction doit détenir une **carte de courtier RERA**. Cevitas la détient ; les acheteurs peuvent la vérifier sur l'application Dubai REST.",
      ]],
      ["h2", "Votre contrat en bref"],
      ["p", "Votre contrat d'ambassadeur est conclu avec Cevitas Real Estate LLC sous le droit de Dubaï. Il est non exclusif, gratuit, renouvelé chaque année, et chaque partie peut y mettre fin avec un préavis de 30 jours. La commission est due sur les transactions effectivement conclues et payées par le promoteur, sous 7 jours après le closing, en AED, contre votre facture."],
      ["callout", "**Ce cadre est votre argument de vente.** Vos contacts ne traitent pas avec un intermédiaire anonyme ; ils sont présentés à une agence licenciée RERA qui a facilité plus de AED 100 millions de transactions. Dites-le."],
      ...closing("fr"),
    ],
  },
};
