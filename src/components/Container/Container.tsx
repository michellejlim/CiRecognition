import React from "react";
import { Col, Navbar, Nav, NavItem, NavLink } from "reactstrap";

type Props = {
  children: React.ReactNode;
};

function Container(props: Props) {
  return (
    <div className="Container">
      <Col>
        <img
          src="https://www.amazingkids.org/images/logo2.png"
          className="Container__Logo"
        />
      </Col>
      <Col>
        <p></p>
        <p></p>
        <Navbar color="white" light expand="md">
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="nomination">Nomination</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="review">Review</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </Col>
      <div className="Container__Content">{props.children}</div>
    </div>
  );
}

export default Container;
