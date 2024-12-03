import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../styles/Header.css';
import logo from "../../images/IML.png";
import DropdownMenu from './DropdownMenu';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const isAuth = useSelector(state => state.auth.isAuth);

    // Функція для перемикання меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const DropdownMenuOpen = () => {
        setIsDropdownMenuOpen(!isDropdownMenuOpen);
    };

    // Закрити меню
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Перехід на головну сторінку
    const toMainPage = () => {
        navigate("/");
    };

    return (
        <header className="header">
            {/* Кнопка меню (лівий блок) */}
            <button className="menu-btn-header" onClick={toggleMenu}>☰ Меню</button>

            {/* Логотип */}
            <div className="logo-home" onClick={toMainPage}>
                <img src={logo} alt="Logo" className="logo-header" />
            </div>



            {/* Бокове меню */}
            <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="menu-close-btn" onClick={closeMenu}>✖</button>
                <ul>
                    <br />
                    <br />
                    {/* Пошукова панель (при потребі) */}
                    <div className="search-bar">
                        <input type="text" placeholder="Пошук" />
                    </div>
                    <li onClick={() => navigate('/')}>Main</li>

                    {isAuth && (
                        <li onClick={() => navigate('/newPost')}>New post</li>
                    )}

                    {!isAuth && (
                        <>
                            <li onClick={() => navigate('/login')}>Login</li>
                            <li onClick={() => navigate('/register')}>Registration</li>
                        </>
                    )}
                    {isAuth && user.role === 'admin' && (
                        <li onClick={() => navigate('/admin')}>Admin</li>
                    )}
                    {/* <li onClick={() => navigate('/about')}>About us</li> */}
                </ul>
            </div>

            {/* Інші елементи (наприклад, аватар користувача) */}
            <div className="user-info">
                <span>{user.login}</span>
                <div className="avatar-container-header">
                    <img
                        src={user.profile_picture}
                        alt="Avatar"
                        className="avatar"
                        onClick={DropdownMenuOpen}
                    />
                    <DropdownMenu isOpen={isDropdownMenuOpen} onClose={closeMenu} />
                </div>
            </div>
        </header>
    );
};

export default Header;