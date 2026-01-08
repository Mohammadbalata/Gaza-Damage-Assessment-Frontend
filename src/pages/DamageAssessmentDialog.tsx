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
  // Use a local loading state to strictly control the button
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const [isChangeToReviewPage, setIsChangeToReviewPage] = useState(readOnly);
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
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
  const { floors: floorsResidential, units: unitsResisential } = useAppSelector(
    (state) => state.damage.ResidentialBuilding.MixedUsage
  );
  const { floors: floorsTower, units: unitsTower } = useAppSelector(
    (state) => state.damage.tower.MixedUsage
  );

  // Helper to extract URL from either string or {url: "..."} object
  const getImageUrl = (image: any): string | undefined => {
    if (!image) return undefined;
    if (typeof image === "string") return image;
    if (typeof image === "object" && image.url) return image.url;
    return undefined;
  };

  // Hydrate form with initial data (especially images)
  useEffect(() => {
    if (initialData) {
      const type = initialData?.extraData?.buildingType;

      if (type && initialData.extraData?.[type]) {
        console.log(
          "Building type specific data:",
          initialData.extraData[type]
        );
      }

      // Update Redux state for consistency
      dispatch(setBuildingType(type));
      dispatch(updatePreviousLocation({ previosLocation: initialData }));

      // Update Form State
      setValue("buildingType", type);

      // Hydrate extra fields
      if (initialData.extraData && initialData.extraData[type]) {
        setValue(type as any, initialData.extraData[type]);
        dispatchByType(dispatch, type, initialData.extraData);
      }

      // Hydrate Images (Critical for Edit Mode)
      // Check multiple possible locations for image URLs
      const buildingData = initialData.extraData?.[type] || {};
      const extraDataRoot = initialData.extraData || {};

      // Try multiple locations: root level, extraData root, building-specific
      // Also handle nested {url: "..."} structure from Supabase
      const beforeWarImage =
        getImageUrl(initialData.beforeWarImage) ||
        getImageUrl(extraDataRoot.beforeWarImage) ||
        getImageUrl(buildingData.beforeWarImage);

      const afterWarImage =
        getImageUrl(initialData.afterWarImage) ||
        getImageUrl(extraDataRoot.afterWarImage) ||
        getImageUrl(buildingData.afterWarImage);

      // For ownership documents, handle array of objects
      let ownershipDocuments =
        initialData.ownershipDocuments ||
        extraDataRoot.ownershipDocuments ||
        buildingData.ownershipDocuments;

      if (Array.isArray(ownershipDocuments)) {
        ownershipDocuments = ownershipDocuments
          .map((doc: any) => getImageUrl(doc) || doc)
          .filter(Boolean);
      }

      if (beforeWarImage) {
        setValue(`${type}.beforeWarImage` as any, beforeWarImage);
      }
      if (afterWarImage) {
        setValue(`${type}.afterWarImage` as any, afterWarImage);
      }
      if (
        ownershipDocuments &&
        Array.isArray(ownershipDocuments) &&
        ownershipDocuments.length > 0
      ) {
        setValue(`${type}.ownershipDocuments` as any, ownershipDocuments);
      }
    }
  }, [initialData, dispatch, setValue]);

  const resetBuildingTypeSelect = () => {
    setValue("buildingType", "");
    dispatch(setBuildingType(""));
    dispatch(resetAllBuildings());
  };

  const buildApplication = (data: any) => ({
    buildingType: data.buildingType,
    extraData: data.extraData,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,
    neighborhood: data.neighborhood,
    beforeWarImage: data.beforeWarImage,
    afterWarImage: data.beforeWarImage,
    ownershipDocuments: data.ownershipDocuments,
  });

  const createApplicationFormData = (application: any) => {
    const formData = new FormData();

    // Safety check for numeric values
    if (application.latitude !== undefined && application.latitude !== null) {
      formData.append("latitude", application.latitude);
      // Also send as nested location object in case backend expects it
      // formData.append("location[latitude]", application.latitude.toString());
    }
    if (application.longitude !== undefined && application.longitude !== null) {
      formData.append("longitude", application.longitude);
      // formData.append("location[longitude]", application.longitude.toString());
    }

    const address = application?.address || "";
    const neighborhood = application?.neighborhood || "";

    formData.append("address", address);
    formData.append("neighborhood", neighborhood);

    // Nested fallbacks
    formData.append("location[address]", address);
    formData.append("location[neighborhood]", neighborhood);

    formData.append(
      "extraData",
      JSON.stringify({
        buildingType: application.buildingType,
        [application.buildingType]: application.extraData,
      })
    );

    if (application.beforeWarImage instanceof File) {
      formData.append("beforeWarImage", application.beforeWarImage);
    }
    if (application.afterWarImage instanceof File) {
      formData.append("afterWarImage", application.afterWarImage);
    }

    if (Array.isArray(application.ownershipDocuments)) {
      application.ownershipDocuments.forEach((file: any) => {
        // Only append actual File objects.
        // If backend updates files by replacement, verify if we need to send existing string URLs.
        // Usually FormData for file upload expects Files. Sending strings might break it.
        // We assume backend keeps existing files if not sent, or we deal with new files only.
        if (file instanceof File) {
          formData.append("ownershipDocuments", file);
        }
      });
    }

    return formData;
  };
  const reBuildData = (formdata: any) => {
    if (formdata.buildingType === "ResidentialBuilding") {
      const data = {
        ...formdata,
        ResidentialBuilding: {
          ...formdata.ResidentialBuilding,
          MixedUsage: {
            floors: floorsResidential,
            units: unitsResisential,
          },
        },
      };
      // console.log("final payload", data);
      return data;
    } else if (formdata.buildingType === "tower") {
      const data = {
        ...formdata,
        tower: {
          ...formdata.tower,
          MixedUsage: {
            floors: floorsTower,
            units: unitsTower,
          },
        },
      };
      // console.log("into tower");
      // console.log("final payload", data);
      return data;
    }
  };

  const onSubmit = async (formdata: any) => {
    let data = formdata;
    // console.log(data);
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
      const neighborhood = location?.neighborhood ?? initLoc?.neighborhood;

      console.log("Submitting Data - Coords:", { latitude, longitude });

      const reBuildData = {
        buildingType: type,
        extraData: formDataWithoutImg[type],
        beforeWarImage: data[type]?.beforeWarImage,
        afterWarImage: data[type]?.afterWarImage,
        ownershipDocuments: data[type]?.ownershipDocuments,
        latitude,
        longitude,
        neighborhood,
        address,
      };

      const application = buildApplication(reBuildData);

      // Update Redux state
      dispatch(updatePreviousLocation({ previosLocation: application }));

      // API Call
      console.log(application);
      const token = localStorage.getItem("token");
      const formData = createApplicationFormData(application);

      const obj = Object.fromEntries(formData.entries());
      console.log(obj);

      if (initialData?.id) {
        // Update existing application
        await axiosClient.put(
          `${API.citizen.applications.update(initialData.id)}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(() => {
          console.log('send edits on dialog form')
        }).catch((err:any) => {
          console.log(err)
        })
      } else {
        // Create new application
        await axiosClient.post(`${API.citizen.locations.previous}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Success feedback
      enqueueSnackbar(t("common.success"), { variant: "success" });

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
                : ROUTES.CURRENT_LOCATION
            );
          }
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(t("common.error"), { variant: "error" });
      setIsSubmitting(false); // Re-enable if error occurred
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axiosClient
      .get(`${API.citizen.applications.list}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: any) => {
        const isCurrent = res.data.data.citizen.current_location;
        if (isCurrent) {
          setIsCurrentLocation(true);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!initialData) {
      resetBuildingTypeSelect();
    }
  }, [onClose]);

  // Render logic extracted to specific helper or inline
  const renderBuildingContent = () => {
    if (!damageAssessmentInfo.buildingType) return null;
    const selected =
      damageAssessmentInfo.buildingType || initialData.extraData.buildingType;

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
