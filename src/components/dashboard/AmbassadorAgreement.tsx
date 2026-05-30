import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, FileText, ArrowDown } from "lucide-react";

interface Clause {
  num: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string[];
  bodyAr: string[];
}

const CLAUSES: Clause[] = [
  {
    num: "1",
    titleEn: "The Parties",
    titleAr: "الأطراف",
    bodyEn: [
      'This Agreement is entered into on the date of acceptance (the "Effective Date") between:',
      '(a) Cevitas Real Estate LLC, a limited liability company licensed in the Emirate of Dubai, United Arab Emirates, operating the Sofara Ambassador Program (the "Company"); and',
      '(b) the individual whose details are recorded in the Sofara onboarding form (the "Ambassador").',
      'The Company and the Ambassador are hereinafter referred to individually as a "Party" and collectively as the "Parties".',
    ],
    bodyAr: [
      'تم إبرام هذه الاتفاقية بتاريخ القبول ("تاريخ السريان") بين:',
      '(أ) شركة سيفيتاس العقارية ذ.م.م، شركة ذات مسؤولية محدودة مرخصة في إمارة دبي، الإمارات العربية المتحدة، والمشغّلة لبرنامج سفراء سوفارا ("الشركة")؛',
      '(ب) الشخص الذي تم تسجيل بياناته في نموذج تسجيل سوفارا ("السفير").',
      'يُشار إلى الشركة والسفير فيما يلي بـ "الطرف" منفردين و"الطرفين" مجتمعَين.',
    ],
  },
  {
    num: "2",
    titleEn: "Purpose and Scope",
    titleAr: "الغرض والنطاق",
    bodyEn: [
      '2.1 The Ambassador shall refer to the Company potential clients interested in purchasing Dubai real estate (primarily off-plan units) (the "Referred Clients").',
      '2.2 The Ambassador is engaged as an independent contractor. Nothing in this Agreement creates an employment, agency, partnership, or joint venture relationship between the Parties.',
      '2.3 The Ambassador shall not negotiate, sign, or close any property transaction on behalf of the Company. All sales activities remain the exclusive responsibility of the Company and its RERA-licensed agents.',
    ],
    bodyAr: [
      '2.1 يقوم السفير بإحالة عملاء محتملين إلى الشركة، يكونون مهتمين بشراء عقارات في دبي (بشكل رئيسي الوحدات على الخارطة) ("العملاء المُحالون").',
      '2.2 يعمل السفير بصفته متعاقدًا مستقلاً. لا تُنشئ هذه الاتفاقية أي علاقة عمل أو وكالة أو شراكة أو مشروع مشترك بين الطرفين.',
      '2.3 لا يحق للسفير التفاوض أو التوقيع أو إتمام أي صفقة عقارية نيابةً عن الشركة. تبقى جميع الأنشطة البيعية حصرية للشركة ووكلائها المرخصين من قبل مؤسسة التنظيم العقاري (ريرا).',
    ],
  },
  {
    num: "3",
    titleEn: "Obligations of the Ambassador",
    titleAr: "التزامات السفير",
    bodyEn: [
      "3.1 Act professionally and ethically when representing the Sofara brand.",
      "3.2 Provide accurate information about the Company's services; never make guarantees on returns, prices, or handover dates not formally confirmed by the Company in writing.",
      "3.3 Comply with all applicable laws and regulations, including UAE RERA rules and the Ambassador's local laws.",
      "3.4 Use only marketing materials approved by the Company. Any custom content must be pre-approved in writing.",
      "3.5 Promptly transfer every Referred Client lead through the channel designated by the Company (CRM link, ambassador portal, or WhatsApp).",
    ],
    bodyAr: [
      "3.1 التصرف باحتراف ونزاهة عند تمثيل علامة سوفارا.",
      "3.2 تقديم معلومات دقيقة عن خدمات الشركة، وعدم تقديم أي ضمانات بشأن العوائد أو الأسعار أو مواعيد التسليم ما لم تُؤكّدها الشركة كتابيًا.",
      "3.3 الالتزام بجميع القوانين والأنظمة المعمول بها، بما في ذلك أنظمة ريرا في الإمارات والقوانين المحلية للسفير.",
      "3.4 استخدام المواد التسويقية المعتمدة من الشركة فقط. يجب الحصول على موافقة كتابية مسبقة على أي محتوى مخصّص.",
      "3.5 تحويل كل عميل مُحال فورًا عبر القناة التي تحددها الشركة (رابط نظام إدارة العملاء، بوابة السفير، أو واتساب).",
    ],
  },
  {
    num: "4",
    titleEn: "Obligations of the Company",
    titleAr: "التزامات الشركة",
    bodyEn: [
      "4.1 Provide the Ambassador with up-to-date marketing materials, project information, and pricing.",
      "4.2 Track every Referred Client in the Company's CRM and grant the Ambassador transparent visibility on the status of his/her leads.",
      "4.3 Manage the sales process with RERA-licensed agents and close transactions in compliance with UAE law.",
      "4.4 Pay the Ambassador the agreed commission in accordance with Clause 5.",
    ],
    bodyAr: [
      "4.1 تزويد السفير بالمواد التسويقية المحدّثة ومعلومات المشاريع والأسعار.",
      "4.2 تتبّع كل عميل مُحال في نظام إدارة علاقات العملاء الخاص بالشركة ومنح السفير رؤية شفافة حول حالة العملاء.",
      "4.3 إدارة عملية البيع عبر وكلاء مرخصين من ريرا وإتمام الصفقات وفقًا للقانون الإماراتي.",
      "4.4 دفع العمولة المتفق عليها للسفير وفقًا للبند 5.",
    ],
  },
  {
    num: "5",
    titleEn: "Commission",
    titleAr: "العمولة",
    bodyEn: [
      "5.1 The Ambassador shall be entitled to a commission, expressed as a percentage of the net commission actually collected by the Company from the developer in relation to each successfully closed transaction generated by a Referred Client. The applicable rate is specified in the Ambassador's portal.",
      '5.2 "Net commission" means the gross commission received by the Company from the developer, less any VAT, marketing fees, kickbacks, or external referral fees paid by the Company to third parties.',
      "5.3 Commission is payable only after the Company has actually received the corresponding funds from the developer, and after any cooling-off or cancellation period has expired.",
      "5.4 All payments are made exclusively in AED, by bank transfer, against a valid invoice issued by the Ambassador.",
    ],
    bodyAr: [
      "5.1 يحق للسفير الحصول على عمولة، يُعبَّر عنها كنسبة مئوية من صافي العمولة التي تحصّلها الشركة فعليًا من المطور لكل صفقة مُتممة بنجاح من عميل مُحال. تُحدَّد النسبة المطبَّقة في بوابة السفير.",
      '5.2 يُقصد بـ "صافي العمولة" إجمالي العمولة التي تتلقاها الشركة من المطور، مخصومًا منها ضريبة القيمة المضافة ورسوم التسويق وأي عمولات إحالة تدفعها الشركة لأطراف ثالثة.',
      "5.3 تُستحَق العمولة فقط بعد استلام الشركة فعليًا للأموال المقابلة من المطور، وبعد انقضاء أي فترة إلغاء أو تراجع.",
      "5.4 تُصرف جميع الدفعات حصريًا بالدرهم الإماراتي عبر تحويل بنكي مقابل فاتورة سارية صادرة عن السفير.",
    ],
  },
  {
    num: "6",
    titleEn: "Lead Attribution",
    titleAr: "نسب العميل",
    bodyEn: [
      "6.1 A Referred Client is attributed to the Ambassador only if the lead is registered in the Company's CRM via the Ambassador's unique link, code, or formal written referral before any other contact between the client and the Company.",
      "6.2 In case of conflict of attribution, the CRM timestamp prevails.",
      "6.3 Attribution remains valid for a period of twelve (12) months from the date of first registration, after which the lead is considered no longer attributed.",
    ],
    bodyAr: [
      "6.1 يُنسب العميل المُحال إلى السفير فقط إذا تم تسجيله في نظام إدارة العملاء عبر الرابط أو الرمز الفريد للسفير أو إحالة كتابية رسمية قبل أي اتصال آخر بين العميل والشركة.",
      "6.2 في حال تعارض النسب، تكون العبرة بتاريخ ووقت التسجيل في نظام إدارة العملاء.",
      "6.3 يظل النسب ساريًا لمدة اثني عشر (12) شهرًا من تاريخ التسجيل الأول، وبعدها يُعتبر العميل غير منسوب.",
    ],
  },
  {
    num: "7",
    titleEn: "Confidentiality",
    titleAr: "السرية",
    bodyEn: [
      "7.1 The Ambassador shall keep strictly confidential all non-public information received from the Company, including pricing, commercial terms, client data, marketing strategies, and internal processes.",
      "7.2 This confidentiality obligation remains in force for two (2) years after the termination of this Agreement.",
    ],
    bodyAr: [
      "7.1 يلتزم السفير بسرية تامة تجاه جميع المعلومات غير العلنية التي يتلقاها من الشركة، بما في ذلك الأسعار، والشروط التجارية، وبيانات العملاء، واستراتيجيات التسويق، والعمليات الداخلية.",
      "7.2 يبقى هذا الالتزام بالسرية ساريًا لمدة سنتين (2) بعد إنهاء هذه الاتفاقية.",
    ],
  },
  {
    num: "8",
    titleEn: "Intellectual Property and Brand",
    titleAr: "الملكية الفكرية والعلامة التجارية",
    bodyEn: [
      "8.1 All rights related to the Sofara and Cevitas brands, logos, content, and marketing materials remain the exclusive property of the Company.",
      "8.2 The Ambassador is granted a limited, non-exclusive, revocable license to use these elements solely for the purposes of this Agreement and only on platforms approved by the Company.",
    ],
    bodyAr: [
      "8.1 تبقى جميع الحقوق المتعلقة بعلامتي سوفارا وسيفيتاس وشعاراتهما ومحتواهما والمواد التسويقية ملكية حصرية للشركة.",
      "8.2 يُمنح السفير ترخيصًا محدودًا غير حصري وقابلًا للإلغاء لاستخدام هذه العناصر حصرًا لأغراض هذه الاتفاقية وعلى المنصات المعتمدة من الشركة فقط.",
    ],
  },
  {
    num: "9",
    titleEn: "Term and Renewal",
    titleAr: "المدة والتجديد",
    bodyEn: [
      "9.1 This Agreement enters into force on the Effective Date and remains valid for a period of twelve (12) months.",
      "9.2 It shall automatically renew for successive twelve (12) month periods unless either Party notifies the other in writing of its intent not to renew at least thirty (30) days before the end of the current term.",
      "9.3 This Agreement is non-exclusive. The Ambassador may engage in any other professional activity that does not directly conflict with his/her obligations under this Agreement.",
    ],
    bodyAr: [
      "9.1 تدخل هذه الاتفاقية حيز التنفيذ بتاريخ السريان وتظل سارية لمدة اثني عشر (12) شهرًا.",
      "9.2 تُجدَّد تلقائيًا لفترات متعاقبة مدتها اثنا عشر (12) شهرًا ما لم يُخطر أي من الطرفين الآخر كتابيًا بنيته عدم التجديد قبل ثلاثين (30) يومًا على الأقل من نهاية المدة الحالية.",
      "9.3 هذه الاتفاقية غير حصرية. يجوز للسفير ممارسة أي نشاط مهني آخر لا يتعارض مباشرة مع التزاماته بموجبها.",
    ],
  },
  {
    num: "10",
    titleEn: "Termination",
    titleAr: "الإنهاء",
    bodyEn: [
      "10.1 Either Party may terminate this Agreement at any time, without cause, by giving thirty (30) days' written notice to the other Party.",
      "10.2 The Company may terminate this Agreement with immediate effect in the event of (i) breach of confidentiality, (ii) damage to the Company's reputation, (iii) breach of UAE law, or (iv) any other serious breach of this Agreement.",
      "10.3 Upon termination, the Ambassador remains entitled to commissions on transactions already closed in accordance with Clause 5, but loses any right to commission on leads not yet converted.",
    ],
    bodyAr: [
      "10.1 يجوز لأي من الطرفين إنهاء هذه الاتفاقية في أي وقت ودون إبداء سبب، بإشعار كتابي مدته ثلاثون (30) يومًا للطرف الآخر.",
      "10.2 يجوز للشركة إنهاء هذه الاتفاقية بأثر فوري في حال: (1) الإخلال بالسرية، أو (2) الإضرار بسمعة الشركة، أو (3) مخالفة القانون الإماراتي، أو (4) أي إخلال جسيم آخر بهذه الاتفاقية.",
      "10.3 عند الإنهاء، يبقى للسفير الحق في العمولات عن الصفقات المُتممة وفقًا للبند 5، ويفقد أي حق في العمولة عن العملاء الذين لم تتحول إحالتهم إلى صفقات.",
    ],
  },
  {
    num: "11",
    titleEn: "Liability",
    titleAr: "المسؤولية",
    bodyEn: [
      "11.1 The Ambassador shall be solely liable for any false, misleading, or unauthorised statement made to a Referred Client or third party.",
      "11.2 The Company's total liability under this Agreement is strictly limited to the commissions actually due to the Ambassador at the time the dispute arises.",
    ],
    bodyAr: [
      "11.1 يتحمّل السفير وحده المسؤولية عن أي تصريح كاذب أو مضلِّل أو غير مرخّص يُدلي به إلى عميل مُحال أو طرف ثالث.",
      "11.2 تقتصر المسؤولية الإجمالية للشركة بموجب هذه الاتفاقية حصرًا على العمولات المستحقة فعليًا للسفير وقت نشوء النزاع.",
    ],
  },
  {
    num: "12",
    titleEn: "General Provisions",
    titleAr: "أحكام عامة",
    bodyEn: [
      "12.1 This Agreement constitutes the entire agreement between the Parties and supersedes any prior agreement, written or oral.",
      "12.2 Any amendment must be made in writing and signed by both Parties.",
      "12.3 This Agreement is executed in English and Arabic. In case of discrepancy, the Arabic version shall prevail.",
      "12.4 This Agreement is governed by the laws of the United Arab Emirates and the Emirate of Dubai. Any dispute shall be submitted to the competent courts of Dubai.",
    ],
    bodyAr: [
      "12.1 تمثّل هذه الاتفاقية كامل الاتفاق بين الطرفين، وتلغي أي اتفاق سابق، كتابيًا كان أو شفهيًا.",
      "12.2 يجب أن يكون أي تعديل كتابيًا وموقّعًا من كلا الطرفين.",
      "12.3 حُرّرت هذه الاتفاقية باللغتين الإنجليزية والعربية. في حال وجود تعارض، تكون النسخة العربية هي المعتمدة.",
      "12.4 تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة وإمارة دبي. تختص محاكم دبي بأي نزاع.",
    ],
  },
];

