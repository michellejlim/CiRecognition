import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import { MainScreen } from '../../components/MainScreen/MainScreen';
import { Stack, FontWeights } from 'office-ui-fabric-react';
import '@microsoft/mgt';
import { Provider } from 'react-redux';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'mgt-msal-provider': any;
    }
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'mgt-login': any;
    }
  }
}

initializeIcons();

const RootApp: React.StatelessComponent<{}> = (p) => {
  
  return (
    <div>
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        verticalFill
        styles={{
          root: {
            width: '960px',
            margin: '0 auto',
            textAlign: 'left',
            color: '#605e5c'
          }
        }}
        gap={15}>
        <mgt-msal-provider client-id="27bc12d5-b60b-41a2-b62a-8ccdeac6363f"></mgt-msal-provider>
        <mgt-login></mgt-login>
        <Switch>
          <Route path="/" exact={true} render={(props) => <MainScreen />} />
          <Route path="/ad" exact={true} render={(props) => <MainScreen />} />
        </Switch>
      </Stack>
      {/* <script src="node_modules/@microsoft/mgt/dist/es6/components.js"></script> */}
    </div>
  );
};


export const App = hot(module)(RootApp);