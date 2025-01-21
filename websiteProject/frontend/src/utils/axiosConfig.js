// Plik do konfiguracji axiosa

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Dodanie interceptorów do obsługi odświeżania tokenu
axiosInstance.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // Wysłanie zapytania o refresh token
                const response = await axiosInstance.post('/api/auth/refreshToken', {
                    refreshToken
                });

                // Otrzymanie go i zapisanie jako token dostępu
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers['x-auth-token'] = accessToken;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error(err);
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;