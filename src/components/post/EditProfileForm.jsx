// EditProfileForm.jsx
import React, { useState } from "react";

const EditProfileForm = ({ initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: initialData.full_name || "",
        email: initialData.email_address || "",
        // додайте інші поля, які потрібно редагувати
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);  // викликаємо функцію з батьківського компонента для збереження
    };

    return (
        <div className="edit-profile-form">
            <h3>Редагувати профіль</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Повне ім'я:
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Електронна пошта:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </label>
                {/* Додайте інші поля за необхідністю */}
                <button type="submit">Зберегти</button>
                <button type="button" onClick={onClose}>Закрити</button>
            </form>
        </div>
    );
};

export default EditProfileForm;
