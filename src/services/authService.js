import { refreshToken } from "../api/auth";
import { toast } from "react-toastify";

export default async function checkAuth() {
    try {
        // const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        //     const [key, value] = cookie.split('=');
        //     acc[key] = value;
        //     return acc;
        // }, {});

        // if (!cookies.refreshToken) {
        //     localStorage.setItem('accessToken', response.data.data.tokens.accessToken)
        //     toast.error("You are not logged in, please log in for full site functionality ");
        //     return true;
        // }

        const response = await refreshToken({ _isRetry: true });
        console.log(response);
        if(response.data.success !== true){
            throw new Error("User not avtorized");
        }
        console.log(response.data.success)
        console.log(response.data.data.tokens.accessToken);
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken)
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}