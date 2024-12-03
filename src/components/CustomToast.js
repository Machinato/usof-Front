import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToast = ({ type, message }) => {
    const toastOptions = {
        position: toast.POSITION.TOP_RIGHT, // Позиція повідомлення
        autoClose: 5000, // Час автоматичного закриття повідомлення
        hideProgressBar: true, // Сховати прогрес-бар
        closeOnClick: true, // Закрити на клік
        pauseOnHover: true, // Призупинити при наведенні
        draggable: true, // Дозволити перетягувати
        theme: "colored" // Теми можуть бути "light", "dark", "colored"
    };

    // Викликаємо сповіщення в залежності від типу
    if (type === "success") {
        toast.success(message, toastOptions);
    } else if (type === "error") {
        toast.error(message, toastOptions);
    }

    return null; // Компонент не рендерить нічого в DOM, оскільки Toastify обробляє сповіщення
};

export default CustomToast;
