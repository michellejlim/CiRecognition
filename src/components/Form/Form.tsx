import * as React from 'react';
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
  | { t: "confirming"; name: string; id: string; why: string }
  | { t: "confirmed" };

type Action = { t: "submitNomination"; name: string; id: string; why: string };

const Context = React.createContext<React.Dispatch<Action>>(() => {});

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "submitNomination":
      return { t: "confirming", name: a.name, id: a.id, why: a.why };
  }
}

const init: State = { t: "nominating" };
const apiUrl: string = 'http://is-tool.the-institute.org:3000';

function Nominating() {
  const name = React.useRef<HTMLInputElement | null>(null);
  const id = React.useRef<HTMLInputElement | null>(null);
  const why = React.useRef<HTMLTextAreaElement | null>(null);
  const dispatch = React.useContext(Context);

  return (
    <React.Fragment>
      <h1>Nominate a Fellow Employee [CURRENTUSER]</h1>

      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch({
            t: "submitNomination",
            name: name.current!.value,
            id: id.current!.value,
            why: why.current!.value
          });
        }}
      >
        <mgt-people-picker></mgt-people-picker>
        <input ref={name} type="text" placeholder="Name" />
        <input ref={id} type="text" placeholder="Employee ID" />
        <textarea
          ref={why}
          placeholder="Why did you nominate this employee?"
        ></textarea>
        <input type="submit" value="Submit Nomination" />
      </form>
    </React.Fragment>
  );
}

function switcher(s: State) {
  switch (s.t) {
    case "nominating":
      return <Nominating />;
    case "confirming":
      return (
        <React.Fragment>
          <h1>Confirm Nomination</h1>
          <dl>
            <dt>Name</dt>
            <dd>{s.name}</dd>
            <dt>ID</dt>
            <dd>{s.id}</dd>
            <dt>Why nominate</dt>
            <dd>{s.why}</dd>
          </dl>
        </React.Fragment>
      );
    case "confirmed":
      return "todo";
  }
}

function Form() {
  const [s, d] = React.useReducer(reducer, init);
  return <Context.Provider value={d}>{switcher(s)}</Context.Provider>;
}

export default Form;