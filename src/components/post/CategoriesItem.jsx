import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CategoryItem.css';

const CategoryItem = ({ category }) => {
    const navigate = useNavigate()

    // Функція для переходу на сторінку категорії
    const handleCategoryClick = () => {
        navigate(`/category/${category.id}`);
    };

    return (
        <div className="category-item" onClick={handleCategoryClick}>
            <div className="category-name">{category.name}</div>
        </div>
    );
};

export default CategoryItem;
