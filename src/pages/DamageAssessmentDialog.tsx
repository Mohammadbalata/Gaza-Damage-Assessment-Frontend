import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  resetAllBuildings,
  setBuildingType,
} from "../redux/slices/damageSlice";
import {
  buildFormDataWithoutImages,
  buildingOptions,
  dispatchByType,
} from "../utils/DamageAssessment";
import { IDamageAssessmentState } from "../interfaces/store/IDamageAssessmentState";
import IndependentBuilding from "../components/Form Applications/IndependentBuilding";
import Tower from "../components/Form Applications/Tower";

import ApartmentInsideBuilding from "../components/Form Applications/ApartmentInsideBuilding";
import CampHousing from "../components/Form Applications/CampHousing";
import AdditionalBuildings from "../components/Form Applications/AdditionalBuildings";
import ResidentialBuilding from "../components/Form Applications/ResidentialBuilding";
import { AlertCircle } from "lucide-react";
import { Button, CircularProgress, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { updatePreviousLocation } from "../redux/slices/locationSlice";
import { ROUTES } from "../routes/Routes";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../api/baseUrl";
import { Login as LoginIcon } from "@mui/icons-material";
import { API } from "../constants/ApiRoutes";
import { useSnackbar } from "notistack";

interface DamageAssessmentDialogProps {
  onClose: () => void;
  location: any;
  readOnly?: boolean;
  initialData?: any;
  onSuccess?: () => void;
}

const DamageAssessmentDialog = ({
  onClose,
  location,
  readOnly = false,
  initialData,
  onSuccess,
}: DamageAssessmentDialogProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const damageAssessmentInfo = useAppSelector((state) => state.damage);
  const citizenInfo = useAppSelector((state) => state.auth.citizenInfo);
  // Use a local loading state to strictly control the button
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const [isChangeToReviewPage, setIsChangeToReviewPage] = useState(readOnly);
  const [isCurrentLocation] = useState<boolean>(
    citizenInfo.current_location !== null,
  );
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm<IDamageAssessmentState>({
    defaultValues: {
      buildingType: damageAssessmentInfo.buildingType || "",
      IndependentBuilding: damageAssessmentInfo.IndependentBuilding || "",
      ApartmentInsideBuilding: damageAssessmentInfo.ApartmentInsideBuilding,
      ResidentialBuilding: damageAssessmentInfo.ResidentialBuilding,
      tower: damageAssessmentInfo.tower || "",
      loading: damageAssessmentInfo.loading,
      error: damageAssessmentInfo.error,
    },
  });
  const floorsResidential = useAppSelector((state) => ({
    ground: state.damage.ResidentialBuilding.MixedUsage_floors_ground,
    mezzanine: state.damage.ResidentialBuilding.MixedUsage_floors_mezzanine,
    roof: state.damage.ResidentialBuilding.MixedUsage_floors_roof,
  }));
  const unitsResisential = useAppSelector((state) => ({
    ground: state.damage.ResidentialBuilding.MixedUsage_units_ground,
    mezzanine: state.damage.ResidentialBuilding.MixedUsage_units_mezzanine,
    roof: state.damage.ResidentialBuilding.MixedUsage_units_roof,
  }));

  const floorsTower = useAppSelector((state) => ({
    ground: state.damage.tower.MixedUsage_floors_ground,
    mezzanine: state.damage.tower.MixedUsage_floors_mezzanine,
    roof: state.damage.tower.MixedUsage_floors_roof,
  }));
  const unitsTower = useAppSelector((state) => ({
    ground: state.damage.tower.MixedUsage_units_ground,
    mezzanine: state.damage.tower.MixedUsage_units_mezzanine,
    roof: state.damage.tower.MixedUsage_units_roof,
  }));

  // Helper to extract URL from either string or {url: "..."} object
  // في DamageAssessmentDialog.tsx

  const getImageUrl = (image: any): string | undefined => {
    if (!image) return undefined;

    // إذا كان string
    if (typeof image === "string") return image;

    // إذا كان object ويحتوي على url
    if (typeof image === "object") {
      if (image.url) return image.url;
      if (image.file_url) return image.file_url;
      if (image.image_url) return image.image_url;
    }

    return undefined;
  };
  // Create a cleaning function
  const cleanSerializableData = (data: any) => {
    if (!data) return data;

    // Create a deep copy
    const cleaned = JSON.parse(
      JSON.stringify(data, (value:any) => {
        // Skip File objects
        if (value instanceof File) {
          return undefined;
        }
        return value;
      }),
    );

    return cleaned;
  };

  // Hydrate form with initial data (especially images)
  useEffect(() => {
    if (initialData) {
      const type = initialData?.damage_details?.buildingType;

      if (type && initialData.damage_details?.[type]) {
        console.log(
          "Building type specific data:",
          initialData.damage_details[type],
        );
      }

      // Update Redux state for consistency
      dispatch(setBuildingType(type));
      dispatch(
        updatePreviousLocation({
          previosLocation: cleanSerializableData(initialData),
        }),
      );
      // dispatch(updatePreviousLocation({ previosLocation: initialData }));

      // Update Form State
      setValue("buildingType", type);

      // Hydrate extra fields
      if (initialData.damage_details && initialData.damage_details[type]) {
        setValue(type as any, initialData.damage_details[type]);
        dispatchByType(dispatch, type, initialData.damage_details);
      }

      // Create a serializable version for Redux
      const serializableData = {
        ...initialData,
        // Convert any File objects to their metadata or remove them
        before_damage_image: getImageUrl(initialData.before_damage_image),
        after_damage_image: getImageUrl(initialData.after_damage_image),
        ownership_documents: Array.isArray(initialData.ownership_documents)
          ? initialData.ownership_documents.map((doc: any) => getImageUrl(doc))
          : initialData.ownership_documents,
      };

      // Update Redux state with serializable data only
      dispatch(setBuildingType(type));
      dispatch(
        updatePreviousLocation({
          previosLocation: serializableData,
        }),
      );

      const hasFileObjects = JSON.stringify(initialData).includes('"File"');
      if (!hasFileObjects) {
        dispatch(updatePreviousLocation({ previosLocation: initialData }));
      }

      // Hydrate Images (Critical for Edit Mode)
      // Check multiple possible locations for image URLs
      const buildingData = initialData.damage_details?.[type] || {};
      const damageDetailsRoot = initialData.damage_details || {};

      // Try multiple locations: root level, damage_details root, building-specific
      // Also handle nested {url: "..."} structure from Supabase
      const before_damage_image =
        getImageUrl(initialData.before_damage_image) ||
        getImageUrl(damageDetailsRoot.before_damage_image) ||
        getImageUrl(buildingData.before_damage_image);

      const after_damage_image =
        getImageUrl(initialData.after_damage_image) ||
        getImageUrl(damageDetailsRoot.after_damage_image) ||
        getImageUrl(buildingData.after_damage_image);

      // For ownership documents, handle array of objects
      let ownership_documents =
        initialData.ownership_documents ||
        damageDetailsRoot.ownership_documents ||
        buildingData.ownership_documents;

      if (Array.isArray(ownership_documents)) {
        ownership_documents = ownership_documents
          .map((doc: any) => getImageUrl(doc) || doc)
          .filter(Boolean);
      }

      if (before_damage_image) {
        setValue(`${type}.before_damage_image` as any, before_damage_image);
      }
      if (after_damage_image) {
        setValue(`${type}.after_damage_image` as any, after_damage_image);
      }
      if (
        ownership_documents &&
        Array.isArray(ownership_documents) &&
        ownership_documents.length > 0
      ) {
        setValue(`${type}.ownership_documents` as any, ownership_documents);
      }
    }
  }, [initialData, dispatch, setValue]);

  // const resetBuildingTypeSelect = () => {
  //   setValue("buildingType", "");
  //   dispatch(setBuildingType(""));
  //   dispatch(resetAllBuildings());
  // };

  const buildApplication = (data: any) => ({
    buildingType: data.buildingType,
    damage_details: data.damage_details,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,
    governorate_id: data.governorate_id,
    municipality_id: data.municipality_id,
    neighborhood_id: data.neighborhood_id,
    landmark_id: data.landmark_id,
    before_damage_image: data.before_damage_image,
    after_damage_image: data.after_damage_image,
    ownership_documents: data.ownership_documents,
  });

  const createApplicationFormData = (application: any) => {
    const formData = new FormData();
    formData.append("_method", initialData?.id ? "PUT" : "POST"); // For Laravel method spoofing

    // Safety check for numeric values
    if (application.latitude !== undefined && application.latitude !== null) {
      formData.append("latitude", application.latitude);
    }
    if (application.longitude !== undefined && application.longitude !== null) {
      formData.append("longitude", application.longitude);
    }

    const address = application?.address || "";
    const governorate_id = application?.governorate_id;
    const municipality_id = application?.municipality_id;
    const neighborhood_id = application?.neighborhood_id;
    const landmark_id = application?.landmark_id;

    if (!neighborhood_id) {
      console.warn("neighborhood_id is missing in application data");
    }

    formData.append("address", address);
    formData.append("governorate_id", governorate_id);
    formData.append("municipality_id", municipality_id);
    formData.append("neighborhood_id", neighborhood_id);
    formData.append("landmark_id", landmark_id);

    // Nested fallbacks
    formData.append("location[address]", address);
    formData.append("location[governorate_id]", governorate_id);
    formData.append("location[municipality_id]", municipality_id);
    formData.append("location[neighborhood_id]", neighborhood_id);
    formData.append("location[landmark_id]", landmark_id);

    formData.append(
      "damage_details",
      JSON.stringify({
        buildingType: application.buildingType,
        [application.buildingType]: application.damage_details,
      }),
    );

    // ✅ التعامل مع before_damage_image - فقط إذا كان File جديد
    if (application.before_damage_image instanceof File) {
      formData.append("before_damage_image", application.before_damage_image);
    }
    // لا نضيف أي شيء إذا كان string (URL) لأن الصورة موجودة مسبقاً على السيرفر

    // ✅ التعامل مع after_damage_image - فقط إذا كان File جديد
    if (application.after_damage_image instanceof File) {
      formData.append("after_damage_image", application.after_damage_image);
    }

    // ✅ التعامل مع ownership_documents - فقط Files الجديدة
    if (Array.isArray(application.ownership_documents)) {
      console.log(
        "ownership_documents array length",
        application.ownership_documents.length,
      );
      application.ownership_documents.forEach((file: any) => {
        // فقط أضف الملفات الجديدة (من نوع File)
        if (file instanceof File) {
          formData.append("ownership_documents[]", file);
          console.log("Appending new ownership document file");
        }
        // لا نضيف URLs لأنها موجودة مسبقاً
      });
    }

    return formData;
  };
  const reBuildData = (formdata: any) => {
    const filterEmptyMixedUsage = (buildingData: any) => {
      const filtered: any = { ...buildingData };
      const mixedUsageKeys = [
        "MixedUsage_floors_ground",
        "MixedUsage_floors_mezzanine",
        "MixedUsage_floors_roof",
        "MixedUsage_units_ground",
        "MixedUsage_units_mezzanine",
        "MixedUsage_units_roof",
      ];

      mixedUsageKeys.forEach((key) => {
        const value = filtered[key];
        if (value === false || (Array.isArray(value) && value.length === 0)) {
          delete filtered[key];
        }
      });
      return filtered;
    };

    if (formdata.buildingType === "ResidentialBuilding") {
      const residentialData = {
        ...formdata.ResidentialBuilding,
        MixedUsage_floors_ground: floorsResidential.ground,
        MixedUsage_floors_mezzanine: floorsResidential.mezzanine,
        MixedUsage_floors_roof: floorsResidential.roof,
        MixedUsage_units_ground: unitsResisential.ground,
        MixedUsage_units_mezzanine: unitsResisential.mezzanine,
        MixedUsage_units_roof: unitsResisential.roof,
      };

      return {
        ...formdata,
        ResidentialBuilding: filterEmptyMixedUsage(residentialData),
      };
    } else if (formdata.buildingType === "tower") {
      const towerData = {
        ...formdata.tower,
        MixedUsage_floors_ground: floorsTower.ground,
        MixedUsage_floors_mezzanine: floorsTower.mezzanine,
        MixedUsage_floors_roof: floorsTower.roof,
        MixedUsage_units_ground: unitsTower.ground,
        MixedUsage_units_mezzanine: unitsTower.mezzanine,
        MixedUsage_units_roof: unitsTower.roof,
      };

      return {
        ...formdata,
        tower: filterEmptyMixedUsage(towerData),
      };
    }
    return formdata;
  };

  const onSubmit = async (formdata: any) => {
    let data = formdata;
    if (data.buildingType === "ResidentialBuilding") {
      data = reBuildData(data);
    } else if (data.buildingType === "tower") {
      data = reBuildData(data);
    }
    // Phase 1: Review
    if (!isChangeToReviewPage) {
      setIsChangeToReviewPage(true);
      return;
    }

    // Phase 2: Submission
    if (isSubmitting) return;

    try {
      if (
        !isCurrentLocation &&
        !location?.neighborhood_id &&
        !initialData?.neighborhood_id
      ) {
        enqueueSnackbar(t("The neighborhood id field is required."), {
          variant: "error",
        });
        return;
      }
      setIsSubmitting(true);

      const type = data.buildingType;
      const formDataWithoutImg: any = buildFormDataWithoutImages(data);

      dispatchByType(dispatch, type, formDataWithoutImg);

      // Use existing location from initialData if new location prop is not provided (Edit Mode)
      // Or use new location from prop (New Application Mode)
      // Robust fallback: Check strict location object first, then root properties
      const initLoc = initialData?.location || initialData;

      // Try to find coordinates in multiple possible locations
      const latitude =
        location?.position?.[0] ?? initLoc?.latitude ?? initLoc?.lat;
      const longitude =
        location?.position?.[1] ?? initLoc?.longitude ?? initLoc?.lng;
      const address = location?.address ?? initLoc?.address;
      const governorate_id =
        location?.governorate_id || initLoc?.governorate_id;
      const municipality_id =
        location?.municipality_id || initLoc?.municipality_id;
      const neighborhood_id =
        location?.neighborhood_id || initLoc?.neighborhood_id;
      const landmark_id =
        location?.landmark_id || initLoc?.landmark_id;
      const landmark = location?.landmark ?? initLoc?.landmark;

      console.log("Submitting Data - Coords:", { latitude, longitude });
      console.log("Submitting Data - Address:", address);
      console.log("Submitting Data - IDs:", { governorate_id, municipality_id, neighborhood_id, landmark_id });
      console.log("Submitting Data - Nearest Landmark:", landmark);

      const reBuildData = {
        buildingType: type,
        damage_details: {
          ...formDataWithoutImg[type],
          landmark,
        },
        before_damage_image: data[type]?.before_damage_image,
        after_damage_image: data[type]?.after_damage_image,
        ownership_documents: data[type]?.ownership_documents,
        latitude,
        longitude,
        governorate_id,
        municipality_id,
        neighborhood_id,
        landmark_id,
        address,
        landmark,
      };

      const application = buildApplication(reBuildData);

      // Update Redux state
      // dispatch(updatePreviousLocation({ previousLocation: application }));

      // API Call
      console.log("initialData", initialData);
      const token = localStorage.getItem("token");
      const formData = createApplicationFormData(application);

      const obj = Object.fromEntries(formData.entries());
      console.log("formData", obj);

      if (initialData?.id) {
        // Update existing application
        await axiosClient
          .post(
            `${API.citizen.damageReports.update(initialData.id)}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            console.log("send edits on dialog form");
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        // Create new application
        await axiosClient.post(
          `${API.citizen.damageReports.create}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      // Success feedback
      // enqueueSnackbar(t("common.success"), { variant: "success" });

      if (onSuccess) {
        onSuccess();
        onClose();
      } else {
        // Navigation / Refresh
        // If closing dialog inside MyApplications, we might want to reload or just close
        // Simple approach: reload to refresh table if updating existing
        setTimeout(() => {
          if (initialData) {
            // Edit mode -> Reload window or navigate to My Apps (force refresh)
            window.location.reload();
          } else {
            // New mode -> Navigate normally
            navigate(
              isCurrentLocation
                ? ROUTES.CITIZEN_DASHBOARD
                : ROUTES.CURRENT_LOCATION,
            );
          }
        }, 1000);
      }
      enqueueSnackbar(t("common.success"), { variant: "success" });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(t("common.error"), { variant: "error" });
      setIsSubmitting(false); // Re-enable if error occurred
    }
  };

  // في DamageAssessmentDialog.tsx

  useEffect(() => {
    if (initialData) {
      const type = initialData?.damage_details?.buildingType;

      if (type && initialData.damage_details?.[type]) {
        console.log(
          "Building type specific data:",
          initialData.damage_details[type],
        );
      }

      // تحديث Redux
      dispatch(setBuildingType(type));
      // dispatch(updatePreviousLocation({ previosLocation: initialData }));

      // تحديث Form State
      setValue("buildingType", type);

      // تعبئة الحقول الإضافية
      if (initialData.damage_details && initialData.damage_details[type]) {
        setValue(type as any, initialData.damage_details[type]);
        dispatchByType(dispatch, type, initialData.damage_details);
      }

      // معالجة الصور - البحث في أماكن متعددة
      const buildingData = initialData.damage_details?.[type] || {};
      const damageDetailsRoot = initialData.damage_details || {};

      // 1. البحث عن صورة قبل الضرر
      let before_damage_image =
        getImageUrl(initialData.before_damage_image) ||
        getImageUrl(damageDetailsRoot.before_damage_image) ||
        getImageUrl(buildingData.before_damage_image);

      // 2. البحث عن صورة بعد الضرر
      let after_damage_image =
        getImageUrl(initialData.after_damage_image) ||
        getImageUrl(damageDetailsRoot.after_damage_image) ||
        getImageUrl(buildingData.after_damage_image);

      // 3. البحث عن مستندات الملكية
      let ownership_documents =
        initialData.ownership_documents ||
        damageDetailsRoot.ownership_documents ||
        buildingData.ownership_documents;

      // إذا لم نجد الصور بعد، نحاول البحث في damage_attachments
      if (
        initialData.damage_attachments &&
        initialData.damage_attachments.length > 0
      ) {
        if (!before_damage_image) {
          const beforeAtt = initialData.damage_attachments.find(
            (att: any) => att.category === "before_damage_image",
          );
          before_damage_image = beforeAtt?.file_url;
        }

        if (!after_damage_image) {
          const afterAtt = initialData.damage_attachments.find(
            (att: any) => att.category === "after_damage_image",
          );
          after_damage_image = afterAtt?.file_url;
        }

        if (!ownership_documents || ownership_documents.length === 0) {
          const ownershipAtts = initialData.damage_attachments.filter(
            (att: any) => att.category === "ownership_documents",
          );
          if (ownershipAtts.length > 0) {
            ownership_documents = ownershipAtts.map((att: any) => att.file_url);
          }
        }
      }

      // معالجة ownership_documents إذا كانت مصفوفة
      if (Array.isArray(ownership_documents)) {
        ownership_documents = ownership_documents
          .map((doc: any) => getImageUrl(doc) || doc)
          .filter(Boolean);
      }

      // تعيين القيم في الفورم
      if (before_damage_image) {
        setValue(`${type}.before_damage_image` as any, before_damage_image);
      }
      if (after_damage_image) {
        setValue(`${type}.after_damage_image` as any, after_damage_image);
      }
      if (
        ownership_documents &&
        Array.isArray(ownership_documents) &&
        ownership_documents.length > 0
      ) {
        setValue(`${type}.ownership_documents` as any, ownership_documents);
      }

      console.log("Hydrated images:", {
        before: before_damage_image,
        after: after_damage_image,
        docs: ownership_documents,
      });
    }
  }, [initialData, dispatch, setValue]);

  // Render logic extracted to specific helper or inline
  const renderBuildingContent = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected =
      damageAssessmentInfo.buildingType ||
      initialData.damage_details.buildingType;

    const commonProps = {
      register,
      watch,
      control,
      errors,
      isChangeToReviewPage: isChangeToReviewPage,
      setValue,
      getValues,
    };

    switch (selected) {
      case "IndependentBuilding":
        return <IndependentBuilding {...commonProps} />;
      case "ApartmentInsideBuilding":
        return <ApartmentInsideBuilding {...commonProps} />;
      case "ResidentialBuilding":
        return <ResidentialBuilding {...commonProps} />;
      case "tower":
        return <Tower {...commonProps} />;
      case "compHouse":
        return <CampHousing {...commonProps} />;
      case "additionalBuildings":
        return <AdditionalBuildings {...commonProps} />;
      default:
        return null;
    }
  };

  const isViewMode = readOnly || isChangeToReviewPage;

  return (
    <div className="w-full mx-auto">
      {damageAssessmentInfo.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p>{damageAssessmentInfo.error}</p>
        </div>
      )}

      <div
        className={classNames("card shadow-none hover:shadow-none", {
          "bg-gray-50": isViewMode,
        })}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {readOnly ? t("common.reviewRequest") : t("common.damageRequest")}
          </h2>
        </div>

        <form className="space-y-6">
          <div
            className={classNames("space-y-6", {
              "pointer-events-none opacity-90": readOnly,
            })}
          >
            <div
              className={classNames({
                "cursor-not-allowed": isViewMode,
              })}
            >
              <label
                htmlFor="buildingType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.buildingType")} <span className="text-red-500">*</span>
              </label>
              <select
                id="buildingType"
                {...register("buildingType", {
                  required: t("common.required"),
                })}
                className={classNames("input-field w-full p-2 border rounded", {
                  "bg-gray-200 cursor-not-allowed": isViewMode,
                })}
                onChange={(e) => {
                  dispatch(setBuildingType(e.target.value));
                }}
                disabled={isViewMode}
                value={damageAssessmentInfo.buildingType}
              >
                <option value="" disabled>
                  اختر مبنى
                </option>
                {buildingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.buildingType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.buildingType.message}
                </p>
              )}
            </div>
            {/* Inline Rendering to prevent remounts */}
            {renderBuildingContent()}
          </div>
          {/* Actions Area */}
          {!readOnly && (
            <DialogActions sx={{ mt: 4, px: 0 }}>
              <Button
                size="large"
                onClick={() => {
                  if (isChangeToReviewPage) {
                    setIsChangeToReviewPage(false);
                  } else {
                    dispatch(resetAllBuildings());
                    onClose();
                  }
                }}
                sx={{ mr: 1 }}
                disabled={isSubmitting}
              >
                {isChangeToReviewPage ? t("common.edit") : t("common.cancel")}
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                size="large"
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon sx={{ ml: language === "ar" ? 1 : 0 }} />
                  )
                }
                sx={{ px: 4 }}
              >
                {isSubmitting
                  ? ""
                  : isChangeToReviewPage
                    ? t("common.submit")
                    : t("common.reviewRequest")}
              </Button>
            </DialogActions>
          )}

          {readOnly && (
            <DialogActions sx={{ mt: 4, px: 0 }}>
              <Button variant="contained" onClick={onClose} size="large">
                {t("common.close")}
              </Button>
            </DialogActions>
          )}
        </form>
      </div>
    </div>
  );
};

export default DamageAssessmentDialog;
