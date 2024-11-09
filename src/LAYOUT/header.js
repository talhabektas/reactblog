import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
    const { loggedIn, user } = useSelector((state) => state.auth);

    return (
        <>
            <Container fluid className="container-fluid header bg-light py-3">
                <h2 className="text-center text-uppercase">
</h2>
            </Container>

            <Navbar bg="light" expand="lg" className="py-3">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/Blog">Blog</Nav.Link>
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                            <Nav.Link as={Link} to="/Chat">chat</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/Register" className="text-uppercase" style={{ color: 'black' }}>Register</Nav.Link>                            {loggedIn ? (
                                <>
                                    <span className="navbar-text me-3 text-shadow">Welcome, {user?.username || "User"}</span>
                                    <Nav.Link as={Link} to="/logout" className="text-uppercase" style={{ color: 'black' }}>Logout</Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="/login" className="text-uppercase">Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
