import React, {FC} from "react";
import "./leadboad.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";


const LeadboadEntry: FC<{v:{
  username: string;
  highScore: number;
}}> = ({v}) => {
  return         <>
  <div key={v.username} className="username">{v.username}</div>

  <div key={v.highScore} className="score">{v.highScore}</div>
</>
}

export const Leadboad = () => {
  const [snapshot] = useCollectionData<{ username: string; highScore: number }>(
    firebase
      .firestore()
      .collection("users")
      .where("highScore", ">", 0)
      .orderBy("highScore", "desc")
      .limit(4)
  );


  
  return (
    <div id="leadboad">
      <div className="username heading">Username</div>
      <div className="score heading">Score</div>
      {snapshot?.map((v) => (
          <LeadboadEntry v={v} key={v.username}/>
      ))}
    </div>
  );
};
