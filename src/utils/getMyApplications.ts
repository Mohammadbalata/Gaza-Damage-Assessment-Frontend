// import { updateCurrentLocation, updatePreviousLocation } from "../redux/slices/locationSlice";

// export const getMyApplications = (dispatch: any, res: any) => {
//   const locations = res.data.data.locations;
//   const prevLocations = locations.filter(
//     (location: any) => location.type === "before_war"
//   );
//   let prevLocationsChangedExtraData: any[] = [];
//   prevLocations.forEach((location: any) => {
//     const damage_details = JSON.parse(location.damage_details);
//     prevLocationsChangedExtraData.push({
//       ...location,
//       damage_details: damage_details,
//     });
//   });

//   dispatch(
//     updatePreviousLocation({ previosLocations: prevLocationsChangedExtraData })
//   );
//   const currentLocation = locations?.find(
//     (location: any) => location.type === "current"
//   );

//   dispatch(
//     updateCurrentLocation({
//       currentLocation: {
//         currentLatitude: currentLocation?.latitude,
//         currentLongitude: currentLocation?.longitude,
//         currentLocationAddress: currentLocation?.address,
//       },
//     })
//   );
// };