interface AmbassadorAgreementProps {
  lang: string;
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
}

const AmbassadorAgreement = ({ lang, accepted, onAcceptedChange }: AmbassadorAgreementProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handle = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        setReachedBottom(true);
      }
    };
    handle();
    el.addEventListener("scroll", handle);
    return () => el.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="dash-card rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[hsl(var(--primary)/.12)] flex items-center justify-center">
          <FileText className="w-4 h-4 text-[hsl(var(--primary))]" />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold dash-text">
            {lang === "ar" ? "اتفاقية السفير — Ambassador Agreement" : "Ambassador Agreement — اتفاقية السفير"}
          </h3>
          <p className="text-[11px] dash-muted-text">
            {lang === "ar"
              ? "اقرأ الاتفاقية بالكامل (EN + AR)، ثم مرّر إلى الأسفل وقبلها."
              : "Read the full agreement (EN + AR), then scroll to the bottom and accept."}
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="h-[360px] overflow-y-auto rounded-xl border border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-bg)/.5)] p-4 text-[12px] leading-relaxed dash-text scroll-smooth"
        >
          <div className="mb-4 pb-3 border-b border-[hsl(var(--dash-border))]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--primary))]">
                  Sofara Ambassador Program
                </p>
                <h4 className="text-sm font-bold dash-text mt-1">AMBASSADOR AGREEMENT</h4>
                <p className="text-[10px] dash-muted-text italic">Cevitas Real Estate LLC — Dubai, UAE</p>
              </div>
              <div className="text-right" dir="rtl">
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--primary))]">
                  برنامج سفراء سوفارا
                </p>
                <h4 className="text-sm font-bold dash-text mt-1">اتفاقية السفير</h4>
                <p className="text-[10px] dash-muted-text italic">شركة سيفيتاس العقارية ذ.م.م — دبي، الإمارات</p>
              </div>
            </div>
          </div>

          {CLAUSES.map((c) => (
            <div key={c.num} className="mb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* English */}
                <div>
                  <h5 className="text-[12px] font-bold dash-text mb-1.5">
                    {c.num}. {c.titleEn}
                  </h5>
                  {c.bodyEn.map((p, i) => (
                    <p key={i} className="mb-1.5 dash-muted-text">
                      {p}
                    </p>
                  ))}
                </div>
                {/* Arabic */}
                <div dir="rtl" className="text-right">
                  <h5 className="text-[12px] font-bold dash-text mb-1.5">
                    {c.num}. {c.titleAr}
                  </h5>
                  {c.bodyAr.map((p, i) => (
                    <p key={i} className="mb-1.5 dash-muted-text">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-[hsl(var(--dash-border))] grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] dash-muted-text">
            <p>
              By clicking "I accept", you electronically sign this Agreement as the Ambassador, and confirm
              you have read and understood both the English and Arabic versions.
            </p>
            <p dir="rtl" className="text-right">
              بالضغط على "أوافق"، فإنك توقّع إلكترونيًا على هذه الاتفاقية بصفتك السفير، وتؤكد أنك قرأت وفهمت
              النسختين الإنجليزية والعربية.
            </p>
          </div>
        </div>

        {!reachedBottom && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-[10px] font-semibold shadow-lg animate-bounce">
            <ArrowDown className="w-3 h-3" />
            {lang === "ar" ? "مرّر إلى الأسفل" : "Scroll to the end"}
          </div>
        )}
      </div>

      <div
        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
          reachedBottom
            ? "border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.05)]"
            : "border-[hsl(var(--dash-border))] bg-[hsl(var(--dash-muted)/.3)] opacity-60"
        }`}
      >
        <Checkbox
          id="agreement-accept"
          checked={accepted}
          onCheckedChange={(v) => onAcceptedChange(!!v)}
          disabled={!reachedBottom}
          className="mt-0.5"
        />
        <label
          htmlFor="agreement-accept"
          className={`text-[12px] dash-text leading-relaxed ${reachedBottom ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <span className="block">
            I have read and accept the Sofara Ambassador Agreement in full (English and Arabic).
          </span>
          <span dir="rtl" className="block mt-1 text-right">
            لقد قرأت وأوافق على اتفاقية سفير سوفارا بالكامل (بالإنجليزية والعربية).
          </span>
        </label>
        {accepted && reachedBottom && (
          <CheckCircle2 className="w-4 h-4 text-[hsl(var(--primary))] shrink-0 mt-1" />
        )}
      </div>
    </div>
  );
};

export default AmbassadorAgreement;
