import * as React from "react";
import "./Review.css";
import "materialize-css";
import { Row, Col } from "react-materialize";
import {
  getApiUrl,
  toJson,
  NominationStatusFinal,
  NominationAward,
} from "../../fetching";
import EmailGetter from "../EmailGetter";
import { ShowNomination, Answer, getAnswer } from "./fetching";

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

async function changeNomStatus(
  setErr: (x: string) => void,
  x: ShowNomination,
  status: NominationStatusFinal
) {
  const msg =
    (status === "approved"
      ? "Are you sure you want to approve this nomination?"
      : "Are you sure you want to deny this nomination?.") +
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
                <br></br>
                <h6>
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
                </h6>
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
                <br></br>
                <h6>
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
                </h6>
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
