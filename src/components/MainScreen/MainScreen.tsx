import * as React from "react";
import Form from "../../components/Form/Form";

interface IProps {
  IsAuthenticated?: any;
}

export const MainScreen: React.FC<IProps> = ({ IsAuthenticated }) => <Form />;
