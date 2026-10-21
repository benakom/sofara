import { ctaShare, agentNudge, signature, SIGNUP } from "../common.mjs";

export default {
  id: "07-onboarding-ambassador-plus",
  sequence: "onboarding",
  day: 21,
  subject: {
    en: "Ambassador+: earn 10% on every deal your recruits close",
    fr: "Ambassadeur+ : gagnez 10 % sur chaque dossier conclu par vos filleuls",
  },
  preview: {
    en: "One recruited ambassador. A second income line, for life of the account.",
    fr: "Un ambassadeur recruté. Une deuxième ligne de revenus, pour toute la vie du compte.",
  },
  blocks: {
    en: [
      ["h1", "Double your reach with Ambassador+"],
      ["p", "So far we have talked about buyers. There is a second way to earn that most ambassadors overlook: **recruit other ambassadors.**"],
      ["h2", "How it works"],
      ["ul", [
        "Share your referral link with someone who would make a good ambassador. When they register through it, they become your godchild.",
        "From the first godchild, your status switches to **Ambassador+** automatically.",
        "On **every transaction your godchildren close, you receive a 10% bonus** on their commission. Their commission is not reduced; the bonus is paid by Sofara on top.",
        "It applies to every deal, for as long as both accounts are active.",
      ]],
      ["h2", "What it is worth"],
      ["p", "Say you recruit five people. Each closes two AED 2 million deals a year at 3%, so AED 60,000 each. Their ten deals generate AED 600,000 in commissions. **Your bonus: AED 60,000 a year**, without introducing a single buyer yourself."],
      ["h2", "Who makes a good ambassador"],
      ["ul", [
        "**Real estate agents abroad** who have clients asking about Dubai. They already have the conversations; they just need a licensed closer.",
        "**Financial advisors, wealth managers, insurance brokers**: they discuss assets with clients every week.",
        "**Community leaders and connectors**: diaspora associations, chambers of commerce, alumni networks.",
        "**Anyone who travels between your country and the UAE** for business.",
      ]],
      ["quote", "I earn commissions introducing buyers to a licensed Dubai brokerage. It is free to join and you never negotiate or sign anything. Here is my link if you want to see how it works: {{referral_link}}"],
      ctaShare.en,
      agentNudge.en,
      ["p", "Agents: your recruiting link and your client link are the same link. A colleague who registers becomes your godchild; a buyer who registers becomes your lead."],
      signature.en,
    ],
    fr: [
      ["h1", "Doublez votre portée avec Ambassadeur+"],
      ["p", "Jusqu'ici nous avons parlé d'acheteurs. Il existe une deuxième façon de gagner que la plupart des ambassadeurs négligent : **recruter d'autres ambassadeurs.**"],
      ["h2", "Comment ça marche"],
      ["ul", [
        "Partagez votre lien de parrainage avec une personne qui ferait un bon ambassadeur. Quand elle s'inscrit via ce lien, elle devient votre filleul.",
        "Dès le premier filleul, votre statut passe automatiquement à **Ambassadeur+**.",
        "Sur **chaque transaction conclue par vos filleuls, vous recevez un bonus de 10 %** de leur commission. Leur commission n'est pas réduite ; le bonus est versé par Sofara en plus.",
        "Cela s'applique à chaque dossier, tant que les deux comptes sont actifs.",
      ]],
      ["h2", "Ce que ça vaut"],
      ["p", "Imaginez cinq recrues. Chacune conclut deux dossiers à AED 2 millions par an à 3 %, soit AED 60 000 chacune. Leurs dix dossiers génèrent AED 600 000 de commissions. **Votre bonus : AED 60 000 par an**, sans introduire vous-même un seul acheteur."],
      ["h2", "Qui fait un bon ambassadeur"],
      ["ul", [
        "**Les agents immobiliers à l'étranger** dont les clients posent des questions sur Dubaï. Ils ont déjà les conversations ; il leur manque un closer licencié.",
        "**Conseillers financiers, gestionnaires de patrimoine, courtiers en assurance** : ils parlent d'actifs avec leurs clients chaque semaine.",
        "**Leaders communautaires et connecteurs** : associations de la diaspora, chambres de commerce, réseaux d'anciens.",
        "**Toute personne qui voyage entre votre pays et les Émirats** pour affaires.",
      ]],
      ["quote", "Je touche des commissions en présentant des acheteurs à une agence licenciée à Dubaï. L'inscription est gratuite et tu ne négocies ni ne signes jamais rien. Voici mon lien si tu veux voir comment ça marche : {{referral_link}}"],
      ctaShare.fr,
      agentNudge.fr,
      ["p", "Agents : votre lien de recrutement et votre lien client sont le même lien. Un confrère qui s'inscrit devient votre filleul ; un acheteur qui s'inscrit devient votre lead."],
      signature.fr,
    ],
  },
};
