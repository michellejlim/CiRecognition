import * as React from "react";
import EmailGetter from "../EmailGetter";
import "./Form.css";
import { getApiUrl, toJson } from "../../fetching";
import FlashMessage from "react-flash-message";

type Guy = {
  displayName: string;
  userPrincipalName: string;
};

type Reason = {
  id: number;
  name: string;
};

type State =
  | { t: "nominating"; err: string | null; showToast: boolean }
  | {
      t: "confirming";
      why: Reason;
      nominees: Guy[];
      other: string;
      myEmail: string;
      err: string | null;
    };

type Action =
  | { t: "err"; err: string }
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
        return {
          t: "nominating",
          err: "please add at least one nominee",
          showToast: false,
        };
      }
      return {
        t: "confirming",
        why: a.why,
        nominees: a.nominees,
        other: a.other,
        myEmail: a.myEmail,
        err: null,
      };
    case "confirmNomination":
      return { t: "nominating", err: null, showToast: true };
    case "backNomination":
      return { t: "nominating", err: null, showToast: false };
    case "err":
      return { ...s, err: a.err };
  }
}

const init: State = { t: "nominating", err: null, showToast: false };

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

function Nominating({ err }: { err: string | null }) {
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
    return null;
  }
  return (
    <WithSidebar>
      <EmailGetter onGetEmail={setMyEmail} />
      <div className="NominationForm">
        <br />
        <h1>Nominate Another Team Member!</h1>
        <br />
        <br />
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
            <h5 className="form_headers">Team Member (s) Being Nominated</h5>
            <mgt-people-picker ref={people}></mgt-people-picker>
            {err === null ? null : <div className="Form__Err">{err}</div>}
            <br />
            <h5 className="form_headers" id="nomination_reason_header">
              Why are you nominating this team member?
            </h5>
            <br />
            <select value={name} onChange={(e) => setName(e.target.value)}>
              {Array.from(reasons.entries()).map(([why, id]) => (
                <option key={id} value={why}>
                  {why}
                </option>
              ))}
            </select>
            <div style={{ display: name === "Other" ? "block" : "none" }}>
              <h5 className="form_headers" id="nomination_reason_header">
                Please explain:
              </h5>
              <textarea ref={other} />
            </div>
            <br />
            <br />
            <br />
            <input type="submit" value="Submit Nomination" />
            <br />
            <br />
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
  err: string | null;
};

function Confirming({ nominees, why, other, myEmail, err }: ConfirmingProps) {
  const dispatch = React.useContext(Context);
  return (
    <WithSidebar>
      <div className="NominationForm">
        <br />
        <h1 id="header">Confirm Nomination</h1>
        <br />
        <br />
        <div className="nom-form">
          <h5 className="form_headers">Selected Nominees: </h5>
          <br />
          <ol>
            <br />
            {/* nominees ought not change, so it should be ok to use the index as the key */}
            {nominees.map((n, idx) => (
              <li key={idx}>{n.displayName}</li>
            ))}
            <br />
          </ol>
          <br />
          <br />
          <h5 className="form_headers">Reason for Nomination</h5>
          <br />
          <div className="reason">
            {why.name === "Other" ? other : why.name}
          </div>
          {err === null ? null : <div className="Form__Err">{err}</div>}
          <br />
          <br />
          <input
            type="reset"
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
              const myEmployeeId = (
                await fetch(
                  getApiUrl("tblEmployees", { emailCompany: myEmail })
                ).then(toJson)
              )[0].employeeId;
              for (const nominee of nominees) {
                const nom2 = (
                  await fetch(
                    getApiUrl("tblEmployees", {
                      emailCompany: nominee.userPrincipalName,
                    })
                  ).then(toJson)
                )[0];
                if (nom2 === undefined) {
                  dispatch({
                    t: "err",
                    err:
                      "This Microsoft Graph user is not defined in the database. Please nominate a different user.",
                  });
                  return;
                }
                const req = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    reason: why.name === "Other" ? other : why.name,
                    status: "pending",
                    date: new Date().toUTCString(),
                    nominator: myEmployeeId,
                    nominee: nom2.employeeId,
                    award: why.id,
                  }),
                };
                try {
                  await fetch(getApiUrl("Nominations"), req).then(toJson);
                } catch (e) {
                  dispatch({ t: "err", err: String(e) });
                  return;
                }
              }
              dispatch({ t: "confirmNomination" });
            }}
          />
          <br />
          <br />
        </div>
      </div>
    </WithSidebar>
  );
}

function switcher(s: State) {
  switch (s.t) {
    case "nominating":
      return (
        <React.Fragment>
          {s.showToast ? (
            <FlashMessage duration={3000}>
              <div className="flash">Nomination Submitted</div>
            </FlashMessage>
          ) : null}
          <Nominating err={s.err} />
        </React.Fragment>
      );
    case "confirming":
      return (
        <Confirming
          nominees={s.nominees}
          why={s.why}
          other={s.other}
          myEmail={s.myEmail}
          err={s.err}
        />
      );
  }
}

function Form() {
  const [s, d] = React.useReducer(reducer, init);
  return <Context.Provider value={d}>{switcher(s)}</Context.Provider>;
}

export default Form;
