import * as React from "react";
import "./Review.css";

const apiUrl: string = "http://localhost:3000/api";

type ReviewData = {
  nominee: string;
  nominator: string;
  reason: string;
};

function Review() {
  return <p>hi</p>;
}

export default Review;
