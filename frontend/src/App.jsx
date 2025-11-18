import { Routes, Route } from "react-router-dom";
import UnregisterHome from "./components/UnregisterHome";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientProfile from "./components/PatientProfile";
import PatientHistory from "./components/PatientHistory";
import DoctorProfile from "./components/DoctorProfile";
import DoctorHistory from "./components/DoctorHistory";
import JoinConsultation from "./components/JoinConsultation";
import AdminProfile from "./components/AdminProfile";
import ShowAllDoctors from "./components/ShowAllDoctors";
import ShowAllPatients from "./components/ShowAllPatients";
import ShowAllAdmins from "./components/ShowAllAdmins";
import NotFound from "./components/NotFound";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UnregisterHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/patient_dashboard">
        <Route index element={<PatientProfile />} />
        <Route path="history" element={<PatientHistory />} />
      </Route>
      <Route path="/doctor_dashboard">
        <Route index element={<DoctorProfile />} />
        <Route path="history" element={<DoctorHistory />} />
        <Route path="consultation" element={<JoinConsultation />} />
      </Route>
      <Route path="/admin_dashboard">
        <Route index element={<AdminProfile />} />
        <Route path="show_alldoctors" element={<ShowAllDoctors />} />
        <Route path="show_allpatients" element={<ShowAllPatients />} />
        <Route path="show_alladmins" element={<ShowAllAdmins />} />
      </Route>
      <Route path="/logout" element={<UnregisterHome />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
