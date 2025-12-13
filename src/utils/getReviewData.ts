import { setNationalId } from "../redux/slices/authSlice";
import { saveAdditionalBuildings, saveApartmentInsideBuilding, saveCompHouse, saveIndependentBuilding, saveResidentialBuilding, saveTower } from "../redux/slices/damageSlice";
import {
  updateCurrentLocation,
  updatePreviousLocation,
} from "../redux/slices/locationSlice";
// import { dispatchBuildingType } from "./dispatchBuildingType";

export const getReviewData = (dispatch: any, res: any) => {
  const prevLocation = res.data.data.locations.filter(
    (location: any) => location.type === "before_war"
  );
  const currectLocation = res.data.data.locations.filter(
    (location: any) => location.type === "current"
  );
  dispatch(
    updatePreviousLocation({
      previousLatitude: prevLocation[0]?.latitude,
      previousLongitude: prevLocation[0]?.longitude,
      previousLocationAddress: prevLocation[0]?.governorate,
    })
  );
  dispatch(
    updateCurrentLocation({
      currentLatitude: currectLocation[0]?.latitude,
      currentLongitude: currectLocation[0]?.longitude,
      currentLocationAddress: currectLocation[0]?.governorate,
    })
  );
  dispatch(setNationalId(res.data.data.citizen.national_id));
  // dispatchBuildingType(dispatch, res.data.data.extraData);
  const type = res.data.data.extraData.buildingType;
  const formData = res.data.data.extraData
      if (type === "IndependentBuilding")
        dispatch(saveIndependentBuilding(formData));
      if (type === "ApartmentInsideBuilding")
        dispatch(saveApartmentInsideBuilding(formData));
      if (type === "ResidentialBuilding")
        dispatch(saveResidentialBuilding(formData));
      if (type === "tower") dispatch(saveTower(formData));
      if (type === "compHouse") {
        dispatch(saveCompHouse(formData));
      }
      if (type === "additionalBuildings")
        dispatch(saveAdditionalBuildings(formData));
      // console.log(type)
      // console.log(res.data.data.extraData);
};
