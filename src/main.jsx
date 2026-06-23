import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainRoutes from './MainRoutes.jsx'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { MyChatProvider } from './context/ChatContext.jsx'
import { MySocketProvider } from "./context/WebSocketContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <MyChatProvider>
      <MySocketProvider>
        <MainRoutes />
      </MySocketProvider>  
    </MyChatProvider>
  </StrictMode>,
);
