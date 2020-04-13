import * as React from "react";
import "./Review.css";
import "materialize-css";
import { Row, Col } from "react-materialize";
import {
  getApiUrl,
  toJson,
  Nomination,
  NominationStatus,
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

async function getAnswer(myEmail: string): Promise<Answer> {
  const pending: ShowNomination[] = [];
  const done: ShowNomination[] = [];
  const myID: number = await fetch(
    getApiUrl("tblEmployees", { emailCompany: myEmail })
  )
    .then(toJson)
    .then((xs) => xs[0].id);
  const noms: Nomination[] = await fetch(getApiUrl("Nominations")).then(toJson);
  for (const nom of noms) {
    const nominee: Employee = await fetch(
      getApiUrl("tblEmployees", { id: nom.nominee })
    )
      .then(toJson)
      .then((xs) => xs[0]);
    if (nominee.supervisorEmployeeId === myID) {
      const nominator: Employee = await fetch(
        getApiUrl("tblEmployees", { id: nom.nominator })
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
  return { pending, done };
}

function PlaceholderImg() {
  return (
    <img
      src="https://cdn.esquimaltmfrc.com/wp-content/uploads/2015/09/flat-faces-icons-circle-woman-7.png"
      alt="placeholder"
      className="girl-img"
    />
  );
}

async function changeNomStatus(x: ShowNomination, status: NominationStatus) {
  if (!window.confirm("Are you sure? This action can't be undone.")) {
    return;
  }
  // TODO this is not atomic! it would be better to have one API request modify
  // all the relevant resources? or perhaps have some kind of 'retry' token in
  // case part of the request chain fails.
  await fetch(getApiUrl(`Nominations/${x.id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status,
    }),
  }).then(toJson);
  if (status === "approved") {
    const nominee: Employee = await fetch(
      getApiUrl(`tblEmployees/${x.nominee}`)
    ).then(toJson);
    const curCIBucks: number = await fetch(
      getApiUrl(`Employee_Recognitions/${nominee.employeeId}`)
    )
      .then(toJson)
      .then((xs) => xs.ci_bucks);
    const award: NominationAward = await fetch(
      getApiUrl(`Nomination_Awards/${x.award}`)
    ).then(toJson);
    await fetch(getApiUrl(`Employee_Recognitions/${nominee.employeeId}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ci_bucks: curCIBucks + award.award_amount,
      }),
    }).then(toJson);
  }
  window.location.reload();
}

function Review() {
  const [answer, setAnswer] = React.useState<Answer | null>(null);
  const [myEmail, setMyEmail] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (myEmail === null) {
      return;
    }
    // TODO what if the backend errors?
    getAnswer(myEmail).then(setAnswer);
  }, [setAnswer, myEmail]);
  if (myEmail === null || answer === null) {
    return <EmailGetter onGetEmail={setMyEmail} />;
  }
  return (
    <div className="noms">
      <h4>Nominations Pending Approval ({answer.pending.length} Remaining)</h4>
      <br></br>
      {answer.pending.map((x) => (
        <div key={x.id} className="pendingItem">
          <div className="ind-pending">
            <Row>
              <Col s={3} className="approve-button">
                <br></br>
                <button
                  className="confirm-button"
                  onClick={() => changeNomStatus(x, "approved")}
                >
                  APPROVE
                </button>
                <br></br>
                <br></br>
                <button
                  className="confirm-button"
                  onClick={() => changeNomStatus(x, "denied")}
                >
                  DENY
                </button>
              </Col>
              <Col s={3} className="nom-text">
                <br></br>
                <h5>
                  NOMINEE: {x.nomineeStr}
                  <br></br>
                  <br></br>
                  NOMINATOR: {x.nominatorStr}
                  <br></br>
                  <br></br>
                  REVIEW: {x.reason}
                </h5>
              </Col>
              <Col s={3} className="approve-button">
                <br></br>
                <PlaceholderImg />
              </Col>
            </Row>
            <hr></hr>
          </div>
        </div>
      ))}
      <br></br>
      <h4>Past Nominations ({answer.done.length})</h4>
      <br></br>
      {answer.done.map((x) => (
        <div key={x.id} className={x.status}>
          <div className="ind-pending">
            <Row>
              <Col s={3} className="approve-button">
                <br></br>
                <PlaceholderImg />
              </Col>
              <Col className="approve-button">
                <br></br>
                <h5>
                  NOMINEE: {x.nomineeStr}
                  <br></br>
                  <br></br>
                  NOMINATOR: {x.nominatorStr}
                  <br></br>
                  <br></br>
                  REVIEW: {x.reason}
                </h5>
              </Col>
              <Col className="approve-button">
                <br></br>
                <br></br>
                <br></br>
                <h4 className="status">{x.status}</h4>
              </Col>
            </Row>
            <hr></hr>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Review;
