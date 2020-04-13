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
import "./App.css";
import {UserAgentApplication} from "msal";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "mgt-people-picker": any;
      "mgt-person": any;
      "mgt-get": any;
      "mgt-msal-provider": any;
      "mgt-login": any;
      "mgt-people": any;
      template: any;
    }
  }
}


initializeIcons();

const RootApp: React.StatelessComponent<{}> = (p) => {
  return (
    <div>
      <Stack>
        <mgt-msal-provider client-id="27bc12d5-b60b-41a2-b62a-8ccdeac6363f"></mgt-msal-provider>
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

const config = {
    auth: {
        clientId: '27bc12d5-b60b-41a2-b62a-8ccdeac6363f',
    }
}

const userAgentApplication = new UserAgentApplication(config);

// if (userAgentApplication.getAccount() === null){
//   console.log(userAgentApplication.getAccount())
//   window.location.href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token&scope=user.read%20openid%20profile&client_id=27bc12d5-b60b-41a2-b62a-8ccdeac6363f&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2F&state=3e487578-7e28-4051-9c21-801b73b7e798&nonce=6d5328ca-5596-4495-ab02-4d7340869821&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.1.3&prompt=select_account&client-request-id=8e82d568-a6da-4a4e-911a-09185362e5f6&response_mode=fragment&sso_reload=true"
// }


export const App = hot(module)(RootApp);
