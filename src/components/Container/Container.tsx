import React from "react";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import "./Container.css";
import { push as Menu } from "react-burger-menu";
import logo from "../../images/logo.jpg";
import EmailGetter from "../EmailGetter";
import {
  getApiUrl,
  toJson,
  Employee,
} from "../../fetching";

type Props = {
  children: React.ReactNode;
};

const navItems = ["dashboard", "nominate", "review"];
const navItemsNotSupervisor = ["dashboard", "nominate"];


function navItem(x: string) {
  const pathname = `/${x}`;
  const className =
    window.location.pathname === pathname ||
    (window.location.pathname === "/" && pathname === "/dashboard")
      ? "Container__NavItem--active"
      : "";
  console.log(window.location.pathname);
  return (
    <NavItem key={x}>
      <NavLink href={pathname} className={className}>
        {x.toUpperCase()}
      </NavLink>
    </NavItem>
  );
}

async function checkIfSupervisor(myEmail: string){
  const myEmployeeId: number = await fetch(
    getApiUrl("tblEmployees", { emailCompany: myEmail })
    )
    .then(toJson)
    .then((xs) => xs[0].employeeId);

  const isSupervisor =  await fetch(getApiUrl("tblEmployees", {supervisorEmployeeId: myEmployeeId}))
    .then(toJson)
    .then((supervisees: Employee[]) => {
      console.log(supervisees.length)
      if (supervisees.length > 0){
        return true
      }else{
        return false
      }
    });
  return isSupervisor;
}

function Container(props: Props) {
  const [myEmail, setMyEmail] = React.useState<string | null>(null);
  const [isSupervisor, setIsSupervisor] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (myEmail === null) {
      return;
    }
    // TODO what if the backend errors?
    checkIfSupervisor(myEmail).then(setIsSupervisor);
  }, [myEmail]);

  return (
    <div className="Container">
      <EmailGetter onGetEmail={setMyEmail} />
      <Menu disableAutoFocus>
        <a id="home" className="menu-item" href="/">
          Home
        </a>
      </Menu>
      <div className="Container__Top">
        <img src={logo} className="Container__Logo" alt="logo" />
        <Navbar light expand="md" className="Container__Nav">
          <Nav className="mr-auto" navbar>
            {isSupervisor ?   navItems.map(navItem) : navItemsNotSupervisor.map(navItem)}
          </Nav>
        </Navbar>
        <mgt-login id="myLoginControl"></mgt-login>
      </div>
      <div className="Container__Content">{props.children}</div>
    </div>
  );
}

export default Container;
