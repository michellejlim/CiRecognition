import React from "react";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import "./Container.css";
import { push as Menu } from 'react-burger-menu'

type Props = {
  children: React.ReactNode;
};


const navItems = ["dashboard", "nominate", "review"];

function navItem(x: string) {
  const pathname = `/${x}`;
  const className =
    (window.location.pathname === pathname || (window.location.pathname == "/" && pathname == "/dashboard")) ? "Container__NavItem--active" : "";
  console.log(window.location.pathname)
  return (
    <NavItem key={x}>
      <NavLink href={pathname} className={className}>
        {x.toUpperCase()}      

      </NavLink>

    </NavItem>
  );
}

function Container(props: Props) {
  return (
    <div className="Container">
      <Menu disableAutoFocus >
        <a id="home" className="menu-item" href="/">Home</a>
      </Menu>
      <div className="Container__Top"> 
        <img
          src="https://www.getstrategy.com/uploads/photos/o/1447339782_photosthe-childrens-institute.png"
          alt="logo"
          className="Container__Logo"
        />
        <Navbar light expand="md" className="Container__Nav">
          <Nav className="mr-auto" navbar>
            {navItems.map(navItem)}
          </Nav>
        </Navbar>
        <mgt-login id="myLoginControl"></mgt-login>
      </div>
      <div className="Container__Content">{props.children}</div>
    </div>
  );
}

export default Container;
