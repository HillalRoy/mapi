import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { loadGMaps } from "../gapi/loadGMap";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getCurCoordinates,
  getGameState,
  loadPlacesThunk,
  RESTART_TIMER,
  setPlaceView,
  updateLoacation,
} from "../store/GameReducers";

const useStreetView = (coordinates: {
  lat: number;
  lng: number;
}): [google.maps.StreetViewPanorama | undefined, unknown] => {
  const [p, setP] = useState<google.maps.StreetViewPanorama>();
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const dispatch = useAppDispatch();

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
          // setLoading(false);
          dispatch(setPlaceView("loaded"));
        } catch (err) {
          setError(err);
          dispatch(setPlaceView("loaded"));
        }
      })
      .catch((error) => setError(error));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setPlaceView("loading"));

    loadGMaps().then(async (google) => {
      const sv = new google.maps.StreetViewService();
      p?.setVisible(false);
      try {
        const { data } = await sv.getPanorama({
          location: coordinates,
          radius: 50,
        });
        const location = data.location!;
        p?.setPov({ heading: 34, pitch: 10 });
        p?.setZoom(0);
        p?.setPano(location.pano as string);
        p?.setVisible(true);
        document.dispatchEvent(new Event(RESTART_TIMER));
        dispatch(setPlaceView("loaded"));
      } catch (err) {
        dispatch(updateLoacation());
      }
    });
  }, [coordinates, dispatch, error, p]);

  return [p, error];
};

export const StreetView = () => {
  const coordinates = useAppSelector(getCurCoordinates);
  const placesState = useAppSelector((s) => s.game.placesState);
  const show = useAppSelector(s => getGameState.placeViewState(s) === "loaded")

  const dispatch = useAppDispatch();
  if (placesState === "empty") {
    dispatch(loadPlacesThunk());
  }
  useStreetView(coordinates);

  return (
    <>
      <motion.div
        initial= {{opacity:0}}
        animate= {{opacity: show ? 1 : 0}}
       id="pano"/>
    </>
  );
};
