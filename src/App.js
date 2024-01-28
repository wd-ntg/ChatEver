import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import VideoCall from "./pages/VideoCall";
import { SocketContextProvider } from "./context/SocketIOContext";
import { NotifyContext, NotifyContextProvider } from "./context/NotifyContext";
import { ChatContext, ChatContextProvider } from "./context/ChatContext";
import RecevierVideoCall from './pages/ReceiverVideoCall'

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videocall"
          element={
            <SocketContextProvider>
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            </SocketContextProvider>
          }
        />
        <Route
          path="/recevivercall"
          element={
            <SocketContextProvider>
              <ProtectedRoute>
                <RecevierVideoCall />
              </ProtectedRoute>
            </SocketContextProvider>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
