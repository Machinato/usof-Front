import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../styles/Modals.css";
import { addPostPictures, deletePostPictures, getAllPhotosForPost } from "../../api/postApi";
import ConfirmationModal from "../post/ConfirmationModal.jsx"

const EditModal = ({ isOpen, onClose, onSave, initialData, type }) => {
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [photos, setPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [isConfirmationOpenEdit, setIsConfirmationOpenEdit] = useState(false);
    const [confirmationMessageEdit, setConfirmationMessageEdit] = useState("");
    const [actionToConfirmEdit, setActionToConfirmEdit] = useState(() => null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
        if (type === "post" && initialData?.id) {
            getAllPhotosForPost(initialData.id)
                .then((res) => setPhotos(res.data.data))
                .catch(console.error);
        }
    }, [initialData, type]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNewPhotos = (e) => {
        setNewPhotos([...newPhotos, ...e.target.files]);
    };

    const handleDeletePhoto = (photoPath) => {
        // Формуємо список фото для видалення
        const filesToDelete = [photoPath]; // Якщо є кілька фото для видалення, можна додати їх у цей масив
    
        // Перетворюємо масив файлів у рядок параметрів для query
        const queryParams = new URLSearchParams();
        filesToDelete.forEach((file) => queryParams.append('file', file));
    
        // Використовуємо delete запит з query-параметрами
        deletePostPictures(initialData.id, queryParams.toString())
            .then(() => {
                setPhotos(photos.filter((p) => p.image_path !== photoPath));
            })
            .catch(console.error);
    };
    
    const handleConfirmAction = () => {
        actionToConfirmEdit();
        setIsConfirmationOpenEdit(false);
    };

    const openConfirmation = (action, message) => {
        setActionToConfirmEdit(() => action);
        setConfirmationMessageEdit(message);
        setIsConfirmationOpenEdit(true);
    };

    const handleSubmit = () => {
        if (type === "post" && newPhotos.length > 0) {
            const formDataToSend = new FormData();
            newPhotos.forEach((photo) => {
                formDataToSend.append("images", photo); // Передаємо тільки нові фото
            });

            addPostPictures(initialData.id, formDataToSend)
                .then(() => {
                    getAllPhotosForPost(initialData.id).then((res) =>
                        setPhotos(res.data.data)
                    );
                    setNewPhotos([]);
                })
                .catch(console.error);
        }
        onSave({ ...formData, photos });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                {type === "post" && (
                    <>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Заголовок посту"
                            className="edit-input"
                        />
                        <div className="photo-section">
                            <label>Додати нові фото:</label>
                            <input type="file" className="add-new-photos-input" multiple onChange={handleNewPhotos} />
                            <div className="photo-preview">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="photo-item">
                                        <img
                                            src={`http://localhost:3001${photo.image_path}`}
                                            alt="Post"
                                            className="post-photo"
                                        />
                                        {/* Кнопка видалення */}
                                        <button
                                            className="delete-photo-btn"
                                            onClick={() => openConfirmation(() => handleDeletePhoto(photo.image_path), "Ви впевнені, що хочете видалити це фото?")}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="edit-textarea"
                    placeholder={type === "post" ? "Вміст посту" : "Коментар"}
                />

                <div className="modal-actions">
                    <button onClick={handleSubmit} className="save-btn">
                        Зберегти
                    </button>
                    <button onClick={onClose} className="cancel-btn">
                        Скасувати
                    </button>
                </div>
            </div>

            <ConfirmationModal
                    isOpen={isConfirmationOpenEdit}
                    onClose={() => setIsConfirmationOpenEdit(false)}
                    onConfirm={handleConfirmAction}
                    message={confirmationMessageEdit}
                />
        </Modal>
    );
};

export default EditModal;
