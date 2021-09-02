import React, { useEffect } from "react";
import { loadGMaps } from "../gapi/loadGMap";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCoordinates, loadPlacesThunk } from "../store/GameReducers";

const setStreetVIew = async (fenway: { lat: number; lng: number }) => {
  try {
    const google = await loadGMaps();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: fenway,
        zoom: 14,
      }
    );

    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano") as HTMLElement,
      {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
      }
    );
    panorama.setOptions({
      showRoadLabels: false
    })
    map.setStreetView(panorama);
  } catch (err) {
    console.log({ err });
  }
};

export const StreetView = () => {
  const coordinates = useAppSelector(getCurCoordinates);
  const dispatch = useAppDispatch();
  if (coordinates.lat + coordinates.lng === 0) {
    console.log("sendt");

    dispatch(loadPlacesThunk());
  }

  useEffect(() => {
    if (coordinates.lat + coordinates.lng === 0) {
    } else setStreetVIew(coordinates);
  }, [coordinates]);

  return (
    <>
      <div id="map"></div>
      <div id="pano"></div>
    </>
  );
};
