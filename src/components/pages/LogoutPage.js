import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../api/auth';
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AuthPage.css";
// import { authReducer } from '../../redusers/authReduser'; // Залежить від вашої структури redux

const LogoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await logout();
                console.log("logout response", response);

                if (response.data.success) {
                    dispatch({ type: 'LOG_OUT' });
                    toast.success('Ви успішно вийшли з системи.');
                    navigate('/');
                } else {
                    throw new Error('Не вдалося вийти.');
                }
            } catch (err) {
                console.error(err);
                toast.error('Сталася помилка при виході.');
            }
        };

        handleLogout(); // Викликаємо асинхронну функцію
    }, [navigate, dispatch]);

    return (
        <div className='all-Page'>
            <div className="logout-page">
                <HeaderItem />
                <h2>Вихід...</h2>
                <p>Зачекайте, будь ласка. Ви виходите з облікового запису.</p>
            </div>
        </div>
    );
};

export default LogoutPage;
