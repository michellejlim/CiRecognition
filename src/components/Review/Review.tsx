import * as React from "react";
import "./Review.css";
import "materialize-css";
import { Row, Col } from "react-materialize";
import {
  getApiUrl,
  toJson,
  Nomination,
  NominationStatusFinal,
  Employee,
  NominationAward,
} from "../../fetching";
import EmailGetter from "../EmailGetter";

type ShowNomination = Nomination & {
  nominatorStr: string;
  nomineeStr: string;
};

type Answer = {
  pending: ShowNomination[];
  done: ShowNomination[];
};

const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

function getDate(date: string): string {
  const year = date.substring(0, 4);
  const day = date.substring(8, 10);
  const month = months[parseInt(date.substring(5, 7))];
  return `${month} ${day}, ${year}`;
}

function byDateAsc(a: ShowNomination, b: ShowNomination) {
  const c = +new Date(a.date);
  const d = +new Date(b.date);
  return c - d;
}

function byDateDesc(a: ShowNomination, b: ShowNomination) {
  const c = +new Date(a.date);
  const d = +new Date(b.date);
  return d - c;
}

async function getAnswer(myEmail: string): Promise<Answer> {
  const pending: ShowNomination[] = [];
  const done: ShowNomination[] = [];
  const myEmployeeId: number = await fetch(
    getApiUrl("tblEmployees", { emailCompany: myEmail })
  )
    .then(toJson)
    .then((xs) => xs[0].employeeId);
  const noms: Nomination[] = await fetch(getApiUrl("Nominations")).then(toJson);
  for (const nom of noms) {
    const nominee: Employee = await fetch(
      getApiUrl("tblEmployees", { employeeId: nom.nominee })
    )
      .then(toJson)
      .then((xs) => xs[0]);
    if (nominee.supervisorEmployeeId === myEmployeeId) {
      const nominator: Employee = await fetch(
        getApiUrl("tblEmployees", { employeeId: nom.nominator })
      )
        .then(toJson)
        .then((xs) => xs[0]);
      const showNom: ShowNomination = {
        ...nom,
        nominatorStr: nominator.firstName + " " + nominator.lastName,
        nomineeStr: nominee.firstName + " " + nominee.lastName,
      };
      if (showNom.status === "pending") {
        pending.push(showNom);
      } else {
        done.push(showNom);
      }
    }
  }
  pending.sort(byDateAsc);
  done.sort(byDateDesc);
  return { pending, done };
}

async function changeNomStatus(
  setErr: (x: string) => void,
  x: ShowNomination,
  status: NominationStatusFinal
) {
  const msg =
    (status === "approved"
      ? "Great! If you're sure you want to approve this nomination, press 'OK'."
      : "That's too bad. If you're sure you want to deny this nomination, press 'OK'.") +
    " This action cannot be undone.";
  if (!window.confirm(msg)) {
    return;
  }
  // this is not atomic! it would be better to have one API request modify
  // all the relevant resources? or perhaps have some kind of 'retry' token in
  // case part of the request chain fails.
  try {
    await fetch(getApiUrl(`Nominations/${x.id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
      }),
    }).then(toJson);
  } catch (e) {
    setErr(String(e));
    return;
  }
  if (status === "approved") {
    const curCIBucks: number = await fetch(
      getApiUrl(`Employee_Recognitions/${x.nominee}`)
    )
      .then(toJson)
      .then((xs) => xs.ci_bucks);
    const award: NominationAward = await fetch(
      getApiUrl(`Nomination_Awards/${x.award}`)
    ).then(toJson);
    try {
      await fetch(getApiUrl(`Employee_Recognitions/${x.nominee}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ci_bucks: curCIBucks + award.award_amount,
        }),
      }).then(toJson);
    } catch (e) {
      setErr(String(e));
      return;
    }
  }
  window.location.reload();
}

function Review() {
  const [answer, setAnswer] = React.useState<Answer | null>(null);
  const [myEmail, setMyEmail] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (myEmail === null) {
      return;
    }
    getAnswer(myEmail).then(setAnswer);
  }, [setAnswer, myEmail]);
  if (myEmail === null || answer === null) {
    return <EmailGetter onGetEmail={setMyEmail} />;
  }
  return (
    <div className="noms">
      <h4>Nominations Pending Approval ({answer.pending.length} Remaining)</h4>
      {err === null ? null : <div className="Review__Err">{err}</div>}
      <br />
      {answer.pending.map((x) => (
        <div key={x.id} className="pendingItem">
          <div className="ind-pending">
            <Row>
              <Col s={3} className="approve-button">
                <br />
                <button
                  className="confirm-button-approve"
                  onClick={() => changeNomStatus(setErr, x, "approved")}
                >
                  APPROVE
                </button>
                <br />

                <br />
                <button
                  className="confirm-button-deny"
                  onClick={() => changeNomStatus(setErr, x, "denied")}
                >
                  DENY
                </button>
              </Col>
              <Col s={3} className="nom-text">
                <br />
                <h5>
                  NOMINEE: {x.nomineeStr}
                  <br />
                  <br />
                  NOMINATOR: {x.nominatorStr}
                  <br />
                  <br />
                  REVIEW: {x.reason}
                  <br />
                  <br />
                  NOMINATED ON: {getDate(x.date)}
                </h5>
              </Col>
              <Col s={3} className="approve-button">
                <br />
                <mgt-person
                  person-query={x.nomineeStr}
                  id="review-profile"
                ></mgt-person>
              </Col>
            </Row>
            <hr />
          </div>
        </div>
      ))}
      <br />
      <h4>Past Nominations ({answer.done.length})</h4>
      <br />
      {answer.done.map((x) => (
        <div key={x.id} className={x.status}>
          <div className="ind-pending">
            <Row>
              <Col s={3} className="approve-button">
                <br />
                <mgt-person
                  person-query={x.nomineeStr}
                  id="review-profile"
                ></mgt-person>
              </Col>
              <Col className="approve-button">
                <br />
                <h5>
                  NOMINEE: {x.nomineeStr}
                  <br />
                  <br />
                  NOMINATOR: {x.nominatorStr}
                  <br />
                  <br />
                  REVIEW: {x.reason}
                  <br />
                  <br />
                  NOMINATED ON: {getDate(x.date)}
                </h5>
              </Col>
              <Col className="approve-button">
                <br />
                <br />
                <br />
                <h4 className="status">{x.status.toUpperCase()}</h4>
              </Col>
            </Row>
            <hr />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Review;
