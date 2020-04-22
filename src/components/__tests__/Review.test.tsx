import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import {
  getApiUrl,
  toJson,
  Employee,
  EmployeeRecognition,
} from "../../fetching";
import { mount,shallow } from "enzyme";

import Review from "../Review/Review";

describe("<Review />", () => {
	test("check getDate function working as expected", async () => {
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
		expect(getDate('1998-04-30')).toBe("April 30, 1998");
		expect(getDate('2019-01-20')).toBe('January 20, 2019')
		expect(getDate('0')).toBe("undefined , 0")
		expect(getDate('2019-01')).toBe("January , 2019")
		expect(getDate('          ')).toBe("undefined   ,     ")
	});

	test("check message approval", async () => {
		function getStatus(status:string) {
			const msg =
		    (status === "approved"
		      ? "Are you sure you want to approve this nomination?"
		      : "Are you sure you want to deny this nomination?.") +
		    " This action cannot be undone.";
		    return msg
	    };
	   
	   	expect(getStatus('approved')).toBe("Are you sure you want to approve this nomination? This action cannot be undone.")
	   	expect(getStatus('denied')).toBe("Are you sure you want to deny this nomination?. This action cannot be undone.")
	  	expect(getStatus('')).toBe("Are you sure you want to deny this nomination?. This action cannot be undone.")

	 });

	 test("check extracting currCIbucks from api", async () => {
		 function getCurrCIBucks(nominee:string){
		    const curCIBucks = getApiUrl(`Employee_Recognitions/${nominee}`);
		    return curCIBucks
		 };
		 expect(getCurrCIBucks('2')).toBe("http://localhost:3000/api/Employee_Recognitions/2")
		 expect(getCurrCIBucks('3')).toBe("http://localhost:3000/api/Employee_Recognitions/3")
		 expect(getCurrCIBucks('0')).toBe("http://localhost:3000/api/Employee_Recognitions/0")
		 expect(getCurrCIBucks('')).toBe("http://localhost:3000/api/Employee_Recognitions/")
		});


});
