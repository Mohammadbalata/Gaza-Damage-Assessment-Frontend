import { useForm } from "react-hook-form";
import { useLanguage } from "../../../../app/providers/LanguageContext";


import {
  buildFormDataWithoutImages,
  buildingOptions,
  dispatchByType,
} from "../../utils/DamageAssessment";
import { IDamageAssessmentState } from "../../../../shared/types/store/IDamageAssessmentState";
import IndependentBuilding from "./IndependentBuilding";
import Tower from "./Tower";

import ApartmentInsideBuilding from "./ApartmentInsideBuilding";
import CampHousing from "./CampHousing";
import AdditionalBuildings from "./AdditionalBuildings";
import ResidentialBuilding from "./ResidentialBuilding";
import { AlertCircle } from "lucide-react";

import {
  Button,
  CircularProgress,
  DialogActions,
  Box,
  Typography,
  alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { ROUTES } from "../../../../app/router/Routes";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../../../shared/api/api";
import { getCitizenInfo, getToken } from "../../../../shared/utils/storage";
import { Login as LoginIcon, ArrowBack } from "@mui/icons-material";
import { API } from "../../../../shared/constants/ApiRoutes";
import { useSnackbar } from "notistack";
import LanguageToggle from "../../../../shared/ui/LanguageToggle";
import { useAppDispatch, useAppSelector } from "../../../../shared/hooks/redux";
import { resetAllBuildings, setBuildingType } from "../../../../app/store/slices/damageSlice";
import { updatePreviousLocation } from "../../../../app/store/slices/locationSlice";
import DamageAssessmentStepper from "../../../../shared/components/DamageAssessmentStepper";

interface DamageAssessmentFormProps {
  onClose?: () => void;
  location: any;
  readOnly?: boolean;
  initialData?: any;
  onSuccess?: () => void;
  isPage?: boolean;
}

const DamageAssessmentForm = ({
  onClose,
  location,
  readOnly = false,
  initialData,
  onSuccess,
  isPage = false,
}: DamageAssessmentFormProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const damageAssessmentInfo = useAppSelector((state) => state.damage);
  const citizenInfo = getCitizenInfo<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const [isChangeToReviewPage, setIsChangeToReviewPage] = useState(readOnly);
  const [isCurrentLocation] = useState<boolean>(
    citizenInfo.current_location !== null,
  );
  const { enqueueSnackbar } = useSnackbar();
  const isRTL = language === "ar";

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
      compHouse: damageAssessmentInfo.compHouse,
      additionalBuildings: damageAssessmentInfo.additionalBuildings,
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

  const getImageUrl = (image: any): string | undefined => {
    if (!image) return undefined;
    if (typeof image === "string") return image;
    if (typeof image === "object") {
      if (image.url) return image.url;
      if (image.file_url) return image.file_url;
      if (image.image_url) return image.image_url;
    }
    return undefined;
  };

  const cleanSerializableData = (data: any) => {
    if (!data) return data;
    const cleaned = JSON.parse(
      JSON.stringify(data, (value: any) => {
        if (value instanceof File) return undefined;
        return value;
      }),
    );
    return cleaned;
  };

  useEffect(() => {
    if (initialData) {
      const type = initialData?.damage_details?.buildingType;
      dispatch(setBuildingType(type));
      dispatch(
        updatePreviousLocation({
          previosLocation: cleanSerializableData(initialData),
        }),
      );
      setValue("buildingType", type);

      if (initialData.damage_details && initialData.damage_details[type]) {
        setValue(type as any, initialData.damage_details[type]);
        dispatchByType(dispatch, type, initialData.damage_details);
      }

      const serializableData = {
        ...initialData,
        before_damage_image: getImageUrl(initialData.before_damage_image),
        after_damage_image: getImageUrl(initialData.after_damage_image),
        ownership_documents: Array.isArray(initialData.ownership_documents)
          ? initialData.ownership_documents.map((doc: any) => getImageUrl(doc))
          : initialData.ownership_documents,
      };

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

      const buildingData = initialData.damage_details?.[type] || {};
      const damageDetailsRoot = initialData.damage_details || {};

      const before_damage_image =
        getImageUrl(initialData.before_damage_image) ||
        getImageUrl(damageDetailsRoot.before_damage_image) ||
        getImageUrl(buildingData.before_damage_image);

      const after_damage_image =
        getImageUrl(initialData.after_damage_image) ||
        getImageUrl(damageDetailsRoot.after_damage_image) ||
        getImageUrl(buildingData.after_damage_image);

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
    formData.append("_method", initialData?.id ? "PUT" : "POST");

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

    formData.append("address", address);
    formData.append("governorate_id", governorate_id);
    formData.append("municipality_id", municipality_id);
    formData.append("neighborhood_id", neighborhood_id);
    if (landmark_id) formData.append("landmark_id", landmark_id);

    formData.append("location[address]", address);
    formData.append("location[governorate_id]", governorate_id);
    formData.append("location[municipality_id]", municipality_id);
    formData.append("location[neighborhood_id]", neighborhood_id);
    if (landmark_id) formData.append("location[landmark_id]", landmark_id);

    formData.append(
      "damage_details",
      JSON.stringify({
        buildingType: application.buildingType,
        [application.buildingType]: application.damage_details,
      }),
    );

    if (application.before_damage_image instanceof File) {
      formData.append("before_damage_image", application.before_damage_image);
    }
    if (application.after_damage_image instanceof File) {
      formData.append("after_damage_image", application.after_damage_image);
    }

    if (Array.isArray(application.ownership_documents)) {
      application.ownership_documents.forEach((file: any) => {
        if (file instanceof File) {
          formData.append("ownership_documents[]", file);
        }
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

    // Sync to Redux before moving to review or submitting
    const type = data.buildingType;
    const formDataWithoutImg: any = buildFormDataWithoutImages(data);
    dispatchByType(dispatch, type, formDataWithoutImg);

    if (!isChangeToReviewPage) {
      setIsChangeToReviewPage(true);
      return;
    }

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

      const initLoc = initialData?.location || initialData;

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
      const landmark_id = location?.landmark_id || initLoc?.landmark_id;
      const landmark = location?.landmark ?? initLoc?.landmark;

      const reBuildDataMap = {
        buildingType: type,
        damage_details: {
          ...formDataWithoutImg[type],
          ...(landmark ? { landmark } : {}),
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

      const application = buildApplication(reBuildDataMap);
      const token = getToken();
      const formData = createApplicationFormData(application);

      if (initialData?.id) {
        await axiosClient.post(
          `${API.citizen.damageReports.update(initialData.id)}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
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

      enqueueSnackbar(t("common.success"), { variant: "success" });

      if (onSuccess) {
        onSuccess();
        onClose?.();
      } else {
        setTimeout(() => {
          if (initialData) {
            window.location.reload();
          } else {
            navigate(
              isCurrentLocation
                ? ROUTES.CITIZEN_DASHBOARD
                : ROUTES.CURRENT_LOCATION,
            );
          }
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(t("common.error"), { variant: "error" });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      const type = initialData?.damage_details?.buildingType;
      dispatch(setBuildingType(type));
      setValue("buildingType", type);

      if (initialData.damage_details && initialData.damage_details[type]) {
        setValue(type as any, initialData.damage_details[type]);
        dispatchByType(dispatch, type, initialData.damage_details);
      }

      const buildingData = initialData.damage_details?.[type] || {};
      const damageDetailsRoot = initialData.damage_details || {};

      let before_damage_image =
        getImageUrl(initialData.before_damage_image) ||
        getImageUrl(damageDetailsRoot.before_damage_image) ||
        getImageUrl(buildingData.before_damage_image);

      let after_damage_image =
        getImageUrl(initialData.after_damage_image) ||
        getImageUrl(damageDetailsRoot.after_damage_image) ||
        getImageUrl(buildingData.after_damage_image);

      let ownership_documents =
        initialData.ownership_documents ||
        damageDetailsRoot.ownership_documents ||
        buildingData.ownership_documents;

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

  const renderBuildingContent = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected =
      damageAssessmentInfo.buildingType ||
      initialData?.damage_details?.buildingType;

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
    <div className={classNames("w-full mx-auto", { "p-4 sm:p-8": isPage })}>
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
        <DamageAssessmentStepper
          activeStep={2}
          step1Completed={true}
          step2Completed={true}
        />
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
            {!(
              (location?.governorate_id || initialData?.governorate_id) &&
              (location?.municipality_id || initialData?.municipality_id) &&
              (location?.neighborhood_id || initialData?.neighborhood_id)
            ) && (
              <Box
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: "error.lighter",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "error.light",
                  textAlign: "center",
                  backgroundColor: (theme) =>
                    alpha(theme.palette.error.main, 0.05),
                }}
              >
                <Typography
                  variant="body1"
                  color="error.main"
                  fontWeight="bold"
                >
                  {t("common.locationRequired")}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  يرجى التأكد من استكمال بيانات الموقع قبل البدء في تعبئة تفاصيل
                  الضرر.
                </Typography>
              </Box>
            )}

            <div
              className={`space-y-4 ${
                !(
                  (location?.governorate_id || initialData?.governorate_id) &&
                  (location?.municipality_id || initialData?.municipality_id) &&
                  (location?.neighborhood_id || initialData?.neighborhood_id)
                )
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <div
                className="rtl:text-right"
                style={{ direction: language === "ar" ? "rtl" : "ltr" }}
              >
                <label
                  htmlFor="buildingType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("form.buildingType")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="buildingType"
                  {...register("buildingType", {
                    required: t("common.required"),
                  })}
                  className={classNames(
                    "input-field w-full p-2 border rounded",
                    {
                      "bg-gray-200 cursor-not-allowed": isViewMode,
                    },
                  )}
                  onChange={(e) => {
                    dispatch(setBuildingType(e.target.value));
                  }}
                  disabled={isViewMode}
                  value={damageAssessmentInfo.buildingType}
                >
                  <option value="" disabled>
                    {t("selectBuilding.title")}
                  </option>
                  {buildingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
                {errors.buildingType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.buildingType.message}
                  </p>
                )}
              </div>
              {renderBuildingContent()}
            </div>
          </div>

          {!readOnly && (
            <DialogActions
              sx={{ mt: 4, px: 0, justifyContent: "space-between" }}
            >
              <Box>
                <Button
                  size="large"
                  onClick={() => {
                    const currentValues = getValues();
                    if (currentValues.buildingType) {
                      const dataToSync =
                        buildFormDataWithoutImages(currentValues);
                      dispatchByType(
                        dispatch,
                        currentValues.buildingType,
                        dataToSync,
                      );
                    }
                    if (isChangeToReviewPage) {
                      setIsChangeToReviewPage(false);
                    } else if (isPage) {
                      navigate(-1);
                    } else {
                      dispatch(resetAllBuildings());
                      onClose?.();
                    }
                  }}
                  sx={{ mr: 1 }}
                  disabled={isSubmitting}
                  startIcon={
                    isPage && !isChangeToReviewPage ? (
                      <ArrowBack
                        sx={{ transform: isRTL ? "rotate(180deg)" : "none" }}
                      />
                    ) : null
                  }
                >
                  {isChangeToReviewPage
                    ? t("common.edit")
                    : isPage && !isChangeToReviewPage
                      ? t("common.back")
                      : t("common.cancel")}
                </Button>
              </Box>

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
              <Button
                variant="contained"
                onClick={() => (isPage ? navigate(-1) : onClose?.())}
                size="large"
              >
                {t("common.close")}
              </Button>
            </DialogActions>
          )}
        </form>
      </div>
      <LanguageToggle />
    </div>
  );
};

export default DamageAssessmentForm;
