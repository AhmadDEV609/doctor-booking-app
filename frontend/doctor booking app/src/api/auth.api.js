import axios from "axios";
import api from "./axios";


export const login = async (form) => {
    const { data } = await api.post(
        "/users/login",
        form
    )
    return data
}

export const signup = async (form) => {
    const { data } = await api.post(
        "/users/signup",
        form
    )
    return data
}

export const logout = async () => {
    const { data } = await api.post("/users/logout");
    return data;
};

export const getUser = async () => {
    const { data } = await api.get("/users/getUser")
    return data
}


