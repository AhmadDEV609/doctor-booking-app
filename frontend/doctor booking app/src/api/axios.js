import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
    withCredentials: true,
});

const refreshApi = axios.create({
    baseURL,
    withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }


        if (originalRequest.url?.includes("/users/refreshToken")) {
            return Promise.reject(error);
        }


        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshApi
                    .post("/users/refreshToken")
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;


            return api(originalRequest);
        } catch (refreshError) {
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;
