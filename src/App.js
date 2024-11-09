import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./PAGES/home";
import Blog from "./PAGES/Blog";
import Add from "./PAGES/adding";
import Header from "./LAYOUT/header";
import Footer from "./LAYOUT/footer";
import Contact from "./PAGES/contact";
import Update from "./PAGES/update";
import Delete from "./PAGES/delete";
import Login from "./PAGES/login";
import {useEffect} from "react";
import axios from "axios";
import Logout from "./PAGES/logout";
import Register from "./PAGES/Register";
import PrivateRoute from "./PAGES/PrivateRoute";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "./store/direct/AuthSlice";
import About from "./PAGES/about";
import Chat from "./PAGES/Chat";
import Message from "./PAGES/Message";



function App() {
    const token = window.localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const timestamp = 1000 * 60 * 3 - 5;
        let interval = setInterval(() => {
            if (token !== null) {
                updateToken();
            }
        }, timestamp);

        return () => {
            clearInterval(interval);
        };
    }, [token]);

    const updateToken = async ()=> {
        try {
            const apiUrl = 'http://localhost:8061/private/token';
            const response = await axios.get(apiUrl, {
                headers: {
                    "token": window.localStorage.getItem("token")
                }
            });

            if (response.status === 200) {
                const data = await response.data;
                window.localStorage.setItem("token", data.token);
            }

        } catch (error) {
            console.log(error);
            window.localStorage.removeItem("token");
        }

        console.log("Inside update token");
    }

    const handleRegister = async (data) => {
        try {
            const response = await axios.post("/Register", data);
            if (response.status === 200) {
                const userData = response.data;
                localStorage.setItem("token", userData.token);
                dispatch(setUser(userData.user));
                navigate("/adding");
            }
        } catch (error) {
            console.error("Register error:", error);
        }
    };

    return (
        <>
            <div className={"wrapper"}>
                <Header />
                <div className={"content"}>
                    <Routes >
                        <Route path="/" element={<Home />} />
                        <Route path="/Blog" element={<Blog />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/Blog/:id" element={<Blog />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/adding" element={<PrivateRoute><Add /></PrivateRoute>} />
                        <Route path="/Chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                        <Route path="/Message" element={<PrivateRoute><Message /></PrivateRoute>} />
                        <Route path="/update/:id" element={<PrivateRoute><Update /></PrivateRoute>} />
                        <Route path="/delete/:id" element={<PrivateRoute><Delete /></PrivateRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default App;