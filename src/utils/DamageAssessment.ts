export const buildingOptions = [
  {
    value: "IndependentBuilding",
    label: "مبنى مستقل (منزل منفصل / فيلا / بيت عربي)",
  },
  { value: "ApartmentInsideBuilding", label: "شقة ( داخل بناية أو برج )" },
  { value: "ResidentialBuilding", label: "بناية " },
  { value: "tower", label: "برج" },
  { value: "compHouse", label: "منازل شعبية (سقف زينكو / كرميد / أسبست)" },
  {
    value: "additionalBuildings",
    label: "مبانٍ إضافية (استراحات – غرف زراعية – أسوار – مخازن - أخرى )",
  },
];

export const DAMAGE_TYPES = [
  { label: "تشققات إنشائية ( أسقف )", value: "تشققات إنشائية ( أسقف )", buildingType: "" },
  { label: "تشققات إنشائية ( أعمدة )", value: "تشققات إنشائية ( أعمدة )", buildingType: "" },
  { label: "تضرر الواجهات ( تفريغ )", value: "تضرر الواجهات", buildingType: "" },
  { label: "تضرر الأبواب والنوافذ", value: "تضرر الأبواب", buildingType: "" },
  { label: "تضرر التشطيبات", value: "تضرر التشطيبات", buildingType: "" },
  { label: "تضرر الكهرباء", value: "تضرر الكهرباء", buildingType: "" },
  { label: "تضرر المصاعد", value: "تضرر المصاعد", buildingType: "بناية" },
  {
    label: "تضرر مداخل أو أدراج البناية",
    value: "تضرر مداخل أو أدراج البناية",
    buildingType: "بناية",
  },
  { label: "تضرر شبكة المياه والصرف", value: "تضرر شبكة المياه والصرف", buildingType: "" },
  { label: "تضرر بالحريق", value: "تضرر بالحريق", buildingType: "" },
];

export const DAMAGE_TYPE_CompHouse = [
  { label: "ضرر أرضيات", value: "ضرر أرضيات" },
  { label: "ضرر تمديدات", value: "ضرر تمديدات" },
  { label: "ضرر سقف", value: "ضرر سقف" },
  { label: "ضرر جدران", value: "ضرر جدران" },
  { label: "ضرر أبواب وشبابيك", value: "ضرر أبواب وشبابيك" },
  { label: "ضرر بالحريق", value: "ضرر بالحريق" },
];
