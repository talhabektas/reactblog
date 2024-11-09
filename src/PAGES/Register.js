import React, { useState } from 'react';
import { Col, Container, Row, Form, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/direct/AuthSlice";

const Register = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const Save = async (data) => {
        console.log(data);
        try {
            const Apiurl = `${process.env.REACT_APP_API_AUTHENTICATION}/register`;
            const response = await axios.post(Apiurl, data, { withCredentials: true });
            if (response.status === 200) {
                const responseData = await response.data;
                console.log(responseData);

                localStorage.setItem("token", responseData.token);
                dispatch(setUser(responseData.user));

                setShowModal(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate("/");
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="w-100">
                    <Col xs={12} md={6} className="mx-auto">
                        <h2 className="text-center mb-4">Create Your Account</h2>
                        <Form onSubmit={handleSubmit(Save)} className="border p-4 shadow-sm rounded">

                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    isInvalid={errors.email}
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group> <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="username"
                                    placeholder="Enter username"
                                    isInvalid={errors.username}
                                    {...register("username", { required: "username is required" })}
                                />
                                {errors.username && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    isInvalid={errors.password}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                />
                                {errors.password && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    isInvalid={errors.passwordConfirm}
                                    {...register("passwordConfirm", {
                                        required: "Please confirm your password",
                                        validate: value => value === watch('password') || "Passwords do not match"
                                    })}
                                />
                                {errors.passwordConfirm && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.passwordConfirm.message}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            <div className="d-grid">
                                <Button variant="primary" type="submit">
                                    Register
                                </Button>
                            </div>

                        </Form>
                    </Col>
                </Row>
            </Container>


            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Başarıyla kaydolunmuştur. Ana sayfaya yönlendiriliyorsunuz.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleModalClose}>
                        Ana Sayfaya Git
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Register;
