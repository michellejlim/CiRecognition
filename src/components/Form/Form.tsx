import * as React from "react";
import Container from "../Container/Container";
import "./Form.css";
type State =
  | { t: "nominating" }
  | { t: "confirming"; name: string; why: string }
  | { t: "confirmed" };

type Action =
  | { t: "submitNomination"; name: string; why: string }
  | { t: "confirmNomination" };

const Context = React.createContext<React.Dispatch<Action>>(() => {});

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "submitNomination":
      return { t: "confirming", name: a.name, why: a.why };
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
  const id = React.useRef<HTMLInputElement | null>(null);
  const why = React.useRef<HTMLTextAreaElement | null>(null);
  const dispatch = React.useContext(Context);

  return (
    <Container>
      &nbsp;
      <br />
      &nbsp;
      <hr />
      <WithSidebar>
        <div className="NominationForm">
          &nbsp;
          <h1>&nbsp;Nominate a Fellow Employee </h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              dispatch({
                t: "submitNomination",
                name: name.current!.value,
                why: why.current!.value
              });
            }}
          >
            <p>Your Name:</p>
            <input type="text" name="name" />
            <p></p>
            <p>Employee Being Nominated</p>
            <mgt-people-picker></mgt-people-picker>
            <p></p>
            <p>Why did you nominate this employee?</p>
            <p></p>
            <textarea name="why" />
            <p></p>
            <p></p>
            <p></p>
            <input type="submit" value="Submit Nomination" />
            <p></p>
          </form>
        </div>
      </WithSidebar>
    </Container>
  );
}

type ConfirmingProps = {
  name: string;
  why: string;
};

function Confirming({ name, why }: ConfirmingProps) {
  const dispatch = React.useContext(Context);
  return (
    <Container>
      <WithSidebar>
        <h1 id="header">Confirm Nomination</h1>
        <h2>{name}</h2>
        <p>{why}</p>
        <input
          type="button"
          value="Submit"
          onClick={e => {
            e.preventDefault();
            dispatch({ t: "confirmNomination" });
          }}
        />
      </WithSidebar>
    </Container>
  );
}

function switcher(s: State) {
  switch (s.t) {
    case "nominating":
      return <Nominating />;
    case "confirming":
      return <Confirming name={s.name} why={s.why} />;
    case "confirmed":
      return (
        <Container>
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
        </Container>
      );
  }
}

export default Nominating;
