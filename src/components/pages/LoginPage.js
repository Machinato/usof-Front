import React, { useEffect, useState } from 'react';
import { login } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import checkAuth from '../../services/authService';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomToast from "../CustomToast";
import logoImage from "../../images/IML.png";
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AuthPage.css";

function LoginPage() {
    const [user, setUser] = useState({ login: '', password: '', email_address: '' });
    // const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authStatr = useSelector(state => state.auth)
    // console.log(`isAuth: ${isAuth}`);

    const liginUser = async (e) => {
        e.preventDefault();
        // setErrors(null)

        await login(user).then(response => {
            localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
            console.log("response.data.data.user", response.data.data.user)
            dispatch({ type: 'LOG_IN', payload: response.data.data.user });
            toast.success(response.data.message);
            // <CustomToast type="success" message={response.data.message} />;

            // console.log('Login successful:', response.data);
            // console.log(response);
            // console.log(`isAuth after login: ${isAuth}`);
        }).catch(err => {
            console.error('Login failed:', err.response);

            // err.response.data.errors ?
            //     setErrors(err.response.data.errors || 'Authentication error.') :
            //     setErrors('An unexpected error occurred. Please try again.');
            const newErrors = err.response.data.errors || 'Authentication error.';

            console.log(user);
            // console.log(errors);

            if (Array.isArray(newErrors)) {
                newErrors.forEach(err => toast.error(err.msg))
            }
            else {
                toast.error(newErrors);
            }
        })
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            checkAuth().then(res => {
                if (res) {
                    console.log("useEffect Login userData: ", res)
                    console.log("authStatr:", authStatr.user)
                    dispatch({ type: 'LOG_IN', payload: authStatr.user }); // Ініціалізація користувача
                }
            });
        }
    }, [dispatch]);

    useEffect(() => {
        console.log("authStatr.isAuth", authStatr.isAuth)
        if (authStatr.isAuth) {
            toast.success("User in account");
            navigate('/')
            // setTimeout(() => navigate('/'), 3000);
        }
    }, [authStatr.isAuth, navigate]); // Виправлено

    return (
        <div className='all-Page'>
            <HeaderItem/>
            <img className='AuthLogo' src={logoImage} alt="Logo" />
            <h1>Login Page</h1>
            <form onSubmit={liginUser}>
                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                <div>
                    <label>Login:</label>
                    <input
                        className='login-input'
                        type="text"
                        value={user.login}
                        onChange={(e) => {
                            setUser({ ...user, login: e.target.value })
                        }
                        }
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        className='login-input'
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        className='login-input'
                        type="email"
                        value={user.email_address}
                        onChange={(e) => setUser({ ...user, email_address: e.target.value })}
                    />
                </div>
                <button className="MyButton" type="submit">Log In</button>
                <Link to={'/Reminder'}>Remind password</Link>
                <Link to={'/Register'}>Sign up</Link>
            </form>
        </div>
    );
}

export default LoginPage;
