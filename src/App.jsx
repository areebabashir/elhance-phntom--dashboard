import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Messages from "./pages/Messages";
import AllEvents from "./pages/allEvents";
import Dashboard from "./pages/Dashboard";
import JoiningResponse from "./pages/JoiningResponse";
import Sidebar from "./components/layout/Sidebar";
import LoginPage from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import MessageDetail from './pages/MessageDetail';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { token } = React.useContext(AuthContext);
  const isAuthenticated = !!token; // Check if token exists
console.log(token);
console.log(isAuthenticated);


  return (
    <div style={{ display: 'flex' }}>
      {isAuthenticated && <Sidebar />}
      <div style={{ marginLeft: isAuthenticated ? '50px' : '0', width: '100%' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/all-events" element={isAuthenticated ?<AllEvents />: <Navigate to="/login" />} />
            <Route path="/messages" element={isAuthenticated ?<Messages />: <Navigate to="/login" />} />
            <Route path="/messages/:id" element= {isAuthenticated ?<MessageDetail />: <Navigate to="/login" />} />

            <Route path="/joining-response" element={isAuthenticated ?<JoiningResponse />: <Navigate to="/login" />} />
          
        </Routes>
      </div>
    </div>
  );
};

export default App;
