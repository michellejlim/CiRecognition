import * as React from "react";
import Dashboard from "../../components/Dashboard/Dashboard";

interface IProps {
  IsAuthenticated?: any;
}

export const MainScreen: React.FC<IProps> = ({ IsAuthenticated }) => (
  <Dashboard />
);
