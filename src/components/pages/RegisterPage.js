import React, { useEffect, useState } from 'react';
import { register } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import checkAuth from '../../services/authService';
import { toast } from "react-toastify";
import logoImage from "../../images/IML.png";
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AuthPage.css";

function RegisterPage() {
    const [user, setUser] = useState({ login: '', password: '', email_address: '', confirmPassword: ''});
    const [errors, setErrors] = useState([]);
    // const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const isAuth = useSelector(state => state.auth.isAuth)
    const authStatr = useSelector(state => state.auth)

    const registerUser = async (e) => {
        e.preventDefault();
        setErrors(null)
        await register(user).then(response =>{
            localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
            console.log("response.data.data.user", response.data.data.user)
            dispatch({ type: 'LOG_IN', payload: response.data.data.user });
            toast.success(response.data.message);
            // console.log(response.data);
            // console.log('Register successful:', response.data);
            // console.log(`isAuth after login: ${isAuth}`);
        }).catch(err => {
            // console.error('Login failed:', err.response?.data || err.message);
            if (err.response) {
                setErrors(err.response.data.message || 'Authentication error.');
            } else {
                setErrors('An unexpected error occurred. Please try again.');
            };
            errors.forEach(err => toast.error(err.msg))
        })
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            checkAuth().then(res => {
                if (res) {
                    dispatch({ type: 'LOG_IN', payload: authStatr.user }); // Ініціалізація користувача
                }
            });
        }
    }, [dispatch]);

    useEffect(() => {
        if (authStatr.isAuth) {
            toast.success("User already in account. If you want register new user you should logout before");
            navigate('/');
        }
    }, [authStatr.isAuth, navigate]); // Виправлено

    return (
        <div className='all-Page'>
            <HeaderItem/>
            <img className='AuthLogo' src={logoImage} alt="Logo" />
            <h1>Sign up</h1>
            <form onSubmit={registerUser}>
                {/* {errors && <p style={{ color: 'red' }}>{errors}</p>} */}
                <div>
                    <label>Login:</label>
                    <input
                        type="text"
                        value={user.login}
                        placeholder={'Login'}
                        onChange={(e) => {
                            setUser({ ...user, login: e.target.value })}
                        }
                    />
                </div>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={user.full_name}
                        placeholder={'Full Name'}
                        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={user.password}
                        placeholder='Password'
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </div>
                <div>
                    <label>Confirm password:</label>
                    <input
                        type="password"
                        value={user.confirmPassword}
                        placeholder={'Confirm password'}
                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={user.email_address}
                        placeholder={'Email'}
                        onChange={(e) => setUser({ ...user, email_address: e.target.value })}
                    />
                </div>
                <button className="MyButton" type="submit">Register</button>
                <br/>
                <Link to={'/login'}>Login</Link>
            </form>
        </div>
    );
}

export default RegisterPage;
