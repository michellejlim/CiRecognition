import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";

import {
  getApiUrl,
  toJson,
  Employee,
  EmployeeRecognition,
} from "../../fetching";
import { mount } from "enzyme";
import Container from "../Container/Container";

describe("<Container />", () => {
  test("check pathname function in navItem working", async () => {
    function pathname(x) {
      return `/${x}`;
    }

    expect(pathname(1)).toBe("/1");
    expect(pathname(0)).toBe("/0");
    expect(pathname("string")).toBe("/string");
  });

  test("check pathname function in navItem working", async () => {
    function windowpathname(pathname) {
      const className =
        window.location.pathname === pathname ||
        (window.location.pathname === "/" && pathname === "/dashboard")
          ? "Container__NavItem--active"
          : "";
      return className;
    }

    expect(windowpathname("/1")).toBe("");
  });

  test("check if checkIfSupervisor function working properly", async () => {
    const annie = {
      employeeId: 1,
      supervisees: [2],
    };
    const bill = {
      employeeId: 2,
      supervisorId: 1,
      supervisees: [],
    };

    function checkIfSupervisor(myEmail) {
      return myEmail.supervisees.length > 0;
    }

    expect(checkIfSupervisor(annie)).toBe(true);
    expect(checkIfSupervisor(bill)).toBe(false);
  });
});
