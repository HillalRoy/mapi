// const { seconds, minutes, pause, resume, isRunning, restart } = useTimer({
//   expiryTimestamp: new Date().getTime() + 300_000,
//   onExpire: () => {
//     dispatch(timeExpire(null));
//   },
// });

import React, { useEffect, useMemo, useState } from "react";
import { Time, Timer } from "../utils/Timer";

export const useTimer = ({
  expiryTimestamp,
  onExpire,
}: {
  expiryTimestamp: number | Time;
  onExpire: () => void;
}) => {
  const [expire, setExpire] = useState(() =>
    expiryTimestamp instanceof Time
      ? expiryTimestamp
      : new Time(expiryTimestamp)
  );
  const [timer, setTimer] = useState(
    useMemo(() => new Timer(expire), [expire])
  );
  const resetTimer = () => {
    setTimer(new Timer(expire));
    setCompleted(false);
  };
  const [completed, setCompleted] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (completed) {
        clearInterval(interval);
        return;
      }
      const remaining = timer.timeRemaining();
      if (!completed && remaining.milisec <= 0) {
        clearInterval(interval);
        onExpire();
        setCompleted(true);
        setSeconds(0);
        setMinutes(0);
      } else {
        setSeconds(remaining.seconds);
        setMinutes(remaining.minutes);
      }
    }, Time.seconds(1));
    return () => clearInterval(interval);
  }, [completed, onExpire, timer]);
  return {
    seconds,
    minutes,
    pause: () => timer.pause(),
    resume: () => timer.resume(),
    isRunning: true,
    restart: () => {
      resetTimer();
    }, // TODO
  };
};
