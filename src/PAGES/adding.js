import axios from "axios";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Spinner, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";


const Add = () => {
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const navigate = useNavigate();
    const [selectedTitle, setSelectedTitle] = useState("");
    const { user } = useSelector((state) => state.auth);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const apiUrl = "http://localhost:8000";
                const response = await axios.get(apiUrl);

                if (response.status === 200 && response.data.blog_records) {
                    setTitles(response.data.blog_records);
                }

                console.log(response.data);
            } catch (error) {
                console.error("Başlıklar alınırken bir hata oluştu:", error);
            }
        };

        fetchTitles();
    }, []);

    const saveForm = async (data) => {
        setLoading(true);

        try {
            const apiUrl = "http://localhost:8000";
            const response = await axios.post(apiUrl, {
                title: newTitle || selectedTitle,
                post: data.post,
                email: user?.email
            });

            if (response.status === 201) {
                console.log("Form başarıyla kaydedildi:", response);
                if (newTitle && !titles.some((title) => title.title === newTitle)) {
                    setTitles((prevTitles) => [...prevTitles, { title: newTitle }]);
                }
                setNewTitle("");
                setSelectedTitle("");
                navigate("/");
            } else {
                console.log("API Hatası:", response.data);
            }
        } catch (error) {
            console.log("Bir hata oluştu:", error.response);
        } finally {
            setLoading(false);
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
            <h3 className="text-center my-4" style={{ color: '#000', fontWeight: 'bold' }}>
                İstediğiniz konuda fikrinizi paylaşmak için :)
            </h3>
            <Form onSubmit={handleSubmit(saveForm)}>
                <Row>
                    <Col xs="12" className="py-3">
                        <Form.Group controlId="formTitle">
                            <Form.Label style={{ fontWeight: 'bold' }}>Başlık</Form.Label>
                            <Form.Control
                                as="select"
                                name="title"
                                {...register("title")}
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                            >
                                <option value="" disabled>Lütfen bir başlık seçin</option>
                                {Array.from(new Set(titles.map((record) => record.title))).map((uniqueTitle) => (
                                    <option key={uniqueTitle} value={uniqueTitle}>
                                        {uniqueTitle}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <h5 className="mt-3">veya..</h5>

                        <Form.Group controlId="formNewTitle">
                            <Form.Control
                                type="text"
                                name="newTitle"
                                value={newTitle}
                                placeholder="Yeni Başlık Ekle"
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs="12" className="py-3">
                        <Form.Group controlId="formPost">
                            <Form.Label style={{ fontWeight: 'bold' }}>İçerik</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="post"
                                {...register("post", {
                                    required: {
                                        value: true,
                                        message: "İçerik zorunludur.",
                                    },
                                })}
                                placeholder="Lütfen içeriğinizi giriniz"
                                isInvalid={!!errors.post}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.post && errors.post.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Button type="submit" className="btn-primary">Kaydet</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Add;
