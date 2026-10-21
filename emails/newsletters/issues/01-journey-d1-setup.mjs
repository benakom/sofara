import { closing, ctaDashboard, TIP } from "../common.mjs";

export default {
  id: "01-journey-d1-setup",
  sequence: "onboarding",
  day: 1,
  subject: {
    en: "{{first_name}}, your 10-minute setup",
    fr: "{{first_name}}, votre installation en 10 minutes",
    es: "{{first_name}}, tu puesta en marcha en 10 minutos",
    ru: "{{first_name}}, настройка за 10 минут",
    ar: "{{first_name}}، انطلاقتك في 10 دقائق",
  },
  preview: {
    en: "Three things to do once, so that everything after is easy.",
    fr: "Trois choses à faire une fois pour toutes, pour que tout le reste soit simple.",
    es: "Tres cosas que haces una sola vez para que todo lo demás sea fácil.",
    ru: "Три вещи, которые делаются один раз, чтобы дальше всё было просто.",
    ar: "ثلاثة أمور تقوم بها مرة واحدة ليصبح كل ما بعدها سهلاً.",
  },
  blocks: {
    en: [
      ["h1", "Ten minutes today, and you are ready."],
      ["p", "Hello {{first_name}}, yesterday you joined Sofara. Today, let us make sure everything is in place. Three things, done once:"],
      ["ol", [
        "**Save your link where you can find it in one tap**: {{referral_link}}. A note on your phone, a pinned WhatsApp message to yourself, your favourites.",
        "**Look around your dashboard for two minutes**: Lead tracking (where you add a contact), Commissions (where you follow your earnings), Referrals (your link and your recruits).",
        "**Write your list of ten names** if it is not done yet. Next to each name, one word: investor, family, expat, entrepreneur, agent.",
      ]],
      ctaDashboard.en,
      ["tip", { label: TIP.en, text: "Add your link to your WhatsApp \"About\" and your Instagram or LinkedIn bio, with one simple line: \"Dubai real estate? I can connect you with a licensed team.\" People will ask you on their own." }],
      ["p", "That is all for today. Tomorrow you will know exactly what to write to the people on your list."],
      ...closing("en"),
    ],
    fr: [
      ["h1", "Dix minutes aujourd'hui, et vous êtes prêt."],
      ["p", "Bonjour {{first_name}}, hier vous avez rejoint Sofara. Aujourd'hui, on s'assure que tout est en place. Trois choses, à faire une seule fois :"],
      ["ol", [
        "**Rangez votre lien là où vous le trouvez en un geste** : {{referral_link}}. Une note sur votre téléphone, un message WhatsApp épinglé à vous-même, vos favoris.",
        "**Faites le tour de votre tableau de bord en deux minutes** : Suivi des leads (pour ajouter un contact), Commissions (pour suivre vos gains), Parrainage (votre lien et vos recrues).",
        "**Écrivez votre liste de dix noms** si ce n'est pas encore fait. À côté de chaque nom, un mot : investisseur, famille, expatrié, entrepreneur, agent.",
      ]],
      ctaDashboard.fr,
      ["tip", { label: TIP.fr, text: "Ajoutez votre lien dans votre « À propos » WhatsApp et votre bio Instagram ou LinkedIn, avec une phrase simple : « Immobilier à Dubaï ? Je peux vous mettre en relation avec une équipe licenciée. » Les gens viendront vous demander d'eux-mêmes." }],
      ["p", "C'est tout pour aujourd'hui. Demain, vous saurez exactement quoi écrire aux personnes de votre liste."],
      ...closing("fr"),
    ],
    es: [
      ["h1", "Diez minutos hoy y estás listo."],
      ["p", "Hola {{first_name}}, ayer te uniste a Sofara. Hoy nos aseguramos de que todo esté en su sitio. Tres cosas que haces una sola vez:"],
      ["ol", [
        "**Guarda tu enlace donde lo encuentres en un toque**: {{referral_link}}. Una nota en el móvil, un mensaje de WhatsApp fijado a ti mismo, tus favoritos.",
        "**Recorre tu panel durante dos minutos**: Seguimiento de contactos (donde añades a alguien), Comisiones (donde sigues tus ganancias), Referidos (tu enlace y tus reclutas).",
        "**Escribe tu lista de diez nombres** si aún no lo has hecho. Junto a cada nombre, una palabra: inversor, familia, expatriado, emprendedor, agente.",
      ]],
      ctaDashboard.es,
      ["tip", { label: TIP.es, text: "Añade tu enlace en el \"Info\" de WhatsApp y en tu bio de Instagram o LinkedIn, con una frase sencilla: \"¿Inmobiliario en Dubái? Te pongo en contacto con un equipo con licencia.\" La gente te preguntará por su cuenta." }],
      ["p", "Eso es todo por hoy. Mañana sabrás exactamente qué escribir a las personas de tu lista."],
      ...closing("es"),
    ],
    ru: [
      ["h1", "Десять минут сегодня — и вы готовы."],
      ["p", "Здравствуйте, {{first_name}}! Вчера вы присоединились к Sofara. Сегодня убедимся, что всё на месте. Три вещи, которые делаются один раз:"],
      ["ol", [
        "**Сохраните ссылку так, чтобы найти её в одно касание**: {{referral_link}}. Заметка в телефоне, закреплённое сообщение самому себе в WhatsApp, закладки.",
        "**Две минуты осмотритесь в личном кабинете**: Клиенты (здесь вы добавляете контакт), Комиссии (здесь видны ваши доходы), Рефералы (ваша ссылка и приглашённые амбассадоры).",
        "**Составьте список из десяти имён**, если ещё не сделали. Рядом с каждым одно слово: инвестор, семья, экспат, предприниматель, агент.",
      ]],
      ctaDashboard.ru,
      ["tip", { label: TIP.ru, text: "Добавьте ссылку в раздел «Сведения» в WhatsApp и в био Instagram или LinkedIn с простой фразой: «Недвижимость в Дубае? Познакомлю с лицензированной командой». Люди начнут спрашивать сами." }],
      ["p", "На сегодня всё. Завтра вы будете точно знать, что написать людям из списка."],
      ...closing("ru"),
    ],
    ar: [
      ["h1", "عشر دقائق اليوم وتكون جاهزاً."],
      ["p", "مرحباً {{first_name}}، انضممت أمس إلى سوفارا. اليوم نتأكد أن كل شيء في مكانه. ثلاثة أمور تقوم بها مرة واحدة:"],
      ["ol", [
        "**احفظ رابطك في مكان تصل إليه بلمسة واحدة**: {{referral_link}}. ملاحظة في هاتفك، أو رسالة واتساب مثبّتة لنفسك، أو المفضلة.",
        "**تجوّل في لوحة التحكم لدقيقتين**: متابعة العملاء (لإضافة جهة اتصال)، والعمولات (لمتابعة أرباحك)، والإحالات (رابطك والسفراء الذين دعوتهم).",
        "**اكتب قائمة الأسماء العشرة** إن لم تفعل بعد. بجانب كل اسم كلمة واحدة: مستثمر، عائلة، مغترب، رائد أعمال، وسيط.",
      ]],
      ctaDashboard.ar,
      ["tip", { label: TIP.ar, text: "أضف رابطك في خانة «الأخبار» في واتساب وفي سيرتك على إنستغرام أو لينكدإن، مع جملة بسيطة: «عقارات في دبي؟ أستطيع أن أعرّفك على فريق مرخّص». سيأتي الناس ليسألوك من تلقاء أنفسهم." }],
      ["p", "هذا كل شيء لليوم. غداً ستعرف بالضبط ماذا تكتب للأشخاص في قائمتك."],
      ...closing("ar"),
    ],
  },
};
