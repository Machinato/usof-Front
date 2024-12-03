import React, { useState } from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import MainPage from "./components/pages/MainPage";
import ReminderPage from "./components/pages/ReminderPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import ActivateAccountPage from "./components/pages/ActivateAccountPage";
import LogoutPage from "./components/pages/LogoutPage";
import CategoryPage from "./components/pages/CategoryPage";
import { ToastContainer } from "react-toastify";
import logoImage from "./images/IML.png";
import PostPage from "./components/pages/PostPage.js";
import ProfilePage from "./components/pages/MyProfilePage.js";
import NewPostPage from "./components/post/NewPostComponent.jsx";
import ProfileSettings from "./components/pages/ProfileSettings.js";
import AdminPanel from "./components/AdminPanel/AdminPanel.jsx"

// const Logo = () => (
//   <motion.div
//     className="logo"
//     initial={{ opacity: 1 }}
//     animate={{ opacity: 0 }}
//     exit={{ opacity: 0 }}
//     transition={{ duration: 1 }}
//   >
//     <img src={logoImage} alt="Logo" />
//   </motion.div>
// );

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer />
      {/* <AnimatePresence mode="wait"> */}
        {/* Логотип відображається при кожному переході
        <Logo key="logo" /> */}
        <Routes location={location} key={location.pathname}>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/Reminder" element={<ReminderPage />} />
          <Route path="/ResetPassword" element={<ResetPasswordPage />} />
          <Route path="/ActivateAccount" element={<ActivateAccountPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/newPost" element={<NewPostPage />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path="/admin" element={<AdminPanel/>} />
        </Routes>
      {/* </AnimatePresence> */}
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
