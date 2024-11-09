import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [wsConnection, setWsConnection] = useState(null);
    const messagesEndRef = useRef(null);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws?email=${user.email}`);

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prev => [...prev, newMessage]);
        };

        ws.onclose = () => {
            console.log('WebSocket Connection Closed');
        };

        setWsConnection(ws);

        return () => {
            if (ws) ws.close();
        };
    }, [user.email]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/messages', {
                params: {
                    email: user.email
                }
            });

            if (response.status === 200) {
                setMessages(response.data.messages);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [user.email]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const markMessageAsRead = async (messageId) => {
        try {
            await axios.put(`http://localhost:8000/api/messages/${messageId}/read`);
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post('http://localhost:8000/api/messages/send', {
                from_email: user.email,
                to_email: messages[messages.length - 1]?.from_email,
                content: newMessage,
            });

            if (response.status === 201) {
                setNewMessage('');
                setMessages(prev => [...prev, response.data]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">Messages</h4>
                        </Card.Header>
                        <Card.Body style={{ height: '500px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="messages-container">
                                    {messages.map((message, index) => {
                                        const isOwnMessage = message.from_email === user.email;
                                        if (!isOwnMessage && !message.is_read) {
                                            markMessageAsRead(message.ID);
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className={`message-bubble mb-3 ${isOwnMessage ? 'text-end' : ''}`}
                                            >
                                                <div
                                                    className={`d-inline-block p-3 rounded-3 ${
                                                        isOwnMessage
                                                            ? 'bg-primary text-white'
                                                            : 'bg-light'
                                                    }`}
                                                    style={{ maxWidth: '75%' }}
                                                >
                                                    <div className="small mb-1">
                                                        {isOwnMessage ? 'You' : message.from_email}
                                                    </div>
                                                    <div>{message.content}</div>
                                                    <div className="small text-end mt-1">
                                                        {new Date(message.created_at).toLocaleTimeString()}
                                                        {message.is_read && isOwnMessage &&
                                                            <span className="ms-2">✓✓</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </Card.Body>
                        <Card.Footer className="bg-white">
                            <Form onSubmit={handleSendMessage}>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                    />
                                    <Button type="submit" variant="primary">
                                        Send
                                    </Button>
                                </div>
                            </Form>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;