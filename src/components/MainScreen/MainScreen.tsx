import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import ReactDOM from "react-dom";
import { Stack } from 'office-ui-fabric-react';
import Form from '../../components/Form/Form';

interface IProps {
  IsAuthenticated?: any
}

export const MainScreen: React.FC<IProps> = ({ IsAuthenticated }) => (
  <Stack horizontal gap={15} horizontalAlign="center">
    <Form />
  </Stack>
);