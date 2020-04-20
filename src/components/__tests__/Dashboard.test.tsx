import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import {
  getApiUrl,
  toJson,
  Employee,
  EmployeeRecognition,
} from "../../fetching";
import { mount } from "enzyme";

import Dashboard from "../Dashboard/Dashboard";

describe("<Dashboard />", () => {
  test("check deeds URl json working", async () => {
    const deedsURL = getApiUrl("Nominations", { status: "approved" });

    expect(deedsURL).toBe(
      "http://localhost:3000/api/Nominations?filter=%7B%22where%22:%7B%22status%22:%22approved%22%7D%7D"
    );
  });

  test("function cmpBucks works on test values", async () => {
    const lhs = {
      who: "Jarrek",
      ci_bucks: 10,
    };
    const rhs = {
      who: "Vivian",
      ci_bucks: 1,
    };

    const pos1 = {
      ci_bucks: 1,
    };
    const pos2 = {
      ci_bucks: 10,
    };

    function cmpBucks(lhs, rhs): number {
      return rhs.ci_bucks - lhs.ci_bucks;
    }

    expect(cmpBucks(lhs, rhs)).toBe(-9);
    expect(cmpBucks(pos1, pos2)).toBe(9);
  });
});
