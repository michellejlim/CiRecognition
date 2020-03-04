import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";
import { MainScreen } from "../../components/MainScreen/MainScreen";

initializeIcons();

const RootApp: React.StatelessComponent<{}> = p => {
  return (
    <div>
      <Switch>
        <Route path="/" exact={true} render={props => <MainScreen />} />
        <Route path="/ad" exact={true} render={props => <MainScreen />} />
      </Switch>
    </div>
  );
};

export const App = hot(module)(RootApp);
