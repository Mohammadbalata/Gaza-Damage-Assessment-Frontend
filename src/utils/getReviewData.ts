import { setNationalId } from "../redux/slices/authSlice";
import {
  saveAdditionalBuildings,
  saveApartmentInsideBuilding,
  saveCompHouse,
  saveIndependentBuilding,
  saveResidentialBuilding,
  saveTower,
} from "../redux/slices/damageSlice";
import {
  updateCurrentLocation,
  updatePreviousLocation,
} from "../redux/slices/locationSlice";
// import { dispatchBuildingType } from "./dispatchBuildingType";

export const getReviewData = (dispatch: any, res: any) => {
  // const prevLocation = res.data.data.locations.filter(
  //   (location: any) => location.type === "before_war"
  // );
  // const currectLocation = res.data.data.locations.filter(
  //   (location: any) => location.type === "current"
  // );
  // dispatch(
  //   updatePreviousLocation({
  //     previousLatitude: prevLocation[0]?.latitude,
  //     previousLongitude: prevLocation[0]?.longitude,
  //     previousLocationAddress: prevLocation[0]?.governorate,
  //   })
  // );
  // dispatch(
  //   updateCurrentLocation({
  //     currentLatitude: currectLocation[0]?.latitude,
  //     currentLongitude: currectLocation[0]?.longitude,
  //     currentLocationAddress: currectLocation[0]?.governorate,
  //   })
  // );
  dispatch(setNationalId(res.data.data.citizen.national_id));
  // dispatchBuildingType(dispatch, res.data.data.extraData);
  // console.log(res.data.data.locations)
  const locations = res.data.data.locations;
  locations.map((location: any) => {
    if (location.type === "before_war") {
      dispatch(
        updatePreviousLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          governorate: location.governorate,
          propertyDamaged: {
            buildingType: location.buildingType,
            [location.buildingType]: location.data,
          },
        })
      );
      const extraData = JSON.parse(res.data.data.locations[0].extraData);

      const type = extraData.buildingType;
      if (type === "IndependentBuilding")
        dispatch(saveIndependentBuilding(extraData));
      if (type === "ApartmentInsideBuilding")
        dispatch(saveApartmentInsideBuilding(extraData));
      if (type === "ResidentialBuilding")
        dispatch(saveResidentialBuilding(extraData));
      if (type === "tower") dispatch(saveTower(extraData));
      if (type === "compHouse") {
        dispatch(saveCompHouse(extraData));
      }
      if (type === "additionalBuildings")
        dispatch(saveAdditionalBuildings(extraData));
    } else if (location.type === "current") {
      dispatch(
        updateCurrentLocation({
          currentLatitude: location.latitude,
          currentLongitude: location.longitude,
          currentLocationAddress: location.governorate,
        })
      );
    }
  });
  // const type = res.data.data.extraData.buildingType;
  // const formData = res.data.data.extraData;
  // if (type === "IndependentBuilding")
  //   dispatch(saveIndependentBuilding(formData));
  // if (type === "ApartmentInsideBuilding")
  //   dispatch(saveApartmentInsideBuilding(formData));
  // if (type === "ResidentialBuilding")
  //   dispatch(saveResidentialBuilding(formData));
  // if (type === "tower") dispatch(saveTower(formData));
  // if (type === "compHouse") {
  //   dispatch(saveCompHouse(formData));
  // }
  // if (type === "additionalBuildings")
  //   dispatch(saveAdditionalBuildings(formData));
  // console.log(type)
  // console.log(res.data.data.locations[0].extraData);
};
