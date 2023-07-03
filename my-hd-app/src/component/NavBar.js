import logo from "../asset/logo.png";
import React, { useContext } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"

import { AuthContext } from "../context/auth";

const NavBar = () => {
    const { user, staff, admin } = useContext(AuthContext);

    const handleSignout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("id");

        localStorage.removeItem("staff_token");
        localStorage.removeItem("staff_email");
        localStorage.removeItem("staff_id");

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_email");
        localStorage.removeItem("admin_id");

        window.location.reload()

    }

    const getNavItems = () => {
        if (user.id != null) {
            return (
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <NavDropdown title="Consultation" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/consultation/book">Book Consultation</NavDropdown.Item>

                            <NavDropdown.Item href="/consultations">All Consultations</NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item href="">
                                Nothing
                            </NavDropdown.Item>

                        </NavDropdown>

                    </Nav>
                    <Button variant="primary" onClick={handleSignout}>Logout</Button>
                </Navbar.Collapse>)
        }
        else if (staff.id != null) {
            return (
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/staff/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/staff/profile">Profile</Nav.Link>
                        <NavDropdown title="Appointments" id="basic-nav-dropdown">

                            <NavDropdown.Item href="/staff/appointments">All Appointments</NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">
                                Nothing
                            </NavDropdown.Item>

                        </NavDropdown>
                    </Nav>
                    <Button variant="primary" onClick={handleSignout}>Logout</Button>
                </Navbar.Collapse>)
        }
        else if (admin.id != null) {

            return (
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Accounts" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/admin/students">Students</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/staffs">Staffs</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Navbar.Text className="mx-4">
                        Signed in as: <strong>{admin.email}</strong>
                    </Navbar.Text>

                    <Button variant="primary" onClick={handleSignout}>Logout</Button>
                </Navbar.Collapse>)
        }
        else {
            return (
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>)
        }
    }

    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    <strong>BookFast</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {getNavItems()}

            </Container>



        </Navbar>
    );
}

export default NavBar;