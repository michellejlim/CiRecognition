import * as React from "react";
import "./Dashboard.css";
import { StringifyOptions } from "querystring";

const apiUrl: string = "http://localhost:3000/api";

type Dept = "Accounting" | "Sales" | "Programming";

const departments: Dept[] = ["Accounting", "Sales", "Programming"];

type GoodDeed = {
  who: string;
  what: string;
  dept: Dept;
};

const goodDeeds: GoodDeed[] = [
  { who: "Stephanie", what: "good leadership", dept: "Accounting" },
  { who: "Mary", what: "kindness outreach", dept: "Programming" },
  { who: "Sam", what: "no absences", dept: "Sales" },
];

type LeaderboardItem = {
  who: string;
  points: number;
};

const leaderboard: LeaderboardItem[] = [
  { who: "Karen Anne", points: 456456 },
  { who: "Adam Smith", points: 234234 },
  { who: "Caleb Keen", points: 123123 },
];

function Dashboard() {
  return (
    <div className="Dashboard">
      <div className="Dashboard__Left">
        <div className="Dashboard__Profile">
          <div className="Dashboard__ProfilePic">
            <p></p>
            <mgt-person person-query="me"></mgt-person>
            <p></p>
          </div>
          <p>
            <p></p>You have x CI bucks
          </p>
        </div>

        <table className="Dashboard__Leaderboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Who</th>
              <th>Points</th>
            </tr>
            <p></p>
          </thead>
          <tbody>
            {leaderboard.map((x, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{x.who}</td>
                <td>{x.points}</td>
              </tr>
            ))}
            <p></p>
          </tbody>
        </table>
      </div>
      <br></br>

      <div className="mid_contain">
        <img
          src="http://www.amazingkids.org/images/Our_approach.jpg"
          alt="logo"
          className="dashboard-img"
        />

        <div className="Dashboard__Right">
          <div>
            <p></p>
            <div className="filtering">
              <label htmlFor="departments">Filter By:</label>
              <select id="departments">
                <option>All Departments</option>
                {departments.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <select>
                <option>Recent</option>
              </select>
            </div>
            <hr className="greyline"></hr>
          </div>

          <div className="students">
            {goodDeeds.map((x, idx) => (
              <div key={idx}>
                <img
                  src="https://cdn.esquimaltmfrc.com/wp-content/uploads/2015/09/flat-faces-icons-circle-woman-7.png"
                  alt="logo"
                  className="person-img"
                />
                {x.who} from {x.dept} has been recognized for {x.what}!
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/72/Message-icon-grey.png"
                  alt="logo"
                  className="message-img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
