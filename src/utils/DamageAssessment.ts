import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";
import {
  saveAdditionalBuildings,
  saveApartmentInsideBuilding,
  saveCompHouse,
  saveIndependentBuilding,
  saveResidentialBuilding,
  saveTower,
} from "../redux/slices/damageSlice";

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
export const nearestLandmark = [
  {
    Label: "مدرسة",
    value: "مدرسة",
  },
  {
    Label: "مستشفى",
    value: "مستشفى",
  },
  {
    Label: "شارع رئيسي",
    value: "شارع رئيسي",
  },
  {
    Label: "مسجد",
    value: "مسجد",
  },
  {
    Label: "سوق",
    value: "سوق",
  },
  {
    Label: "اخرى",
    value: "اخرى",
  },
];

export const DAMAGE_TYPES = [
  {
    label: "تشققات إنشائية ( أسقف )",
    value: "تشققات إنشائية ( أسقف )",
    buildingType: "",
  },
  {
    label: "تشققات إنشائية ( أعمدة )",
    value: "تشققات إنشائية ( أعمدة )",
    buildingType: "",
  },
  {
    label: "تضرر الواجهات ( تفريغ )",
    value: "تضرر الواجهات",
    buildingType: "",
  },
  { label: "تضرر الأبواب والنوافذ", value: "تضرر الأبواب", buildingType: "" },
  { label: "تضرر التشطيبات", value: "تضرر التشطيبات", buildingType: "" },
  { label: "تضرر الكهرباء", value: "تضرر الكهرباء", buildingType: "" },
  { label: "تضرر المصاعد", value: "تضرر المصاعد", buildingType: "بناية" },
  {
    label: "تضرر مداخل أو أدراج البناية",
    value: "تضرر مداخل أو أدراج البناية",
    buildingType: "بناية",
  },
  {
    label: "تضرر شبكة المياه والصرف",
    value: "تضرر شبكة المياه والصرف",
    buildingType: "",
  },
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

export const BuildingContent = [
  { label: "يحتوي على غرفة قابلة للسكن على الأقل", value: "يحتوي على غرفة قابلة للسكن على الأقل" },
  { label: "يحتوي على مطبخ قابل للاستخدام على الأقل", value:"يحتوي على مطبخ قابل للاستخدام على الأقل" },
  { label: "يحتوي على دورة مياه قابلة للاستخدام على الأقل", value: "يحتوي على دورة مياه قابلة للاستخدام على الأقل" },
];

export const removeImagesFromBuilding = (buildingData: any) => {
  if (!buildingData) return buildingData;

  const cleaned = { ...buildingData };
  delete cleaned.beforeWarImage;
  delete cleaned.afterWarImage;
  delete cleaned.ownershipDocuments;

  return cleaned;
};

export const buildFormDataWithoutImages = (
  formData: IDamageAssessmentState
) => {
  const type = formData.buildingType;

  return {
    ...formData,
    [type]: removeImagesFromBuilding(
      formData[type as keyof IDamageAssessmentState]
    ),
  };
};

export const dispatchByType = (dispatch: any, type: string, data: any) => {
  const actionsMap: Record<string, Function> = {
    IndependentBuilding: saveIndependentBuilding,
    ApartmentInsideBuilding: saveApartmentInsideBuilding,
    ResidentialBuilding: saveResidentialBuilding,
    tower: saveTower,
    compHouse: saveCompHouse,
    additionalBuildings: saveAdditionalBuildings,
  };

  const action = actionsMap[type];
  if (action) {
    dispatch(action(data));
  }
};
