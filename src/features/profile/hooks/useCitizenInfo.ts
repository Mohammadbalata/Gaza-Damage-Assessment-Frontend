import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/redux";
import {
  fetchCitizenInfo,
  saveCitizenInfo,
  setCitizenInfo,
} from "../../../app/store/slices/citizenSlice";
import { getToken } from "../../../shared/utils/storage";

export const useCitizenInfo = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, loaded } = useAppSelector((s) => s.citizen);

  useEffect(() => {
    if (!loaded && !loading && getToken()) {
      dispatch(fetchCitizenInfo());
    }
  }, [loaded, loading, dispatch]);

  return {
    citizenInfo: data,
    loading,
    error,
    loaded,
    refetch: () => dispatch(fetchCitizenInfo()).unwrap(),
    save: (formData: FormData) =>
      dispatch(saveCitizenInfo(formData)).unwrap(),
    setCitizenInfo: (info: any) => dispatch(setCitizenInfo(info)),
  };
};
