import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
});

api.interceptors.response.use(res => res, async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

        originalRequest._retry = true;

        await api.post("/users/refresh");

        return api(originalRequest);
    }

    return Promise.reject(error);
}
);


export default api;