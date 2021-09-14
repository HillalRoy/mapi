import React, { useEffect, useState } from "react";
import { loadGMaps } from "../gapi/loadGMap";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCoordinates, loadPlacesThunk, updateLoacation } from "../store/GameReducers";


const useStreetView = (coordinates: {
  lat: number;
  lng: number;
}): [google.maps.StreetViewPanorama | undefined, boolean, unknown] => {
  const [p, setP] = useState<google.maps.StreetViewPanorama>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadGMaps()
      .then((google) => {
        try {
          const panorama = new google.maps.StreetViewPanorama(
            document.getElementById("pano") as HTMLElement,
            {
              position: { lat: 37.86926, lng: -122.254811 },
              pov: {
                heading: 34,
                pitch: 10,
              },
              showRoadLabels: false,
            }
          );
          setP(panorama);
          // panorama.setPosition()
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      })
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    setLoading(true)
    loadGMaps().then(async (google) => {
      const sv = new google.maps.StreetViewService();
      p?.setVisible(false);
      try{
        const { data } = await sv.getPanorama({ location: coordinates, radius: 50 })
        const location = data.location!;
        p?.setPano(location.pano as string);
        p?.setVisible(true);
        setLoading(false)
      }catch(err) {
        dispatch(updateLoacation())
      }

    });
  }, [coordinates, dispatch, error, p]);

  return [p, loading, error];
};

export const StreetView = () => {
  const coordinates = useAppSelector(getCurCoordinates);
  const placesState = useAppSelector((s) => s.game.placesState);

  const dispatch = useAppDispatch();
  if (placesState === "empty") {
    dispatch(loadPlacesThunk());
  }
  useStreetView(coordinates);

  return (
    <>
      <div id="map"></div>
      <div id="pano"></div>
    </>
  );
};
