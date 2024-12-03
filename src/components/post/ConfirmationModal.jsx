import React, { useState } from "react";
import Modal from "react-modal";
import "../../styles/Modals.css"

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">Підтвердити</button>
                    <button onClick={onClose} className="cancel-btn">Скасувати</button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
