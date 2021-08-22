import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCountry, getPlaces, submitAns } from "../store/GameReducers";

import "./gameOptions.scss";

const random = (n: number) => Math.floor(Math.random() * n);
const randomChoice: <T>(arr: T[]) => T = (arr) => arr[random(arr.length)];

export const GameOptions = () => {
  const country = useAppSelector(getCurCountry);
  const places = useAppSelector(getPlaces);

  const dispatch = useAppDispatch();
  const options = useMemo(() => {
    const ansOp = random(4);
    const options: [string, string, string, string] = ["", "", "", ""];
    for (let i = 0; i < options.length; i++) {
      if (i === ansOp) options[i] = country;
      else {
        for (let j = 0; j < 10; j++) {
          const place = randomChoice(places).country;
          if (!(j in options)) {
            options[i] = place
            break;
          }
        }
      }
    }
    return options
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
