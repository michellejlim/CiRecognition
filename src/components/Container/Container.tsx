import React from "react";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import "./Container.css";
import { push as Menu } from "react-burger-menu";
import logo from "../../images/logo.jpg";
import bu from "../../images/bigups.jpg";

import EmailGetter from "../EmailGetter";

import { getApiUrl, toJson, Employee } from "../../fetching";
import { getAnswer } from "../Review/fetching";

type Props = {
  children: React.ReactNode;
};

type NavLinkItemProps = {
  pathname: string;
  show: string;
  badge?: number | null;
};

function NavLinkItem({ pathname, show, badge = null }: NavLinkItemProps) {
  const className =
    window.location.pathname === pathname ||
    (window.location.pathname === "/" && pathname === "/dashboard")
      ? "Container__NavItem--active"
      : "";
  if (badge == null){
    return (
      <NavItem>
        <NavLink href={pathname} className={className}>
          {show}
        </NavLink>
      </NavItem>
    );
  } else {
    return (
      <NavItem>
        <NavLink href={pathname} className={className}>
          {show}
        </NavLink>
        <span className="notification_badge">{badge}</span>
      </NavItem>
    );
  };
}

async function checkIfSupervisor(myEmail: string) {
  const myEmployeeId: number = await fetch(
    getApiUrl("tblEmployees", { emailCompany: myEmail })
  )
    .then(toJson)
    .then((xs) => xs[0].employeeId);

  const isSupervisor = await fetch(
    getApiUrl("tblEmployees", { supervisorEmployeeId: myEmployeeId })
  )
    .then(toJson)
    .then((supervisees: Employee[]) => supervisees.length > 0);
  return isSupervisor;
}

function Container(props: Props) {
  const [myEmail, setMyEmail] = React.useState<string | null>(null);
  const [isSupervisor, setIsSupervisor] = React.useState<boolean | null>(null);
  const [pending, setPending] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (myEmail === null) {
      return;
    }
    checkIfSupervisor(myEmail).then(setIsSupervisor);
    getAnswer(myEmail).then((x) => {
      setPending(x.pending.length);
    });
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
        {isSupervisor != null ? 
          <Nav className="mr-auto" navbar>
            <NavLinkItem pathname="/dashboard" show="DASHBOARD" />
            <NavLinkItem pathname="/nominate" show="NOMINATE" />
            {isSupervisor ? (
              <NavLinkItem
                pathname="/review"
                show="REVIEW"
                badge= {pending === null ? 0 : pending}
              />
            ) : null}
          </Nav> : null }
        </Navbar>
        <mgt-login id="myLoginControl"></mgt-login>
      </div>
      
    
      <div className="Container__Content">{props.children}</div>

    </div>
  );
}

export default Container;
