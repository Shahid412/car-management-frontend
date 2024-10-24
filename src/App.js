// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import AppNavbar from './components/Layout/Navbar';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import Dashboard from './components/Dashboard/Dashboard';
import CategoriesList from './components/Categories/CategoriesList';
import CarsList from './components/Cars/CarsList';
import PrivateRoute from './components/Layout/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/categories'
            element={
              <PrivateRoute>
                <CategoriesList />
              </PrivateRoute>
            }
          />
          <Route
            path='/cars'
            element={
              <PrivateRoute>
                <CarsList />
              </PrivateRoute>
            }
          />
          <Route
            path='/'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
