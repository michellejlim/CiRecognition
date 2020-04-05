import * as React from "react";
import "./Review.css";
import 'materialize-css';
import { Button, Card, Row, Col } from 'react-materialize';

const apiUrl: string = "http://localhost:3000/api";

type ReviewData = {
  id: number;
  nominee: string;
  nominator: string;
  reason: string;
};

type Status = "APPROVED" | "DENIED";
type DoneReviewData = ReviewData & { status: Status };

type Response = {
  pending: ReviewData[];
  past: DoneReviewData[];
};

function getResponse(): Promise<Response> {
  return Promise.resolve({
    pending: [
      {
        id: 123123,
        nominator: "janice anne",
        nominee: "sally handsen",
        reason: "she's good",
      },
      {
        id: 234234,
        nominator: "george washington",
        nominee: "thomas jefferson",
        reason: "good at writing",
      },
    ],
    past: [
      {
        id: 345345,
        nominator: "vivian huang",
        nominee: "jarrek holmes",
        reason: "helpful guy",
        status: "APPROVED",
      },
      {
        id: 456456,
        nominator: "andrew carnegie",
        nominee: "andrew mellon",
        reason: "good at art",
        status: "APPROVED",
      },
      {
        id: 567567,
        nominator: "donald duck",
        nominee: "thanos",
        reason: "big and purple",
        status: "DENIED",
      },
    ],
  });
}

function confirm() {
  window.confirm("Are you sure? This action can't be undone.");
}

function Review() {
  const [response, setResponse] = React.useState<Response | null>(null);
  React.useEffect(() => {
    // TODO what if the backend errors?
    getResponse().then(setResponse).catch(console.error);
  }, [setResponse]);
  if (response === null) {
    return null;
  }
  return (
    <div className="noms">

      <h4>Nominations Pending Approval ({response.pending.length} Remaining)</h4><br></br>
      {response.pending.map((x) => (
        <div key={x.id} className="pendingItem">
          <div className = "ind-pending">
            <Row>
              <Col s={3} className = "approve-button">
                <br></br>
                <button className = "confirm-button" onClick={confirm}>APPROVE</button><br></br>
                <br></br>
                <button className = "confirm-button" onClick={confirm}>DENY</button>
              </Col>
              <Col s={3} className = "nom-text">
                <br></br>
                <p> NOMINEE:  {x.nominee}<br></br><br></br>
                    NOMINATOR: {x.nominator}<br></br><br></br>
                    REVIEW:  {x.reason}
                </p>
              </Col>
              <Col s={3} className = "approve-button">
                <br></br>
                <img 
                    src="https://cdn.esquimaltmfrc.com/wp-content/uploads/2015/09/flat-faces-icons-circle-woman-7.png"
                    alt="logo"
                    className="girl-img"
                  />
              </Col>
            </Row>
            <hr></hr>
          </div>

        </div>
      ))}
      <br></br>
      <h4>Past Nominations ({response.past.length})</h4><br></br>
      
      {response.past.map((x) => (
        <div key={x.id} className={ x.status == 'APPROVED'? 'APPROVED' : 'DENIED' }>
          <div className = "ind-pending">
            <Row>

              <Col s={3} className = "approve-button">
                <br></br>
                <img 
                    src="https://cdn.esquimaltmfrc.com/wp-content/uploads/2015/09/flat-faces-icons-circle-woman-7.png"
                    alt="logo"
                    className="girl-img"
                  />
              </Col>

              <Col className = "approve-button">
                <br></br>
                <p>NOMINEE: {x.nominee}</p>
                <p>NOMINATOR: {x.nominator}</p>
                <p>REVIEW: {x.reason}</p>
              </Col>

              <Col className = "approve-button">
                <br></br><br></br><br></br>
                <h4 className = "status">{x.status}</h4>
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
