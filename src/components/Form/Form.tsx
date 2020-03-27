import * as React from "react";
import "./Form.css";

type State =
  | { t: "nominating" }
  | { t: "confirming"; why: string; nominees: string[] }
  | { t: "confirmed" };

type Action =
  | { t: "submitNomination"; why: string; nominees: string[] }
  | { t: "confirmNomination" }
  | { t: "backNomination" };

const Context = React.createContext<React.Dispatch<Action>>(() => {});

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "submitNomination":
      if (a.nominees.length === 0) {
        // TODO show an error
        return s;
      }
      return {
        t: "confirming",
        why: a.why,
        nominees: a.nominees
      };
    case "confirmNomination":
      return { t: "confirmed" };
    case "backNomination":
      return { t: "nominating" };
  }
}

const init: State = { t: "nominating" };
const apiUrl: string = "http://is-tool.the-institute.org:3000";

const reasons = ["good leadership", "kindness outreach", "no absences"];

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
  const people = React.useRef<any | null>(null);
  const [why, setWhy] = React.useState<string | null>(null);
  const dispatch = React.useContext(Context);
  return (
    <WithSidebar>
      <div className="NominationForm">
        <h1>Nominate a Fellow Employee </h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            // TODO do something if why is null
            if (why === null) {
              return;
            }
            dispatch({
              t: "submitNomination",
              why,
              nominees: people.current!.selectedPeople.map(
                (x: any) => x.displayName
              )
            });
          }}
        >
          <p>Employee(s) Being Nominated</p>
          <mgt-people-picker ref={people}></mgt-people-picker>
          <p>Why did you nominate this employee?</p>
          {reasons.map(r => (
            <p key={r}>
              <label>
                <input
                  type="radio"
                  name="reason"
                  onChange={() => setWhy(r)}
                  checked={why === r}
                />
                {r}
              </label>
            </p>
          ))}
          <input
            type="radio"
            name="reason"
            value="other"
            checked={why !== null && !reasons.includes(why)}
          />
          <label>other</label>
          <div>
            <textarea name="why" onChange={e => setWhy(e.target.value)} />
          </div>
          <div>
            <input type="submit" value="Submit Nomination" />
          </div>
        </form>
      </div>
    </WithSidebar>
  );
}

type ConfirmingProps = {
  nominees: string[];
  why: string;
};

function Confirming({ nominees, why }: ConfirmingProps) {
  const dispatch = React.useContext(Context);
  return (
    <WithSidebar>
      <h1 id="header">Confirm Nomination</h1>
      <p>nominees selected: </p>
      <ol>
        {/* nominees ought not change, so it should be ok to use the index as the key */}
        {nominees.map((n, idx) => (
          <li key={idx}>{n}</li>
        ))}
      </ol>
      <p>why nominate: {why}</p>
      <input
        type="button"
        value="Back"
        onClick={e => {
          dispatch({ t: "backNomination" });
        }}
      />
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
      return <Confirming nominees={s.nominees} why={s.why} />;
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
