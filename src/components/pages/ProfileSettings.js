import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/ProfileSettings.css";
import { updateAvatar, updateUser } from "../../api/userApi";
import HeaderItem from "../../components/Header/headerItem";
import { toast } from "react-toastify";

const ProfileSettings = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    // Початкові дані
    const [formData, setFormData] = useState({
        login: user.login,
        full_name: user.full_name,
        email_address: user.email_address,
    });

    const [newPhoto, setNewPhoto] = useState(null); // Нове фото

    // Обробка зміни текстових полів
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Обробка завантаження фото
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPhoto(file); // Збереження файлу
        }
    };

    // Відправка даних на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (newPhoto) {
                const avatarData = new FormData();
                avatarData.append("avatar", newPhoto);
                avatarData.append("user_id", null);
                updateAvatar(avatarData).then(response => {
                    if (!response.data.success) {
                        throw new Error(response.data.message);
                    }
                    dispatch({ type: "UPDATE_PROFILE_PICTURE", payload: response.data.data.profile_picture });
                }).catch(err => {

                })
                // const avatarResponse = await updateAvatar(avatarData);
            }

            // Оновлення інших даних
            const updateResponse = await updateUser(null, formData);

            if (!updateResponse.data.success) {
                throw new Error(updateResponse.data.message);
            }

            dispatch({ type: "UPDATE_USER", payload: { ...formData } });
            toast.success("Profile settings have been successfully updated!");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <div className="profile-settings-container">
            <HeaderItem />
            <div className="all-setings">
                <h1 className="profile-settings-title">Profile settings</h1>
                <form className="profile-settings-form" onSubmit={handleSubmit}>
                    <label>
                        User login:
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Enter your username"
                        />
                    </label>
                    <label>
                        Full user name:
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email_address"
                            value={formData.email_address}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </label>
                    <label>
                        Profile photo:
                        <div className="profile-photo-section">
                            <img
                                src={newPhoto ? URL.createObjectURL(newPhoto) : user.profile_picture}
                                alt="Current photo"
                                className="profile-photo-preview"
                            />
                            <input type="file" accept="image/*" onChange={handlePhotoChange} />
                        </div>
                    </label>
                    <button type="submit" className="profile-settings-save-btn">
                        Save changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
