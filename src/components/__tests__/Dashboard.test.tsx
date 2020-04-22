import React from "react";
import { render, fireEvent, waitForElement,cleanup } from "@testing-library/react";
afterEach(cleanup)

import {
  getApiUrl,
  toJson,
  Employee,
  EmployeeRecognition,
} from "../../fetching";
import { mount,shallow } from "enzyme";

import Dashboard from "../Dashboard/Dashboard";

describe("<Dashboard />", () => {

  
  test("check deeds URl json working", async () => {
    const deedsURL = getApiUrl("Nominations", { status: "approved" });

    expect(deedsURL).toBe(
      "http://localhost:3000/api/Nominations?filter=%7B%22where%22:%7B%22status%22:%22approved%22%7D%7D"
    );
  });
  test("check good deed", async () => {
    const APIGoodDeed = {
      reason: 'kindness',
      nominee: 2,
    };
    expect(APIGoodDeed.reason).toBe('kindness');
    expect(APIGoodDeed.nominee).toBe(2);
    expect(APIGoodDeed.reason).not.toBe('hardwork')
    expect(APIGoodDeed.nominee).not.toBeNull()
    expect(APIGoodDeed.reason).not.toBeNull()

   });

   test("function take test", async () => {

      function take<T>(n: number, xs: readonly T[]): T[] {
        const len = Math.min(n, xs.length);
        const ret = Array(len);
        for (let i = 0; i < len; i++) {
          ret[i] = xs[i];
        }
        return ret;
      }
      expect(take(10, [1,2,3])).toStrictEqual([1,2,3])
      expect(take(0,[])).toStrictEqual([])
      expect(take(0,[])).not.toBeNull()
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
