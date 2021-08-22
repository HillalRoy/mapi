import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCountry, getPlaces, submitAns } from "../store/GameReducers";
import { random, randomChoice } from "../utils/tools";

import "./gameOptions.scss";

export const GameOptions = () => {
  const country = useAppSelector(getCurCountry);
  const places = useAppSelector(getPlaces);

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
          if (!(place in options)) {
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
          onClick={() => dispatch(submitAns(v))}
          className="z1 option"
        >
          {v}
        </button>
      ))}
    </div>
  );
};
