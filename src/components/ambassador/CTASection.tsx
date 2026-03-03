import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast({ title: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Candidature envoyée !", description: "Nous reviendrons vers vous sous 48h." });
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Prêt à faire partie de{" "}
            <span className="text-gradient-gold">l'élite</span> ?
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Les places sont limitées. Postulez maintenant et recevez une réponse sous 48h.
          </p>

          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 space-y-4"
            >
              <Input
                placeholder="Votre nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-base"
              />
              <Input
                type="email"
                placeholder="Votre email professionnel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-xl bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 text-base"
              />
              <Button variant="hero" size="lg" className="w-full text-base py-6 rounded-xl">
                Soumettre ma candidature
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <p className="text-xs text-muted-foreground">
                En soumettant ce formulaire, vous acceptez nos conditions générales.
              </p>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2 text-foreground">
                Candidature reçue !
              </h3>
              <p className="text-muted-foreground">
                Nous reviendrons vers vous dans les 48 prochaines heures.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
