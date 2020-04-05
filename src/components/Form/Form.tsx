import * as React from "react";
import "./Form.css";

type State =
  | { t: "nominating" }
  | { t: "confirming"; why: string; nominees: string[]; other: string }
  | { t: "confirmed" };

type Action =
  | { t: "submitNomination"; why: string; nominees: string[]; other: string }
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
        nominees: a.nominees,
        other: a.other,
      };
    case "confirmNomination":
      return { t: "confirmed" };
    case "backNomination":
      return { t: "nominating" };
  }
}

const init: State = { t: "nominating" };
const apiUrl: string = "http://localhost:3000/api";

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
  const other = React.useRef<null | HTMLTextAreaElement>(null);
  const [reasons, setReasons] = React.useState<string[] | null>(null);
  const [why, setWhy] = React.useState<string | null>(null);
  const dispatch = React.useContext(Context);
  React.useEffect(() => {
    fetch(`${apiUrl}/Nomination_Awards`)
      .then((data) => data.json())
      .then((xs) => {
        const whys = xs.map((x: any) => x.name);
        setReasons(whys);
        setWhy(whys[0]);
      })
      .catch((err) => console.error({ err }));
    console.log("doing an effect");
  }, [setReasons]);
  if (reasons === null || why === null) {
    return <p>loading</p>;
  }
  return (
    <WithSidebar>
      <div className="NominationForm">
        <h1>Nominate a Fellow Employee </h1>
        <br></br>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              t: "submitNomination",
              why,
              nominees: people.current!.selectedPeople.map(
                (x: any) => x.displayName
              ),
              other: other.current!.value,
            });
          }}
        >
          <div className="nom-form">
            <h5>* Employee(s) Being Nominated</h5>
            
            <mgt-people-picker ref={people}></mgt-people-picker>
            <br></br><br></br>
            <h5>Why did you nominate this employee?</h5>
            <select value={why} onChange={(e) => setWhy(e.target.value)}>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
            <div style={{ display: why === "other" ? "block" : "none" }}>
              <br />
              <textarea ref={other} />
            </div>
          <br></br><br></br><br></br><br></br>
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
  nominees: string[];
  why: string;
  other: string;
};

function Confirming({ nominees, why, other }: ConfirmingProps) {
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
      <p>why nominate: {why === "other" ? other : why}</p>
      <input
        type="button"
        value="Back"
        onClick={(e) => {
          dispatch({ t: "backNomination" });
        }}
      />
      <input
        type="button"
        value="Submit"
        onClick={(e) => {
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
      return <Confirming nominees={s.nominees} why={s.why} other={s.other} />;
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
