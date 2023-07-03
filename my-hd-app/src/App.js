import logo from "./asset/logo.png";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./page/Home";
import Register from "./page/Register";
import Login from "./page/Login";
import Profile from "./page/Profile";
import Consultations from "./page/Consultations";
import Consultation from "./page/Consultation";
import BookConsultation from "./page/BookConsultation";

// staff related page
import StaffLogin from "./page/Staff/Login";
import StaffDashboard from "./page/Staff/Dashboard";
import StaffAppointments from "./page/Staff/Appointments";
import StaffAppointment from "./page/Staff/Appointment";
import StaffProfile from "./page/Staff/Profile";

// admin related page
import AdminLogin from "./page/Admin/Login";
import Students from "./page/Admin/Students";
import Staffs from "./page/Admin/Staffs";
import Staff from "./page/Admin/Staff";
import Student from "./page/Admin/Student";

import NavBar from "./component/NavBar";

import AuthProvider from "./context/auth";
import PrivateRoute from "./component/PrivateRoute";
import PrivateStaffRoute from "./component/PrivateStaffRoute";
import PrivateAdminRoute from "./component/PrivateAdminRoute";



function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>

            {/* student related route */}
            <Route path="/" index element={<PrivateRoute Component={Home} />} />
            <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
            <Route path="/consultations" element={<PrivateRoute Component={Consultations} />} />
            <Route path="/consultation/:id" element={<PrivateRoute Component={Consultation} />} />
            <Route path="/consultation/book" element={<PrivateRoute Component={BookConsultation} />} />

            {/* staff related route */}
            <Route path="/staff/profile" element={<PrivateStaffRoute Component={StaffProfile} />} />
            <Route path="/staff/appointments" element={<PrivateStaffRoute Component={StaffAppointments} />} />
            <Route path="/staff/appointment/:id" element={<PrivateStaffRoute Component={StaffAppointment} />} />
            <Route path="/staff/dashboard" element={<PrivateStaffRoute Component={StaffDashboard} />} />

            {/* admin related route */}
            <Route path="/admin/staffs" element={<PrivateAdminRoute Component={Staffs} />} />
            <Route path="/admin/staff/:id" element={<PrivateAdminRoute Component={Staff} />} />
            <Route path="/admin/students" element={<PrivateAdminRoute Component={Students} />} />
            <Route path="/admin/student/:id" element={<PrivateAdminRoute Component={Student} />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
      
    </div>
  );
}

export default App;
