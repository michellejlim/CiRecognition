import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";
import { MainScreen } from "../../components/MainScreen/MainScreen";
import Form from "../../components/Form/Form";
import Container from "../../components/Container/Container";
import Dashboard from "../../components/Dashboard/Dashboard";
import Review from "../../components/Review/Review";
import { Stack } from "office-ui-fabric-react";
import "@microsoft/mgt";
import "@progress/kendo-theme-default/dist/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Providers, MsalProvider, ProviderState } from "@microsoft/mgt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "mgt-people-picker": any;
      "mgt-person": any;
      "mgt-get": any;
      "mgt-login": any;
      template: any;
    }
  }
}

initializeIcons();
const msalConfig = { clientId: "27bc12d5-b60b-41a2-b62a-8ccdeac6363f" };
const provider = new MsalProvider(msalConfig);
Providers.globalProvider = provider;

const RootApp: React.StatelessComponent<{}> = (p) => {
  return (
    <div>
      <Stack>
        <Container>
          <Switch>
            <Route path="/" exact render={(props) => <MainScreen />} />
            <Route path="/nominate" exact render={(props) => <Form />} />
            <Route path="/dashboard" exact render={(props) => <Dashboard />} />
            <Route path="/review" exact render={(props) => <Review />} />
          </Switch>
        </Container>
      </Stack>
    </div>
  );
};

if (provider.state === ProviderState.SignedOut) {
  provider.login();
}

export const App = hot(module)(RootApp);
