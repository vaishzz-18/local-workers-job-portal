import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        login: "Sign in",
        register: "Get Started",
        logout: "Logout",
        dashboard: "Dashboard",
      },
      home: {
        hero_title_1: "Find Local Work.",
        hero_title_2: "Hire Local Talent.",
        hero_subtitle:
          "The direct and transparent platform connecting skilled local workers with employers. No middlemen, fair wages, decent work for all.",
        btn_work: "I want to work",
        btn_hire: "I want to hire",
        stats_jobs: "Jobs Matched",
        stats_workers: "Verified Workers",
        stats_employers: "Active Employers",
        stats_rating: "Average Rating",
        why_choose: "Why choose LocalWorks?",
        feature1_title: "Transparent Hiring",
        feature1_desc:
          "Direct connection between employers and workers with zero hidden agency fees.",
        feature2_title: "Easy Discovery",
        feature2_desc:
          "Find verified local electricians, plumbers, carpenters, and more in minutes.",
        feature3_title: "Community Growth",
        feature3_desc:
          "Supporting SDG 8 by promoting inclusive and sustainable economic growth locally.",
        cta_title: "Ready to get started?",
        cta_desc:
          "Join thousands of users who have found success on LocalWorks.",
        how_it_works: "How it works",
        step1: "Create an Account",
        step1_desc: "Sign up as a worker or employer in seconds.",
        step2: "Browse or Post",
        step2_desc: "Explore available jobs or post your hiring needs.",
        step3: "Connect & Succeed",
        step3_desc: "Message, hire, and complete the job directly.",
      },
    },
  },
  es: {
    translation: {
      nav: {
        login: "Iniciar sesión",
        register: "Comenzar",
        logout: "Cerrar sesión",
        dashboard: "Panel",
      },
      home: {
        hero_title_1: "Encuentra Trabajo Local.",
        hero_title_2: "Contrata Talento Local.",
        hero_subtitle:
          "La plataforma directa y transparente que conecta trabajadores locales cualificados con empleadores. Sin intermediarios, salarios justos, trabajo decente para todos.",
        btn_work: "Quiero trabajar",
        btn_hire: "Quiero contratar",
        stats_jobs: "Trabajos Conectados",
        stats_workers: "Trabajadores Verificados",
        stats_employers: "Empleadores Activos",
        stats_rating: "Calificación Media",
        why_choose: "¿Por qué elegir LocalWorks?",
        feature1_title: "Contratación Transparente",
        feature1_desc:
          "Conexión directa entre empleadores y trabajadores con cero tarifas ocultas de agencia.",
        feature2_title: "Descubrimiento Fácil",
        feature2_desc:
          "Encuentra electricistas, fontaneros, carpinteros y más verificados en minutos.",
        feature3_title: "Crecimiento Comunitario",
        feature3_desc:
          "Apoyando el ODS 8 promoviendo un crecimiento económico inclusivo y sostenible.",
        cta_title: "¿Listo para comenzar?",
        cta_desc:
          "Únete a miles de usuarios que han tenido éxito en LocalWorks.",
        how_it_works: "Cómo funciona",
        step1: "Crear una cuenta",
        step1_desc: "Regístrate como trabajador o empleador en segundos.",
        step2: "Navegar o Publicar",
        step2_desc: "Explora trabajos disponibles o publica tus necesidades.",
        step3: "Conecta y Triunfa",
        step3_desc:
          "Envía mensajes, contrata y completa el trabajo directamente.",
      },
    },
  },
  fr: {
    translation: {
      nav: {
        login: "Se connecter",
        register: "Commencer",
        logout: "Se déconnecter",
        dashboard: "Tableau de bord",
      },
      home: {
        hero_title_1: "Trouvez un travail local.",
        hero_title_2: "Embauchez des talents locaux.",
        hero_subtitle:
          "La plateforme directe et transparente reliant les travailleurs locaux qualifiés aux employeurs. Pas d'intermédiaires, salaires équitables, travail décent pour tous.",
        btn_work: "Je veux travailler",
        btn_hire: "Je veux embaucher",
        stats_jobs: "Emplois Associés",
        stats_workers: "Travailleurs Vérifiés",
        stats_employers: "Employeurs Actifs",
        stats_rating: "Note Moyenne",
        why_choose: "Pourquoi choisir LocalWorks?",
        feature1_title: "Embauche Transparente",
        feature1_desc:
          "Connexion directe entre employeurs et travailleurs sans frais d'agence cachés.",
        feature2_title: "Découverte Facile",
        feature2_desc:
          "Trouvez des électriciens, plombiers, charpentiers et autres vérifiés en quelques minutes.",
        feature3_title: "Croissance Communautaire",
        feature3_desc:
          "Soutenir l'ODD 8 en promouvant une croissance économique inclusive et durable.",
        cta_title: "Prêt à commencer?",
        cta_desc:
          "Rejoignez des milliers d'utilisateurs qui ont réussi sur LocalWorks.",
        how_it_works: "Comment ça marche",
        step1: "Créer un compte",
        step1_desc:
          "Inscrivez-vous comme travailleur ou employeur en quelques secondes.",
        step2: "Parcourir ou Publier",
        step2_desc: "Explorez les emplois disponibles ou publiez vos besoins.",
        step3: "Connectez & Réussissez",
        step3_desc:
          "Envoyez des messages, embauchez et terminez le travail directement.",
      },
    },
  },
  hi: {
    translation: {
      nav: {
        login: "लॉग इन करें",
        register: "शुरू करें",
        logout: "लॉग आउट",
        dashboard: "डैशबोर्ड",
      },
      home: {
        hero_title_1: "स्थानीय काम खोजें।",
        hero_title_2: "स्थानीय प्रतिभा को काम पर रखें।",
        hero_subtitle:
          "कुशल स्थानीय श्रमिकों को नियोक्ताओं से जोड़ने वाला सीधा और पारदर्शी मंच। कोई बिचौलिया नहीं, उचित वेतन, सभी के लिए सम्मानजनक काम।",
        btn_work: "मैं काम करना चाहता हूँ",
        btn_hire: "मैं काम पर रखना चाहता हूँ",
        stats_jobs: "नौकरियां मिलीं",
        stats_workers: "सत्यापित श्रमिक",
        stats_employers: "सक्रिय नियोक्ता",
        stats_rating: "औसत रेटिंग",
        why_choose: "LocalWorks क्यों चुनें?",
        feature1_title: "पारदर्शी नियुक्ति",
        feature1_desc:
          "शून्य छिपी एजेंसी फीस के साथ नियोक्ताओं और श्रमिकों के बीच सीधा संबंध।",
        feature2_title: "आसान खोज",
        feature2_desc:
          "सत्यापित स्थानीय इलेक्ट्रीशियन, प्लंबर, बढ़ई और बहुत कुछ मिनटों में खोजें।",
        feature3_title: "सामुदायिक विकास",
        feature3_desc:
          "स्थानीय स्तर पर समावेशी और सतत आर्थिक विकास को बढ़ावा देकर SDG 8 का समर्थन करना।",
        cta_title: "शुरू करने के लिए तैयार हैं?",
        cta_desc:
          "उन हजारों उपयोगकर्ताओं से जुड़ें जिन्होंने LocalWorks पर सफलता पाई है।",
        how_it_works: "यह कैसे काम करता है",
        step1: "खाता बनाएँ",
        step1_desc:
          "सेकंडों में एक कार्यकर्ता या नियोक्ता के रूप में साइन अप करें।",
        step2: "ब्राउज़ करें या पोस्ट करें",
        step2_desc:
          "उपलब्ध नौकरियों का अन्वेषण करें या अपनी भर्ती आवश्यकताओं को पोस्ट करें।",
        step3: "जुड़ें और सफल हों",
        step3_desc: "संदेश भेजें, किराए पर लें और सीधे काम पूरा करें।",
      },
    },
  },
  kn: {
    translation: {
      nav: {
        login: "ಸೈನ್ ಇನ್",
        register: "ಪ್ರಾರಂಭಿಸಿ",
        logout: "ಲಾಗ್ ಔಟ್",
        dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      },
      home: {
        hero_title_1: "ಸ್ಥಳೀಯ ಕೆಲಸವನ್ನು ಹುಡುಕಿ.",
        hero_title_2: "ಸ್ಥಳೀಯ ಪ್ರತಿಭೆಗಳನ್ನು ನೇಮಿಸಿ.",
        hero_subtitle:
          "ನುರಿತ ಸ್ಥಳೀಯ ಕಾರ್ಮಿಕರನ್ನು ಉದ್ಯೋಗದಾತರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ನೇರ ಮತ್ತು ಪಾರದರ್ಶಕ ವೇದಿಕೆ. ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ, ನ್ಯಾಯಯುತ ವೇತನ, ಎಲ್ಲರಿಗೂ ಯೋಗ್ಯವಾದ ಕೆಲಸ.",
        btn_work: "ನಾನು ಕೆಲಸ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ",
        btn_hire: "ನಾನು ನೇಮಿಸಿಕೊಳ್ಳಲು ಬಯಸುತ್ತೇನೆ",
        stats_jobs: "ಕೆಲಸಗಳು ಹೊಂದಾಣಿಕೆಯಾಗಿವೆ",
        stats_workers: "ಪರಿಶೀಲಿಸಿದ ಕೆಲಸಗಾರರು",
        stats_employers: "ಸಕ್ರಿಯ ಉದ್ಯೋಗದಾತರು",
        stats_rating: "ಸರಾಸರಿ ರೇಟಿಂಗ್",
        why_choose: "LocalWorks ಅನ್ನು ಏಕೆ ಆರಿಸಬೇಕು?",
        feature1_title: "ಪಾರದರ್ಶಕ ನೇಮಕಾತಿ",
        feature1_desc:
          "ಯಾವುದೇ ಗುಪ್ತ ಏಜೆನ್ಸಿ ಶುಲ್ಕವಿಲ್ಲದೆ ಉದ್ಯೋಗದಾತರು ಮತ್ತು ಕಾರ್ಮಿಕರ ನಡುವೆ ನೇರ ಸಂಪರ್ಕ.",
        feature2_title: "ಸುಲಭ ಹುಡುಕಾಟ",
        feature2_desc:
          "ನಿಮಿಷಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿದ ಸ್ಥಳೀಯ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್‌ಗಳು, ಪ್ಲಂಬರ್‌ಗಳು, ಬಡಗಿಗಳು ಮತ್ತು ಹೆಚ್ಚಿನವರನ್ನು ಹುಡುಕಿ.",
        feature3_title: "ಸಮುದಾಯದ ಬೆಳವಣಿಗೆ",
        feature3_desc:
          "ಸ್ಥಳೀಯವಾಗಿ ಒಳಗೊಳ್ಳುವ ಮತ್ತು ಸುಸ್ಥಿರ ಆರ್ಥಿಕ ಬೆಳವಣಿಗೆಯನ್ನು ಉತ್ತೇಜಿಸುವ ಮೂಲಕ SDG 8 ಅನ್ನು ಬೆಂಬಲಿಸುವುದು.",
        cta_title: "ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
        cta_desc: "LocalWorks ನಲ್ಲಿ ಯಶಸ್ಸು ಕಂಡ ಸಾವಿರಾರು ಬಳಕೆದಾರರನ್ನು ಸೇರಿ.",
        how_it_works: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
        step1: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
        step1_desc: "ಕೆಲಸಗಾರ ಅಥವಾ ಉದ್ಯೋಗದಾತರಾಗಿ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸೈನ್ ಅಪ್ ಮಾಡಿ.",
        step2: "ಬ್ರೌಸ್ ಮಾಡಿ ಅಥವಾ ಪೋಸ್ಟ್ ಮಾಡಿ",
        step2_desc:
          "ಲಭ್ಯವಿರುವ ಉದ್ಯೋಗಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಅಥವಾ ನಿಮ್ಮ ನೇಮಕಾತಿ ಅಗತ್ಯಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ.",
        step3: "ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ಯಶಸ್ವಿಯಾಗಿ",
        step3_desc: "ಸಂದೇಶ, ನೇಮಕ, ಮತ್ತು ಕೆಲಸವನ್ನು ನೇರವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿ.",
      },
    },
  },
  mr: {
    translation: {
      nav: {
        login: "साइन इन करा",
        register: "सुरू करा",
        logout: "लॉग आउट",
        dashboard: "डॅशबोर्ड",
      },
      home: {
        hero_title_1: "स्थानिक काम शोधा.",
        hero_title_2: "स्थानिक प्रतिभा नियुक्त करा.",
        hero_subtitle:
          "कुशल स्थानिक कामगारांना नियोक्त्यांशी जोडणारे थेट आणि पारदर्शक व्यासपीठ. कोणतेही मध्यस्थ नाहीत, योग्य वेतन, सर्वांसाठी सभ्य काम.",
        btn_work: "मला काम करायचे आहे",
        btn_hire: "मला कामावर ठेवायचे आहे",
        stats_jobs: "नोकर्‍या जुळल्या",
        stats_workers: "सत्यापित कामगार",
        stats_employers: "सक्रिय नियोक्ते",
        stats_rating: "सरासरी रेटिंग",
        why_choose: "LocalWorks का निवडावे?",
        feature1_title: "पारदर्शक नियुक्ती",
        feature1_desc:
          "कोणत्याही छुप्या एजन्सी शुल्काशिवाय नियोक्ते आणि कामगार यांच्यात थेट संबंध.",
        feature2_title: "सोपा शोध",
        feature2_desc:
          "काही मिनिटांत सत्यापित स्थानिक इलेक्ट्रिशियन, प्लंबर, सुतार आणि बरेच काही शोधा.",
        feature3_title: "सामुदायिक वाढ",
        feature3_desc:
          "स्थानिक पातळीवर सर्वसमावेशक आणि शाश्वत आर्थिक विकासाला चालना देऊन SDG 8 ला समर्थन देणे.",
        cta_title: "सुरू करण्यास तयार आहात?",
        cta_desc:
          "LocalWorks वर यश मिळवलेल्या हजारो वापरकर्त्यांमध्ये सामील व्हा.",
        how_it_works: "हे कसे कार्य करते",
        step1: "खाते तयार करा",
        step1_desc: "काही सेकंदात कामगार किंवा नियोक्ता म्हणून साइन अप करा.",
        step2: "ब्राउझ करा किंवा पोस्ट करा",
        step2_desc:
          "उपलब्ध नोकऱ्या एक्सप्लोर करा किंवा तुमच्या नियुक्तीच्या गरजा पोस्ट करा.",
        step3: "कनेक्ट करा आणि यशस्वी व्हा",
        step3_desc: "संदेश पाठवा, कामावर ठेवा आणि थेट काम पूर्ण करा.",
      },
    },
  },
  bn: {
    translation: {
      nav: {
        login: "লগ ইন",
        register: "শুরু করুন",
        logout: "লগ আউট",
        dashboard: "ড্যাশবোর্ড",
      },
      home: {
        hero_title_1: "স্থানীয় কাজ খুঁজুন।",
        hero_title_2: "স্থানীয় প্রতিভা নিয়োগ করুন।",
        hero_subtitle:
          "দক্ষ স্থানীয় কর্মীদের নিয়োগকর্তাদের সাথে যুক্ত করার সরাসরি এবং স্বচ্ছ প্ল্যাটফর্ম। কোনো মধ্যস্বত্বভোগী নেই, ন্যায্য মজুরি, সবার জন্য শালীন কাজ।",
        btn_work: "আমি কাজ করতে চাই",
        btn_hire: "আমি নিয়োগ করতে চাই",
        stats_jobs: "কাজ মিলেছে",
        stats_workers: "যাচাইকৃত কর্মী",
        stats_employers: "সক্রিয় নিয়োগকর্তা",
        stats_rating: "গড় রেটিং",
        why_choose: "LocalWorks কেন বেছে নেবেন?",
        feature1_title: "স্বচ্ছ নিয়োগ",
        feature1_desc:
          "কোনো লুকানো এজেন্সি ফি ছাড়াই নিয়োগকর্তা এবং কর্মীদের মধ্যে সরাসরি যোগাযোগ।",
        feature2_title: "সহজ আবিষ্কার",
        feature2_desc:
          "মিনিটের মধ্যে যাচাইকৃত স্থানীয় ইলেকট্রিশিয়ান, প্লাম্বার, ছুতোর এবং আরও অনেক কিছু খুঁজুন।",
        feature3_title: "সম্প্রদায়ের বৃদ্ধি",
        feature3_desc:
          "স্থানীয়ভাবে অন্তর্ভুক্তিমূলক এবং টেকসই অর্থনৈতিক প্রবৃদ্ধির প্রচারে SDG 8-কে সমর্থন করা।",
        cta_title: "শুরু করতে প্রস্তুত?",
        cta_desc:
          "হাজার হাজার ব্যবহারকারীদের সাথে যোগ দিন যারা LocalWorks এ সাফল্য পেয়েছেন।",
        how_it_works: "এটি কিভাবে কাজ করে",
        step1: "একটি অ্যাকাউন্ট তৈরি করুন",
        step1_desc:
          "সেকেন্ডের মধ্যে একজন কর্মী বা নিয়োগকর্তা হিসাবে সাইন আপ করুন।",
        step2: "ব্রাউজ বা পোস্ট করুন",
        step2_desc:
          "উপলব্ধ কাজ অন্বেষণ করুন বা আপনার নিয়োগের প্রয়োজন পোস্ট করুন।",
        step3: "সংযুক্ত হন এবং সফল হন",
        step3_desc: "বার্তা পাঠান, নিয়োগ করুন এবং সরাসরি কাজ সম্পন্ন করুন।",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
