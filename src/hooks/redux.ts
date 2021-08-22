import firebase from "firebase";
import { useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useLocations = () => {
  const locationCollection = firebase.firestore().collection("locations");


  const [snapshot, loading, error] = useCollection(locationCollection);
  return useMemo(()=> {
      const countryList: Place[] = [];

      snapshot?.forEach((v) => (countryList as any[]).push(v.data()));;
      return [countryList, loading, error] as [Place[], boolean, typeof error]
  }, [snapshot, loading, error])

}