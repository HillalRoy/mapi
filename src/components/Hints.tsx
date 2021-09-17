import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { showHints } from "../store/GameReducers";

export const Hints = () => {
  const [showHintLabel, setShowHintLable] = useState(true);
  const dispatch = useAppDispatch()
  return (
    <div className="hints-card">
      <AnimatePresence>
        {showHintLabel && (
          <motion.button
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "initial", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 1 }}
            className="hint-label"
            onClick={() => dispatch(showHints(true))}
          >
            Do you need hint??
          </motion.button>
        )}
      </AnimatePresence>
      <button
        onClick={() => setShowHintLable(!showHintLabel)}
        className="hints-card__btn z1"
      >
        {" "}
        ii{" "}
      </button>
    </div>
  );
};
