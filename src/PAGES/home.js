import React, { useState, useEffect, useRef } from 'react';
import { Col, Container, Row, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';
import MessageComponent from './Message';

const Home = () => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [spotifyData, setSpotifyData] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const scrollRef = useRef(null);

    const accessToken = "";
    const playlistId = "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'http://localhost:8000';
                const response = await axios.get(apiUrl);

                if (response.status === 200 && response.data.statusText === 'ok') {
                    setApiData(response.data.blog_records || []);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Blog verileri alınırken hata oluştu:', error.response || error.message);
            }
        };

        const fetchSpotifyData = async () => {
            try {
                const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 200) {
                    setSpotifyData(response.data.items || []);
                }
            } catch (error) {
                console.error('Spotify verileri alınırken hata oluştu:', error.response || error.message);
            }
        };

        fetchData();
        fetchSpotifyData();
    }, [accessToken, playlistId]);

    const handleDelete = async () => {
        if (!selectedPost) return;

        try {
            const apiUrl = `http://localhost:8000/${selectedPost.id}`;
            const response = await axios.delete(apiUrl);

            if (response.status === 200) {
                setApiData(apiData.filter(post => post.id !== selectedPost.id));
            } else {
                console.error('Gönderi silinirken hata oluştu:', response.data);
            }
        } catch (error) {
            console.error('Gönderi silinirken hata oluştu:', error.response || error.message);
        } finally {
            setShowModal(false);
        }
    };

    const handleShowModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    const scrollUp = () => {
        scrollRef.current.scrollBy({
            top: -100,
            behavior: 'smooth'
        });
    };

    const scrollDown = () => {
        scrollRef.current.scrollBy({
            top: 100,
            behavior: 'smooth'
        });
    };

    if (loading) {
        return (
            <div className="spinner d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs="12" md="8">
                    <h2 className="text-center mb-4 text-primary">Top Posts of the Day</h2>
                    <div className="d-flex justify-content-center mb-4">
                        <Link to="adding" className="btn btn-primary btn-lg shadow-sm">
                            Add New Post
                        </Link>
                    </div>

                    {apiData.length > 0 ? (
                        <Row>
                            {apiData.map((record, index) => (
                                <Col key={index} xs="12" sm="6" md="4" className="py-3">
                                    <div className="post-box p-4 shadow rounded h-100">
                                        <h5 className="post-title">
                                            <Link to={`/Blog/${record.id}`} className="text-dark fw-bold">
                                                {record.title}
                                            </Link>
                                        </h5>
                                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                            {record.post}
                                        </p>
                                        <span className="text-muted small" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                            {record.email || "user"}
                                        </span>
                                        <div className="mt-3 d-flex justify-content-between align-items-center">
                                            <Link to={`update/${record.id}`} className="text-warning">
                                                <i className="fa fa-pencil-alt" />
                                            </Link>
                                            <Button variant="link" onClick={() => handleShowModal(record)}>
                                                <i className="fa fa-trash" style={{ color: 'red' }} />
                                            </Button>
                                            <MessageComponent email={record.email} />
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center text-muted py-5">Veri bulunamadı</div>
                    )}
                </Col>

                <Col xs="12" md="4" className="py-3" style={{ backgroundColor: '#E0F7FA', borderRadius: '10px' }}>
                    <h3 className="text-center mb-4 text-info">Top 50 in Turkey</h3>
                    <Button variant="outline-info" className="mb-2 w-100" onClick={scrollUp}>
                        Scroll Up
                    </Button>
                    <div ref={scrollRef} style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '10px',
                        backgroundColor: 'rgba(35,192,17,0.45)',
                        borderRadius: '8px',
                    }}>
                        {spotifyData.length > 0 ? (
                            spotifyData.map((item, index) => (
                                <div key={index} className="track mb-3">
                                    <p className="fw-bold">
                                        {item.track.name} - {item.track.artists.map(artist => artist.name).join(', ')}
                                    </p>
                                    <audio controls className="w-100">
                                        <source src={item.track.preview_url} type="audio/mpeg" />
                                        Tarayıcınız bu ses öğesini desteklemiyor.
                                    </audio>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">Top 50 verisi bulunamadı</p>
                        )}
                    </div>
                    <Button variant="outline-info" className="mt-2 w-100" onClick={scrollDown}>
                        Scroll Down
                    </Button>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Silme Onayı</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bu gönderiyi silmek istediğinize emin misiniz?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        İptal
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Sil
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Home;
