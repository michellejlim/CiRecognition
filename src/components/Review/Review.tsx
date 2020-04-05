import * as React from "react";
import "./Review.css";

const apiUrl: string = "http://localhost:3000/api";

type Review = {
  nominee: string;
  nominator: string;
  reason: string;
};

type Status = "approved" | "denied";
type DoneReview = Review & { status: Status };

type Response = {
  pending: Review[];
  past: DoneReview[];
};

function mockData(): Promise<Response> {
  return Promise.resolve({
    pending: [
      {
        nominator: "janice anne",
        nominee: "sally handsen",
        reason: "she's good",
      },
      {
        nominator: "george washington",
        nominee: "thomas jefferson",
        reason: "good at writing",
      },
    ],
    past: [
      {
        nominator: "vivian huang",
        nominee: "jarrek holmes",
        reason: "helpful guy",
        status: "approved",
      },
      {
        nominator: "andrew carnegie",
        nominee: "andrew mellon",
        reason: "good at art",
        status: "approved",
      },
      {
        nominator: "donald duck",
        nominee: "thanos",
        reason: "big and purple",
        status: "denied",
      },
    ],
  });
}

function Review() {
  return <p>hi</p>;
}

export default Review;
