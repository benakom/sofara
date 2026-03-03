import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Karim B.",
    role: "Ambassadeur depuis 6 mois",
    text: "En 6 mois, j'ai recommandé Sofara à 12 contacts. 4 ont investi. Résultat : plus de €18,000 de commissions. Le programme est transparent et l'équipe est incroyable.",
    avatar: "K",
  },
  {
    name: "Sarah M.",
    role: "Influenceuse immobilier",
    text: "Sofara m'a permis de monétiser mon audience de manière authentique. Mes abonnés me remercient car ils ont trouvé le bien idéal à Dubai grâce à la plateforme.",
    avatar: "S",
  },
  {
    name: "Jean-Pierre D.",
    role: "Entrepreneur, Paris",
    text: "Je cherchais un side income passif. Avec mon réseau d'entrepreneurs, les commissions sont tombées naturellement. Sofara gère tout, je recommande juste.",
    avatar: "J",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Témoignages
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Ils ont rejoint{" "}
            <span className="text-gradient-gold">Sofara</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card rounded-2xl p-8 hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center font-display font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
