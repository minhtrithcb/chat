import React from "react";
import {Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/AuthPage/Login";
import "./assets/css/main.scss"
import MainLayout from "./pages/MainLayout";
import NotFound from "./pages/NotFound/NotFound";
import SignUp from "./pages/AuthPage/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import 'react-toastify/dist/ReactToastify.css';
import 'emoji-mart/css/emoji-mart.css'
import PrevPrivateRoute from "./components/PrevPrivateRoute";
import Contact from "./pages/Contact/Contact";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin";
import ForgotPass from "./pages/AuthPage/ForgotPass";
import VerifyEmail from "./pages/AuthPage/VerifyEmail";
import ChangePass from "./pages/AuthPage/ChangePass";

function App() {
  return (
    <div className="app">
        <Routes>
          {/* Private Route */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />} >
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Route>
          {/* Visible Route when they not login*/}
          <Route element={<PrevPrivateRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/change-password/:token" element={<ChangePass />} />
          </Route>
          {/* Catch Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
