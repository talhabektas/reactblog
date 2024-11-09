import React, { useEffect, useState } from 'react';
import axios from 'axios';

const About = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook'u ile veri yükleme
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000');

                if (response.data) {
                    setLoading(false);
                }
            } catch (err) {
                setError('Veri yüklenirken bir hata oluştu.');
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Boş bağımlılık dizisi, sadece bileşen ilk yüklendiğinde çalışır

    // Yükleme ve hata durumları için kontrol
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <h1>Hakkımızda</h1>
            <p style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                Sıkı bir futbol ve rap dinleyicisi olarak, benim gibi düşünen ve sadece bu konular hakkında konuşmak isteyen
                insanlarla buluşmak amacıyla bu siteyi oluşturduk. Amacımız, kimsenin baskısı altında kalmadan ve
                fikirlerinin yargılanmasından korkmadan özgürce paylaşım yapabileceği bir ortam sunmak. Her yaştan insanın
                rahatça girebileceği, futbol ve müzik üzerine keyifle sohbet edebileceği bir platform oluşturmak istiyoruz.
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Futbol ve müzikle kalın!</p>
        </div>
    );
};

export default About;
