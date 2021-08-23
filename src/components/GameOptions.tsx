import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCountry, getPlaces, getShowAns, showAnsThunk } from "../store/GameReducers";
import { random, randomChoice } from "../utils/tools";

import "./gameOptions.scss";

export const GameOptions = () => {
  const country = useAppSelector(getCurCountry);
  const places = useAppSelector(getPlaces);
  const showAns = useAppSelector(getShowAns)

  const dispatch = useAppDispatch();
  const options = useMemo(() => {
    const ansOp = random(4);
    const options: [string, string, string, string] = ["", "", "", ""];
    if(places.length === 0)  return options

    for (let i = 0; i < options.length; i++) {
      if (i === ansOp) options[i] = country;
      else {
        for (let j = 0; j < 10; j++) {

          const place = randomChoice(places).country;

          if (options.indexOf(place) === -1 && place !== country) {
            options[i] = place;
            break;
          }
        }
      }
    }
    return options;
  }, [country, places]);

  return (
    <div className="options">
      {options.map((v, i) => (
        <button
          key={i}
          onClick={() => dispatch(showAnsThunk(v))}
          className={`z1 option ${showAns ? v === country ? "ans-r" : "ans-w" : ""}`}
          disabled={showAns}
        >
          {v}
        </button>
      ))}
    </div>
  );
};
