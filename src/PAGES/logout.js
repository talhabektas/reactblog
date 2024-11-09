import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {logoutUser} from "../store/direct/AuthSlice";
import {useNavigate} from "react-router-dom";

const LogOut = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();
    useEffect(()=>{

        window.localStorage.removeItem("token");

        dispatch(logoutUser());
        navigate("/",{
            state:"başarıyla uygulamadan çıkış yapılmıştır.",
        })

    },[])

    return (
        <div>
            LOGOUT
        </div>
    );
};

export default LogOut;