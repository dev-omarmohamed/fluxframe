export type Language = "ar" | "en";

export const translations = {
  ar: {
    // Brand & General
    brandName: "FluxFrame",
    studio: "استوديو فلكس فريم",
    tagline: "هويات بصرية بالذكاء الاصطناعي، محتوى سوشيال ميديا، وطباعة 3D.",
    taglineHighlight: "صُممت لتتميز.",
    heroSubtitle: "هويات بصرية احترافية كاملة (ملفات الشعار + موك آبس) بـ 1000 ج.م. صناعة فيديوهات ريلز بالذكاء الاصطناعي وبوستات سوشيال ميديا. وطباعة ثلاثية الأبعاد بتوصيل 150 ج.م.",

    // Nav
    navHome: "الرئيسية",
    navTemplates: "باقات الهوية",
    navContent: "فيديوهات وريلز AI",
    nav3DPrinting: "طباعة 3D",
    navAdmin: "لوحة التحكم",
    langToggle: "English",

    // CTA buttons
    exploreTemplates: "باقة الهوية الكاملة (1000 ج.م)",
    exploreContent: "باقات الفيديوهات والبوستات",
    upload3DModel: "طلب طباعة 3D",
    requestThisService: "طلب هذه الباقة",
    submitFile: "إرسال الملف للمراجعة",
    viewTemplatesAndPrompts: "تفاصيل باقة الهوية الكاملة",
    upload3DModelCta: "رفع ملف ثلاثي الأبعاد",

    // Service 1: Full Brand Identity Package (1000 EGP)
    card1Category: "الباقة الكاملة لبدء البراند",
    card1Title: "الهوية البصرية المتكاملة للمشروع",
    card1Price: "1,000 ج.م",
    card1Desc: "كل ما تحتاجه لإطلاق علامتك التجارية من الصفر باحترافية كاملة. ملفات الشعار بجميع الصيغ المصدرية وموك آبس واقعية شاملة.",
    card1Features: [
      "تصميم الشعار الأساسي والفرعي بجميع الصيغ (Vector SVG, PNG شفاف, PDF عالي الدقة)",
      "موك آبس احترافية واقعية (كروت عمل، أوراق مراسلات، أكياس وتغليف، لافتات، يونيفورم)",
      "تصاميم أغلفة السوشيال ميديا والأفاتار لجميع المنصات",
      "دليل الهوية الكامل (Brand Guidelines): الألوان المعتمدة، الخطوط، وقواعد الاستخدام",
      "الأوامر الهندسية الدقيقة للذكاء الاصطناعي (Prompts) لتوليد مواد إضافية متطابقة",
      "تسليم جاهز للطباعة والاستخدام الرقمي الفوري في 24-48 ساعة",
    ],

    // Service 2: AI Reels & Social Media Posts
    cardContentCategory: "صناعة المحتوى بالذكاء الاصطناعي",
    cardContentTitle: "فيديوهات ريلز وبوستات السوشيال ميديا",
    cardContentPrice: "من 100 ج.م للفيديو · من 20 ج.م للصورة",
    cardContentDesc: "فيديوهات ريلز وشورتس بالذكاء الاصطناعي وتصاميم بوستات إعلانية احترافية لزيادة المبيعات والتفاعل لبراندك.",
    cardContentRateVideo: "100 إلى 200 ج.م لكل فيديو ريلز/شورتس",
    cardContentRateImage: "20 إلى 50 ج.م لكل تصميم بوست/صورة",
    cardContentFeatures: [
      "فيديوهات ريلز وسيناريوهات تسويقية بالذكاء الاصطناعي مع تعليق صوتي ومؤثرات",
      "تصاميم بوستات ومنشورات متناسقة مع هوية براندك وألوانه",
      "أسعار مرنة: 100 إلى 200 ج.م للفيديو | 20 إلى 50 ج.م للصورة",
      "3 باقات توفيرية مصممة لمضاعفة وصول ومبيعات حساباتك",
    ],

    // 3 Content Packages
    contentPkg1Title: "باقة الانطلاق (Starter)",
    contentPkg1Price: "850 ج.م",
    contentPkg1Items: "5 ريلز فيديو AI + 10 بوستات وتصاميم",
    contentPkg1Desc: "مثالية لبدء إطلاق حساباتك على إنستجرام وتيك توك وفيسبوك بمحتوى مرئي عالي الجودة.",

    contentPkg2Title: "باقة النمو والمبيعات (Growth)",
    contentPkg2Badge: "الأكثر طلباً",
    contentPkg2Price: "2,150 ج.م",
    contentPkg2Items: "15 ريلز فيديو AI + 25 بوست وتصميم",
    contentPkg2Desc: "استهداف يومي للعملاء الجدد بمحتوى تفاعلي وسيناريوهات إعلانية ترفع المبيعات مباشرة.",

    contentPkg3Title: "باقة التوسع الشامل (Pro Scale)",
    contentPkg3Price: "3,750 ج.م",
    contentPkg3Items: "30 ريلز فيديو AI + 50 بوست وتصميم",
    contentPkg3Desc: "تغطية شهرية متكاملة لجميع منصاتك مع استراتيجية نشر تجعل براندك في الصدارة دائماً.",

    // Service 3: 3D Printing
    card2Category: "تصنيع سريع ودقيق",
    card2Title: "طباعة 3D دقيقة وواقعية",
    card2Price: "+ 150 ج.م شحن موحد",
    card2Desc: "أرسل ملف STL أو OBJ أو رسم تخطيطي. نراجع الأبعاد وحجم المادة الخام ونؤكد السعر مع توصيل لجميع محافظات مصر.",
    card2Features: [
      "دعم صيغ STL, OBJ, 3MF, STEP والصور التوضيحية",
      "تصنيع عالي الدقة بتقنيات FDM والريزن المتطورة",
      "تسعير عادل وشفاف حسب وزن الخامة وساعات الطباعة",
      "شحن سريع وموحّد 150 ج.م لجميع أنحاء مصر",
    ],

    // Trust strip
    trust1Title: "سرعة في التسليم",
    trust1Desc: "ملفات الهوية والمحتوى خلال 24 إلى 48 ساعة. تصنيع وشحن نماذج 3D خلال 48 إلى 72 ساعة.",
    trust2Title: "أسعار واضحة وثابتة",
    trust2Desc: "1,000 ج.م للهوية المتكاملة. من 100 لـ 200 ج.م للفيديو ومن 20 لـ 50 ج.م للصورة. شحن 3D موحد 150 ج.م.",
    trust3Title: "تواصل بشري مباشر",
    trust3Desc: "محادثة مباشرة عبر واتساب لتأكيد التفاصيل ومراجعة التعديلات والدفع عبر فودافون كاش أو إنستاباي.",

    // AI Templates Page
    templatesCatalogueEyebrow: "باقة إطلاق البراند",
    templatesPageTitle: "الهوية البصرية المتكاملة للمشاريع",
    templatesPageDesc: "كل ما تحتاجه لبدء علامتك التجارية: ملفات اللوجو الأصلية بجميع الصيغ، موك آبس واقعية، وأدلة الهوية الكاملة بسعر 1,000 ج.م فقط.",
    coreAiFoundation: "نص الأمر الهندسي الأساسي (Core Prompt)",
    noTemplates: "لا توجد نماذج مسجلة حالياً.",

    // Request Modal
    modalOrderInitiation: "بدء طلب الخدمة",
    modalRequestPrefix: "طلب",
    modalPriceNotice: "سعر باقة الهوية: 1,000 ج.م شاملة جميع الملفات والموك آبس.",
    modalFullName: "الاسم بالكامل *",
    modalFullNamePlaceholder: "مثال: مصطفى علي",
    modalPhone: "رقم الواتساب *",
    modalPhonePlaceholder: "مثال: 01012345678",
    modalDetails: "تفاصيل المشروع أو رؤية البراند",
    modalDetailsPlaceholder: "اكتب اسم مشروعك، نشاطه، أو أي ألوان مفضلة لديك...",
    modalHumanCheckLabel: "سؤال التحقق البشري (لمنع الإرسال المكرر) *",
    modalHumanCheckPlaceholder: "اكتب الإجابة هنا",
    modalSubmit: "تأكيد وإرسال الطلب",
    modalSuccessTitle: "تم استلام طلبك بنجاح.",
    modalSuccessDesc: "سنتواصل معك عبر واتساب فوراً لتأكيد التفاصيل وطريقة الدفع.",
    modalDone: "تم",

    // 3D Printing Page
    printPageEyebrow: "تصنيع ثلاثي الأبعاد حسب الطلب",
    printPageTitle: "ارفع ملفك. واحصل على عرض سعر.",
    printPageDesc: "أرسل ملف STL أو OBJ أو 3MF أو STEP أو PDF أو ZIP أو صورة مرجعية. نقوم بمراجعته وتحديد تكلفة الطباعة بدقة مع إضافة 150 ج.م مصاريف شحن موحدة.",
    printFormEyebrow: "طلب عرض سعر فوري",
    printFormTitle: "ارفع ملف التصميم",
    printFormDesc: "لا يوجد دفع الآن. نقوم بفحص النموذج وحساب حجم الخامة، ونرسل لك عرض السعر النهائي عبر واتساب.",
    printFormName: "اسمك الكريم *",
    printFormPhone: "رقم الواتساب *",
    printFormAddress: "عنوان التوصيل في مصر *",
    printFormAddressPlaceholder: "الشارع، رقم العمارة، الحي، المدينة",
    printFormDetails: "ملاحظات الخامة أو الاستخدام الوظيفي",
    printFormDetailsPlaceholder: "الخامة المفضلة (PLA, PETG, ABS, Resin)، اللون، نسبة الكثافة، أو متطلبات المتانة...",
    printFormFile: "ملف النموذج أو الرسم الفني (حتى 25 ميجابايت) *",
    printFormFileHelp: "يدعم: STL, OBJ, 3MF, STEP, STP, PDF, ZIP, PNG, JPG (حتى 25 ميجابايت)",
    printFormSubmit: "إرسال الملف للفحص والتسعير",
    printFormSuccessTitle: "تم استلام الملف بنجاح.",
    printFormSuccessDesc: "سنقوم بفحص ملفك ونتواصل معك عبر واتساب بتكلفة الطباعة الدقيقة بالإضافة إلى 150 ج.م مصاريف الشحن.",
    printSubmitAnother: "إرسال نموذج آخر",

    // How it works steps
    workflowEyebrow: "خطوات التنفيذ",
    workflowTitle: "كيف نعمل؟",
    step1Title: "رفع الملف",
    step1Desc: "ارفع النموذج أو الرسم الفني بصيغة STL, OBJ, STEP أو صورة توضيحية.",
    step2Title: "فحص الأبعاد والهندسة",
    step2Desc: "نتحقق من سماكة الجدران، ونحدد أفضل نسبة حشو (Infill) ونحسب كمية المادة الخام.",
    step3Title: "عرض السعر على واتساب",
    step3Desc: "تتلقى التكلفة الفعلية للطباعة بكل شفافية مع 150 ج.م رسوم توصيل ثابتة.",
    step4Title: "الطباعة والتصنيع الدقيق",
    step4Desc: "نطبع النموذج على طابعات صناعية معايرة تضمن قوة التماسك وجودة الأسطح.",
    step5Title: "التوصيل حتى باب المنزل",
    step5Desc: "تغليف آمن وشحن مباشر إلى عنوانك في أي مكان داخل جمهورية مصر العربية.",
    shippingBadge: "150 ج.م شحن موحد",
    turnaroundBadge: "وقت التنفيذ: 24 - 48 ساعة",

    // Admin
    adminPortal: "بوابة الإدارة",
    adminSignInTitle: "تسجيل دخول المسؤول",
    adminSignInDesc: "أدخل بريدك الإلكتروني وكلمة المرور للتحقق من صلاحية الإدارة.",
    adminEmailLabel: "البريد الإلكتروني للمسؤول",
    adminPasswordLabel: "كلمة المرور",
    adminAuthBtn: "تسجيل الدخول كمسؤول",
    adminControlCenter: "مركز التحكم والعمليات",
    adminDashboardTitle: "إدارة FluxFrame",
    adminTemplatesHeading: "نماذج وباقات الخدمات",
    adminRequestsHeading: "طلبات العملاء الواردة",
    refresh: "تحديث",
    signOut: "تسجيل الخروج",
    save: "حفظ",
    saved: "تم الحفظ",

    // Footer
    footerDesc: "هويات بصرية متكاملة (ملفات الشعار + موك آبس)، فيديوهات وبوستات سوشيال ميديا، وطباعة ثلاثية الأبعاد دقيقة.",
    footerSupport: "دعم عبر واتساب",
    footerCopy: "جميع الحقوق محفوظة © استوديو FluxFrame.",
    footerLocation: "القاهرة، مصر · باقة الهوية 1000 ج.م · شحن 3D موحد 150 ج.م",
  },
  en: {
    // Brand & General
    brandName: "FluxFrame",
    studio: "FluxFrame studio",
    tagline: "AI Brand Identities, Social Media Content, and 3D Printing.",
    taglineHighlight: "Engineered to stand out.",
    heroSubtitle: "Complete professional brand identities (all logo vector files + mockups) for 1,000 EGP. AI Reels videos & social media post designs. Precision 3D printing with 150 EGP flat shipping.",

    // Nav
    navHome: "Home",
    navTemplates: "Brand Identity",
    navContent: "AI Reels & Content",
    nav3DPrinting: "3D Printing",
    navAdmin: "Admin Portal",
    langToggle: "العربية",

    // CTA buttons
    exploreTemplates: "Full Identity Pack (1,000 EGP)",
    exploreContent: "AI Reels & Posts Packages",
    upload3DModel: "Order 3D Print",
    requestThisService: "Order This Package",
    submitFile: "Submit File for Review",
    viewTemplatesAndPrompts: "Full Brand Identity Specs",
    upload3DModelCta: "Upload 3D Model",

    // Service 1: Full Brand Identity Package (1000 EGP)
    card1Category: "Complete Startup Kit",
    card1Title: "Full Brand Identity & Assets",
    card1Price: "1,000 EGP",
    card1Desc: "Everything you need to launch your brand from scratch. Logo source vector files, realistic mockups, social covers, and full style guides.",
    card1Features: [
      "Primary & secondary logo files (Vector SVG, transparent PNG, high-res PDF)",
      "Photorealistic mockups (business cards, stationery, bags, packaging, signs, apparel)",
      "Social media profile avatars and cover banners for all platforms",
      "Brand Style Guide: color palettes, typography, and logo usage rules",
      "Full prompt engineering specs for consistent future AI asset generation",
      "Delivered print-ready and digital-ready within 24-48 hours",
    ],

    // Service 2: AI Reels & Social Media Posts
    cardContentCategory: "AI Content Studio",
    cardContentTitle: "AI Reels Videos & Social Posts",
    cardContentPrice: "From 100 EGP/video · From 20 EGP/image",
    cardContentDesc: "AI-generated Reels, Shorts, and viral social post creatives designed to boost brand awareness and convert followers into sales.",
    cardContentRateVideo: "100 to 200 EGP per video (Reels/Shorts)",
    cardContentRateImage: "20 to 50 EGP per post image design",
    cardContentFeatures: [
      "AI Reels videos with scriptwriting, AI voiceover, and dynamic visual hooks",
      "High-converting social media post designs matched to your brand identity",
      "Clear rates: 100 to 200 EGP per video | 20 to 50 EGP per image design",
      "3 value-packed bundles tailored to explode your engagement and sales",
    ],

    // 3 Content Packages
    contentPkg1Title: "Starter Content Pack",
    contentPkg1Price: "850 EGP",
    contentPkg1Items: "5 AI Reels + 10 Post Designs",
    contentPkg1Desc: "Perfect for launching your presence on Instagram, TikTok, and Facebook with consistent high-grade visuals.",

    contentPkg2Title: "Growth & Sales Pack",
    contentPkg2Badge: "Most Popular",
    contentPkg2Price: "2,150 EGP",
    contentPkg2Items: "15 AI Reels + 25 Post Designs",
    contentPkg2Desc: "Daily reach to acquire new customers with dynamic scripts and compelling marketing angles.",

    contentPkg3Title: "Pro Scale Pack",
    contentPkg3Price: "3,750 EGP",
    contentPkg3Items: "30 AI Reels + 50 Post Designs",
    contentPkg3Desc: "Full monthly omnichannel domination to ensure your brand stays on top of social feeds all month long.",

    // Service 3: 3D Printing
    card2Category: "Rapid Fabrication",
    card2Title: "Precision 3D Printing",
    card2Price: "+150 EGP flat delivery",
    card2Desc: "Send an STL, OBJ, or drawing. We review the geometry, calculate raw printing material costs, and ship right to your door anywhere in Egypt.",
    card2Features: [
      "Supports STL, OBJ, 3MF, STEP, and reference sketches",
      "High-precision FDM & Resin manufacturing",
      "Transparent print pricing per gram/hour",
      "Flat 150 EGP nationwide shipping",
    ],

    // Trust strip
    trust1Title: "Rapid Turnaround",
    trust1Desc: "Identity files & content delivered within 24 to 48 hours. 3D prints produced and shipped within 48 to 72 hours.",
    trust2Title: "Clear Transparent Rates",
    trust2Desc: "1,000 EGP for full identity. 100 to 200 EGP per video, 20 to 50 EGP per post image. Flat 150 EGP 3D delivery.",
    trust3Title: "Direct WhatsApp Chat",
    trust3Desc: "Confirm details, review drafts, and settle payments easily via Vodafone Cash or InstaPay.",

    // AI Templates Page
    templatesCatalogueEyebrow: "Brand Launch Kit",
    templatesPageTitle: "Full Brand Identity Packages",
    templatesPageDesc: "Everything you need to start your brand: logo source files, realistic mockups, and complete brand style guidelines for 1,000 EGP flat.",
    coreAiFoundation: "Core AI Prompt Foundation",
    noTemplates: "No templates found.",

    // Request Modal
    modalOrderInitiation: "Order Initiation",
    modalRequestPrefix: "Order",
    modalPriceNotice: "Full Identity Package: 1,000 EGP flat with all source files and mockups included.",
    modalFullName: "Your Full Name *",
    modalFullNamePlaceholder: "e.g. Mostafa Ali",
    modalPhone: "WhatsApp Phone Number *",
    modalPhonePlaceholder: "e.g. 01012345678",
    modalDetails: "Project Details / Brand Vision",
    modalDetailsPlaceholder: "Brand name, industry, preferred style, or color vision...",
    modalHumanCheckLabel: "Human Verification (Prevents Duplication) *",
    modalHumanCheckPlaceholder: "Write the answer here",
    modalSubmit: "Confirm & Submit Order",
    modalSuccessTitle: "Order received successfully.",
    modalSuccessDesc: "We’ll contact you on WhatsApp right away to confirm details and start production.",
    modalDone: "Done",

    // 3D Printing Page
    printPageEyebrow: "On-Demand 3D Fabrication",
    printPageTitle: "Upload your file. Get a quote.",
    printPageDesc: "Send an STL, OBJ, 3MF, STEP, PDF, ZIP or reference image. We review it, confirm the printing cost, and add a flat 150 EGP delivery fee.",
    printFormEyebrow: "Direct Quote Request",
    printFormTitle: "Upload your file.",
    printFormDesc: "No payment right now. We inspect your geometry, calculate material volume, and message you with the exact print quote.",
    printFormName: "Your Name *",
    printFormPhone: "WhatsApp Phone *",
    printFormAddress: "Delivery Address *",
    printFormAddressPlaceholder: "Street address, building, city (Egypt)",
    printFormDetails: "Material, Infill or Functional Notes",
    printFormDetailsPlaceholder: "Desired material (PLA, PETG, ABS, Resin), color preference, quantity, or mechanical tolerance requirements...",
    printFormFile: "3D Model or Specification File (max 25 MB) *",
    printFormFileHelp: "Accepts: STL, OBJ, 3MF, STEP, STP, PDF, ZIP, PNG, JPG (up to 25 MB)",
    printFormSubmit: "Submit File for Review",
    printFormSuccessTitle: "File received successfully.",
    printFormSuccessDesc: "We’ll review it and contact you on WhatsApp with the print cost plus the 150 EGP delivery fee.",
    printSubmitAnother: "Submit another model",

    // How it works steps
    workflowEyebrow: "Manufacturing Workflow",
    workflowTitle: "How it works",
    step1Title: "File Upload",
    step1Desc: "Upload STL, OBJ, 3MF, STEP, or image references (up to 25 MB).",
    step2Title: "Geometry Inspection",
    step2Desc: "We verify wall thicknesses, select optimal infill percentage, and calculate filament volume.",
    step3Title: "Direct WhatsApp Quote",
    step3Desc: "You receive the exact raw material/print cost plus our flat 150 EGP delivery fee.",
    step4Title: "Precision Fabrication",
    step4Desc: "Manufactured on calibrated industrial printers with strict layer adhesion standards.",
    step5Title: "Doorstep Delivery",
    step5Desc: "Carefully boxed and shipped right to your address anywhere in Egypt.",
    shippingBadge: "150 EGP flat shipping",
    turnaroundBadge: "Turnaround: 24 - 48h",

    // Admin
    adminPortal: "Admin Portal",
    adminSignInTitle: "Admin Sign In",
    adminSignInDesc: "Enter your admin email and password. Custom claims are strictly enforced.",
    adminEmailLabel: "Admin Email",
    adminPasswordLabel: "Password",
    adminAuthBtn: "Authenticate as Admin",
    adminControlCenter: "Control Center",
    adminDashboardTitle: "FluxFrame Administration",
    adminTemplatesHeading: "Service Packages & Prompts",
    adminRequestsHeading: "Customer Inquiries & Orders",
    refresh: "Refresh",
    signOut: "Sign Out",
    save: "Save",
    saved: "Saved",

    // Footer
    footerDesc: "Complete brand identities (logo files + mockups), AI Reels & social posts, and precision 3D printing.",
    footerSupport: "WhatsApp Support",
    footerCopy: "All rights reserved © FluxFrame studio.",
    footerLocation: "Cairo, Egypt · Full Identity 1,000 EGP · Flat 150 EGP 3D Delivery",
  },
};
