import * as React from 'react';
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