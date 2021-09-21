import React, { useEffect, useMemo, useState } from "react";
import { Time, Timer } from "../utils/Timer";

export const useTimer = ({
  expiryTimestamp,
  onExpire,
}: {
  expiryTimestamp: number | Time;
  onExpire: () => void;
}) => {
  const [expire] = useState(() =>
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
  const [timePast, setTimePast] = useState(0);
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
        setTimePast(expire.milisec - remaining.milisec)
        setSeconds(remaining.seconds);
        setMinutes(remaining.minutes);
      }
    }, Time.seconds(1));
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, onExpire, timer]);
  return {
    seconds,
    minutes,
    timePast,
    pause: () => timer.pause(),
    resume: () => timer.resume(),
    isRunning: true,
    restart: resetTimer // TODO
  };
};
