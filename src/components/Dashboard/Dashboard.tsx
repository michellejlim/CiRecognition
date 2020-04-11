import * as React from "react";
import "./Dashboard.css";

type Dept = "Accounting" | "Sales" | "Programming";

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
      <br></br>

      <div className="mid_contain">
        <img
          src="https://prostaff.com/wp-content/uploads/sites/8/2017/11/Atterro-11-17_WhyEmployeeAppreciationMatters.jpg"
          alt="logo"
          className="dashboard-img"
        />

        <div className="Dashboard__Right">
          <br></br>
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
