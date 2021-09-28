import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  getCurCountry,
  getGameState,
  getPlaces,
  getShowAns,
  showAnsThunk,
} from "../store/GameReducers";
import { random, randomChoice } from "../utils/tools";

import "./gameOptions.scss";


const itemsVariant: Variants = {
  hide: {
    y: 200,
    opacity: 0,
    
  },
  show: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.5 + i * 0.09
    }
  }),
};

export const GameOptions = () => {
  const country = useAppSelector(getCurCountry);
  const places = useAppSelector(getPlaces);
  const showAns = useAppSelector(getShowAns);
  const show = useAppSelector(
    (s) => getGameState.placeViewState(s) === "loaded"
  );

  const dispatch = useAppDispatch();
  const options = useMemo(() => {
    const ansOp = random(4);
    const options: [string, string, string, string] = ["", "", "", ""];
    if (places.length === 0) return options;

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
    <AnimatePresence>
      
      <motion.div

        className="options"
      >
        {options.map((v, i) => (
          <motion.button
            variants={itemsVariant}
            custom={i}
            initial="hide"
            animate={show ? "show" : "hide"}
            key={i}
            onClick={() => dispatch(showAnsThunk(v))}
            className={`z1 option ${
              showAns ? (v === country ? "ans-r" : "ans-w") : ""
            }`}
            disabled={showAns}
          >
            {v}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
