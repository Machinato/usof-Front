import api from "./index"

export const login = (user) => {
    console.log(user);

    return api.post('/auth/login', user);
}

export const register = (user) => {
    return api.post('/auth/register', user);
}

export const logout = () => {
    return api.post('/auth/logout');
}

export const resetPassToEmail = (email_address) => {
    return api.post('/auth/password-reset', { email_address });
}

export const resetPass = (token, new_password) => {
    return api.post(`/auth/password-reset/${token}`, { new_password });
}

export const refreshToken = () => {
    return api.post('/auth/refresh');
}

export const activationAccount = (confirm_token) => {
    return api.post(`/auth/account-activation/${confirm_token}`);
}
