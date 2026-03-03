import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Postulez",
    description: "Remplissez le formulaire de candidature en 2 minutes. Nous examinons chaque profil avec soin.",
  },
  {
    number: "02",
    title: "Onboarding",
    description: "Recevez votre kit ambassadeur : formation, outils et accès à votre dashboard personnalisé.",
  },
  {
    number: "03",
    title: "Partagez",
    description: "Créez du contenu, partagez votre lien et recommandez la plateforme à votre réseau.",
  },
  {
    number: "04",
    title: "Récoltez",
    description: "Suivez vos conversions en temps réel et recevez vos commissions chaque mois.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-gold-soft opacity-30" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Comment ça marche
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            4 étapes vers le{" "}
            <span className="text-gradient-gold">succès</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <span className="font-display text-6xl font-bold text-primary/15 block mb-4">
                  {step.number}
                </span>
                <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
