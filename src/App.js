import './App.css';
import { Routes, Route } from 'react-router-dom';
import Ocr from './pages/ocr/ocr';
import Login from './pages/login/login';
import Home from './pages/home/home';
import Toast from './components/Toast/toast';
import PrivateRoute from './components/PrivateRoute/privateRoute';
import AdminRoute from './components/AdminRoute/adminRoute';
import AuthRoute from './components/AuthRoute/authRoute';
import Register from './pages/register/register';
import Navbars from './components/Navbars/navbars';
import User from './pages/user/user';
import PDF from './pages/pdf/pdf';
import { useEffect } from 'react';

import axios from './config/axios';
import { useDispatch } from 'react-redux';
import { login } from './redux/userSlice';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    getInformations();
  }, []);

  const getInformations = async () => {
    const response = await axios.get('info');
    if (response && +response.EC === 0) {
      dispatch(login({ username: response.DT.username, isAdmin: response.DT.isAdmin }));
    }
  }

  return (
    <>
      <Navbars />

      <Routes>
        <Route path="/user" element={<PrivateRoute> <AdminRoute><User /></AdminRoute></PrivateRoute>} />
        <Route path="/pdf" element={<PrivateRoute> <AdminRoute><PDF /></AdminRoute></PrivateRoute>} />
        <Route path="/ocr" element={<PrivateRoute> <AdminRoute><Ocr /></AdminRoute></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />

        <Route path="/register" element={<Register />} />
      </Routes>

      <Toast />
    </>
  );
}

export default App;
