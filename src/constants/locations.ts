export type Location = {
  id: number;
  name: string;
  coords: [number, number];
};

export const locations: Location[] = [
  { id: 1, name: "حي قاع القرين", coords: [31.312136, 34.322571] },
  { id: 2, name: "حي المنارة", coords: [31.312481, 34.308956] },
  { id: 3, name: "حي البطن السمين", coords: [31.338725, 34.293492] },
  { id: 4, name: "حي المواصي الجنوبي", coords: [31.350169, 34.257856] },
  { id: 5, name: "حي قيزان أبو رشوان", coords: [31.32892, 34.283064] },
  { id: 6, name: "حي جورت اللوت", coords: [31.332005, 34.303409] },
  { id: 7, name: "حي السلام", coords: [31.303201, 34.293245] },
  { id: 8, name: "حي قيزان النجار", coords: [31.320056, 34.293727] },
  { id: 9, name: "حي المواصي الشمالي", coords: [31.378993, 34.291451] },
  { id: 10, name: "حي التحرير", coords: [31.341646, 34.271494] },
  { id: 11, name: "حي السطر", coords: [31.363714, 34.321218] },
  { id: 12, name: "حي معن", coords: [31.329971, 34.31607] },
  { id: 13, name: "حي الجلاء", coords: [31.377936, 34.312917] },
  { id: 14, name: "حي النصر", coords: [31.364591, 34.292537] },
  { id: 15, name: "حي الأمل", coords: [31.356017, 34.298724] },
  { id: 16, name: "حي المعسكر", coords: [31.348462, 34.292917] },
  { id: 17, name: "حي مركز المدينة", coords: [31.343805, 34.302888] },
  { id: 18, name: "حي الكتيبة", coords: [31.356724, 34.307157] },
  { id: 19, name: "حي المحطة", coords: [31.350257, 34.312577] },
  { id: 20, name: "حي الشيخ ناصر", coords: [31.340147, 34.311497] },
];

