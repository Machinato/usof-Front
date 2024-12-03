import React from 'react';
import '../../styles/DropdownMenu.css';

const DropdownMenu = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <nav className="dropdown-menu" onMouseLeave={onClose}>
            <ul>
                <li><a href="/profile">My profile</a></li>
                <li><a href="/logout">Log out</a></li>
            </ul>
        </nav>
    );
};

export default DropdownMenu;
