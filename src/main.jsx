import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoutes from './MainRoutes.jsx'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { MyChatProvider, TokenProvider, UserContextProvider } from './context/ChatContext.jsx'
import { MySocketProvider } from "./context/WebSocketContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
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
        theme="colored"
      />
      <TokenProvider>
        <UserContextProvider>
          <MyChatProvider>
            <MySocketProvider>
              <MainRoutes />
            </MySocketProvider>
          </MyChatProvider>
        </UserContextProvider>
      </TokenProvider>
    </ThemeProvider>
  </StrictMode>,
);
