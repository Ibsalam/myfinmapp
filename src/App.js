import './App.css';
import Header from './components/Header'; // Make sure header component uses correct casing too
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup"; // Updated import with capital "S"
import Dashboard from "./pages/Dashboard"; // Updated import with capital "D"
import SignupSigninComponent from './components/SignupSignin';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
