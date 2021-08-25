import firebase from "firebase";
import React, { FC, useState } from "react";
import { useLocations } from "../hooks/redux";
import "./screens.scss";
import "./addLocations.scss";

const Location: FC<{ lat: number; lng: number; country: string, id:number }> = ({
  lat,
  lng,
  country,
  id
}) => {
  return (
    <div className="location">
      <div className="lat value">
        <span id="lat">{lat}</span>
      </div>
      <div className="lng value">
        <span id="lng">{lng}</span>
      </div>
      <div className="country value">
        <span id="country">{country}</span>
      </div>
      {/* <div className="country value">
        <span id="country">{country}</span>
      </div> */}
    </div>
  );
};

export const AddLocations = () => {
  const locationCollection = firebase.firestore().collection("locations");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [countryList] = useLocations();

  const addLocation = async () => {
    try {
      setError("")
      await locationCollection.add({ location: { lat, lng }, country });
    } catch (error) {
      setError(error);
      console.log({ error });
    }
  };
  return (
    <section id="add-location" className="screen">
      <div className="locations hedding">
        <div className="location">
          <div className="lat value">
            <span id="lat">lat</span>
          </div>
          <div className="lng value">
            <span id="lng">lng</span>
          </div>
          <div className="country value">
            <span id="country">country</span>
          </div>
        </div>
      </div>
      <form
      className="locations"
        onSubmit={(e) => {
          e.preventDefault();
          addLocation();
        }}
      >
        <div className="add location">
          <div className="lat value">
            <input
              value={lat}
              onChange={(e) => setLat(+e.target.value)}
              type="number"
              name="lat"
              id="lat"
            />
          </div>
          <div className="lng value">
            <input
              value={lng}
              onChange={(e) => setLng(+e.target.value)}
              type="number"
              name="lng"
              id="lng"
            />
          </div>
          <div className="country value">
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              type="text"
              name="country"
              required={true}
              id="country"
              placeholder="country"
            />
          </div>
        </div>
        <button>Add</button>
        <div className="error">{error}</div>
      </form>

      <div className="locations">
        {countryList
          .filter((v) => v)
          .map(([v, id], i) => (
            <Location
              key={v.country + i}
              lat={v.location.lat}
              lng={v.location.lng}
              country={v.country}
              id={id}
            />
          ))}
      </div>
    </section>
  );
};
