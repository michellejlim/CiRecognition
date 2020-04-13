import * as React from "react";
import EmailGetter from "../EmailGetter";
import "./Form.css";
import { getApiUrl, toJson } from "../../fetching";
import FlashMessage from 'react-flash-message'


type Guy = {
  displayName: string;
  userPrincipalName: string;
};

type Reason = {
  id: number;
  name: string;
};

type State =
  | { t: "nominating" }
  | {
      t: "confirming";
      why: Reason;
      nominees: Guy[];
      other: string;
      myEmail: string;
    }
  | { t: "confirmed" };

type Action =
  | {
      t: "submitNomination";
      why: Reason;
      nominees: Guy[];
      other: string;
      myEmail: string;
    }
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
        myEmail: a.myEmail,
      };
    case "confirmNomination":
      return { t: "confirmed" };
    case "backNomination":
      return { t: "nominating" };
  }
}

const init: State = { t: "nominating" };

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
  const [reasons, setReasons] = React.useState<Map<string, number> | null>(
    null
  );
  const [name, setName] = React.useState<string | null>(null);
  const [myEmail, setMyEmail] = React.useState<string | null>(null);
  const dispatch = React.useContext(Context);
  React.useEffect(() => {
    fetch(getApiUrl("Nomination_Awards"))
      .then(toJson)
      .then((xs: Reason[]) => {
        const rs = new Map<string, number>();
        for (const { id, name } of xs) {
          rs.set(name, id);
        }
        setReasons(rs);
        setName(xs[0].name);
      });
  }, [setReasons]);
  if (reasons === null || name === null) {
    return <p></p>;
  }
  return (
    <WithSidebar>
      <EmailGetter onGetEmail={setMyEmail} />
      <div className="NominationForm">
        <h1>Nominate a Fellow Employee</h1>
        <br></br>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const id = reasons.get(name);
            if (id === undefined || myEmail == null) {
              throw new Error("internal error");
            }
            dispatch({
              t: "submitNomination",
              why: { name, id },
              nominees: people.current!.selectedPeople,
              other: other.current!.value,
              myEmail,
            });
          }}
        >
          <div className="nom-form">
            <h5>Employee(s) Being Nominated</h5>
            <mgt-people-picker ref={people}></mgt-people-picker>
            <br></br>
            <br></br>
            <h5>Why did you nominate this employee?</h5>
            <select value={name} onChange={(e) => setName(e.target.value)}>
              {Array.from(reasons.entries()).map(([why, id]) => (
                <option key={id} value={why}>
                  {why}
                </option>
              ))}
            </select>
            <div style={{ display: name === "Other" ? "block" : "none" }}>
              <br />
              <textarea ref={other} />
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
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
  nominees: Guy[];
  why: Reason;
  other: string;
  myEmail: string;
};

function Confirming({ nominees, why, other, myEmail }: ConfirmingProps) {
  const dispatch = React.useContext(Context);
  return (
    <WithSidebar>
      <h1 id="header">Confirm Nomination</h1>
      <p>nominees selected: </p>
      <ol>
        {/* nominees ought not change, so it should be ok to use the index as the key */}
        {nominees.map((n, idx) => (
          <li key={idx}>{n.displayName}</li>
        ))}
      </ol>
      <p>why nominate: {why.name === "Other" ? other : why.name}</p>
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
        onClick={async (e) => {
          e.preventDefault();
          dispatch({ t: "confirmNomination" });
          // TODO handle errors when fetching?
          const myId = (
            await fetch(
              getApiUrl("tblEmployees", { emailCompany: myEmail })
            ).then(toJson)
          )[0].id;
          for (const nominee of nominees) {
            const nom2 = (
              await fetch(
                getApiUrl("tblEmployees", {
                  emailCompany: nominee.userPrincipalName,
                })
              ).then(toJson)
            )[0];
            const req = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reason: why.name === "Other" ? other : why.name,
                status: "pending",
                date: new Date().toUTCString(),
                nominator: myId,
                nominee: nom2.id,
                award: why.id,
              }),
            };
            fetch(getApiUrl("Nominations"), req);
          }
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
      return (
        <Confirming
          nominees={s.nominees}
          why={s.why}
          other={s.other}
          myEmail={s.myEmail}
        />
      );
    case "confirmed":
      return (
        <React.Fragment>
          <FlashMessage duration={3000}>
            <div className="flash">Nomination Submitted</div>
          </FlashMessage>
          
          <Nominating />;
        </React.Fragment>
      )
  }
}

function Form() {
  const [s, d] = React.useReducer(reducer, init);
  return <Context.Provider value={d}>{switcher(s)}</Context.Provider>;
}

export default Form;
