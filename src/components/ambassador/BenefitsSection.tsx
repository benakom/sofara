import { motion } from "framer-motion";
import { DollarSign, Users, Zap, Trophy, Gift, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Commissions généreuses",
    description: "Jusqu'à 30% de commission récurrente sur chaque client que vous apportez.",
  },
  {
    icon: Users,
    title: "Communauté exclusive",
    description: "Accès à un réseau privé de leaders d'opinion et d'entrepreneurs visionnaires.",
  },
  {
    icon: Zap,
    title: "Outils marketing",
    description: "Kit complet avec contenus, liens trackés et dashboard analytics en temps réel.",
  },
  {
    icon: Trophy,
    title: "Reconnaissance",
    description: "Badges, classements et mise en avant sur nos canaux officiels.",
  },
  {
    icon: Gift,
    title: "Avantages exclusifs",
    description: "Accès anticipé aux nouvelles fonctionnalités et invitations VIP aux événements.",
  },
  {
    icon: TrendingUp,
    title: "Croissance personnelle",
    description: "Formations dédiées en marketing, personal branding et stratégie digitale.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const BenefitsSection = () => {
  return (
    <section className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Avantages
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Pourquoi nous{" "}
            <span className="text-gradient-gold">rejoindre</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un programme pensé pour récompenser votre engagement et accélérer votre succès.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={item}
              className="group glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-gold/10 hover:shadow-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
