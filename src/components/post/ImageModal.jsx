import React from 'react';
import '../../styles/FullScreenModl.css'; // Стилі модального вікна
import closeImg from "../../images/close.png"

const ImageModal = ({ imageSrc, onClose }) => {
    if (!imageSrc) return null;

    return (
        <div className="image-modal">
            <div className="modal-content">
                <img src={imageSrc} alt="Full Screen" />
            </div>
            <button className="button-close-img" onClick={onClose}>
                <img
                    src={closeImg}
                    alt="close icon"
                    className="close-icon" />
            </button>
        </div>
    );
};

export default ImageModal;
