import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import Admin from "./pages/Admin";
import PatientProtected from "./pages/PatientProtected";
import DoctorProtected from "./pages/DoctorProtected";
import AdminProtected from "./pages/AdminProtected";
import Alldoctors from "./pages/Alldoctors";
import Appointments from "./pages/Appointments";
import CompleteProfile from "./Doctor/CompleteProfile.jsx";
import AdminDoctors from "./Admin/AdminDoctors.jsx";
import DoctorDetail from "./pages/DoctorDetail.jsx";
import AdminAppointments from "./Admin/AdminAppointments.jsx";
import Chatbot from "./pages/Chatbot.jsx";
const App = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1">

        <Routes>

          {/* Public Routes */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          {/* Patient */}

          <Route element={<PatientProtected />}>
            <Route
              path="/patient"
              element={<Patient />}
            />
            <Route
              path="/doctors"
              element={<Alldoctors />}
            />
            <Route
              path="/appointments"
              element={<Appointments />}
            />

            <Route
              path="/doctor/detail/:doctorId"
              element={<DoctorDetail />}
            />

          </Route>

          {/* Doctor */}

          <Route element={<DoctorProtected />}>
            <Route
              path="/doctor"
              element={<Doctor />}
            />
            <Route
              path="/doctor/profile"
              element={<CompleteProfile />}
            />


          </Route>

          {/* Admin */}

          <Route element={<AdminProtected />}>
            <Route
              path="/admin"
              element={<Admin />}
            />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path='/admin/appointments' element={<AdminAppointments />} />
          </Route>

        </Routes>

      </main>
      <Chatbot />
      <Footer />

    </div>
  );
};

export default App;