import * as React from "react";
import EmailGetter from "../EmailGetter";
import "./Dashboard.css";
import {
  getApiUrl,
  toJson,
  Employee,
  EmployeeRecognition,
} from "../../fetching";

type GoodDeed = {
  reason: string;
  nominee: string;
};

type APIGoodDeed = {
  reason: string;
  nominee: number;
};

type LeaderboardItem = {
  who: string;
  ci_bucks: number;
};

const deedsURL = getApiUrl("Nominations", { status: "approved" });

function cmpBucks(lhs: LeaderboardItem, rhs: LeaderboardItem): number {
  return rhs.ci_bucks - lhs.ci_bucks;
}

function take<T>(n: number, xs: readonly T[]): T[] {
  const len = Math.min(n, xs.length);
  const ret = Array(len);
  for (let i = 0; i < len; i++) {
    ret[i] = xs[i];
  }
  return ret;
}

function Dashboard() {
  const [deeds, setDeeds] = React.useState<GoodDeed[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardItem[]>([]);
  const [myEmail, setMyEmail] = React.useState<string | null>(null);
  const [myBucks, setMyBucks] = React.useState<number | null>(null);
  React.useEffect(() => {
    fetch(deedsURL)
      .then(toJson)
      .then((deeds: APIGoodDeed[]) =>
        Promise.all(
          deeds.map(({ reason, nominee }) =>
            fetch(getApiUrl("tblEmployees", { id: nominee }))
              .then(toJson)
              .then((xs: Employee[]) => ({
                reason,
                nominee: xs[0].firstName + " " + xs[0].lastName,
              }))
          )
        )
      )
      .then((xs) => setDeeds(take(10, xs)));
  }, [setDeeds]);
  React.useEffect(() => {
    fetch(getApiUrl("Employee_Recognitions"))
      .then(toJson)
      .then((leaderboard: EmployeeRecognition[]) =>
        Promise.all(
          leaderboard.map(({ id, ci_bucks }) =>
            fetch(getApiUrl("tblEmployees", { id }))
              .then(toJson)
              .then((xs: Employee[]) => ({
                ci_bucks,
                who: xs[0].firstName + " " + xs[0].lastName,
              }))
          )
        )
      )
      .then((xs) => setLeaderboard(take(5, xs.sort(cmpBucks))));
  }, [setLeaderboard]);
  try {
    React.useEffect(() => {
      if (myEmail === null) {
        return;
      }
      fetch(getApiUrl("tblEmployees", { emailCompany: myEmail }))
        .then(toJson)
        .then((xs: Employee[]) => {
          if (xs.length > 0) {
            fetch(getApiUrl("Employee_Recognitions", { id: xs[0].employeeId }))
            .then(toJson)
            .then((xs: EmployeeRecognition[]) => setMyBucks(xs[0].ci_bucks));
          }
        }
      )
    }, [myEmail]);
  }
  catch (err) {
    console.error(err);
  }

  return (
    <div className="Dashboard">
      <EmailGetter onGetEmail={setMyEmail} />
      <div className="Dashboard__Left">
        <div className="Dashboard__Profile">
          <div className="Dashboard__ProfilePic">
            <mgt-person person-query="me" show-name show-email></mgt-person>
          </div>
          <p className = "numbucks">You have {myBucks == null ? "..." : myBucks} CI bucks</p>
        </div>
        <table className="Dashboard__Leaderboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Bucks</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((x, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{x.who}</td>
                <td>{x.ci_bucks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mid_contain">
        <img
          src="http://www.amazingkids.org/images/Services_Sliders/Children_Family/C_F1.jpg"
          alt="logo"
          className="dashboard-img"
        />
        <div className="Dashboard__Right"><br></br><br></br>
        {deeds.map((x, idx) => (
            <div key={idx}>

          <table className="right_table"> 
            <tbody>
                <tr>
                  <td>
                    <mgt-person person-query={x.nominee}></mgt-person>
                  </td>
                  <td>{x.nominee} has been recognized for '{x.reason}'!</td>
                  <td> <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Message-icon-grey.png"
                alt="logo"
                className="message-img"
              /></td>
                </tr>
            </tbody>
          </table>
             
            </div>
          )
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;