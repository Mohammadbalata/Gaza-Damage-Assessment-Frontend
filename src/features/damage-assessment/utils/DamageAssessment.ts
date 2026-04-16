import { IDamageAssessmentState } from "../../../shared/types/store/IDamageAssessmentState";
import {
  saveAdditionalBuildings,
  saveApartmentInsideBuilding,
  saveCompHouse,
  saveIndependentBuilding,
  saveResidentialBuilding,
  saveTower,
} from "../../../app/store/slices/damageSlice";

export const buildingOptions = [
  {
    value: "IndependentBuilding",
    label: "form.IndependentBuilding",
  },
  { value: "ApartmentInsideBuilding", label: "form.ApartmentInsideBuilding" },
  { value: "ResidentialBuilding", label: "form.ResidentialBuilding" },
  { value: "tower", label: "form.tower" },
  { value: "compHouse", label: "form.compHouse" },
  {
    value: "additionalBuildings",
    label: "form.additionalBuildings",
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
    label: "damage.structuralCeilingCracks",
    value: "damage.structuralCeilingCracks",
    buildingType: "",
  },
  {
    label: "damage.structuralColumnCracks",
    value: "damage.structuralColumnCracks",
    buildingType: "",
  },
  {
    label: "damage.facadeDamage",
    value: "damage.facadeDamage",
    buildingType: "",
  },
  {
    label: "damage.doorsWindowsDamage",
    value: "damage.doorsWindowsDamage",
    buildingType: "",
  },
  {
    label: "damage.finishingDamage",
    value: "damage.finishingDamage",
    buildingType: "",
  },
  {
    label: "damage.electricityDamage",
    value: "damage.electricityDamage",
    buildingType: "",
  },
  {
    label: "damage.elevatorDamage",
    value: "damage.elevatorDamage",
    buildingType: "بناية",
  },
  {
    label: "damage.buildingStairsEntranceDamage",
    value: "damage.buildingStairsEntranceDamage",
    buildingType: "بناية",
  },
  {
    label: "damage.waterSewageDamage",
    value: "damage.waterSewageDamage",
    buildingType: "",
  },
  {
    label: "damage.fireDamage",
    value: "damage.fireDamage",
    buildingType: "",
  },
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
  {
    label: "building_content.habitable_room",
    value: "building_content.habitable_room",
  },
  {
    label: "building_content.usable_kitchen",
    value: "building_content.usable_kitchen",
  },
  {
    label: "building_content.usable_bathroom",
    value: "building_content.usable_bathroom",
  },
];

export const removeImagesFromBuilding = (buildingData: any) => {
  if (!buildingData) return buildingData;

  const cleaned = { ...buildingData };
  delete cleaned.before_damage_image;
  delete cleaned.after_damage_image;
  delete cleaned.ownership_documents;

  return cleaned;
};

export const buildFormDataWithoutImages = (
  formData: IDamageAssessmentState,
) => {
  const type = formData.buildingType;

  return {
    ...formData,
    [type]: removeImagesFromBuilding(
      formData[type as keyof IDamageAssessmentState],
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
