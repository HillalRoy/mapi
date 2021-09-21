import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { showHints } from "../store/GameReducers";
import { getUI } from "../store/UIReducer";

export const Hints = () => {
  const [showHintLabel, setShowHintLable] = useState(true);
  const dispatch = useAppDispatch();
  const showHint = useAppSelector(getUI.showHints);
  // TODO : fix the hickup on hint lebal update
  return (
    <>
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            className="hints-card"
          >
            <AnimatePresence>
              {showHintLabel && (
                <motion.button
                  initial={{ width: 1, opacity: 0 }}
                  animate={{ width: "initial", opacity: 1 }}
                  exit={{ width: 1, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="hint-label"
                  onClick={() => dispatch(showHints(true))}
                >
                  Do you need hint??
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={() => setShowHintLable(!showHintLabel)}
              style={{ fontSize: "2rem"}}
              className="hints-card__btn z1"
            >
              💡
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
