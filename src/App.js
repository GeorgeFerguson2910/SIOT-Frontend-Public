import { Routes, Route, Navigate } from 'react-router-dom';
import styles from './App.module.css';

import Sidebar from './components/Sidebar';
import PubMed from './Pages/PubMed';
import PMC from './Pages/PMC';
import History from './Pages/History';
import Login from './Pages/Login';

// Simple auth check
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // true if token exists
};

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <div className={styles.appContainer}>

      {/* If NOT logged in → hide sidebar */}
      {isAuthenticated() && <Sidebar />}

      <div className={styles.mainWhiteContainer}>
        <Routes>

          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/PubMed"
            element={
              <ProtectedRoute>
                <PubMed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PMC"
            element={
              <ProtectedRoute>
                <PMC />
              </ProtectedRoute>
            }
          />

          <Route
            path="/History"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/PubMed" />} />

          {/* 404 */}
          <Route path="*" element={<div>Not found</div>} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
