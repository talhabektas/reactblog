import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MessageComponent = () => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const { user } = useSelector((state) => state.auth);

    const openMessageForm = (email) => {
        setSelectedEmail(email);
        setIsMessageModalOpen(true);
    };

    const closeMessageForm = () => {
        setIsMessageModalOpen(false);
        setMessageContent("");
    };

    const handleMessageSend = async () => {
        try {
            // Request yapısını kontrol etmek için console.log ekleyelim
            const messageData = {
                from_email: user.email,
                to_email: selectedEmail,
                content: messageContent,
            };
            console.log("Sending message data:", messageData);

            const response = await axios.post("http://localhost:8000/api/messages/send", messageData);

            if (response.status === 201) {
                console.log("Message sent successfully:", response.data);
                closeMessageForm();
            }
        } catch (error) {
            console.error("Error sending message:", error);
            console.error("Error details:", error.response?.data); // Detaylı hata mesajını görelim
        }
    };

    return (
        <div>
            <Button onClick={() => openMessageForm("user@example.com")}>
                Send Message
            </Button>
            <Modal show={isMessageModalOpen} onHide={closeMessageForm} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Send Message to {selectedEmail}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Type your message here..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeMessageForm}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleMessageSend}>
                        Send Message
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MessageComponent;