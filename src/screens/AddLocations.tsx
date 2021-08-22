import firebase from "firebase";
import React, { FC, useState } from "react";
import { useLocations } from "../hooks/redux";
import "./screens.scss";


const Location: FC<{ lat: number; lng: number; country: string }> = ({
  lat,
  lng,
  country,
}) => {
  return (
    <div className="location">
      <label htmlFor="lat">lat</label> <span id="lat">{lat}</span>
      <label htmlFor="lng">lng</label> <span id="lng">{lng}</span>
      <label htmlFor="country"> Country </label>{" "}
      <span id="country">{country}</span>
    </div>
  );
};

export const AddLocations = () => {
  const locationCollection = firebase.firestore().collection("locations");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [country, setCountry] = useState("");

  const [countryList] = useLocations();

  const addLocation = async () => {
    try {
      const res = await locationCollection.where('country', '==', country).get()
      let exist = false
      res.forEach(v=> {
        const p = v.data() as Place
        if(Math.round(p.location.lat) === Math.round(lat) && Math.round(p.location.lng) === Math.round(lng)){
          exist = true
        }
      })
      if(exist){
        return
      }
      await locationCollection.add({ location: { lat, lng }, country });
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <section className="add-location screen">
      <div className="locations">
        <div className="aa">
          {countryList
            .filter((v) => v)
            .map((v, i) => (
              <Location
                key={v.country + i}
                lat={v.location.lat}
                lng={v.location.lng}
                country={v.country}
              />
            ))}{" "}
        </div>
      </div>
      <div className="add">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addLocation();
          }}
        >
          <label htmlFor="lat">lat</label>{" "}
          <input
            value={lat}
            onChange={(e) => setLat(+e.target.value)}
            type="number"
            name="lat"
            id="lat"
          />
          <label htmlFor="lng">lng</label>{" "}
          <input
            value={lng}
            onChange={(e) => setLng(+e.target.value)}
            type="number"
            name="lng"
            id="lng"
          />
          <label htmlFor="country"> Country </label>{" "}
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            type="text"
            name="country"
            id="country"
          />
          <button>Add</button>
        </form>
      </div>
    </section>
  );
};
