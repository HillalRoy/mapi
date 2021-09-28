import React, { FC } from "react";
import "./leadboad.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../store/Firebase";

const LeadboadEntry: FC<{
  v: {
    username: string;
    highScore: number;
  };
  index: number;
}> = ({ v, index }) => {
  let maddel = " ";
  if (index === 0) {
    maddel = "🥇";
  } else if (index === 1) {
    maddel = "🥈";
  } else if (index === 2) {
    maddel = "🥉";
  }

  return (
    <tr>
      <td>
        {" "}
        #{index + 1} {maddel}
      </td>
      <td key={v.username} className="username">
        {v.username}
      </td>

      <td key={v.highScore} className="score">
        {v.highScore}
      </td>
    </tr>
  );
};

export const Leadboad = () => {
  const [snapshot] = useCollectionData<{ username: string; highScore: number }>(
    firestore
      .collection("users")
      .where("highScore", ">", 0)
      .orderBy("highScore", "desc")
      .limit(5)
  );

  return (
    <div id="leadboad">
      <div className="title heading">LeaderBoard</div>
      <table>
        <tr>
          <th className="rank heading">#</th>

          <th className="username heading">Username</th>
          <th className="score heading">Score</th>
        </tr>
        {snapshot?.map((v, i) => (
          <LeadboadEntry v={v} index={i} key={v.username + i} />
        ))}
      </table>
    </div>
  );
};
