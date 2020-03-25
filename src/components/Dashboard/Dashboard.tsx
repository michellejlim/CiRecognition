import * as React from "react";
import "./Dashboard.css";
import { StringifyOptions } from "querystring";

type Dept = "accounting" | "sales" | "programming";

const departments: Dept[] = ["accounting", "sales", "programming"];

type GoodDeed = {
  who: string;
  what: string;
  dept: Dept;
};

const goodDeeds: GoodDeed[] = [
  { who: "stephanie", what: "good leadership", dept: "accounting" },
  { who: "mary", what: "kindness outreach", dept: "programming" },
  { who: "sam", what: "no absences", dept: "sales" }
];

type LeaderboardItem = {
  who: string;
  points: number;
};

const leaderboard: LeaderboardItem[] = [
  { who: "karen anne", points: 456456 },
  { who: "adam smith", points: 234234 },
  { who: "caleb keen", points: 123123 }
];

function Dashboard() {
  return (
    <div className="Dashboard">
      <div className="Dashboard__Left">
        <div className="Dashboard__Profile">
          <div className="Dashboard__ProfilePic">
            <mgt-person person-query="me"></mgt-person>
          </div>
          <p>You have x CI bucks</p>
        </div>
        <table className="Dashboard__Leaderboard">
          <thead>
            <tr>
              <th>rank</th>
              <th>who</th>
              <th>points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((x, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{x.who}</td>
                <td>{x.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="Dashboard__Right">
        <div>
          <label htmlFor="departments">Filter By:</label>
          <select id="departments">
            <option>All Departments</option>
            {departments.map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select>
            <option>Recent</option>
          </select>
        </div>
        <div>
          {goodDeeds.map((x, idx) => (
            <div key={idx}>
              {x.who} from {x.dept} has been recognized for {x.what}!
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
