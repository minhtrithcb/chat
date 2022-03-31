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
import PrevPrivateRoute from "./components/PrevPrivateRoute";
import Contact from "./pages/Contact/Contact";

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
            </Route>
          </Route>
          {/* Visible Route when they not login*/}
          <Route element={<PrevPrivateRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
          {/* Catch Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
