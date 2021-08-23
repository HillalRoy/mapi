import React from "react";
import "./leadboad.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";

export const Leadboad = () => {
  const [snapshot] = useCollectionData<{ username: string; highScore: number }>(
    firebase
      .firestore()
      .collection("users")
      .where("highScore", ">", 0)
      .orderBy("highScore", "desc")
      .limit(3)
  );
  return (
    <div
      style={{ backgroundImage: "url('/assets/scoreboard.png')" }}
      id="leadboad"
    >
      {snapshot?.map((v) => (
        <div className="score">
          {" "}
          {v.username}: {v.highScore}{" "}
        </div>
      ))}
    </div>
  );
};
