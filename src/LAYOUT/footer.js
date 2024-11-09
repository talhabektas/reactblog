import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <Container fluid className="container-fluid footer" style={{ marginTop:"129px"}}>
            <Row>
                <Col xs="6">
                    <ul >
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/Blog">Blog</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </Col>
                <Col xs="6">
                    <div className="col text-center text-lg-left pt-3" style={{ height: "100px" }}>
                        <a className="" href="/contact/">
                            <h5 >Connect With Me on Social Media</h5>
                        </a>
                        <div className="social-links pt-1" >
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.linkedin.com/in/mehmet-talha-bekta%C5%9F-4a56aa271/"
                                title="Connect on Linkedin"
                            >
                                <i className="fa-brands fa-linkedin fa-2x"></i>
                            </a>
                            &nbsp;&nbsp;&nbsp;
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://github.com/talhabektas"
                                className="Github"
                                title="Connect on Github"
                            >
                                <i class="fa-brands fa-github fa-2x"></i>
                            </a>
                            &nbsp;&nbsp;&nbsp;
                            <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.instagram.com/talha.bekts/"
                            title="Connect on Instagram"
                        >
                            <i className="fa-brands fa-instagram fa-2x"></i>
                        </a>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>

    );
};

export default Footer;
