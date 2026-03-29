import { Composition } from "remotion";
import { CourseVideo, type CourseVideoProps } from "./CourseVideo";

const courses: { id: string; props: CourseVideoProps }[] = [
  { id: "course-01", props: { title: "Les fondamentaux de l'immobilier à Dubai", subtitle: "Dubai Real Estate Fundamentals", category: "DUBAI", duration: "2h 30min", icon: "🏙️", points: ["Structure du marché", "Types de propriétés", "Processus d'achat", "Zones clés"], courseNumber: 1 }},
  { id: "course-02", props: { title: "Le marché Off-Plan", subtitle: "Guide complet", category: "DUBAI", duration: "1h 45min", icon: "📋", points: ["Avantages & risques", "Plans de paiement", "Choix du promoteur", "Stratégies investisseurs"], courseNumber: 2 }},
  { id: "course-03", props: { title: "Zones Freehold vs Leasehold", subtitle: "Comprendre les différences", category: "DUBAI", duration: "1h 00min", icon: "🗺️", points: ["Zones ouvertes aux étrangers", "Implications juridiques", "Conseils clients", "Cadre légal"], courseNumber: 3 }},
  { id: "course-04", props: { title: "Les développeurs premium", subtitle: "Emaar, DAMAC, Sobha & plus", category: "DUBAI", duration: "2h 00min", icon: "🏗️", points: ["Historique & projets", "Qualité de construction", "Réputation", "Plans de paiement"], courseNumber: 4 }},
  { id: "course-05", props: { title: "Les quartiers premium de Dubai", subtitle: "Zones les plus recherchées", category: "DUBAI", duration: "1h 30min", icon: "📍", points: ["Downtown & Marina", "Palm Jumeirah", "Business Bay", "Dubai Hills"], courseNumber: 5 }},
  { id: "course-06", props: { title: "Prospection & Génération de leads", subtitle: "Techniques éprouvées", category: "SALES", duration: "1h 45min", icon: "🎯", points: ["Réseaux sociaux", "Bouche-à-oreille", "Événements", "Partenariats"], courseNumber: 6 }},
  { id: "course-07", props: { title: "L'art du closing immobilier", subtitle: "Techniques de closing", category: "SALES", duration: "2h 15min", icon: "🤝", points: ["Création d'urgence", "Gestion émotionnelle", "Argumentaire de valeur", "Accompagnement"], courseNumber: 7 }},
  { id: "course-08", props: { title: "Gestion des objections clients", subtitle: "Les 20 objections clés", category: "SALES", duration: "1h 30min", icon: "💬", points: ["Prix & timing", "Sécurité juridique", "Rendement", "Concurrence"], courseNumber: 8 }},
  { id: "course-09", props: { title: "Négociation avancée", subtitle: "Stratégies de haut niveau", category: "SALES", duration: "2h 00min", icon: "♟️", points: ["Lecture du client", "Ancrage psychologique", "Concessions", "Persuasion"], courseNumber: 9 }},
  { id: "course-10", props: { title: "Frais DLD & Service Charges", subtitle: "Décryptage complet", category: "DUBAI", duration: "0h 45min", icon: "💰", points: ["DLD 4%", "Frais d'agence", "Oqood", "Service charges"], courseNumber: 10 }},
  { id: "course-11", props: { title: "Plans de paiement & Financement", subtitle: "Guide pratique", category: "DUBAI", duration: "1h 15min", icon: "🏦", points: ["Plans promoteurs", "Financement bancaire", "Non-résidents", "Optimisation"], courseNumber: 11 }},
  { id: "course-12", props: { title: "KYC & AML", subtitle: "Conformité essentielle", category: "COMPLIANCE", duration: "1h 30min", icon: "🛡️", points: ["Procédures KYC", "Réglementation AML", "Documents requis", "Signaux d'alerte"], courseNumber: 12 }},
  { id: "course-13", props: { title: "Golden Visa & Résidence", subtitle: "Investissement UAE", category: "DUBAI", duration: "1h 00min", icon: "🪪", points: ["Conditions d'éligibilité", "Processus de demande", "Avantages clients", "Argument de vente"], courseNumber: 13 }},
  { id: "course-14", props: { title: "Fiscalité immobilière UAE", subtitle: "Avantages fiscaux", category: "COMPLIANCE", duration: "1h 15min", icon: "📊", points: ["0% impôt sur le revenu", "TVA 5%", "Comparaison internationale", "Double imposition"], courseNumber: 14 }},
  { id: "course-15", props: { title: "Communication & Personal Branding", subtitle: "Construisez votre marque", category: "SALES", duration: "1h 30min", icon: "📱", points: ["Storytelling immobilier", "Réseaux sociaux", "Création de contenu", "Networking"], courseNumber: 15 }},
  { id: "course-16", props: { title: "Rendement locatif & ROI", subtitle: "Analyse financière", category: "DUBAI", duration: "1h 45min", icon: "📈", points: ["Calcul du rendement", "ROI par quartier", "Gestion locative", "Stratégies rentabilité"], courseNumber: 16 }},
];

export const RemotionRoot = () => (
  <>
    {courses.map((c) => (
      <Composition
        key={c.id}
        id={c.id}
        component={CourseVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={c.props}
      />
    ))}
  </>
);
