import {  createContext, useContext, useState } from "react";
import API from "../api/axios.js";

const AuthContext = createContext();// create a container

export const AuthProvider = ({children})=>{
    const [user, setuser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login =async(email,password)=>{
        const {data} = await API.post('/auth/login',{email,password});
        localStorage.setItem('token',data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        setuser(data.user);
        return data.user;
    };

    const register = async (formdata)=>{
        const {data}= await API.post('/auth/register',formdata);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setuser(data.user);
        return data.user;
    }

    const logout =async ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setuser(null);
    };

    return(
        <AuthContext.Provider value={{user,login,register,logout}}>{children}</AuthContext.Provider>
    )
}

export const useAuth= ()=>useContext(AuthContext);