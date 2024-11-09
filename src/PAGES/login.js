import React, { useState } from 'react';
import { Col, Container, Row, Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/direct/AuthSlice";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleCloseModal = () => setShowModal(false);

    const Save = async (data) => {
        try {
            const Apiurl = `${process.env.REACT_APP_API_AUTHENTICATION}/login`;
            const response = await axios.post(Apiurl, data, { withCredentials: true });

            if (response.status === 200) {
                const responseData = response.data;
                console.log(responseData);

                localStorage.setItem("token", responseData.token);
                dispatch(setUser(responseData.user));

                navigate("/", { state: responseData.msg });
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Yanlış e-posta veya şifre girdiniz. Lütfen tekrar deneyin.");
            } else {
                setErrorMessage("Giriş başarısız. Kayıtlı değilseniz lütfen register olun.");
                setTimeout(() => {
                    navigate("/register");
                }, 3000);
            }
            setShowModal(true);
        }
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="w-100">
                    <Col xs={12} md={6} lg={4} className="mx-auto">
                        <h2 className="text-center mb-4">Login to Your Account</h2>

                        <Form onSubmit={handleSubmit(Save)} className="border p-4 shadow rounded">
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email", { required: "Email gerekli" })}
                                    isInvalid={!!errors.email}
                                />
                                {errors.email && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", { required: "Şifre gerekli" })}
                                    isInvalid={!!errors.password}
                                />
                                {errors.password && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>

                        {errorMessage && (
                            <Alert variant="danger" className="mt-4">
                                {errorMessage}
                            </Alert>
                        )}
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Hata</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Kapat
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Login;
