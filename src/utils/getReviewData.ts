import {
  setEmail,
  setFamilyName,
  setFatherName,
  setFirstName,
  setGrandfatherName,
  setNationalId,
  setPhoneNumber,
} from "../redux/slices/authSlice";
import {
  updateCurrentLocation,
  updatePreviousLocation,
} from "../redux/slices/locationSlice";

export const getReviewData = (dispatch: any, res: any) => {
  dispatch(setNationalId(res.data.data.citizen.national_id));
  dispatch(setFirstName(res.data.data.citizen.first_name));
  dispatch(setFatherName(res.data.data.citizen.father_name));
  dispatch(setGrandfatherName(res.data.data.citizen.grandfather_name));
  dispatch(setFamilyName(res.data.data.citizen.family_name));
  dispatch(setEmail(res.data.data.citizen.email));
  dispatch(setPhoneNumber(res.data.data.citizen.phone_number));

  const locations = res.data.data.locations;
  const prevLocations = locations.filter(
    (location: any) => location.type === "before_war"
  );
  let prevLocationsChangedExtraData: any[] = [];
  prevLocations.forEach((location: any) => {
    const extraData = JSON.parse(location.extraData);
    prevLocationsChangedExtraData.push({
      ...location,
      extraData: extraData,
    });
  });

  dispatch(
    updatePreviousLocation({ previosLocations: prevLocationsChangedExtraData })
  );
  const currentLocation = locations?.find(
    (location: any) => location.type === "current"
  );

  dispatch(
    updateCurrentLocation({
      currentLocation: {
        currentLatitude: currentLocation?.latitude,
        currentLongitude: currentLocation?.longitude,
        currentLocationAddress: currentLocation?.address,
      },
    })
  );
};
