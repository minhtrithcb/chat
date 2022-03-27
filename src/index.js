import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import ChatProvider from './context/ChatContext';
import SocketProvider from './context/SocketContext';

ReactDOM.render(
  <AuthProvider>
    <SocketProvider>
    <ChatProvider>
      <ThemeProvider>
        <BrowserRouter>
          <React.StrictMode>
            <ToastContainer 
              pauseOnHover={false} 
              limit={3} 
              pauseOnFocusLoss={false} 
              autoClose={2000} 
            />
            <App />
          </React.StrictMode>
        </BrowserRouter>
      </ThemeProvider>
    </ChatProvider>
  </SocketProvider>
  </AuthProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
