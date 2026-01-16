import { instance } from '../utils/instance';

export const getPrincipal = async () => {
    instance.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem('AccessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });
    try {
        const response = await instance.get('/user/account/principal');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const signupRequest = async (data) => {
    try {
        const response = await instance.post('/user/auth/signup', data);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const signinRequest = async (data) => {
    try {
        const response = await instance.post('/user/auth/signin', data);
        return response;
    } catch (error) {
        return error.response;
    }
};
