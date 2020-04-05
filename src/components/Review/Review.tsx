import * as React from "react";
import "./Review.css";

const apiUrl: string = "http://localhost:3000/api";

type ReviewData = {
  id: number;
  nominee: string;
  nominator: string;
  reason: string;
};

type Status = "approved" | "denied";
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
        status: "approved",
      },
      {
        id: 456456,
        nominator: "andrew carnegie",
        nominee: "andrew mellon",
        reason: "good at art",
        status: "approved",
      },
      {
        id: 567567,
        nominator: "donald duck",
        nominee: "thanos",
        reason: "big and purple",
        status: "denied",
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
      <p>Nominations Pending Approval ({response.pending.length} Remaining)</p>
      {response.pending.map((x) => (
        <div key={x.id} className="pendingItem">
          <button onClick={confirm}>APPROVE</button>
          <button onClick={confirm}>DENY</button>
          <p>Nominee: {x.nominee}</p>
          <p>Nominator: {x.nominator}</p>
          <p>Review: {x.reason}</p>
        </div>
      ))}
      <p>Past Nominations ({response.past.length})</p>
      {response.past.map((x) => (
        <div key={x.id} className="pendingItem">
          <p>Nominee: {x.nominee}</p>
          <p>Nominator: {x.nominator}</p>
          <p>Review: {x.reason}</p>
          <p>{x.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Review;
