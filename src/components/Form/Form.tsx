import * as React from "react";
import "./Form.css";

// import { msalInstance } from '../../hoc/Auth'; 
import "@microsoft/mgt";  
import { values } from 'office-ui-fabric-react';  

declare global {  
  // eslint-disable-next-line @typescript-eslint/no-namespace 
  namespace JSX { 
    interface IntrinsicElements { 
      'mgt-people-picker': any; 
    } 
  } 
} 

declare global {  
  // eslint-disable-next-line @typescript-eslint/no-namespace 
  namespace JSX { 
    interface IntrinsicElements { 
      'mgt-person': any;  
    } 
  } 
} 

declare global {  
  // eslint-disable-next-line @typescript-eslint/no-namespace 
  namespace JSX { 
    interface IntrinsicElements { 
      'mgt-get': any; 
    } 
  } 
} 

declare global {  
  // eslint-disable-next-line @typescript-eslint/no-namespace 
  namespace JSX { 
    interface IntrinsicElements { 
      'template': any;  
    } 
  } 
}

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

function Container(props: JustChildren) {
  return (
    <div className="Container">
      <nav className="Container__Nav">
        <a href="dashboard">Dashboard</a>
        <a href="nomination">Nomination</a>
        <a href="review">Review</a>
      </nav>
      <img
        src="https://www.amazingkids.org/images/logo2.png"
        className="Container__Logo"
      />
      <div className="Container__Content">{props.children}</div>
    </div>
  );
}

function WithSidebar(props: JustChildren) {
  return (
    <div className="WithSidebar">
      <ul className="WithSidebar__Sidebar">
        <li>
          <a href="person1">person 1</a>
        </li>
        <li>
          <a href="person2">person 2</a>
        </li>
        <li>
          <a href="person3">person 3</a>
        </li>
      </ul>
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
      <WithSidebar>
        <h1>Nominate a Fellow Employee [CURRENTUSER]</h1>
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
          <mgt-people-picker></mgt-people-picker>
          <input ref={name} type="text" placeholder="Name" />
          <textarea
            ref={why}
            placeholder="Why did you nominate this employee?"
          ></textarea>
          <input type="submit" value="Submit Nomination" />
        </form>
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

function Form() {
  const [s, d] = React.useReducer(reducer, init);
  return <Context.Provider value={d}>{switcher(s)}</Context.Provider>;
}

export default Form;
