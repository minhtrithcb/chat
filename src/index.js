import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <React.StrictMode>
          <ToastContainer pauseOnHover={false} limit={3} />
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
