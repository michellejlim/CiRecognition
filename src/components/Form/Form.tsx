import * as React from "react";
import Container from "../Container/Container";
import "./Form.css";

type Reason = "Good Sportsmanship" | "Extra Hours" | "Act of Kindness";

const reasons: Reason[] = ["Good Sportsmanship", "Extra Hours", "Act of Kindness"];

type State =
  | { t: "nominating" }
  | { t: "confirming"; name: string; why: string; nominee: string }
  | { t: "confirmed" };

type Action =
  | { t: "submitNomination"; name: string; why: string; nominees: string[] }
  | { t: "confirmNomination" };

const Context = React.createContext<React.Dispatch<Action>>(() => {});

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "submitNomination":
      if (a.nominees.length !== 1) {
        // TODO show an error to the user
        return s;
      }
      return {
        t: "confirming",
        name: a.name,
        why: a.why,
        nominee: a.nominees[0]
      };
    case "confirmNomination":
      return { t: "confirmed" };
  }
}

const init: State = { t: "nominating" };
const apiUrl: string = "http://is-tool.the-institute.org:3000";

type JustChildren = {
  children: React.ReactNode;
};

function WithSidebar(props: JustChildren) {
  return (
    <div className="WithSidebar">
      <ul className="WithSidebar__Sidebar"></ul>
      <div className="WithSidebar__Content">{props.children}</div>
    </div>
  );
}

function Nominating() {
  const name = React.useRef<HTMLInputElement | null>(null);
  const people = React.useRef<any | null>(null);
  const why = React.useRef<HTMLTextAreaElement | null>(null);
  const dispatch = React.useContext(Context);
  return (
    <WithSidebar>
      <div className="NominationForm">
   
        <h1>Nominate a Fellow Employee </h1><br></br>
        <form
          onSubmit={e => {
            console.log({ HEUHEUEH: people.current });
            e.preventDefault();
            dispatch({
              t: "submitNomination",
              name: name.current!.value,
              why: why.current!.value,
              nominees: people.current!.selectedPeople.map(
                (x: any) => x.displayName
              )
            });
          }}
        >
         <div className = "nom-form">
          <h5>Employee Being Nominated</h5><br></br>
            <mgt-people-picker ref={people}></mgt-people-picker>
          <br></br><br></br>
          <h5>Why did you nominate this employee?</h5><br></br>
    
          <label htmlFor="reasons">Select Reason:</label>
              <select id="reasons" >
                <option>Choose One</option>
                {reasons.map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
          <br></br><br></br><br></br>
          <h5>Elaborate on Reason (Optional)</h5><br></br>
          <textarea />
          <br></br><br></br>
          <div>
            <input type="submit" value="Submit Nomination" />
          </div>
          </div>
        </form>
      </div>
    </WithSidebar>
  );
}

type ConfirmingProps = {
  name: string;
  nominee: string;
  why: string;
};

function Confirming({ name, nominee, why }: ConfirmingProps) {
  const dispatch = React.useContext(Context);
  return (
    <WithSidebar>
      <h1 id="header">Confirm Nomination</h1>
      <p>your name: {name}</p>
      <p>nominee name: {nominee}</p>
      <p>why nominate: {why}</p>
      <input
        type="button"
        value="Submit"
        onClick={e => {
          e.preventDefault();
          dispatch({ t: "confirmNomination" });
        }}
      />
    </WithSidebar>
  );
}

function switcher(s: State) {
  switch (s.t) {
    case "nominating":
      return <Nominating />;
    case "confirming":
      return <Confirming name={s.name} nominee={s.nominee} why={s.why} />;
    case "confirmed":
      return (
        <React.Fragment>
          <h1>Thank you for the nomination!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </React.Fragment>
      );
  }
}

function Form() {
  const [s, d] = React.useReducer(reducer, init);
  return <Context.Provider value={d}>{switcher(s)}</Context.Provider>;
}

export default Form;
