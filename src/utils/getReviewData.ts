
import { setNationalId } from "../redux/slices/authSlice";
import {
  updateCurrentLocation,
  updatePreviousLocation,
} from "../redux/slices/locationSlice";

export const getReviewData = (dispatch: any, res: any) => {
  const prevLocation = res.data.data.locations.filter(
    (location: any) => location.type === "before_war"
  );
  const currectLocation = res.data.data.locations.filter(
    (location: any) => location.type === "current"
  );
  dispatch(
    updatePreviousLocation({
      previousLatitude: prevLocation[0].latitude,
      previousLongitude: prevLocation[0].longitude,
      previousLocationAddress: prevLocation[0].governorate,
    })
  );
  dispatch(
    updateCurrentLocation({
      currentLatitude: currectLocation[0].latitude,
      currentLongitude: currectLocation[0].longitude,
      currentLocationAddress: currectLocation[0].governorate,
    })
  );
  dispatch(setNationalId(res.data.data.citizen.national_id));
};
