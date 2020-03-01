import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import { MainScreen } from '../../components/MainScreen/MainScreen';
import { withAuth } from '../../hoc/Auth';
import { Stack, Text, FontWeights } from 'office-ui-fabric-react';


initializeIcons();

const boldStyle = { root: { fontWeight: FontWeights.semibold } };

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
        <Switch>
          <Route path="/" exact={true} render={(props) => <MainScreen />} />
          <Route path="/ad" exact={true} render={(props) => <MainScreen />} />
        </Switch>
      </Stack>
    </div>
  );
};

export const App = hot(module)(withAuth(RootApp));