export const landmarks:any = {
  "15": [
    {
      "landmark": "بركة حي الأمل + متنزه",
      "latitude": "31.359859",
      "longitude": "34.300861"
    },
    {
      "landmark": "بئر مياه الامل اوبك",
      "latitude": "31.357212",
      "longitude": "34.296329"
    },
    {
      "landmark": "جمعية اتحاد العمل النسائي",
      "latitude": "31.357325",
      "longitude": "34.302186"
    },
    {
      "landmark": "جمعية الامل لرعاية الاطفال",
      "latitude": "31.352949",
      "longitude": "34.295531"
    },
    {
      "landmark": "جمعية الهلال الاحمر الفلسطينى",
      "latitude": "31.351577",
      "longitude": "34.297138"
    },
    {
      "landmark": "حديقة ابو زيادة",
      "latitude": "31.354707",
      "longitude": "34.29647"
    },
    {
      "landmark": "حديقة البياره محمد عساف",
      "latitude": "31.353029",
      "longitude": "34.299205"
    },
    {
      "landmark": "حديقة الطفل \"عبد الهادي",
      "latitude": "31.356979",
      "longitude": "34.29631"
    },
    {
      "landmark": "روضة طيور الجنة",
      "latitude": "31.351862",
      "longitude": "34.29599"
    },
    {
      "landmark": "مدرسة هارون الرشيد الثانوية للبنين أ و ب",
      "latitude": "31.35612",
      "longitude": "34.29733"
    },
    {
      "landmark": "مدرسه طبريا الثانويه والاساسيه للبنات",
      "latitude": "31.356089",
      "longitude": "34.299991"
    },
    {
      "landmark": "مدرسه عبد الله صيام الاساسيه للبنين",
      "latitude": "31.355739",
      "longitude": "34.299563"
    },
    {
      "landmark": "مستشفى الامل",
      "latitude": "31.350929",
      "longitude": "34.298005"
    },
    {
      "landmark": "مسجد ابو ذر الغفاري",
      "latitude": "31.355504",
      "longitude": "34.29514"
    },
    {
      "landmark": "مسجد الإمام حسن البنا",
      "latitude": "31.355549",
      "longitude": "34.299945"
    },
    {
      "landmark": "مسجد الرحمه حي الامل",
      "latitude": "31.352098",
      "longitude": "34.295701"
    },
    {
      "landmark": "مسجد حمزه",
      "latitude": "31.358568",
      "longitude": "34.297674"
    },
    {
      "landmark": "مسجد علي بن ابي طالب",
      "latitude": "31.357179",
      "longitude": "34.30274"
    },
    {
      "landmark": "منتزة الشهيد أشرف الطيبي",
      "latitude": "31.357024",
      "longitude": "34.298398"
    },
    {
      "landmark": "منتزة الشهيد رامي سلامة",
      "latitude": "31.356919",
      "longitude": "34.300381"
    },
    {
      "landmark": "منتزة الشهيد هشام ابوعامر",
      "latitude": "31.352283",
      "longitude": "34.298583"
    },
    {
      "landmark": "منتزة حي الأمل المركزي",
      "latitude": "31.35807",
      "longitude": "34.297263"
    },
    {
      "landmark": "منتزه الشهيد رياض ياسين",
      "latitude": "31.354966",
      "longitude": "34.298751"
    },
    {
      "landmark": "منتزه الشهيد قنن",
      "latitude": "31.353935",
      "longitude": "34.295857"
    },
    {
      "landmark": "منتزه الشهيد محمود طومان",
      "latitude": "31.357764",
      "longitude": "34.299018"
    },
    {
      "landmark": "منتزه الشهيد مهند محارب",
      "latitude": "31.354128",
      "longitude": "34.300112"
    },
    {
      "landmark": "منتزه الشهيده حجو",
      "latitude": "31.355115",
      "longitude": "34.294926"
    }
  ],
  "3": [
    {
      "landmark": "المقبرة العامة",
      "latitude": "31.34156",
      "longitude": "34.288973"
    },
    {
      "landmark": "المقبرة العامة",
      "latitude": "31.341695",
      "longitude": "34.292258"
    },
    {
      "landmark": "بئر مياه عيا",
      "latitude": "31.339291",
      "longitude": "34.296028"
    },
    {
      "landmark": "جمعية الثقافة والفكر الحر",
      "latitude": "31.335457",
      "longitude": "34.2976"
    },
    {
      "landmark": "محطة صرف صحي المقابر",
      "latitude": "31.34311",
      "longitude": "34.291964"
    },
    {
      "landmark": "محطه البطن السمين للصرف الصحة",
      "latitude": "31.33588",
      "longitude": "34.291148"
    },
    {
      "landmark": "مدرسة الاسراء الثانوية",
      "latitude": "31.344547",
      "longitude": "34.289702"
    },
    {
      "landmark": "مدرسة طارق بن زياد الأساسيه المشتركه",
      "latitude": "31.34264",
      "longitude": "34.29294"
    },
    {
      "landmark": "مدرسة عبد الرحمن الأغا الثانوية للبنات",
      "latitude": "31.337245",
      "longitude": "34.29933"
    },
    {
      "landmark": "مدرسة محمود المبحوح",
      "latitude": "31.344311",
      "longitude": "34.290145"
    },
    {
      "landmark": "مركز تاهيل الفتيان والفتيات",
      "latitude": "31.344656",
      "longitude": "34.291181"
    },
    {
      "landmark": "مركز تدريب مهني",
      "latitude": "31.344964",
      "longitude": "34.291353"
    },
    {
      "landmark": "مسجد ابو فطاير",
      "latitude": "31.341278",
      "longitude": "34.299045"
    },
    {
      "landmark": "مسجد اسامة بن زياد",
      "latitude": "31.33754",
      "longitude": "34.299115"
    },
    {
      "landmark": "مسجد السلام",
      "latitude": "31.341107",
      "longitude": "34.293383"
    },
    {
      "landmark": "مسجد المجاهدين",
      "latitude": "31.342776",
      "longitude": "34.292384"
    },
    {
      "landmark": "مسجد النبي داوود",
      "latitude": "31.340472",
      "longitude": "34.295524"
    },
    {
      "landmark": "مسجد النصر",
      "latitude": "31.339212",
      "longitude": "34.286843"
    },
    {
      "landmark": "مسجد حذيفه بن اليمان",
      "latitude": "31.335542",
      "longitude": "34.295572"
    },
    {
      "landmark": "مسجد حمدان المصري",
      "latitude": "31.335186",
      "longitude": "34.291706"
    },
    {
      "landmark": "مسجد خالد بن الوليد",
      "latitude": "31.338217",
      "longitude": "34.296168"
    },
    {
      "landmark": "مسجد دار الحديث",
      "latitude": "31.339973",
      "longitude": "34.30127"
    },
    {
      "landmark": "مسجد عبد الرحمن بن عوف",
      "latitude": "31.336805",
      "longitude": "34.292917"
    },
    {
      "landmark": "مسجد فلسطين",
      "latitude": "31.34273",
      "longitude": "34.296324"
    }
  ],
  "10": [
    {
      "landmark": "الكلية الجامعية للعلوم التطبيقية",
      "latitude": "31.354277",
      "longitude": "34.27123"
    },
    {
      "landmark": "المجلس الاعلى للقضاء الشرعي",
      "latitude": "31.354405",
      "longitude": "34.280635"
    },
    {
      "landmark": "المسلخ البلدي",
      "latitude": "31.340124",
      "longitude": "34.28425"
    },
    {
      "landmark": "المنتزه الاقليمي",
      "latitude": "31.336559",
      "longitude": "34.258427"
    },
    {
      "landmark": "بركة الامل لتجميع الامطار",
      "latitude": "31.347774",
      "longitude": "34.287987"
    },
    {
      "landmark": "بئر مياه التركي",
      "latitude": "31.356771",
      "longitude": "34.272049"
    },
    {
      "landmark": "بئر مياه الرحمة",
      "latitude": "31.335822",
      "longitude": "34.281806"
    },
    {
      "landmark": "بئر مياه الكويتي",
      "latitude": "31.333026",
      "longitude": "34.279555"
    },
    {
      "landmark": "بئر مياه النعيم",
      "latitude": "31.331094",
      "longitude": "34.277792"
    },
    {
      "landmark": "بئر مياه تيكا التركي",
      "latitude": "31.355738",
      "longitude": "34.277102"
    },
    {
      "landmark": "جامعة الاقصي",
      "latitude": "31.355906",
      "longitude": "34.274707"
    },
    {
      "landmark": "حديقة النمساوي العامة",
      "latitude": "31.344468",
      "longitude": "34.287693"
    },
    {
      "landmark": "قوات التدخل وحفظ النظام",
      "latitude": "31.353431",
      "longitude": "34.281876"
    },
    {
      "landmark": "مبنى مصلحة مياه بلديات الساحل",
      "latitude": "31.354705",
      "longitude": "34.278174"
    },
    {
      "landmark": "مجمع الصحابه الطبي مستشفى الخير",
      "latitude": "31.354075",
      "longitude": "34.280384"
    },
    {
      "landmark": "مركز شرطة غرب خان يونس",
      "latitude": "31.354048",
      "longitude": "34.281216"
    },
    {
      "landmark": "مسجد الالباني",
      "latitude": "31.345395",
      "longitude": "34.288177"
    },
    {
      "landmark": "منتزه دوار النجمة",
      "latitude": "31.356049",
      "longitude": "34.278741"
    }
  ],
  "13": [
    {
      "landmark": "UNDP محطة ",
      "latitude": "31.370886",
      "longitude": "34.310537"
    },
    {
      "landmark": "اكاديمية فلسطين للعلوم الأمنية",
      "latitude": "31.370246",
      "longitude": "34.312748"
    },
    {
      "landmark": "الاكاديمية العلمية للتطوير والتنمية",
      "latitude": "31.371837",
      "longitude": "34.311175"
    },
    {
      "landmark": "بئر تيكا 1",
      "latitude": "31.373967",
      "longitude": "34.311874"
    },
    {
      "landmark": "بئر تيكا 2",
      "latitude": "31.375032",
      "longitude": "34.316162"
    },
    {
      "landmark": "بئر مياه مدينة حمد 1",
      "latitude": "31.377229",
      "longitude": "34.318168"
    },
    {
      "landmark": "بئر مياه مدينة حمد 2",
      "latitude": "31.374307",
      "longitude": "34.319409"
    },
    {
      "landmark": "جامعة القدس المفتوحة",
      "latitude": "31.372429",
      "longitude": "34.310145"
    },
    {
      "landmark": "جمعية دار القرآن الكريم والسنة",
      "latitude": "31.371826",
      "longitude": "34.307913"
    },
    {
      "landmark": "جمعيه اعمار للتنمية والتاهيل",
      "latitude": "31.369493",
      "longitude": "34.31165"
    },
    {
      "landmark": "خزان السطر 1  ",
      "latitude": "31.372128",
      "longitude": "34.307328"
    },
    {
      "landmark": "خزان السطر 2",
      "latitude": "31.374781",
      "longitude": "34.3048"
    },
    {
      "landmark": "خزان جديد",
      "latitude": "31.373308",
      "longitude": "34.306795"
    },
    {
      "landmark": "روضة مدينة حمد",
      "latitude": "31.375443",
      "longitude": "34.318298"
    },
    {
      "landmark": "شركة غزة نظيفة وامنة بيئيا",
      "latitude": "31.377032",
      "longitude": "34.322774"
    },
    {
      "landmark": "مدرسة الشيخ حمد بن خليفة آل ثاني الأساسية للبنات",
      "latitude": "31.375484",
      "longitude": "34.319437"
    },
    {
      "landmark": "مدرسة الشيخ حمد بن خليفة آل ثاني الأساسية للبنين",
      "latitude": "31.375107",
      "longitude": "34.318696"
    },
    {
      "landmark": "مسجد الشيخ حمد آل ثاني",
      "latitude": "31.375976",
      "longitude": "34.317878"
    },
    {
      "landmark": "مسجد حي الاسلام",
      "latitude": "31.371094",
      "longitude": "34.309262"
    }
  ],
  "11": [
    {
      "landmark": "المجمع الاسلامي مدرسه الاقصى",
      "latitude": "31.366263",
      "longitude": "34.314116"
    },
    {
      "landmark": "بئر مياه السطر الجديد",
      "latitude": "31.37398",
      "longitude": "34.323926"
    },
    {
      "landmark": "جمعيه اتحاد لجان العمل الزراعي",
      "latitude": "31.356731",
      "longitude": "34.325784"
    },
    {
      "landmark": "مدرسة",
      "latitude": "31.377328",
      "longitude": "34.325204"
    },
    {
      "landmark": "مدرسة",
      "latitude": "31.358347",
      "longitude": "34.329792"
    },
    {
      "landmark": "مدرسة الحاج سليمان مصطفى الاغا",
      "latitude": "31.361581",
      "longitude": "34.323338"
    },
    {
      "landmark": "مدرسة عيد الأغا الاساسيه",
      "latitude": "31.369276",
      "longitude": "34.314538"
    },
    {
      "landmark": "مسجد",
      "latitude": "31.374781",
      "longitude": "34.330683"
    },
    {
      "landmark": "مسجد الامين",
      "latitude": "31.36625",
      "longitude": "34.319308"
    },
    {
      "landmark": "مسجد الحمد والرضا",
      "latitude": "31.369691",
      "longitude": "34.323549"
    },
    {
      "landmark": "مسجد الرضوان",
      "latitude": "31.363217",
      "longitude": "34.323547"
    },
    {
      "landmark": "مسجد الشهيد عبدالرحمن الأغا",
      "latitude": "31.363372",
      "longitude": "34.317362"
    },
    {
      "landmark": "مسجد الصفا",
      "latitude": "31.364434",
      "longitude": "34.321372"
    },
    {
      "landmark": "مسجد العباس",
      "latitude": "31.35784",
      "longitude": "34.323219"
    },
    {
      "landmark": "مسجد العودة",
      "latitude": "31.368124",
      "longitude": "34.324496"
    },
    {
      "landmark": "مسجد النور",
      "latitude": "31.359716",
      "longitude": "34.321036"
    },
    {
      "landmark": "مسجد النور",
      "latitude": "31.371551",
      "longitude": "34.326037"
    },
    {
      "landmark": "مسجد الهداية",
      "latitude": "31.367237",
      "longitude": "34.330217"
    },
    {
      "landmark": "مسجد جعفر",
      "latitude": "31.35259",
      "longitude": "34.323315"
    },
    {
      "landmark": "مسجد سعد بن معاذ",
      "latitude": "31.369328",
      "longitude": "34.31399"
    },
    {
      "landmark": "مسجد طيبة",
      "latitude": "31.366056",
      "longitude": "34.324814"
    },
    {
      "landmark": "مسجد عبدالله عزام",
      "latitude": "31.359244",
      "longitude": "34.317164"
    },
    {
      "landmark": "مسجد عثمان بن عفان",
      "latitude": "31.366858",
      "longitude": "34.315225"
    },
    {
      "landmark": "مسجد عثمان بن عفان",
      "latitude": "31.355071",
      "longitude": "34.329108"
    },
    {
      "landmark": "مسجد نعمان",
      "latitude": "31.373799",
      "longitude": "34.326753"
    },
    {
      "landmark": "مضخة مجاري مدينة حمد",
      "latitude": "31.365502",
      "longitude": "34.310076"
    },
    {
      "landmark": "معهد محمد النجار للعلوم الشرعيه",
      "latitude": "31.365998",
      "longitude": "34.30773"
    }
  ],
  "7": [
    {
      "landmark": "مدرسة الهدى تابعة للمجمع الإسلامي",
      "latitude": "31.316649",
      "longitude": "34.285578"
    },
    {
      "landmark": "مستوصف مسقط",
      "latitude": "31.316036",
      "longitude": "34.284463"
    },
    {
      "landmark": "مسجد الاستقامة",
      "latitude": "31.29677",
      "longitude": "34.298991"
    },
    {
      "landmark": "مسجد التقوى",
      "latitude": "31.297325",
      "longitude": "34.292837"
    },
    {
      "landmark": "مسجد التقوي",
      "latitude": "31.305687",
      "longitude": "34.30476"
    },
    {
      "landmark": "مسجد الرحمه حي السلام",
      "latitude": "31.301675",
      "longitude": "34.305803"
    },
    {
      "landmark": "مسجد العامر",
      "latitude": "31.301852",
      "longitude": "34.296821"
    },
    {
      "landmark": "مسجد الفلاح",
      "latitude": "31.294238",
      "longitude": "34.301206"
    },
    {
      "landmark": "مسجد الهدى",
      "latitude": "31.308052",
      "longitude": "34.291301"
    },
    {
      "landmark": "مسجد ام حبيبة",
      "latitude": "31.314658",
      "longitude": "34.283887"
    },
    {
      "landmark": "مسجد سليمان عليه السلام",
      "latitude": "31.309308",
      "longitude": "34.287282"
    },
    {
      "landmark": "مسجد مصبح",
      "latitude": "31.303516",
      "longitude": "34.277052"
    },
    {
      "landmark": "مسجد منارة التوحيد",
      "latitude": "31.305514",
      "longitude": "34.308473"
    },
    {
      "landmark": "مصلى",
      "latitude": "31.303897",
      "longitude": "34.292876"
    },
    {
      "landmark": "مصلى ام احمد",
      "latitude": "31.296879",
      "longitude": "34.304379"
    }
  ],
  "20": [
    {
      "landmark": "جمعية دار الكتاب والسنة",
      "latitude": "31.339321",
      "longitude": "34.308686"
    },
    {
      "landmark": "دوار بني سهيلا",
      "latitude": "31.343456",
      "longitude": "34.313505"
    },
    {
      "landmark": "شرطة المرور",
      "latitude": "31.343066",
      "longitude": "34.313135"
    },
    {
      "landmark": "محطه التحليه محطه الشرقيه",
      "latitude": "31.336701",
      "longitude": "34.309429"
    },
    {
      "landmark": "مدرسة الحاج محمد النجار",
      "latitude": "31.342548",
      "longitude": "34.312905"
    },
    {
      "landmark": "مدرسة خالد الحسن الثاموية للبنين",
      "latitude": "31.342878",
      "longitude": "34.312248"
    },
    {
      "landmark": "مركز مصادر التعلم",
      "latitude": "31.343022",
      "longitude": "34.311558"
    },
    {
      "landmark": "مسجد الشهيد جمعة المزين",
      "latitude": "31.339603",
      "longitude": "34.309623"
    },
    {
      "landmark": "مسجد المصطفى",
      "latitude": "31.341699",
      "longitude": "34.312842"
    },
    {
      "landmark": "مقبرة",
      "latitude": "31.340129",
      "longitude": "34.316794"
    },
    {
      "landmark": "مقر مصلحة مياه بلديات الساحل",
      "latitude": "31.342978",
      "longitude": "34.310772"
    }
  ],
  "18": [
    {
      "landmark": "محطة الصرف الصحي الوفية",
      "latitude": "31.351798",
      "longitude": "34.301956"
    },
    {
      "landmark": "مدرسة الشروق النموذجية الخاصة",
      "latitude": "31.35969",
      "longitude": "34.312433"
    },
    {
      "landmark": "مسجد ابو بكر الصديق",
      "latitude": "31.351868",
      "longitude": "34.299705"
    },
    {
      "landmark": "مسجد التقوى",
      "latitude": "31.354167",
      "longitude": "34.308648"
    },
    {
      "landmark": "مسجد الكتيبة",
      "latitude": "31.351478",
      "longitude": "34.305661"
    },
    {
      "landmark": "مسجد اهل السنه",
      "latitude": "31.355722",
      "longitude": "34.308021"
    },
    {
      "landmark": "مسجد خديجة",
      "latitude": "31.358626",
      "longitude": "34.31457"
    },
    {
      "landmark": "مسجد خضره فاطمه الزهراء",
      "latitude": "31.360992",
      "longitude": "34.310643"
    },
    {
      "landmark": "مسجد صالح",
      "latitude": "31.356442",
      "longitude": "34.31258"
    },
    {
      "landmark": "مصلى التوحيد",
      "latitude": "31.352459",
      "longitude": "34.301899"
    }
  ],
  "19": [
    {
      "landmark": "الإتصالات الفلسطينية",
      "latitude": "31.343394",
      "longitude": "34.309673"
    },
    {
      "landmark": "الكراج المركزي",
      "latitude": "31.344233",
      "longitude": "34.30957"
    },
    {
      "landmark": "تجمع تجاري مستوصف خان يونس",
      "latitude": "31.345109",
      "longitude": "34.309317"
    },
    {
      "landmark": "جامعة فلسطين",
      "latitude": "31.351409",
      "longitude": "34.320641"
    },
    {
      "landmark": "روضة المجمع الإسلامي",
      "latitude": "31.345934",
      "longitude": "34.313762"
    },
    {
      "landmark": "شركة توزيع الكهرباء خانيونس",
      "latitude": "31.346668",
      "longitude": "34.307937"
    },
    {
      "landmark": "صراف الألي بنك القدس ",
      "latitude": "31.344442",
      "longitude": "34.308776"
    },
    {
      "landmark": "صراف البنك العقاري المصري",
      "latitude": "31.344395",
      "longitude": "34.308838"
    },
    {
      "landmark": "كلية الزيتونة الجامعية للعلوم والتنمية",
      "latitude": "31.355432",
      "longitude": "34.317256"
    },
    {
      "landmark": "مبنى الكرامة",
      "latitude": "31.344421",
      "longitude": "34.309918"
    },
    {
      "landmark": "مبنى بلدية خانيونس",
      "latitude": "31.343759",
      "longitude": "34.308983"
    },
    {
      "landmark": "متنزة المحطة",
      "latitude": "31.349495",
      "longitude": "34.312286"
    },
    {
      "landmark": "متنزة المحطة",
      "latitude": "31.348183",
      "longitude": "34.31146"
    },
    {
      "landmark": "متنزه أبو حميد",
      "latitude": "31.34348",
      "longitude": "34.308138"
    },
    {
      "landmark": "مخزن الشؤون الاجتماعية",
      "latitude": "31.346597",
      "longitude": "34.310526"
    },
    {
      "landmark": "مدرسة الشهيد أبو احميد الاساسية المشتركة أ/ب ",
      "latitude": "31.351411",
      "longitude": "34.319842"
    },
    {
      "landmark": "مدرسة الشيخ احمد نمر الثانوية للبنين",
      "latitude": "31.343644",
      "longitude": "34.311119"
    },
    {
      "landmark": "مدرسة بنات بني سهيلا ",
      "latitude": "31.344013",
      "longitude": "34.314547"
    },
    {
      "landmark": "مدرسة شهداء خان يونس المشتركة ",
      "latitude": "31.349263",
      "longitude": "34.311738"
    },
    {
      "landmark": "مدرسة كمال ناصر  للبنين أ وب",
      "latitude": "31.344062",
      "longitude": "34.3107"
    },
    {
      "landmark": "مديرية التربية والتعليم",
      "latitude": "31.350006",
      "longitude": "34.312254"
    },
    {
      "landmark": "مركز الاوقاف الاسلامي",
      "latitude": "31.35109",
      "longitude": "34.319924"
    },
    {
      "landmark": "مركز البندر الصحي",
      "latitude": "31.344958",
      "longitude": "34.309651"
    },
    {
      "landmark": "مركز مكافحة المخدرات",
      "latitude": "31.34822",
      "longitude": "34.310998"
    },
    {
      "landmark": "مستشفى دار السلام",
      "latitude": "31.351336",
      "longitude": "34.320312"
    },
    {
      "landmark": "مسجد ابو حميد",
      "latitude": "31.345912",
      "longitude": "34.30924"
    },
    {
      "landmark": "مسجد الاحسان",
      "latitude": "31.349856",
      "longitude": "34.31051"
    },
    {
      "landmark": "مسجد الشرطة",
      "latitude": "31.343399",
      "longitude": "34.308618"
    },
    {
      "landmark": "مسجد المجمع الإسلامي",
      "latitude": "31.345784",
      "longitude": "34.314014"
    },
    {
      "landmark": "مسجد خليل الرحمن",
      "latitude": "31.34642",
      "longitude": "34.306478"
    },
    {
      "landmark": "مسجد سليمان الفارسي",
      "latitude": "31.348379",
      "longitude": "34.312493"
    },
    {
      "landmark": "مسجد مصطفى العقاد",
      "latitude": "31.351112",
      "longitude": "34.311795"
    },
    {
      "landmark": "مصلى الإخلاص",
      "latitude": "31.35213",
      "longitude": "34.310322"
    },
    {
      "landmark": "مقبرة الشيخ حسين الاسطل",
      "latitude": "31.346868",
      "longitude": "34.312224"
    },
    {
      "landmark": "مقر مديرية الاشغال",
      "latitude": "31.343344",
      "longitude": "34.309067"
    },
    {
      "landmark": "مقر مديرية الداخليه",
      "latitude": "31.343512",
      "longitude": "34.309398"
    },
    {
      "landmark": "مقر مديرية العمل",
      "latitude": "31.343696",
      "longitude": "34.30954"
    },
    {
      "landmark": "مقرشرطه المحافظة",
      "latitude": "31.34462",
      "longitude": "34.310002"
    },
    {
      "landmark": "مكتب البريد",
      "latitude": "31.343322",
      "longitude": "34.309286"
    },
    {
      "landmark": "ملعب حي المحطه",
      "latitude": "31.347337",
      "longitude": "34.310841"
    },
    {
      "landmark": "منتزه الشهيد ابوحميد",
      "latitude": "31.345926",
      "longitude": "34.309886"
    },
    {
      "landmark": "موقف السيارات البلدية",
      "latitude": "31.344012",
      "longitude": "34.308504"
    },
    {
      "landmark": "نقابه المهندسيين",
      "latitude": "31.345526",
      "longitude": "34.308127"
    }
  ],
  "16": [
    {
      "landmark": "استاد خان يونس البلدي",
      "latitude": "31.347858",
      "longitude": "34.295263"
    },
    {
      "landmark": "الدفاع المدني",
      "latitude": "31.347034",
      "longitude": "34.294635"
    },
    {
      "landmark": "المركز التجاري",
      "latitude": "31.34536",
      "longitude": "34.299151"
    },
    {
      "landmark": "المكتبة العامة",
      "latitude": "31.346646",
      "longitude": "34.295733"
    },
    {
      "landmark": "المكتبة العامة",
      "latitude": "31.346579",
      "longitude": "34.296"
    },
    {
      "landmark": "بئر مياه الاحراش",
      "latitude": "31.343555",
      "longitude": "34.293687"
    },
    {
      "landmark": "جمعيه الشابات المسلمات",
      "latitude": "31.352433",
      "longitude": "34.289706"
    },
    {
      "landmark": "خزان السعادة",
      "latitude": "31.346152",
      "longitude": "34.295753"
    },
    {
      "landmark": "روضه اطفال خانيونس الكويكرز",
      "latitude": "31.34638",
      "longitude": "34.293235"
    },
    {
      "landmark": "ساحة القبيبة",
      "latitude": "31.344363",
      "longitude": "34.29701"
    },
    {
      "landmark": "ساحة يافا",
      "latitude": "31.344906",
      "longitude": "34.299242"
    },
    {
      "landmark": "صالة ابو يوسف النجار الرياضية",
      "latitude": "31.347274",
      "longitude": "34.296096"
    },
    {
      "landmark": "صالة خدمات خانيونس",
      "latitude": "31.346383",
      "longitude": "34.294153"
    },
    {
      "landmark": "محطة المجادلة",
      "latitude": "31.34926",
      "longitude": "34.286983"
    },
    {
      "landmark": "محطة تحليةالهدى",
      "latitude": "31.350446",
      "longitude": "34.30016"
    },
    {
      "landmark": "محطه الصرف الصحي ابو الريش",
      "latitude": "31.35102",
      "longitude": "34.293412"
    },
    {
      "landmark": "مخازن صيانه التابعة لوكاله الغوث",
      "latitude": "31.346966",
      "longitude": "34.296413"
    },
    {
      "landmark": "مدرس ذكور خانيونس الابتدائية للاجئين ب و د",
      "latitude": "31.344888",
      "longitude": "34.293915"
    },
    {
      "landmark": "مدرسة أحمد بن عبد العزيز الإعدادية أ للبنين",
      "latitude": "31.345076",
      "longitude": "34.293371"
    },
    {
      "landmark": "مدرسة بنات خانيونس الابتدائية أ",
      "latitude": "31.348543",
      "longitude": "34.293954"
    },
    {
      "landmark": "مدرسة بنات خانيونس الابتدائية ج",
      "latitude": "31.34819",
      "longitude": "34.293623"
    },
    {
      "landmark": "مدرسة بنات خانيونس الإعدادية  للاجئات ج",
      "latitude": "31.349247",
      "longitude": "34.291311"
    },
    {
      "landmark": "مدرسة بنات خانيونس الاعدادية ب وخانيونس المشتركة د",
      "latitude": "31.343657",
      "longitude": "34.296195"
    },
    {
      "landmark": "مدرسة بيت المقدس الثانوية للبنات",
      "latitude": "31.346903",
      "longitude": "34.293348"
    },
    {
      "landmark": "مدرسة حاتم الطائي الاساسية المشتركة",
      "latitude": "31.34707",
      "longitude": "34.294136"
    },
    {
      "landmark": "مدرسة خان يونس الابتدائية المشتركة",
      "latitude": "31.348698",
      "longitude": "34.292728"
    },
    {
      "landmark": "مدرسة خانيونس الابتدائية المشتركة ج",
      "latitude": "31.352934",
      "longitude": "34.287854"
    },
    {
      "landmark": "مدرسة خانيونس الإعدادية أ للاجئات",
      "latitude": "31.345889",
      "longitude": "34.29649"
    },
    {
      "landmark": "مدرسة ذكور خان يونس الابتدائية  د للاجئين",
      "latitude": "31.345726",
      "longitude": "34.293804"
    },
    {
      "landmark": "مدرسة ذكور خانيونس الابتدائيه أ /ج",
      "latitude": "31.348909",
      "longitude": "34.294887"
    },
    {
      "landmark": "مدرسة ذكور خانيونس الإعدادية أ للاجئين",
      "latitude": "31.348233",
      "longitude": "34.291243"
    },
    {
      "landmark": "مدرسة ذكور خانيونس الإعدادية ج للاجئين\n",
      "latitude": "31.347636",
      "longitude": "34.291069"
    },
    {
      "landmark": "مدرسة عكا الثانوية للبنات أ و ب",
      "latitude": "31.347766",
      "longitude": "34.291905"
    },
    {
      "landmark": "مدرسة مصطفى حافظ الابتدائيه أ / ب",
      "latitude": "31.348988",
      "longitude": "34.291971"
    },
    {
      "landmark": "مدرسة مصطفى حافظ المشتركة",
      "latitude": "31.345472",
      "longitude": "34.296323"
    },
    {
      "landmark": "مدرسه بنات خانيونس الابتدائيه للاجئات أ و ب",
      "latitude": "31.348594",
      "longitude": "34.295608"
    },
    {
      "landmark": "مدرسه عبد القادر الحسيني الثانويه والاساسيه للبنين",
      "latitude": "31.34735",
      "longitude": "34.293595"
    },
    {
      "landmark": "مديرية الدفاع المدني",
      "latitude": "31.346011",
      "longitude": "34.295924"
    },
    {
      "landmark": "مركز الشئون الاجتماعيه والتموين",
      "latitude": "31.350379",
      "longitude": "34.288694"
    },
    {
      "landmark": "مركز النشاط النسائي وكاله الغوت",
      "latitude": "31.350077",
      "longitude": "34.288626"
    },
    {
      "landmark": "مركز صحي",
      "latitude": "31.3499",
      "longitude": "34.289452"
    },
    {
      "landmark": "مستشفى ناصر",
      "latitude": "31.346523",
      "longitude": "34.291571"
    },
    {
      "landmark": "مسجد التقوى الإسلامي",
      "latitude": "31.348793",
      "longitude": "34.294156"
    },
    {
      "landmark": "مسجد الشافعي",
      "latitude": "31.3516",
      "longitude": "34.286875"
    },
    {
      "landmark": "مسجد الفاروق",
      "latitude": "31.348751",
      "longitude": "34.290416"
    },
    {
      "landmark": "مسجد الفرقان",
      "latitude": "31.347761",
      "longitude": "34.296254"
    },
    {
      "landmark": "مسجد الهدى",
      "latitude": "31.350679",
      "longitude": "34.299768"
    },
    {
      "landmark": "مسجد بلال",
      "latitude": "31.346171",
      "longitude": "34.29757"
    },
    {
      "landmark": "مسجد خالد بن الوليد",
      "latitude": "31.348359",
      "longitude": "34.286949"
    },
    {
      "landmark": "مسجد عمر بن الخطاب",
      "latitude": "31.345798",
      "longitude": "34.295739"
    },
    {
      "landmark": "مقر وكاله الامم المتحدة لتشغيل اللاجئين- خان يونس",
      "latitude": "31.346381",
      "longitude": "34.296637"
    },
    {
      "landmark": "نادي الشروق  والامل",
      "latitude": "31.345897",
      "longitude": "34.294206"
    },
    {
      "landmark": "ورشة صيانة البلدية",
      "latitude": "31.346303",
      "longitude": "34.29525"
    }
  ],
  "2": [
    {
      "landmark": "المدينة الرياضية",
      "latitude": "31.32423",
      "longitude": "34.301379"
    },
    {
      "landmark": "بئر مياه المدينة الرياضية",
      "latitude": "31.324324",
      "longitude": "34.300622"
    },
    {
      "landmark": "عيادة خالدية الاغا الصحية",
      "latitude": "31.31805",
      "longitude": "34.311"
    },
    {
      "landmark": "مدرسة أبو بكر الصديق الأساسية للبنين",
      "latitude": "31.323328",
      "longitude": "34.301583"
    },
    {
      "landmark": "مسجد أبو حنيفة النعمان",
      "latitude": "31.312167",
      "longitude": "34.306501"
    },
    {
      "landmark": "مسجد الانوار",
      "latitude": "31.313937",
      "longitude": "34.315067"
    },
    {
      "landmark": "مسجد الدعوة",
      "latitude": "31.326759",
      "longitude": "34.311894"
    },
    {
      "landmark": "مسجد الصحابة",
      "latitude": "31.311117",
      "longitude": "34.309366"
    },
    {
      "landmark": "مسجد المنارة",
      "latitude": "31.307304",
      "longitude": "34.309213"
    },
    {
      "landmark": "مسجد أنس بن مالك",
      "latitude": "31.318565",
      "longitude": "34.312324"
    },
    {
      "landmark": "مسجد خليل الرحمن",
      "latitude": "31.30143",
      "longitude": "34.31535"
    },
    {
      "landmark": "مسجد سيد قطب",
      "latitude": "31.321439",
      "longitude": "34.309998"
    },
    {
      "landmark": "مسجد عباد الرحمن",
      "latitude": "31.296897",
      "longitude": "34.308123"
    },
    {
      "landmark": "مصلى الانصار",
      "latitude": "31.326927",
      "longitude": "34.308763"
    },
    {
      "landmark": "نادي الاتحاد الرياضي",
      "latitude": "31.324127",
      "longitude": "34.302416"
    },
    {
      "landmark": "نادي الاتحاد الرياضي",
      "latitude": "31.323681",
      "longitude": "34.302162"
    }
  ],
  "9": [
    {
      "landmark": "مسجد الإحسان",
      "latitude": "31.357675",
      "longitude": "34.262045"
    },
    {
      "landmark": "مسجد الامام الذهبي",
      "latitude": "31.352515",
      "longitude": "34.266636"
    },
    {
      "landmark": "مسجد الفاروق",
      "latitude": "31.361331",
      "longitude": "34.266339"
    },
    {
      "landmark": "مسجد النور",
      "latitude": "31.350784",
      "longitude": "34.256731"
    },
    {
      "landmark": "مسجد خليل الرحمن",
      "latitude": "31.356969",
      "longitude": "34.260474"
    },
    {
      "landmark": "مسجد عثمان بن عفان",
      "latitude": "31.344556",
      "longitude": "34.253075"
    },
    {
      "landmark": "مصلى تل الجنان",
      "latitude": "31.352987",
      "longitude": "34.266503"
    },
    {
      "landmark": "مقرالدفاع المدني الانقاذ البحري",
      "latitude": "31.364769",
      "longitude": "34.268757"
    },
    {
      "landmark": "مؤسسسة كارتياس القدس",
      "latitude": "31.360689",
      "longitude": "34.269902"
    }
  ],
  "4": [
    {
      "landmark": "المنتزة البحري",
      "latitude": "31.381346",
      "longitude": "34.285777"
    },
    {
      "landmark": "النادي البحري",
      "latitude": "31.367481",
      "longitude": "34.271823"
    },
    {
      "landmark": "عيادة المواصي الصحية",
      "latitude": "31.362738",
      "longitude": "34.275422"
    },
    {
      "landmark": "كلية الرباط تابعة للداخلية",
      "latitude": "31.372732",
      "longitude": "34.28812"
    },
    {
      "landmark": "مدرسة جرار القدوة الثانوية للبنات",
      "latitude": "31.366469",
      "longitude": "34.276048"
    },
    {
      "landmark": "مسجد ابو حنيفة",
      "latitude": "31.364253",
      "longitude": "34.272061"
    },
    {
      "landmark": "مسجد ابو هريرة",
      "latitude": "31.368321",
      "longitude": "34.280435"
    },
    {
      "landmark": "مسجد ابومطر",
      "latitude": "31.342619",
      "longitude": "34.247748"
    },
    {
      "landmark": "مسجد الامام مالك",
      "latitude": "31.382166",
      "longitude": "34.293075"
    },
    {
      "landmark": "مسجد البشير",
      "latitude": "31.377916",
      "longitude": "34.288454"
    },
    {
      "landmark": "مسجد الرباط",
      "latitude": "31.365539",
      "longitude": "34.278558"
    },
    {
      "landmark": "مسجد العقاد",
      "latitude": "31.382089",
      "longitude": "34.293215"
    },
    {
      "landmark": "مسجد القبة",
      "latitude": "31.363671",
      "longitude": "34.277491"
    },
    {
      "landmark": "مسجد المجايدة",
      "latitude": "31.373207",
      "longitude": "34.281558"
    },
    {
      "landmark": "مسجد الهداية ",
      "latitude": "31.387171",
      "longitude": "34.298845"
    },
    {
      "landmark": "مسجد حنين",
      "latitude": "31.392602",
      "longitude": "34.299987"
    },
    {
      "landmark": "مسجد خالد بن الوليد",
      "latitude": "31.391357",
      "longitude": "34.306656"
    },
    {
      "landmark": "مسجد نور الايمان",
      "latitude": "31.361669",
      "longitude": "34.272427"
    },
    {
      "landmark": "مصلى التوحيد",
      "latitude": "31.384556",
      "longitude": "34.30504"
    },
    {
      "landmark": "ميناء الصيادين",
      "latitude": "31.368845",
      "longitude": "34.273157"
    },
    {
      "landmark": "ميناء خانيونس",
      "latitude": "31.396767",
      "longitude": "34.303833"
    }
  ],
  "14": [
    {
      "landmark": "اتحاد لجان الرعاية الصحية",
      "latitude": "31.35535",
      "longitude": "34.285291"
    },
    {
      "landmark": "الجمعية الاسلامية حي الامل",
      "latitude": "31.356491",
      "longitude": "34.294354"
    },
    {
      "landmark": "الخدمات الطبية العسكرية",
      "latitude": "31.355555",
      "longitude": "34.285013"
    },
    {
      "landmark": "السجن المركزي",
      "latitude": "31.363871",
      "longitude": "34.299739"
    },
    {
      "landmark": "المركز الثقافي/ الجمعية الإسلامية",
      "latitude": "31.36253",
      "longitude": "34.294358"
    },
    {
      "landmark": "المنتزة الاماراتي",
      "latitude": "31.36099",
      "longitude": "34.295495"
    },
    {
      "landmark": "بئر مياه الامل الجديد",
      "latitude": "31.353834",
      "longitude": "34.291758"
    },
    {
      "landmark": "بئر مياه الفدائية",
      "latitude": "31.359606",
      "longitude": "34.274945"
    },
    {
      "landmark": "بئر مياه بلدية",
      "latitude": "31.358513",
      "longitude": "34.288396"
    },
    {
      "landmark": "جمعية أرض الإنسان",
      "latitude": "31.355122",
      "longitude": "34.293181"
    },
    {
      "landmark": "جمعية اعمار",
      "latitude": "31.356272",
      "longitude": "34.294173"
    },
    {
      "landmark": "جمعية الثقافة والفكر الحر",
      "latitude": "31.358984",
      "longitude": "34.289113"
    },
    {
      "landmark": "جمعية نسائم الامل",
      "latitude": "31.356036",
      "longitude": "34.293972"
    },
    {
      "landmark": "حوض ترشيح مياه الامطار الاضافي",
      "latitude": "31.370456",
      "longitude": "34.291703"
    },
    {
      "landmark": "روضة أطفال",
      "latitude": "31.36228",
      "longitude": "34.294696"
    },
    {
      "landmark": "روضه الحريه",
      "latitude": "31.358709",
      "longitude": "34.28883"
    },
    {
      "landmark": "سوق حي الأمل للخضروات",
      "latitude": "31.354242",
      "longitude": "34.292267"
    },
    {
      "landmark": "عيادة الحي الياباني - الوكالة",
      "latitude": "31.361646",
      "longitude": "34.294161"
    },
    {
      "landmark": "محطة القطاطوة",
      "latitude": "31.354367",
      "longitude": "34.285892"
    },
    {
      "landmark": "محطه المعالجة المؤقته لمياه الصرف الصحي",
      "latitude": "31.369567",
      "longitude": "34.288577"
    },
    {
      "landmark": "مدرسة الجنان الثانوية للبنين",
      "latitude": "31.357055",
      "longitude": "34.293276"
    },
    {
      "landmark": "مدرسة بنات الأمل الابتدائية",
      "latitude": "31.360222",
      "longitude": "34.296072"
    },
    {
      "landmark": "مدرسة بنات الأمل الاعدادية",
      "latitude": "31.359661",
      "longitude": "34.295274"
    },
    {
      "landmark": "مدرسة بنات خانيونس الإعدادية الجديدة للاجئين\n",
      "latitude": "31.36042",
      "longitude": "34.292111"
    },
    {
      "landmark": "مدرسة ذكور الأمل الابتدائية",
      "latitude": "31.358568",
      "longitude": "34.29558"
    },
    {
      "landmark": "مدرسة ذكور خانيونس الابتدائية هـ",
      "latitude": "31.361851",
      "longitude": "34.297674"
    },
    {
      "landmark": "مدرسة ذكور خانيونس الاعدادية ب للاجئين\n",
      "latitude": "31.359727",
      "longitude": "34.293052"
    },
    {
      "landmark": "مديرية الشؤون الاجتماعية",
      "latitude": "31.354983",
      "longitude": "34.293053"
    },
    {
      "landmark": "مدينة أصداء",
      "latitude": "31.369713",
      "longitude": "34.300562"
    },
    {
      "landmark": "مركز تدريب الوكالة",
      "latitude": "31.363992",
      "longitude": "34.294921"
    },
    {
      "landmark": "مسجد الامين محمد",
      "latitude": "31.360017",
      "longitude": "34.293754"
    },
    {
      "landmark": "مسجد الايمان - البراق",
      "latitude": "31.359528",
      "longitude": "34.289651"
    },
    {
      "landmark": "مسجد ذو النورين",
      "latitude": "31.353372",
      "longitude": "34.291712"
    },
    {
      "landmark": "مسجد ذي النورين",
      "latitude": "31.356356",
      "longitude": "34.290411"
    },
    {
      "landmark": "مسجد عقبة بن نافع",
      "latitude": "31.362634",
      "longitude": "34.297659"
    },
    {
      "landmark": "مشتل البلدية",
      "latitude": "31.359398",
      "longitude": "34.275526"
    },
    {
      "landmark": "مقر مديرية الزراعة",
      "latitude": "31.357794",
      "longitude": "34.27713"
    },
    {
      "landmark": "ملعب الصبرة",
      "latitude": "31.354181",
      "longitude": "34.290384"
    },
    {
      "landmark": "ملعب حارة المصاطفة",
      "latitude": "31.354941",
      "longitude": "34.291274"
    },
    {
      "landmark": "منتجع طبريا",
      "latitude": "31.366733",
      "longitude": "34.284733"
    },
    {
      "landmark": "منتزة",
      "latitude": "31.360854",
      "longitude": "34.290834"
    },
    {
      "landmark": "منتزه",
      "latitude": "31.362981",
      "longitude": "34.292946"
    },
    {
      "landmark": "منتزه الحي الهولندي",
      "latitude": "31.360582",
      "longitude": "34.297371"
    },
    {
      "landmark": "منتزه الحي الياباني",
      "latitude": "31.361962",
      "longitude": "34.291922"
    },
    {
      "landmark": "نقابة المحاسبين",
      "latitude": "31.355824",
      "longitude": "34.293787"
    }
  ],
  "6": [
    {
      "landmark": "الكلية الجامعية للعلوم والتكنولوجيا\n",
      "latitude": "31.328178",
      "longitude": "34.29982"
    },
    {
      "landmark": "المركز الثقافي",
      "latitude": "31.325588",
      "longitude": "34.300172"
    },
    {
      "landmark": "مبنى النيابة العامة",
      "latitude": "31.326144",
      "longitude": "34.302603"
    },
    {
      "landmark": "مجلس اداره النفايات الصلبة",
      "latitude": "31.325475",
      "longitude": "34.300522"
    },
    {
      "landmark": "مجمع المحاكم النظامية",
      "latitude": "31.325207",
      "longitude": "34.302079"
    },
    {
      "landmark": "مدرسة أحلام الحرازين الاساسية بنات",
      "latitude": "31.330117",
      "longitude": "34.297698"
    },
    {
      "landmark": "مدرسة أحمد عبد العزيز ا/ ب",
      "latitude": "31.338893",
      "longitude": "34.305462"
    },
    {
      "landmark": "مدرسة اسامه النجار أ /ب",
      "latitude": "31.338613",
      "longitude": "34.305103"
    },
    {
      "landmark": "مدرسة عبدالعزيز الرنتيسي الأساسية بنات",
      "latitude": "31.329636",
      "longitude": "34.29819"
    },
    {
      "landmark": "مدرسه الشهيد محمد الدره الأساسيه للبنين",
      "latitude": "31.326224",
      "longitude": "34.301703"
    },
    {
      "landmark": "مركز أمني",
      "latitude": "31.330223",
      "longitude": "34.298835"
    },
    {
      "landmark": "مركز جورة اللوت الصحي",
      "latitude": "31.334881",
      "longitude": "34.305462"
    },
    {
      "landmark": "مسجد أبن القيم",
      "latitude": "31.333559",
      "longitude": "34.309745"
    },
    {
      "landmark": "مسجد الإسلام",
      "latitude": "31.336759",
      "longitude": "34.308233"
    },
    {
      "landmark": "مسجد الصالحين",
      "latitude": "31.329261",
      "longitude": "34.304239"
    },
    {
      "landmark": "مسجد الغانم",
      "latitude": "31.336473",
      "longitude": "34.30497"
    },
    {
      "landmark": "مسجد النور",
      "latitude": "31.332126",
      "longitude": "34.294509"
    },
    {
      "landmark": "مسجد حليمة",
      "latitude": "31.332987",
      "longitude": "34.301835"
    },
    {
      "landmark": "مصلى  الفلاحة ( الزاوية ) ",
      "latitude": "31.328645",
      "longitude": "34.307702"
    },
    {
      "landmark": "مصلى المحسنين",
      "latitude": "31.3324",
      "longitude": "34.298866"
    },
    {
      "landmark": "معهد الازهز الديني",
      "latitude": "31.32698",
      "longitude": "34.302341"
    },
    {
      "landmark": "مقبرة",
      "latitude": "31.331034",
      "longitude": "34.310271"
    }
  ],
  "5": [
    {
      "landmark": "بئر مياه _ سلطة المياه الفلسطينية",
      "latitude": "31.329672",
      "longitude": "34.278159"
    },
    {
      "landmark": "بئر مياه ابو رشوان",
      "latitude": "31.32953",
      "longitude": "34.28432"
    },
    {
      "landmark": "بئر مياه التحدي",
      "latitude": "31.332333",
      "longitude": "34.28306"
    },
    {
      "landmark": "بئر مياه الجنوبي الجديد",
      "latitude": "31.334412",
      "longitude": "34.28333"
    },
    {
      "landmark": "بئر مياه الشاعر",
      "latitude": "31.337554",
      "longitude": "34.286713"
    },
    {
      "landmark": "جمعية المزارعيين الفلسطنيين",
      "latitude": "31.329002",
      "longitude": "34.288333"
    },
    {
      "landmark": "روضة اطفال اجيال التحرير",
      "latitude": "31.325704",
      "longitude": "34.280351"
    },
    {
      "landmark": "محطة تحلية الفارسين ",
      "latitude": "31.334131",
      "longitude": "34.287322"
    },
    {
      "landmark": "مدرسة الصفوة الاساسية المشتركة",
      "latitude": "31.319875",
      "longitude": "34.280175"
    },
    {
      "landmark": "مسجد الاسراء",
      "latitude": "31.32455",
      "longitude": "34.279132"
    },
    {
      "landmark": "مسجد الايمان",
      "latitude": "31.330057",
      "longitude": "34.284767"
    },
    {
      "landmark": "مسجد الحاج فهمي شراب",
      "latitude": "31.323913",
      "longitude": "34.285195"
    },
    {
      "landmark": "مسجد الرباط",
      "latitude": "31.320244",
      "longitude": "34.277345"
    },
    {
      "landmark": "مسجد أم المؤمنين عائشة",
      "latitude": "31.334664",
      "longitude": "34.287187"
    },
    {
      "landmark": "مسجد عبد الكريم الشاعر",
      "latitude": "31.331431",
      "longitude": "34.288923"
    }
  ],
  "8": [
    {
      "landmark": "بئر مياه الاغاثة",
      "latitude": "31.319374",
      "longitude": "34.290062"
    },
    {
      "landmark": "بئر مياه الوالدين",
      "latitude": "31.316728",
      "longitude": "34.289181"
    },
    {
      "landmark": "جمعيه مزارعي البيوت البلاستيكية",
      "latitude": "31.32201",
      "longitude": "34.290894"
    },
    {
      "landmark": "مدرسة المهاجرين الخاصة",
      "latitude": "31.320437",
      "longitude": "34.290472"
    },
    {
      "landmark": "مدرسة عائشة أم المؤمنين",
      "latitude": "31.320796",
      "longitude": "34.290582"
    },
    {
      "landmark": "مسجد الاسلام",
      "latitude": "31.321558",
      "longitude": "34.297579"
    },
    {
      "landmark": "مسجد الامين محمد",
      "latitude": "31.327471",
      "longitude": "34.294459"
    },
    {
      "landmark": "مسجد الحاج محمد النجار",
      "latitude": "31.320249",
      "longitude": "34.285459"
    },
    {
      "landmark": "مسجد الحمد والرضا",
      "latitude": "31.320505",
      "longitude": "34.301965"
    },
    {
      "landmark": "مسجد الشهيد اسامه النجار",
      "latitude": "31.326039",
      "longitude": "34.291791"
    },
    {
      "landmark": "مسجد الشيخة للواة",
      "latitude": "31.313898",
      "longitude": "34.300349"
    },
    {
      "landmark": "مسجد الفارووق",
      "latitude": "31.318782",
      "longitude": "34.295178"
    },
    {
      "landmark": "مسجد المحتسب",
      "latitude": "31.323465",
      "longitude": "34.287414"
    }
  ],
  "17": [
    {
      "landmark": "اكشاك الميدان",
      "latitude": "31.343329",
      "longitude": "34.302466"
    },
    {
      "landmark": "البنك الاسلامي العربي",
      "latitude": "31.345388",
      "longitude": "34.303761"
    },
    {
      "landmark": "البنك الاسلامي الفلسطينى",
      "latitude": "31.346377",
      "longitude": "34.303197"
    },
    {
      "landmark": "المسجد الكبير",
      "latitude": "31.343231",
      "longitude": "34.301752"
    },
    {
      "landmark": "بنك القاهره - عمان",
      "latitude": "31.343581",
      "longitude": "34.303149"
    },
    {
      "landmark": "بنك القدس",
      "latitude": "31.347444",
      "longitude": "34.302681"
    },
    {
      "landmark": "بنك فلسطين",
      "latitude": "31.346197",
      "longitude": "34.302905"
    },
    {
      "landmark": "جمعية دار الكتاب والسنة",
      "latitude": "31.342536",
      "longitude": "34.306047"
    },
    {
      "landmark": "سور قلعة برقوق",
      "latitude": "31.342848",
      "longitude": "34.302637"
    },
    {
      "landmark": "سوق احمد عبد العزيز للخضروات",
      "latitude": "31.340909",
      "longitude": "34.30645"
    },
    {
      "landmark": "سوق حراء",
      "latitude": "31.339933",
      "longitude": "34.304141"
    },
    {
      "landmark": "سوق سور المقبرة",
      "latitude": "31.340643",
      "longitude": "34.303553"
    },
    {
      "landmark": "شركة جوال",
      "latitude": "31.345037",
      "longitude": "34.304897"
    },
    {
      "landmark": "كلية التربية",
      "latitude": "31.348725",
      "longitude": "34.302712"
    },
    {
      "landmark": "مبنى البلدية القديمة",
      "latitude": "31.34261",
      "longitude": "34.302035"
    },
    {
      "landmark": "مجمع الياسين الطبي",
      "latitude": "31.344507",
      "longitude": "34.304747"
    },
    {
      "landmark": "محطه الصرف الصحي حسبه السمك",
      "latitude": "31.34135",
      "longitude": "34.301999"
    },
    {
      "landmark": "مدرسة ابن خلدون الاساسية للبنات",
      "latitude": "31.344405",
      "longitude": "34.302299"
    },
    {
      "landmark": "مدرسة حيفا الاساسية أ و ب للبنات",
      "latitude": "31.348288",
      "longitude": "34.30356"
    },
    {
      "landmark": "مدرسة خان يونس الثانوية للبنات",
      "latitude": "31.34492",
      "longitude": "34.30711"
    },
    {
      "landmark": "مدرسة عبد الله أبو سته الاساسية أ/ب للبنين",
      "latitude": "31.348691",
      "longitude": "34.301743"
    },
    {
      "landmark": "مدرسة عبد الله أبو سته الاساسية أ/ب للبنين",
      "latitude": "31.349182",
      "longitude": "34.301959"
    },
    {
      "landmark": "مدرسة فاروق الفرا الثانوية للبنات",
      "latitude": "31.34465",
      "longitude": "34.307573"
    },
    {
      "landmark": "مديرية التربية والتعليم",
      "latitude": "31.348661",
      "longitude": "34.303319"
    },
    {
      "landmark": "مركز تدريب مديرية خانيونس",
      "latitude": "31.345237",
      "longitude": "34.306884"
    },
    {
      "landmark": "مسجد الخلفاء الراشدين",
      "latitude": "31.34827",
      "longitude": "34.298986"
    },
    {
      "landmark": "مسجد السقا",
      "latitude": "31.347971",
      "longitude": "34.301973"
    },
    {
      "landmark": "مسجد الشهداء",
      "latitude": "31.339091",
      "longitude": "34.304124"
    },
    {
      "landmark": "مسجد المتقيين",
      "latitude": "31.345267",
      "longitude": "34.30014"
    },
    {
      "landmark": "مسجد أهل السنة",
      "latitude": "31.343299",
      "longitude": "34.304505"
    },
    {
      "landmark": "مقبرة",
      "latitude": "31.340374",
      "longitude": "34.302957"
    }
  ],
  "12": [
    {
      "landmark": "بئر وخزان معن",
      "latitude": "31.33215",
      "longitude": "34.311989"
    },
    {
      "landmark": "شرطة معن",
      "latitude": "31.327505",
      "longitude": "34.313634"
    },
    {
      "landmark": "شرطه مرور خان يونس",
      "latitude": "31.327025",
      "longitude": "34.31271"
    },
    {
      "landmark": "عيادة معن الجديدة الوكالة",
      "latitude": "31.326694",
      "longitude": "34.313155"
    },
    {
      "landmark": "مبنى الاذاعة ",
      "latitude": "31.331942",
      "longitude": "34.312136"
    },
    {
      "landmark": "محطة مياه الفارسين",
      "latitude": "31.334923",
      "longitude": "34.311836"
    },
    {
      "landmark": "محلات العيادة",
      "latitude": "31.32729",
      "longitude": "34.313237"
    },
    {
      "landmark": "مدرسة الاوقاف الشرعية للبنات",
      "latitude": "31.326999",
      "longitude": "34.313829"
    },
    {
      "landmark": "مدرسة أم سلمة الثانوية الأساسية  للبنات أ/ب",
      "latitude": "31.326574",
      "longitude": "34.314096"
    },
    {
      "landmark": "مدرسة ذكور بني سهيلا",
      "latitude": "31.343149",
      "longitude": "34.315663"
    },
    {
      "landmark": "مدرسة ذكور معن الإبتدائية المشتركة",
      "latitude": "31.326173",
      "longitude": "34.313367"
    },
    {
      "landmark": "مدرسة عمار بن ياسر الثانوية والأساسية للبنين أ/ب",
      "latitude": "31.32621",
      "longitude": "34.314428"
    },
    {
      "landmark": "مدرسه إناث معن الابتدائيه والاعداديه للاجئين",
      "latitude": "31.325769",
      "longitude": "34.313606"
    },
    {
      "landmark": "مستوصف الهلال الأحمر",
      "latitude": "31.33318",
      "longitude": "34.317172"
    },
    {
      "landmark": "مسجد . . التقوي",
      "latitude": "31.325725",
      "longitude": "34.318827"
    },
    {
      "landmark": "مسجد أبو بكر الصديق",
      "latitude": "31.322457",
      "longitude": "34.319056"
    },
    {
      "landmark": "مسجد أبو عبيدة بن الجراح",
      "latitude": "31.331647",
      "longitude": "34.312453"
    },
    {
      "landmark": "مسجد احمد ابن حنبل",
      "latitude": "31.338263",
      "longitude": "34.31431"
    },
    {
      "landmark": "مسجد استقلال اندونيسيا الكبير",
      "latitude": "31.332676",
      "longitude": "34.313355"
    },
    {
      "landmark": "مسجد التوحيد",
      "latitude": "31.333811",
      "longitude": "34.316619"
    },
    {
      "landmark": "مسجد الجهاد",
      "latitude": "31.329595",
      "longitude": "34.315504"
    },
    {
      "landmark": "مسجد الرنتيسي",
      "latitude": "31.335008",
      "longitude": "34.311967"
    },
    {
      "landmark": "مسجد طيبة",
      "latitude": "31.335947",
      "longitude": "34.313401"
    },
    {
      "landmark": "مسجد عباد الرحمن",
      "latitude": "31.327129",
      "longitude": "34.317753"
    },
    {
      "landmark": "مسجد عبد الله بن رواحة",
      "latitude": "31.326477",
      "longitude": "34.32064"
    },
    {
      "landmark": "مسجد علي بن ابي طالب",
      "latitude": "31.332088",
      "longitude": "34.318212"
    },
    {
      "landmark": "مسجد معن بن زائدة",
      "latitude": "31.329493",
      "longitude": "34.320245"
    },
    {
      "landmark": "مقابر",
      "latitude": "31.330988",
      "longitude": "34.312929"
    },
    {
      "landmark": "مقبرة",
      "latitude": "31.331028",
      "longitude": "34.311848"
    },
    {
      "landmark": "نادي شباب معن الرياضي",
      "latitude": "31.331767",
      "longitude": "34.312929"
    }
  ],
  "1": [
    {
      "landmark": "الجامعة الاسلامية",
      "latitude": "31.3222",
      "longitude": "34.320265"
    },
    {
      "landmark": "جمعية تطوير حي القرين",
      "latitude": "31.315294",
      "longitude": "34.316078"
    },
    {
      "landmark": "جمعية زمزم الخيرية",
      "latitude": "31.31209",
      "longitude": "34.325978"
    },
    {
      "landmark": "روضة العلماء الصغار",
      "latitude": "31.308265",
      "longitude": "34.326213"
    },
    {
      "landmark": "محطة ضخ الاوروبي",
      "latitude": "31.303078",
      "longitude": "34.316402"
    },
    {
      "landmark": "مدرسة جنين",
      "latitude": "31.301889",
      "longitude": "34.321508"
    },
    {
      "landmark": "مدرسة رأس الناقورة ",
      "latitude": "31.301889",
      "longitude": "34.321508"
    },
    {
      "landmark": "مدرسة رواد المستقبل الخاصة",
      "latitude": "31.317299",
      "longitude": "34.324278"
    },
    {
      "landmark": "مدرسة عسقلان الاعدادية للذكور",
      "latitude": "31.312534",
      "longitude": "34.331798"
    },
    {
      "landmark": "مستشفى غزة الاوروبي",
      "latitude": "31.303286",
      "longitude": "34.319525"
    },
    {
      "landmark": "مسجد الامين محمد",
      "latitude": "31.312163",
      "longitude": "34.331137"
    },
    {
      "landmark": "مسجد الحاجه رقيه وبدريه",
      "latitude": "31.309961",
      "longitude": "34.327388"
    },
    {
      "landmark": "مسجد الصحابه",
      "latitude": "31.302848",
      "longitude": "34.321398"
    },
    {
      "landmark": "مسجد بلال",
      "latitude": "31.314695",
      "longitude": "34.326837"
    },
    {
      "landmark": "مسجد ذو النورين",
      "latitude": "31.313948",
      "longitude": "34.32383"
    },
    {
      "landmark": "مسجد نور الاسلام",
      "latitude": "31.308397",
      "longitude": "34.316237"
    },
    {
      "landmark": "مصلى",
      "latitude": "31.310812",
      "longitude": "34.319943"
    },
    {
      "landmark": "مصلى صلاح الدين",
      "latitude": "31.316786",
      "longitude": "34.315423"
    }
  ]
}