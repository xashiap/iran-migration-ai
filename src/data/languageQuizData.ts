export type QuizLanguage = 'english' | 'german' | 'french' | 'italian';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface QuizQuestion {
  id: string;
  language: QuizLanguage;
  level: CEFRLevel;
  category: 'grammar' | 'vocabulary' | 'comprehension' | 'situational';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResultData {
  language: QuizLanguage;
  score: number;
  total: number;
  percentage: number;
  cefrLevel: CEFRLevel;
  levelLabelFa: string;
  examEquivalent: string;
  immigrationImpact: string;
  studyRecommendation: string;
  formFieldsToUpdate: {
    englishLevel?: 'basic' | 'intermediate' | 'advanced' | 'fluent';
    englishExam?: 'ielts' | 'toefl' | 'duolingo' | 'pte' | 'none';
    englishScore?: string;
    germanLevel?: 'none' | 'a1_a2' | 'b1' | 'b2' | 'c1_c2';
    frenchLevel?: 'none' | 'a1_a2' | 'b1' | 'b2' | 'c1_c2';
    italianLevel?: 'none' | 'a1_a2' | 'b1' | 'b2' | 'c1_c2';
  };
}

// -------------------------------------------------------------
// بانک جامع سوالات انگلیسی (English Question Bank)
// -------------------------------------------------------------
const ENGLISH_QUESTIONS: QuizQuestion[] = [
  // A1 / A2
  {
    id: 'en-1',
    language: 'english',
    level: 'A1',
    category: 'grammar',
    prompt: 'She ________ from Iran, but currently lives in Germany.',
    options: ['come', 'comes', 'is come', 'coming'],
    correctIndex: 1,
    explanation: 'برای فاعل سوم‌شخص مفرد (She) در زمان حال ساده فعل باید s- بگیرد (comes).',
  },
  {
    id: 'en-2',
    language: 'english',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'I need to renew my ________ before booking an international flight.',
    options: ['ticket', 'passport', 'receipt', 'contract'],
    correctIndex: 1,
    explanation: 'پاسپورت (Passport) مدرک هویتی برای پروازهای بین‌المللی است.',
  },
  {
    id: 'en-3',
    language: 'english',
    level: 'A2',
    category: 'grammar',
    prompt: 'Yesterday, while I was preparing my visa documents, the courier ________.',
    options: ['arrives', 'arrived', 'has arrived', 'was arriving'],
    correctIndex: 1,
    explanation: 'برای عملی که در گذشته حین استمرار عمل دیگری رخ می‌دهد، از گذشته ساده (arrived) استفاده می‌شود.',
  },
  {
    id: 'en-4',
    language: 'english',
    level: 'A2',
    category: 'situational',
    prompt: 'At the embassy counter: "Could you please tell me where the biometric room is?" - Which response is most natural?',
    options: ['Yes, I am.', 'Sure, it is down the hall to your right.', 'No, thank you.', 'I have two passports.'],
    correctIndex: 1,
    explanation: 'پاسخ استاندارد برای راهنمایی مسیر "Sure, it is down the hall to your right" است.',
  },
  // B1
  {
    id: 'en-5',
    language: 'english',
    level: 'B1',
    category: 'grammar',
    prompt: 'If I ________ my IELTS certificate by next month, I will submit my Express Entry profile immediately.',
    options: ['receive', 'received', 'will receive', 'had received'],
    correctIndex: 0,
    explanation: 'در جملات شرطی نوع اول (First Conditional)، بعد از if زمان حال ساده (receive) می‌آید.',
  },
  {
    id: 'en-6',
    language: 'english',
    level: 'B1',
    category: 'vocabulary',
    prompt: 'Applicants must show evidence of sufficient financial ________ to support their stay abroad.',
    options: ['liabilities', 'resources', 'debts', 'expenses'],
    correctIndex: 1,
    explanation: 'واژه financial resources به معنای منابع و تمکن مالی کافی است.',
  },
  {
    id: 'en-7',
    language: 'english',
    level: 'B1',
    category: 'grammar',
    prompt: 'The university representative told us that official transcripts ________ translated and notarized.',
    options: ['must to be', 'must be', 'has to', 'should being'],
    correctIndex: 1,
    explanation: 'ساختار مجهول بعد از افعال مدال (must) به صورت must + be + past participle است.',
  },
  {
    id: 'en-8',
    language: 'english',
    level: 'B1',
    category: 'situational',
    prompt: 'In a professional job interview: "How do you handle tight project deadlines?" - Best answer:',
    options: [
      'I ignore deadlines because quality takes time.',
      'I prioritize key milestones, communicate proactively with teammates, and organize my workflow.',
      'I ask my manager to do the difficult parts.',
      'I always work on weekends without telling anyone.',
    ],
    correctIndex: 1,
    explanation: 'گزینه دوم پاسخی حرفه‌ای و سنجیده در مصاحبه‌های کاری بین‌المللی است.',
  },
  // B2
  {
    id: 'en-9',
    language: 'english',
    level: 'B2',
    category: 'grammar',
    prompt: 'Had the immigration officer inspected the original employment contracts, he ________ that the experience was fully qualified.',
    options: ['would realize', 'would have realized', 'had realized', 'will realize'],
    correctIndex: 1,
    explanation: 'وارونگی شرطی نوع سوم (Inversion of 3rd conditional): Had + Subject + p.p. با would have + p.p. تکمیل می‌شود.',
  },
  {
    id: 'en-10',
    language: 'english',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'Her extensive background in backend engineering made her an ________ candidate for the skilled worker visa.',
    options: ['indifferent', 'exemplary', 'ambiguous', 'obsolete'],
    correctIndex: 1,
    explanation: 'واژه exemplary به معنای نمونه، شایسته و ممتاز است.',
  },
  {
    id: 'en-11',
    language: 'english',
    level: 'B2',
    category: 'comprehension',
    prompt: 'Choose the sentence that best paraphrases: "Notwithstanding the stringent criteria, thousands of tech professionals relocate abroad annually."',
    options: [
      'Because the criteria are so strict, tech professionals cannot relocate.',
      'Despite the tough requirements, many tech specialists migrate each year.',
      'Only professionals who ignore requirements can move abroad.',
      'Tech companies avoid hiring professionals who relocated recently.',
    ],
    correctIndex: 1,
    explanation: 'قید Notwithstanding مترادف Despite (علی‌رغم) است.',
  },
  {
    id: 'en-12',
    language: 'english',
    level: 'B2',
    category: 'grammar',
    prompt: 'The manager insisted that every applicant ________ their portfolio well before the panel interview.',
    options: ['submits', 'submit', 'submitted', 'would submit'],
    correctIndex: 1,
    explanation: 'حالت التزامی (Subjunctive mood) پس از insist that مستلزم فرم پایه فعل (submit) بدون s است.',
  },
  // C1
  {
    id: 'en-13',
    language: 'english',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'The new points-based immigration policy seeks to ________ bureaucratic bottlenecks and expedite skilled migration.',
    options: ['exacerbate', 'circumvent', 'alleviate', 'proliferate'],
    correctIndex: 2,
    explanation: 'واژه alleviate به معنای کاستن، تسکین دادن و سبک کردن بار دیوان‌سالاری است.',
  },
  {
    id: 'en-14',
    language: 'english',
    level: 'C1',
    category: 'grammar',
    prompt: 'Scarcely ________ the embassy appointment confirmation when the flight ticket prices surged dramatically.',
    options: ['I had received', 'did I received', 'had I received', 'have I received'],
    correctIndex: 2,
    explanation: 'وارونگی منفی (Negative inversion): Scarcely had + Subject + p.p. ... when ... ساختاری پیشرفته در سطح C1 است.',
  },
  {
    id: 'en-15',
    language: 'english',
    level: 'C1',
    category: 'comprehension',
    prompt: 'In academic writing, what does "tentative conclusion" mean?',
    options: [
      'A conclusion that is completely proven beyond any doubt.',
      'A preliminary or provisional conclusion open to further verification.',
      'A conclusion that contradicts all previous research.',
      'A summary written exclusively for laypersons.',
    ],
    correctIndex: 1,
    explanation: 'واژه tentative به معنای موقتی، محتاطانه و مبتنی بر شواهد اولیه است.',
  },
  {
    id: 'en-16',
    language: 'english',
    level: 'A2',
    category: 'vocabulary',
    prompt: 'After living in Toronto for six months, she finally found an affordable ________ near the subway.',
    options: ['embassy', 'apartment', 'institution', 'curriculum'],
    correctIndex: 1,
    explanation: 'واژه apartment به معنای آپارتمان مسکونی است.',
  },
  {
    id: 'en-17',
    language: 'english',
    level: 'B1',
    category: 'grammar',
    prompt: 'Neither the immigration lawyer nor the translation bureau ________ able to expedite the stamp yesterday.',
    options: ['were', 'was', 'are', 'is'],
    correctIndex: 1,
    explanation: 'در ساختار Neither ... nor مطابقت فعل بر اساس اسم نزدیک‌تر (translation bureau که مفرد است) با was انجام می‌شود.',
  },
  {
    id: 'en-18',
    language: 'english',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'The applicant was asked to ________ discrepancies between her CV and social security records.',
    options: ['reconcile', 'condone', 'fabricate', 'evade'],
    correctIndex: 0,
    explanation: 'واژه reconcile به معنای تطبیق دادن و رفع تناقض بین دو منبع اطلاعاتی است.',
  },
  {
    id: 'en-19',
    language: 'english',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'His ability to articulate complex software architectures under pressure is virtually ________.',
    options: ['unprecedented', 'peerless', 'pedestrian', 'superficial'],
    correctIndex: 1,
    explanation: 'واژه peerless به معنای بی‌نظیر، بی‌همتا و در بالاترین سطح کیفی است.',
  },
  {
    id: 'en-20',
    language: 'english',
    level: 'B2',
    category: 'grammar',
    prompt: 'By the time my German residence permit expires in 2028, I ________ in Munich for five full years.',
    options: ['will live', 'will have been living', 'am living', 'would live'],
    correctIndex: 1,
    explanation: 'آینده کامل استمراری (Future Perfect Continuous): By the time + present, will have been + v-ing.',
  },
];

// -------------------------------------------------------------
// بانک جامع سوالات آلمانی (German Question Bank)
// -------------------------------------------------------------
const GERMAN_QUESTIONS: QuizQuestion[] = [
  // A1 / A2
  {
    id: 'de-1',
    language: 'german',
    level: 'A1',
    category: 'grammar',
    prompt: 'Guten Tag! Wie ________ Sie bitte mit Nachnamen?',
    options: ['heißt', 'heißen', 'heißt du', 'bin'],
    correctIndex: 1,
    explanation: 'برای ضمیر محترمانه Sie فرم فعل heißen است.',
  },
  {
    id: 'de-2',
    language: 'german',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'Ich brauche einen Termin bei der deutschen ________ in Teheran.',
    options: ['Botschaft', 'Wohnung', 'Bahnhof', 'Zeitung'],
    correctIndex: 0,
    explanation: 'واژه Botschaft به معنای سفارت است (سفارت آلمان در تهران).',
  },
  {
    id: 'de-3',
    language: 'german',
    level: 'A2',
    category: 'grammar',
    prompt: 'Gestern ________ ich meine Unterlagen für die Chancenkarte übersetzt.',
    options: ['habe', 'bin', 'hatte', 'werde'],
    correctIndex: 0,
    explanation: 'فعل übersetzen برای ساخت زمان مازی نقلی (Perfekt) با فعل کمکی haben می‌آید.',
  },
  {
    id: 'de-4',
    language: 'german',
    level: 'A2',
    category: 'situational',
    prompt: 'Im Bürgeramt: "Hier ist Ihre Meldebestätigung." - Was antworten Sie am besten?',
    options: ['Gute Besserung!', 'Vielen Dank für Ihre Hilfe!', 'Ich verstehe kein Wort.', 'Auf Wiederhören am Telefon.'],
    correctIndex: 1,
    explanation: 'پاسخ مودبانه و رایج هنگام دریافت برگه تاییدیه ثبت آدرس (Meldebestätigung) تشکر رسمی است.',
  },
  // B1
  {
    id: 'de-5',
    language: 'german',
    level: 'B1',
    category: 'grammar',
    prompt: 'Wenn ich ein Sperrkonto eröffnen ________, könnte ich mein Visum schneller beantragen.',
    options: ['kann', 'könnte', 'würde können', 'konnte'],
    correctIndex: 1,
    explanation: 'برای بیان تمایل و شرط محتمل در Konjunktiv II از فرم könnte استفاده می‌شود.',
  },
  {
    id: 'de-6',
    language: 'german',
    level: 'B1',
    category: 'vocabulary',
    prompt: 'Die Anerkennung meines Hochschulabschlusses erfolgt über die Zentralstelle für ausländisches Bildungswesen (________).',
    options: ['DAAD', 'ZAB', 'VFS', 'IELTS'],
    correctIndex: 1,
    explanation: 'مرجع رسمی تایید مدرک تحصیلی برای کار در آلمان ZAB (آنابین) است.',
  },
  {
    id: 'de-7',
    language: 'german',
    level: 'B1',
    category: 'grammar',
    prompt: 'Obwohl das Visumverfahren komplex ist, ________ viele Fachkräfte nach Deutschland.',
    options: ['ziehen', 'sie ziehen', 'gezogen haben', 'sie werden ziehen'],
    correctIndex: 0,
    explanation: 'در جمله پیرو با Obwohl، جمله پایه بعد از ویرگول با فعل آغاز می‌شود (وارونگی فعل و فاعل).',
  },
  {
    id: 'de-8',
    language: 'german',
    level: 'B1',
    category: 'situational',
    prompt: 'In einer geschäftlichen E-Mail: Welche Anrede ist professionell, wenn man den Namen des Empfängers kennt (Herr Schmidt)?',
    options: ['Hallo Kumpel Schmidt,', 'Sehr geehrter Herr Schmidt,', 'Liebe Kollege Schmidt,', 'Hi Herr Schmidt,'],
    correctIndex: 1,
    explanation: 'عبارت "Sehr geehrter Herr Schmidt," استانداردترین و رسمی‌ترین خطاب اداری در آلمان است.',
  },
  // B2
  {
    id: 'de-9',
    language: 'german',
    level: 'B2',
    category: 'grammar',
    prompt: 'Es wird empfohlen, dass alle relevanten Zertifikate vorab beglaubigt ________.',
    options: ['werden', 'worden', 'geworden sind', 'würden'],
    correctIndex: 0,
    explanation: 'در ساختار مجهول زمان حال پس از dass، فعل کمکی werden در پایان جمله قرار می‌گیرد.',
  },
  {
    id: 'de-10',
    language: 'german',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'Die Chancenkarte bietet Fachkräften die Möglichkeit, ihren Lebensunterhalt durch eine ________ zu sichern.',
    options: ['Nebentätigkeit', 'Verletzung', 'Kündigung', 'Absage'],
    correctIndex: 0,
    explanation: 'طبق قانون کارت شانس، اشتغال جانبی آزمایشی تا ۲۰ ساعت در هفته را Nebentätigkeit می‌نامند.',
  },
  {
    id: 'de-11',
    language: 'german',
    level: 'B2',
    category: 'comprehension',
    prompt: 'Was bedeutet der Ausdruck "eine Stelle antreten"?',
    options: ['Einen Job kündigen', 'Eine neue Arbeitsstelle beginnen', 'Arbeitslosengeld beantragen', 'In Rente gehen'],
    correctIndex: 1,
    explanation: 'اصطلاح اداری-کاری "eine Stelle antreten" به معنی شروع به کار در یک موقعیت شغلی جدید است.',
  },
  {
    id: 'de-12',
    language: 'german',
    level: 'B2',
    category: 'grammar',
    prompt: 'Je besser meine Deutschkenntnisse sind, ________ schneller finde ich eine Festanstellung als Ingenieur.',
    options: ['umso', 'denn', 'weil', 'trotzdem'],
    correctIndex: 0,
    explanation: 'ساختار مقایسه‌ای متناسب در زبان آلمانی: Je + صفت تفضیلی ... umso / desto + صفت تفضیلی است.',
  },
  // C1
  {
    id: 'de-13',
    language: 'german',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'Um den Fachkräftemangel nachhaltig zu ________, wurden die Einwanderungsgesetze grundlegend reformiert.',
    options: ['bewältigen', 'verharmlosen', 'verschleppen', 'stagnieren'],
    correctIndex: 0,
    explanation: 'فعل bewältigen به معنای چیره شدن بر بحران و مدیریت کمبود نیروی کار است.',
  },
  {
    id: 'de-14',
    language: 'german',
    level: 'C1',
    category: 'grammar',
    prompt: 'Angesichts ________ wirtschaftlichen Wandels bedarf es hochqualifizierter IT-Spezialisten.',
    options: ['des rasanten', 'dem rasanten', 'der rasante', 'den rasanten'],
    correctIndex: 0,
    explanation: 'حرف اضافه Angesichts نیازمند حالت ملکی (Genitiv) برای اسم مذکر است (des rasanten Wandels).',
  },
  {
    id: 'de-15',
    language: 'german',
    level: 'C1',
    category: 'comprehension',
    prompt: 'Welche Bedeutung hat das Wort "redundant" in technischen Spezifikationen?',
    options: [
      'Gefährlich und ungetestet',
      'Mehrfach vorhanden zur Erhöhung der Ausfallsicherheit',
      'Vollkommen nutzlos und fehlerhaft',
      'Ausschließlich manuell bedienbar',
    ],
    correctIndex: 1,
    explanation: 'واژه تکنیکال Redundant به معنای افزونه، سامانه‌های پشتیبان دوگانه برای حفظ امنیت عملیاتی است.',
  },
  {
    id: 'de-16',
    language: 'german',
    level: 'A2',
    category: 'vocabulary',
    prompt: 'Für den Mietvertrag muss man in Deutschland oft drei Monatsmieten als ________ hinterlegen.',
    options: ['Kaution', 'Gehalt', 'Steuer', 'Rechnung'],
    correctIndex: 0,
    explanation: 'مبلغ ودیعه اجاره خانه در آلمان Kaution نام دارد.',
  },
  {
    id: 'de-17',
    language: 'german',
    level: 'B1',
    category: 'vocabulary',
    prompt: 'Nach der Einreise muss man sich innerhalb von zwei Wochen beim ________ anmelden.',
    options: ['Einwohnermeldeamt', 'Fundbüro', 'Reisebüro', 'Supermarkt'],
    correctIndex: 0,
    explanation: 'اداره ثبت محل سکونت و آدرس در آلمان Einwohnermeldeamt نام دارد.',
  },
  {
    id: 'de-18',
    language: 'german',
    level: 'B2',
    category: 'grammar',
    prompt: 'Der Bewerber behauptet, über mehrjährige Erfahrung im Projektmanagement zu ________.',
    options: ['verfügen', 'haben verfügt', 'verfügt', 'verfüge'],
    correctIndex: 0,
    explanation: 'اصطلاح "über etwas verfügen" (برخورداری از تجربه) همراه با حرف اضافه zu و مصدر در پایان جمله می‌آید.',
  },
  {
    id: 'de-19',
    language: 'german',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'Wie viel ________ ein Flugticket von Teheran nach Frankfurt?',
    options: ['kostet', 'kaufen', 'arbeiten', 'bezahlt'],
    correctIndex: 0,
    explanation: 'پرسش قیمت با Wie viel kostet انجام می‌شود.',
  },
  {
    id: 'de-20',
    language: 'german',
    level: 'B1',
    category: 'grammar',
    prompt: 'Sie lernt seit einem Jahr intensiv Deutsch, ________ an einer deutschen Universität studieren zu können.',
    options: ['um', 'ohne', 'statt', 'damit'],
    correctIndex: 0,
    explanation: 'ساختار بیانی هدف با مصدر با zu به فرم um ... zu + Infinitiv می‌آید.',
  },
];

// -------------------------------------------------------------
// بانک جامع سوالات فرانسوی (French Question Bank)
// -------------------------------------------------------------
const FRENCH_QUESTIONS: QuizQuestion[] = [
  // A1 / A2
  {
    id: 'fr-1',
    language: 'french',
    level: 'A1',
    category: 'grammar',
    prompt: 'Bonjour! Je m’appelle Sara et je ________ iranienne.',
    options: ['suis', 'ai', 'es', 'est'],
    correctIndex: 0,
    explanation: 'صرف فعل être برای ضمیر اول شخص مفرد (Je) به صورت Je suis است.',
  },
  {
    id: 'fr-2',
    language: 'french',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'Pour voyager au Canada, j’ai besoin d’obtenir un ________ de travail ou d’études.',
    options: ['permis', 'billet', 'journal', 'cadeau'],
    correctIndex: 0,
    explanation: 'مجوز کار یا تحصیل به فرانسوی permis de travail / d’études گفته می‌شود.',
  },
  {
    id: 'fr-3',
    language: 'french',
    level: 'A2',
    category: 'grammar',
    prompt: 'Hier soir, nous ________ tous les formulaires pour le dossier d’immigration.',
    options: ['avons rempli', 'remplissons', 'remplirons', 'avions rempli'],
    correctIndex: 0,
    explanation: 'برای زمان گذشته ساده (Passé Composé) فعل remplir با avoir به صورت avons rempli صرف می‌شود.',
  },
  {
    id: 'fr-4',
    language: 'french',
    level: 'A2',
    category: 'situational',
    prompt: 'À l’aéroport international: "Vos bagages dépassent la limite de poids." - Que comprenez-vous?',
    options: [
      'Mes valises sont trop lourdes.',
      'L’avion a déjà décollé.',
      'Je dois changer de terminal.',
      'Le vol est annulé à cause de la météo.',
    ],
    correctIndex: 0,
    explanation: 'جمله به معنای اضافه‌بار چمدان‌ها نسبت به سقف وزنی مجاز است.',
  },
  // B1
  {
    id: 'fr-5',
    language: 'french',
    level: 'B1',
    category: 'grammar',
    prompt: 'Si j’obtiens le niveau B2 en français, mes points au système Entrée Express ________ considérablement.',
    options: ['augmenteront', 'augmentent', 'auraient augmenté', 'augmentaient'],
    correctIndex: 0,
    explanation: 'در شرطی نوع اول فرانسوی (Si + Présent), فعل جمله دوم در زمان آینده ساده (Futur Simple: augmenteront) می‌آید.',
  },
  {
    id: 'fr-6',
    language: 'french',
    level: 'B1',
    category: 'vocabulary',
    prompt: 'Pour immigrer au Québec, il est primordial de réussir le test de français certifié (________ ou TEF).',
    options: ['TCF', 'TOEFL', 'ZAB', 'IELTS'],
    correctIndex: 0,
    explanation: 'آزمون رسمی زبان فرانسه برای مهاجرت کانادا و کبک TCF Canada یا TEF است.',
  },
  {
    id: 'fr-7',
    language: 'french',
    level: 'B1',
    category: 'grammar',
    prompt: 'Bien que le processus ________ rigoureux, beaucoup de candidats réussissent leur projet.',
    options: ['soit', 'est', 'sera', 'était'],
    correctIndex: 0,
    explanation: 'بعد از حرف ربط Bien que الزاما وجه التزامی (Subjonctif: soit) به کار می‌رود.',
  },
  {
    id: 'fr-8',
    language: 'french',
    level: 'B1',
    category: 'situational',
    prompt: 'Dans un courriel professionnel: Quelle formule de politesse finale est la plus appropriée?',
    options: ['Bisous à bientôt,', 'Cordialement,', 'Salut mon cher ami,', 'À la prochaine fois,'],
    correctIndex: 1,
    explanation: 'واژه Cordialement مودبانه‌ترین و متداول‌ترین عبارت پایانی در ایمیل‌های کاری فرانسوی است.',
  },
  // B2
  {
    id: 'fr-9',
    language: 'french',
    level: 'B2',
    category: 'grammar',
    prompt: 'Il est indispensable que vous ________ tous les justificatifs financiers avant l’entrevue.',
    options: ['soumettiez', 'soumettez', 'soumettrez', 'avez soumis'],
    correctIndex: 0,
    explanation: 'ساختار Il est indispensable que مستلزم وجه سوبژونکتیف برای vous به صورت soumettiez است.',
  },
  {
    id: 'fr-10',
    language: 'french',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'La province du Nouveau-Brunswick encourage les candidats francophones afin de favoriser l’épanouissement des communautés de langue officielle ________.',
    options: ['minoritaire', 'dominante', 'obsolète', 'négligée'],
    correctIndex: 0,
    explanation: 'جامعه اقلیت زبانی به فرانسوی "communauté de langue officielle minoritaire" نامیده می‌شود.',
  },
  {
    id: 'fr-11',
    language: 'french',
    level: 'B2',
    category: 'comprehension',
    prompt: 'Que signifie l’expression "faire d’une pierre deux coups"?',
    options: [
      'Accomplir deux objectifs avec une seule action.',
      'Casser accidentellement un objet de valeur.',
      'Renoncer définitivement à un projet.',
      'Acheter des matériaux de construction.',
    ],
    correctIndex: 0,
    explanation: 'اصطلاح معادل «با یک تیر دو نشان زدن» است.',
  },
  {
    id: 'fr-12',
    language: 'french',
    level: 'B2',
    category: 'grammar',
    prompt: 'Les compétences linguistiques que cette professionnelle a ________ durant son séjour ont été déterminantes.',
    options: ['acquises', 'acquis', 'acquise', 'acquérir'],
    correctIndex: 0,
    explanation: 'مطابقت اسم مفعول با مفعول بی‌واسطه مقدم (Les compétences linguistiques که جمع مونث است): acquises.',
  },
  // C1
  {
    id: 'fr-13',
    language: 'french',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'Les autorités fédérales ont instauré une stratégie proactive visant à ________ les disparités régionales de main-d’œuvre.',
    options: ['pallier', 'exacerber', 'dissimuler', 'précipiter'],
    correctIndex: 0,
    explanation: 'فعل اداری pallier به معنای جبران کردن و تخفیف دادن کمبودهاست.',
  },
  {
    id: 'fr-14',
    language: 'french',
    level: 'C1',
    category: 'grammar',
    prompt: 'Quoi qu’il ________ des fluctuations économiques, l’ingénierie logicielle demeure un secteur très porteur.',
    options: ['en soit', 'en est', 'en serait', 'en fût'],
    correctIndex: 0,
    explanation: 'ترکیب التزامی تثبیت شده: Quoi qu’il en soit (به هر روی / در هر حال).',
  },
  {
    id: 'fr-15',
    language: 'french',
    level: 'C1',
    category: 'comprehension',
    prompt: 'Dans un rapport économique, que connote le terme "conjoncture"?',
    options: [
      'La situation économique globale à un moment donné.',
      'Une prévision météorologique maritime.',
      'Un conflit syndical localisé.',
      'Une loi constitutionnelle immuable.',
    ],
    correctIndex: 0,
    explanation: 'واژه conjoncture شرایط اقتصادی-اجتماعی حاکم در مقطع زمانی معین را تعریف می‌کند.',
  },
  {
    id: 'fr-16',
    language: 'french',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'Comment dit-on "thank you very much" en français?',
    options: ['Merci beaucoup', 'Au revoir', 'S’il vous plaît', 'Bonne nuit'],
    correctIndex: 0,
    explanation: 'معادل فرانسوی عبارت Merci beaucoup است.',
  },
  {
    id: 'fr-17',
    language: 'french',
    level: 'A2',
    category: 'grammar',
    prompt: 'Où est ton passeport? - Je ________ ai mis dans mon sac à dos.',
    options: ['l’', 'le', 'lui', 'y'],
    correctIndex: 0,
    explanation: 'ضمیر مفعولی مستقیم قبل از مصوت به صورت l’ قرار می‌گیرد (Je l’ai mis).',
  },
  {
    id: 'fr-18',
    language: 'french',
    level: 'B1',
    category: 'vocabulary',
    prompt: 'Le traducteur assermenté a apposé son ________ officiel sur l’acte de naissance.',
    options: ['sceau', 'reçu', 'drapeau', 'dessin'],
    correctIndex: 0,
    explanation: 'مهر رسمی دارالترجمه به فرانسوی sceau یا cachet نامیده می‌شود.',
  },
  {
    id: 'fr-19',
    language: 'french',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'Ce candidat fait preuve d’une grande ________ face aux aléas de la réinstallation.',
    options: ['résilience', 'insolence', 'apathie', 'hésitation'],
    correctIndex: 0,
    explanation: 'واژه résilience به معنای تاب‌آوری و انطباق‌پذیری در شرایط چالش‌برانگیز مهاجرت است.',
  },
  {
    id: 'fr-20',
    language: 'french',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'L’éloquence et la rigueur de son exposé ont emporté l’adhésion ________ du jury de sélection.',
    options: ['unanime', 'équivoque', 'éphémère', 'tacite'],
    correctIndex: 0,
    explanation: 'واژه unanime به معنای متفق‌القول و با اجماع کامل آرا است.',
  },
];

// -------------------------------------------------------------
// بانک جامع سوالات ایتالیایی (Italian Question Bank)
// -------------------------------------------------------------
const ITALIAN_QUESTIONS: QuizQuestion[] = [
  // A1 / A2
  {
    id: 'it-1',
    language: 'italian',
    level: 'A1',
    category: 'grammar',
    prompt: 'Ciao! Mi chiamo Marco e ________ uno studente all’Università di Bologna.',
    options: ['sono', 'ho', 'sei', 'sta'],
    correctIndex: 0,
    explanation: 'صرف فعل essere برای اول‌شخص مفرد (Io) به صورت sono است.',
  },
  {
    id: 'it-2',
    language: 'italian',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'Per studiare in Italia devo richiedere un ________ di soggiorno per motivi di studio.',
    options: ['permesso', 'biglietto', 'orologio', 'conto'],
    correctIndex: 0,
    explanation: 'کارت اقامت دانشجویی در ایتالیا Permesso di soggiorno نامیده می‌شود.',
  },
  {
    id: 'it-3',
    language: 'italian',
    level: 'A2',
    category: 'grammar',
    prompt: 'L’anno scorso mio fratello ha ________ la borsa di studio regionale DSU.',
    options: ['vinto', 'vinceva', 'vincere', 'vincendo'],
    correctIndex: 0,
    explanation: 'اسم مفعول گذشته (Participio Passato) فعل vincere به صورت vinto است.',
  },
  {
    id: 'it-4',
    language: 'italian',
    level: 'A2',
    category: 'situational',
    prompt: 'Alla segreteria studenti: "Vorrei ritirare il mio certificato di iscrizione." - Cosa significa?',
    options: [
      'می‌خواهم گواهی اشتغال به تحصیل خود را تحویل بگیرم.',
      'می‌خواهم از دانشگاه انصراف دهم.',
      'می‌خواهم به کافه دانشگاه بروم.',
      'کارت دانشجویی‌ام را گم کرده‌ام.',
    ],
    correctIndex: 0,
    explanation: 'جمله درخواست تحویل گواهی ثبت‌نام و اشتغال به تحصیل از دبیرخانه دانشجویی است.',
  },
  // B1
  {
    id: 'it-5',
    language: 'italian',
    level: 'B1',
    category: 'grammar',
    prompt: 'Se potessi scegliere qualsiasi città italiana, mi ________ volentieri a Milano per il master.',
    options: ['trasferirei', 'trasferisco', 'trasferito', 'trasferissi'],
    correctIndex: 0,
    explanation: 'در شرطی نوع دوم ایتالیایی (Congiuntivo imperfetto + Condizionale presente): trasferirei.',
  },
  {
    id: 'it-6',
    language: 'italian',
    level: 'B1',
    category: 'vocabulary',
    prompt: 'Il valore dell’indicatore ________ Parificato determina l’accesso alle borse di studio e agli alloggi universitari.',
    options: ['ISEE', 'IBAN', 'PEC', 'SPID'],
    correctIndex: 0,
    explanation: 'شاخص ارزیابی وضعیت مالی و درآمد سرپرست خانوار برای بورسیه ایتالیا ISEE Parificato نام دارد.',
  },
  {
    id: 'it-7',
    language: 'italian',
    level: 'B1',
    category: 'grammar',
    prompt: 'Benché l’iter burocratico ________ lungo, gli studenti internazionali ottengono ottimi risultati.',
    options: ['sia', 'è', 'sarà', 'era'],
    correctIndex: 0,
    explanation: 'پس از حرف ربط Benché (هرچند که)، کاربرد وجه التزامی (Congiuntivo: sia) الزامی است.',
  },
  {
    id: 'it-8',
    language: 'italian',
    level: 'B1',
    category: 'situational',
    prompt: 'In una lettera formale all’ufficio borse di studio: Quale chiusura è più adeguata?',
    options: ['Cordiali saluti,', 'Baci e abbracci,', 'Ci vediamo presto,', 'Ciao caro,'],
    correctIndex: 0,
    explanation: 'عبارت رسمی "Cordiali saluti," (با درود و احترام) استانداردترین پایان‌بندی نامه‌های اداری ایتالیاست.',
  },
  // B2
  {
    id: 'it-9',
    language: 'italian',
    level: 'B2',
    category: 'grammar',
    prompt: 'È fondamentale che tutti i candidati ________ la dichiarazione di valore (DOV) o il CIMEA prima dell’immatricolazione.',
    options: ['presentino', 'presentano', 'hanno presentato', 'presentassero'],
    correctIndex: 0,
    explanation: 'ساختار È fondamentale che مستلزم وجه Congiuntivo presente سوم شخص جمع: presentino است.',
  },
  {
    id: 'it-10',
    language: 'italian',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'Il certificato linguistico ufficiale riconosciuto dal Ministero degli Esteri per l’italiano è il ________ o CELI.',
    options: ['CILS', 'TOEFL', 'DELF', 'TestDaF'],
    correctIndex: 0,
    explanation: 'آزمون رسمی معتبر زبان ایتالیایی سفارت CILS (دانشگاه سیه‌نا) یا CELI (دانشگاه پروجا) است.',
  },
  {
    id: 'it-11',
    language: 'italian',
    level: 'B2',
    category: 'comprehension',
    prompt: 'Cosa intende il proverbio italiano "Chi la dura la vince"?',
    options: [
      'Con perseveranza e tenacia si raggiungono gli obiettivi.',
      'Chi corre più veloce arriva per primo.',
      'Non bisogna fidarsi degli sconosciuti.',
      'È meglio spendere poco per non rischiare.',
    ],
    correctIndex: 0,
    explanation: 'ضرب‌المثل به این معناست که صبر و پشتکار در نهایت موجب پیروزی و موفقیت می‌شود.',
  },
  {
    id: 'it-12',
    language: 'italian',
    level: 'B2',
    category: 'grammar',
    prompt: 'Nonostante ________ molti ostacoli logistici all’inizio, la ricercatrice ha completato il suo dottorato.',
    options: ['ci fossero', 'ci sono', 'ci saranno', 'ci siano stati'],
    correctIndex: 0,
    explanation: 'بعد از Nonostante در زمان گذشته، وجه Congiuntivo imperfetto (ci fossero) استفاده می‌شود.',
  },
  // C1
  {
    id: 'it-13',
    language: 'italian',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'Il rettore ha elogiato il contributo accademico dei dottorandi definendolo un apporto di ________ valore scientifico.',
    options: ['inestimabile', 'trascurabile', 'superfluo', 'irrisorio'],
    correctIndex: 0,
    explanation: 'واژه inestimabile به معنای بسیار ارزشمند و غیرقابل قیمت‌گذاری است.',
  },
  {
    id: 'it-14',
    language: 'italian',
    level: 'C1',
    category: 'grammar',
    prompt: 'Qualora l’ambasciata ________ chiarimenti supplementari sulla documentazione bancaria, risponderemo tempestivamente.',
    options: ['richiedesse', 'richiede', 'ha richiesto', 'richiederà'],
    correctIndex: 0,
    explanation: 'حرف ربط رسمی Qualora (در صورتی که / چنانچه) با Congiuntivo imperfetto به صورت richiedesse همراه می‌شود.',
  },
  {
    id: 'it-15',
    language: 'italian',
    level: 'C1',
    category: 'comprehension',
    prompt: 'Nel contesto delle convenzioni internazionali, cosa esprime la locuzione "mutatis mutandis"?',
    options: [
      'Fatte le dovute modifiche e adattamenti alle specifiche circostanze.',
      'Senza alcuna variazione rispetto al testo originale.',
      'In modo del tutto clandestino e non autorizzato.',
      'Unicamente a favore delle autorità consolari.',
    ],
    correctIndex: 0,
    explanation: 'عبارت حقوقی لاتین-ایتالیایی mutatis mutandis به معنی اعمال تغییرات و تعدیل‌های لازم متناسب با شرایط است.',
  },
  {
    id: 'it-16',
    language: 'italian',
    level: 'A1',
    category: 'vocabulary',
    prompt: 'Come si dice "good morning" in italiano?',
    options: ['Buongiorno', 'Buonanotte', 'Arrivederci', 'Per favore'],
    correctIndex: 0,
    explanation: 'معادل صبحتان به خیر به زبان ایتالیایی Buongiorno است.',
  },
  {
    id: 'it-17',
    language: 'italian',
    level: 'A2',
    category: 'vocabulary',
    prompt: 'Prima di affittare una stanza, è consigliabile firmare un regolare ________ di locazione.',
    options: ['contratto', 'giornale', 'diploma', 'timbro'],
    correctIndex: 0,
    explanation: 'قرارداد اجاره مسکن Contratto di locazione نام دارد.',
  },
  {
    id: 'it-18',
    language: 'italian',
    level: 'B1',
    category: 'grammar',
    prompt: 'I documenti che tu mi ________ sono stati consegnati al consolato stamattina.',
    options: ['hai dato', 'hai davi', 'dando', 'daresti'],
    correctIndex: 0,
    explanation: 'زمان گذشته نقلی: I documenti che tu mi hai dato.',
  },
  {
    id: 'it-19',
    language: 'italian',
    level: 'B2',
    category: 'vocabulary',
    prompt: 'Gli studenti meritevoli possono ottenere l’esonero totale dal pagamento delle ________ universitarie.',
    options: ['tasse', 'bollette', 'multe', 'spese postali'],
    correctIndex: 0,
    explanation: 'شهریه دانشگاه در ایتالیا Tasse universitarie نام دارد که با بورسیه DSU معاف می‌شود.',
  },
  {
    id: 'it-20',
    language: 'italian',
    level: 'C1',
    category: 'vocabulary',
    prompt: 'La discrepanza tra le due dichiarazioni fiscali si è rivelata del tutto ________ e irrilevante.',
    options: ['marginale', 'catastrofica', 'intenzionale', 'fondamentale'],
    correctIndex: 0,
    explanation: 'واژه marginale به معنای جزئی، ناچیز و بی‌اهمیت در روند بررسی اداری است.',
  },
];

// -------------------------------------------------------------
// موتور انتخاب تصادفی ۱۵ سوال متعادل و ارزیابی نتیجه
// -------------------------------------------------------------

export function getRandomQuizQuestions(language: QuizLanguage, count: number = 15): QuizQuestion[] {
  let pool: QuizQuestion[] = [];
  switch (language) {
    case 'english':
      pool = [...ENGLISH_QUESTIONS];
      break;
    case 'german':
      pool = [...GERMAN_QUESTIONS];
      break;
    case 'french':
      pool = [...FRENCH_QUESTIONS];
      break;
    case 'italian':
      pool = [...ITALIAN_QUESTIONS];
      break;
  }

  // الگوریتم سورت تصادفی با توزیع سختی از آسان به دشوار
  const aLevels = pool.filter(q => q.level === 'A1' || q.level === 'A2');
  const bLevels = pool.filter(q => q.level === 'B1' || q.level === 'B2');
  const cLevels = pool.filter(q => q.level === 'C1');

  // بر زدن هر بخش
  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const sampledA = shuffle(aLevels).slice(0, 5); // 5 سوال آسان/پایه
  const sampledB = shuffle(bLevels).slice(0, 7); // 7 سوال متوسط
  const sampledC = shuffle(cLevels).slice(0, 3); // 3 سوال پیشرفته

  const combined = [...sampledA, ...sampledB, ...sampledC];
  return combined.length >= count ? combined.slice(0, count) : shuffle(pool).slice(0, count);
}

export function evaluateLanguageQuiz(language: QuizLanguage, correctCount: number, total: number = 15): QuizResultData {
  const percentage = Math.round((correctCount / total) * 100);

  let cefrLevel: CEFRLevel = 'A1';
  let levelLabelFa = 'مقدماتی (A1)';
  let examEquivalent = '';
  let immigrationImpact = '';
  let studyRecommendation = '';

  const formUpdates: QuizResultData['formFieldsToUpdate'] = {};

  if (language === 'english') {
    if (correctCount >= 14) {
      cefrLevel = 'C1';
      levelLabelFa = 'پیشرفته (C1)';
      examEquivalent = 'معادل آیلتس 7.5 تا 8.5 / تافل 102 تا 115 / دولینگو 135+';
      immigrationImpact = 'بالاترین امتیاز مهارت زبان در سیستم اکسپرس اینتری کانادا (CLB 9/10) و اسکیلد ورکر استرالیا. شانس عالی برای پذیرش مستقیم دکتری/ارشد با فاند کامل یا جاب‌آفر بین‌المللی.';
      studyRecommendation = 'روی تکنیک‌های مصاحبه کاری و واژگان تخصصی حوزه مهندسی/شغلی خود تمرکز کنید.';
      formUpdates.englishLevel = 'advanced';
      formUpdates.englishExam = 'ielts';
      formUpdates.englishScore = '8.0';
    } else if (correctCount >= 11) {
      cefrLevel = 'B2';
      levelLabelFa = 'فوق‌متوسط (B2)';
      examEquivalent = 'معادل آیلتس 6.5 تا 7.0 / تافل 85 تا 100 / دولینگو 115 تا 130';
      immigrationImpact = 'سطح طلایی و کافی برای اکثر دانشگاه‌های انگلیسی‌زبان جهان و واجد شرایط ویزای جستجوی کار یا ورود به بازار کار اروپا و خلیج فارس.';
      studyRecommendation = 'با تقویت مهارت رایتینگ آکادمیک و گرامرهای پیچیده به راحتی به سطح C1 می‌رسید.';
      formUpdates.englishLevel = 'intermediate';
      formUpdates.englishExam = 'ielts';
      formUpdates.englishScore = '6.5';
    } else if (correctCount >= 8) {
      cefrLevel = 'B1';
      levelLabelFa = 'متوسط کاربردی (B1)';
      examEquivalent = 'معادل آیلتس 5.5 تا 6.0 / تافل 65 تا 80 / دولینگو 95 تا 110';
      immigrationImpact = 'پایه مناسب برای مکالمه روزمره و کاری نسبی. با یک دوره تقویت ۲ تا ۴ ماهه می‌توانید نمره لازم برای پرونده مهاجرتی کانادا یا آلمان را کسب کنید.';
      studyRecommendation = 'روی درک مطلب متون کاری و افعال دو کلمه‌ای (Phrasal Verbs) روزانه تمرین کنید.';
      formUpdates.englishLevel = 'intermediate';
      formUpdates.englishExam = 'ielts';
      formUpdates.englishScore = '5.5';
    } else if (correctCount >= 5) {
      cefrLevel = 'A2';
      levelLabelFa = 'مقدماتی پیشرفته (A2)';
      examEquivalent = 'معادل آیلتس 4.5 تا 5.0';
      immigrationImpact = 'برای مهاجرت کاری نیاز به تقویت دارد. اما برای دوره‌های زبان در مقصد یا کالج‌های مشروط قابل استفاده است.';
      studyRecommendation = 'دایره واژگان روزمره خود را به ۲۰۰۰ لغت برسانید و ساختارهای زمان‌های گرامری را مرور کنید.';
      formUpdates.englishLevel = 'basic';
      formUpdates.englishExam = 'none';
      formUpdates.englishScore = '';
    } else {
      cefrLevel = 'A1';
      levelLabelFa = 'پایه و مبتدی (A1)';
      examEquivalent = 'معادل آیلتس کمتر از 4.0';
      immigrationImpact = 'هنوز تا کسب حداقل نمره برای پرونده مهاجرتی فاصله دارید؛ پیشنهاد می‌شود ۳ تا ۶ ماه برنامه مدون مطالعه پایه‌ای زبان داشته باشید.';
      studyRecommendation = 'یادگیری را از متون ساده و مکالمات پایه‌ای شروع کنید.';
      formUpdates.englishLevel = 'basic';
      formUpdates.englishExam = 'none';
      formUpdates.englishScore = '';
    }
  } else if (language === 'german') {
    if (correctCount >= 13) {
      cefrLevel = 'B2';
      levelLabelFa = 'پیشرفته (B2)';
      examEquivalent = 'معادل مدرک گوته B2 (Goethe-Zertifikat B2) / تست‌داف ۴';
      immigrationImpact = 'کلید طلایی ورود مستقیم به دانشگاه‌های رایگان آلمان، ویزای جستجوی کار، کارت شانس آلمان با حداکثر امتیاز زبان، و معافیت از کالج زبان.';
      studyRecommendation = 'با حفظ این سطح، آماده ارسال مدارک به ویزامتریک تهران و مصاحبه کاری هستید.';
      formUpdates.germanLevel = 'b2';
    } else if (correctCount >= 9) {
      cefrLevel = 'B1';
      levelLabelFa = 'متوسط کاری (B1)';
      examEquivalent = 'معادل مدرک گوته B1 (Goethe-Zertifikat B1)';
      immigrationImpact = 'کسب ۱ امتیاز باارزش برای کارت شانس آلمان (Chancenkarte)، حداقل مورد نیاز برای آسبیلدونگ و بلوکارت رشته‌های مهندسی، و مصاحبه سفارت اتریش.';
      studyRecommendation = 'روی مهارت نوشتن ایمیل‌های رسمی اداری و نامه‌نگاری تمرین کنید تا به سطح B2 برسید.';
      formUpdates.germanLevel = 'b1';
    } else if (correctCount >= 5) {
      cefrLevel = 'A2';
      levelLabelFa = 'مقدماتی (A2)';
      examEquivalent = 'معادل مدرک گوته A2';
      immigrationImpact = 'حداقل مدرک الزامی برای درخواست کارت شانس آلمان (Chancenkarte) در صورتی که زبان انگلیسی شما B2 باشد.';
      studyRecommendation = 'با تمرین روزانه یک ساعته در طول ۲ ماه می‌توانید به B1 ارتقا پیدا کنید.';
      formUpdates.germanLevel = 'a1_a2';
    } else {
      cefrLevel = 'A1';
      levelLabelFa = 'سطح آغازین (A1)';
      examEquivalent = 'مقدماتی گوته A1 یا در حال یادگیری';
      immigrationImpact = 'برای سفارت و ویزای کاری کافی نیست اما شروع خوبی برای یادگیری زبان آلمانی است.';
      studyRecommendation = 'افعال باقاعده و بی‌قاعده و آرتیکل‌های Der, Die, Das را در اولویت بگذارید.';
      formUpdates.germanLevel = 'a1_a2';
    }
  } else if (language === 'french') {
    if (correctCount >= 13) {
      cefrLevel = 'B2';
      levelLabelFa = 'پیشرفته (B2 - کلید کانادا)';
      examEquivalent = 'معادل مدرک DELF B2 یا TCF Canada با نمره NCLC 7+';
      immigrationImpact = 'امتیاز فوق‌العاده تا ۵۰ نمره مازاد در دراوهای کتگوری-بیس فرانسوی کانادا (Francophone mobility) و قبولی تضمینی مهاجرت استان کبک (PR).';
      studyRecommendation = 'شما در یکی از پرتقاضاترین دسته‌های مهاجرتی کانادا با پایین‌ترین کف امتیاز CRS قرار دارید!';
      formUpdates.frenchLevel = 'b2';
    } else if (correctCount >= 9) {
      cefrLevel = 'B1';
      levelLabelFa = 'متوسط (B1)';
      examEquivalent = 'معادل DELF B1 یا TCF با نمره NCLC 5/6';
      immigrationImpact = 'پایه بسیار عالی برای دریافت نمره دراوهای فرانسه کانادا با یک دوره تکمیلی ۲ الی ۳ ماهه.';
      studyRecommendation = 'روی اصطلاحات فرانسوی و تلفظ صوتی کار کنید تا به سطح B2 (NCLC 7) برسید.';
      formUpdates.frenchLevel = 'b1';
    } else {
      cefrLevel = 'A2';
      levelLabelFa = 'مقدماتی (A1/A2)';
      examEquivalent = 'معادل DELF A1/A2';
      immigrationImpact = 'برای بهره‌مندی از امتیازات طلایی مهاجرت کانادا باید به سطح B2 ارتقا یابید.';
      studyRecommendation = 'گرامر Passé Composé و واژگان عمومی را منظم تمرین کنید.';
      formUpdates.frenchLevel = 'a1_a2';
    }
  } else if (language === 'italian') {
    if (correctCount >= 13) {
      cefrLevel = 'B2';
      levelLabelFa = 'پیشرفته (B2)';
      examEquivalent = 'معادل مدرک CILS B2 یا CELI 3';
      immigrationImpact = 'ورود مستقیم به کلیه رشته‌های ایتالیایی‌زبان دانشگاه‌های میلان، رم، بولونیا و تورین با امکان دریافت بورسیه کامل استانی DSU.';
      studyRecommendation = 'تسلط شما برای مصاحبه و زندگی دانشجویی یا شغلی در ایتالیا بسیار ایده‌آل است.';
      formUpdates.italianLevel = 'b2';
    } else if (correctCount >= 9) {
      cefrLevel = 'B1';
      levelLabelFa = 'متوسط کاربردی (B1)';
      examEquivalent = 'معادل CILS B1 یا CELI 2';
      immigrationImpact = 'مناسب برای زندگی روزمره در ایتالیا و الزامی برای تمدید اقامت و شهروندی در آینده.';
      studyRecommendation = 'تمرکز بر زمان‌های گذشته و صیغه التزامی (Congiuntivo) سطح شما را به B2 می‌رساند.';
      formUpdates.italianLevel = 'b1';
    } else {
      cefrLevel = 'A2';
      levelLabelFa = 'مقدماتی (A1/A2)';
      examEquivalent = 'معادل CILS A1/A2';
      immigrationImpact = 'برای تحصیل در ایتالیا، انتخاب رشته‌های انگلیسی‌زبان همراه با بورسیه استانی DSU گزینه جایگزین و بدون نیاز به آزمون ایتالیایی است.';
      studyRecommendation = 'یادگیری احوالپرسی، آدرس‌یابی و اصطلاحات دانشگاهی را دنبال کنید.';
      formUpdates.italianLevel = 'a1_a2';
    }
  }

  return {
    language,
    score: correctCount,
    total,
    percentage,
    cefrLevel,
    levelLabelFa,
    examEquivalent,
    immigrationImpact,
    studyRecommendation,
    formFieldsToUpdate: formUpdates,
  };
}
