import React from "react";
import {Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/AuthPage/Login";
import "./assets/css/main.scss"
import MainLayout from "./pages/MainLayout";
import NotFound from "./pages/NotFound/NotFound";
import SignUp from "./pages/AuthPage/SignUp";

function App() {
  return (
    <div className="app">
        <Routes>
          <Route path="/" element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
