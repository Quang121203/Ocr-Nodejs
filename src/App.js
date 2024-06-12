import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Ocr from './pages/ocr/ocr';
import Login from './pages/login/login';
import Home from './pages/home/home';
import Toast from './components/toast/toast';
import PrivateRoute from './components/PrivateRoute/privateRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<PrivateRoute><Ocr /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>

      <Toast />
    </>
  );
}

export default App;
