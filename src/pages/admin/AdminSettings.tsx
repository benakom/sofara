import { Crown, ExternalLink } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Paramètres</h1>
        <p className="text-sm text-[hsl(228,10%,50%)] mt-1">Configuration de votre plateforme Sofara</p>
      </div>

      <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--primary)/.1)]">
            <Crown className="w-5 h-5 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Sofara Business</h2>
            <p className="text-[11px] text-[hsl(228,10%,45%)]">Plan actif : Sofara Lite</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <InfoRow label="Domaine email" value="notify.sofara.io" />
          <InfoRow label="Plateforme" value="sofara.lovable.app" />
          <InfoRow label="Rôle" value="Super Admin (Owner)" />
          <InfoRow label="Version" value="Sofara Lite v1.0" />
        </div>
      </div>

      <div className="bg-[hsl(228,20%,11%)] border border-[hsl(228,18%,16%)] rounded-xl p-6">
        <h2 className="text-sm font-bold text-white mb-3">Fonctionnalités actives</h2>
        <div className="space-y-2">
          {[
            "Inscription & vérification email ambassadeurs",
            "Pipeline de leads avec suivi des stages",
            "Gestion des commissions (estimées → confirmées → payées)",
            "Système de paiements avec validation",
            "Profils ambassadeurs avec code de parrainage",
            "Dashboard KPI en temps réel",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[hsl(228,10%,60%)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-medium text-[hsl(228,10%,40%)] uppercase tracking-wider">{label}</span>
    <span className="text-sm text-white font-medium">{value}</span>
  </div>
);

export default AdminSettings;
