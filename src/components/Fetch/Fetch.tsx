import * as React from "react";

const url = "http://localhost:3000/api/";

// Returns all nomination award names (for use in nomination form drop down)
fetch(url + "Nomination_Awards")
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      console.log(data);
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

// Returns all approved nominations for dashboard
fetch(url + encodeURI('Nominations?filter={"where": {"status": "approved"}}'))
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      console.log(data);
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

// Returns info for employee 1
fetch(url + encodeURI("tblEmployees/1"))
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      console.log(data);
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

// Returns nominations for supervisor 2
fetch(
  url + encodeURI('tblEmployees?filter={"where": {"supervisorEmployeeId": 2}}')
)
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      var nomineeString = "";
      data.forEach(
        (el: any) =>
          (nomineeString = nomineeString + '{"nominee": "' + el.id + '"}')
      );

      fetch(
        url +
          encodeURI(
            'Nominations?filter={"where": {"or":[' + nomineeString + "]}}"
          )
      )
        .then(function (response) {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }

          // Examine the text in the response
          response.json().then(function (data) {
            console.log(data);
          });
        })
        .catch(function (err) {
          console.log("Fetch Error :-S", err);
        });
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

// TODO: Post a new nomination
// TODO: Post a nomination approval/denial

function Fetch() {
  return <React.Fragment> Fetcher </React.Fragment>;
}

export default Fetch;
