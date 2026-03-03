import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Building2, Globe, Banknote, Sun } from "lucide-react";
import dubaiLifestyle from "@/assets/dubai-lifestyle.jpg";

const advantages = [
  { icon: Banknote, title: "0% d'impôt", desc: "Aucun impôt sur le revenu, les plus-values ou les revenus locatifs." },
  { icon: TrendingUp, title: "8-12% de rendement", desc: "Des rendements locatifs parmi les plus élevés au monde." },
  { icon: Building2, title: "Marché en croissance", desc: "+20% de hausse des prix en 2024, une demande qui ne faiblit pas." },
  { icon: Globe, title: "Hub international", desc: "Un carrefour entre l'Europe, l'Asie et l'Afrique. Accès mondial." },
  { icon: ShieldCheck, title: "Cadre sécurisé", desc: "Réglementation solide, visa investisseur, stabilité politique." },
  { icon: Sun, title: "Qualité de vie", desc: "365 jours de soleil, infrastructures de classe mondiale." },
];

const WhyDubaiSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-dark">
              <img
                src={dubaiLifestyle}
                alt="Dubai Marina lifestyle"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-display font-bold text-gradient-gold">+27%</div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Croissance 2024</div>
                      <div className="text-xs text-muted-foreground">Marché immobilier de Dubai</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
                Pourquoi Dubai
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground">
                Le marché immobilier le plus{" "}
                <span className="text-gradient-gold">attractif</span> au monde
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Dubai n'est pas juste une ville — c'est une opportunité. Avec une croissance de +27% 
                en 2024, 0% d'impôts et des rendements locatifs imbattables, c'est LE marché 
                où vos contacts veulent investir.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advantages.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <a.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{a.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{a.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDubaiSection;
