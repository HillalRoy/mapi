import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getCurCountry, submitAns } from "../store/GameReducers";

import "./gameOptions.scss";

const random = (n: number) => Math.floor(Math.random() * n);

export const GameOptions = () => {
  const country = useAppSelector(getCurCountry);
  const dispatch = useAppDispatch();
  const options = useMemo(() => {
    const ansOp = random(4);
    const options: [string, string, string, string] = ["", "", "", ""];

    return options.map((_, i) => (i === ansOp ? country : "random"));
  }, [country]);

  return (
    <div className="options">
      {options.map((v,i) => (
        <button key={i} onClick={() => dispatch(submitAns(v))} className="z1 option">
          {v}
        </button>
      ))}
    </div>
  );
};
