import axios from "axios";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Spinner, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
    const [loading, loadingState] = useState(false);
    const [apiData, setApiData] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            loadingState(true);
            try {
                const apiUrl = `http://localhost:8000/${id}`;
                const response = await axios.get(apiUrl);

                if (response.status === 200) {
                    setApiData(response.data);
                } else {
                    console.log("API Error:", response.data);
                }
            } catch (error) {
                console.log("Bir hata oluştu:", error.response);
            } finally {
                loadingState(false);
            }
        };

        fetchData();
    }, [id]);

    const saveForm = async (data) => {
        loadingState(true);

        try {
            const apiUrl = `http://localhost:8000/${id}`;
            const response = await axios.put(apiUrl, {
                title: data.title,
                post: data.post,
            });

            if (response.status === 200) {
                console.log("Form başarıyla güncellendi:", response);
                navigate("/");
            } else {
                console.log("API Error:", response.data);
            }
        } catch (error) {
            console.log("Bir hata oluştu:", error.response);
        } finally {
            loadingState(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="grow" />
            </Container>
        );
    }

    return (
        <Container>
            <h3 className="text-center my-4" style={{ color: '#6c757d' }}>Fikir değişiklikleri iyidir;)</h3>
            {apiData ? (
                <Form onSubmit={handleSubmit(saveForm)}>
                    <Row>
                        <Col xs="12" className="py-3">
                            <Form.Group controlId="formTitle">
                                <Form.Label style={{ fontWeight: 'bold' }}>Konunuzdan memnun kalmadınız mı?</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    defaultValue={apiData.title}
                                    isInvalid={!!errors.title}
                                    placeholder="Lütfen konunuzu giriniz"
                                    {...register("title", {
                                        required: { value: true, message: "Başlık zorunludur." },
                                        minLength: {
                                            value: 3,
                                            message: "Başlık en az 3 karakter olmalıdır.",
                                        },
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.title && errors.title.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs="12" className="py-3">
                            <Form.Group controlId="formPost">
                                <Form.Label style={{ fontWeight: 'bold' }}>yeni içerik he</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="post"
                                    defaultValue={apiData.post}
                                    isInvalid={!!errors.post}
                                    placeholder="Lütfen içeriğinizi giriniz"
                                    {...register("post", {
                                        required: {
                                            value: true,
                                            message: "İçerik zorunludur.",
                                        },
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.post && errors.post.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col className="text-center">
                            <Button type="submit" className="btn-primary">Kaydet</Button>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <p>Veri yükleniyor...</p>
            )}
        </Container>
    );
};

export default Update;
