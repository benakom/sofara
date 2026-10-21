import { signature, helpLine } from "../newsletters/common.mjs";

// Sent once the ambassador has verified their email. Account is pending validation.
export default {
  id: "under-review",
  subject: {
    en: "Your Sofara application is being reviewed",
    fr: "Votre candidature Sofara est en cours de validation",
    es: "Estamos revisando tu solicitud en Sofara",
    ru: "Ваша заявка в Sofara на рассмотрении",
    ar: "طلبك في سوفارا قيد المراجعة",
  },
  preview: {
    en: "Email verified. Our team reviews every application personally, usually within 48 hours.",
    fr: "Email vérifié. Notre équipe examine chaque candidature personnellement, généralement sous 48 heures.",
    es: "Email verificado. Nuestro equipo revisa cada solicitud personalmente, normalmente en 48 horas.",
    ru: "Email подтверждён. Мы лично рассматриваем каждую заявку, обычно в течение 48 часов.",
    ar: "تم تأكيد بريدك. يراجع فريقنا كل طلب شخصياً، عادةً خلال 48 ساعة.",
  },
  blocks: {
    en: [
      ["h1", "Thank you, {{first_name}}. Your application is under review."],
      ["p", "Your email is confirmed and your application to join the Sofara ambassador network has reached our team."],
      ["p", "We read every profile personally before opening access. This usually takes **24 to 48 hours** on business days. You will receive an email the moment your account is validated."],
      ["callout", "**While you wait, one small thing.** Think of three people around you who have talked about Dubai, investing abroad or relocating. Just the names. That list will be your first step."],
      helpLine.en,
      signature.en,
    ],
    fr: [
      ["h1", "Merci, {{first_name}}. Votre candidature est en cours de validation."],
      ["p", "Votre email est confirmé et votre candidature pour rejoindre le réseau d'ambassadeurs Sofara est bien arrivée à notre équipe."],
      ["p", "Nous lisons chaque profil personnellement avant d'ouvrir l'accès. Cela prend généralement **24 à 48 heures** ouvrées. Vous recevrez un email dès que votre compte sera validé."],
      ["callout", "**En attendant, une petite chose.** Pensez à trois personnes autour de vous qui ont parlé de Dubaï, d'investir à l'étranger ou de s'expatrier. Juste les noms. Cette liste sera votre première étape."],
      helpLine.fr,
      signature.fr,
    ],
    es: [
      ["h1", "Gracias, {{first_name}}. Estamos revisando tu solicitud."],
      ["p", "Tu email está confirmado y tu solicitud para unirte a la red de embajadores de Sofara ya ha llegado a nuestro equipo."],
      ["p", "Leemos cada perfil personalmente antes de dar acceso. Suele tardar **entre 24 y 48 horas** laborables. Recibirás un email en cuanto tu cuenta esté validada."],
      ["callout", "**Mientras esperas, una cosa pequeña.** Piensa en tres personas de tu entorno que hayan hablado de Dubái, de invertir en el extranjero o de mudarse. Solo los nombres. Esa lista será tu primer paso."],
      helpLine.es,
      signature.es,
    ],
    ru: [
      ["h1", "Спасибо, {{first_name}}. Ваша заявка на рассмотрении."],
      ["p", "Ваш email подтверждён, и заявка на вступление в сеть амбассадоров Sofara уже у нашей команды."],
      ["p", "Мы лично читаем каждый профиль, прежде чем открыть доступ. Обычно это занимает **24–48 часов** в рабочие дни. Вы получите письмо, как только аккаунт будет подтверждён."],
      ["callout", "**Пока ждёте — одно небольшое дело.** Вспомните трёх знакомых, которые говорили о Дубае, инвестициях за рубежом или переезде. Только имена. Этот список станет вашим первым шагом."],
      helpLine.ru,
      signature.ru,
    ],
    ar: [
      ["h1", "شكراً يا {{first_name}}. طلبك قيد المراجعة."],
      ["p", "تم تأكيد بريدك الإلكتروني، ووصل طلب انضمامك إلى شبكة سفراء سوفارا إلى فريقنا."],
      ["p", "نقرأ كل ملف شخصياً قبل فتح الحساب. يستغرق ذلك عادةً **من 24 إلى 48 ساعة** في أيام العمل. ستصلك رسالة فور تفعيل حسابك."],
      ["callout", "**أثناء الانتظار، أمر صغير واحد.** فكّر في ثلاثة أشخاص من حولك تحدثوا عن دبي أو الاستثمار في الخارج أو الانتقال. الأسماء فقط. ستكون هذه القائمة خطوتك الأولى."],
      helpLine.ar,
      signature.ar,
    ],
  },
};
