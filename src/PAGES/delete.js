import axios from "axios";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Spinner, Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const Delete = () => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const apiUrl = `http://localhost:8000/${id}`;
                const response = await axios.get(apiUrl);

                if (response.status === 200) {
                    setApiData(response.data);
                    console.log(response.data);
                } else {
                    console.log("API Error:", response.data);
                }
            } catch (error) {
                console.log("Bir hata oluştu:", error.response);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const apiUrl = `http://localhost:8000/${id}`;
            const response = await axios.delete(apiUrl);

            if (response.status === 200) {
                console.log("Post başarıyla silindi:", response);
                navigate("/");
            } else {
                console.log("API Error:", response.data);
            }
        } catch (error) {
            console.log("Bir hata oluştu:", error.response);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    if (loading) {
        return (
            <Container className="spinner">
                <Spinner animation="grow" />
            </Container>
        );
    }

    return (
        <Container>
            <h3>Postu Sil</h3>
            {apiData ? (
                <Row>
                    <Col xs="12" className="py-3">
                        <p><strong>Konu:</strong> {apiData.title || "Konu mevcut değil."}</p>
                        <p><strong>İçerik:</strong> {apiData.post || "İçerik mevcut değil."}</p>
                    </Col>
                    <Col xs="12">
                        <Button variant="danger" onClick={handleShowModal}>
                            Sil
                        </Button>
                    </Col>
                </Row>
            ) : (
                <p>Veri yükleniyor...</p>
            )}

            {/* Modal Başlangıcı */}
            <Modal show={showModal} onHide={handleShowModal}>
                <Modal.Header closeButton>
                    <Modal.Title>DELETE THIS </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bu postu silmek istediğinizden emin misiniz?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hayır
                    </Button>
                    <Button variant="danger" onClick={() => {
                        handleDelete();
                        handleCloseModal();
                    }}>
                        Evet
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal Sonu */}
        </Container>
    );
};

export default Delete;
