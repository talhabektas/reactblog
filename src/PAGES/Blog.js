import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Blog = () => {
    const params = useParams();


    useEffect(() => {
        console.log("Blog ID:", params.id);

        const fetchData = async () => {
            try {
                const apiUrl = `http://localhost:8000/${params.id}`;
                const response = await axios.get(apiUrl);

                if (response.status === 200) {
                    console.log(response.data);
                    if (response?.data.statusText === 'ok') {
                        setApiData(response?.data?.record);
                    }
                }
            } catch (error) {
                console.log('Hata:', error);
                console.log('Hata Yanıtı:', error.response);
            }
        };

        if (params.id) {
            fetchData();
        }
        fetchData();
    }, [params.id]);

    const [apiData, setApiData] = useState(null);

    return (
        <Container>
            {apiData ? (
                <Row>
                    <Col xs="6">
                        <h1>{apiData.title}</h1>
                    </Col>
                    <Col xs="12">
                        <p>{apiData.post}</p>
                    </Col>
                </Row>
            ) : (
                <p>Yükleniyor...</p>
            )}
        </Container>
    );
};

export default Blog;
