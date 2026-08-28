import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Industries } from "./pages/Industries";
import { Locations } from "./pages/Locations";
import { Jobs } from "./pages/Jobs";
import { Employers } from "./pages/Employers";
import { Workers } from "./pages/Workers";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/admin/Login";
import { AdminLayout, AdminDashboard } from "./pages/admin/AdminLayout";
import { AdminWorkers } from "./pages/admin/AdminWorkers";
import { AdminEnquiries } from "./pages/admin/AdminEnquiries";
import { AdminJobs } from "./pages/admin/AdminJobs";

export default function App() {
  return (
    <Routes>
      {/* Public site (with shared header/footer) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="industries" element={<Industries />} />
        <Route path="locations" element={<Locations />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="employers" element={<Employers />} />
        <Route path="workers" element={<Workers />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin (no public header — custom sidebar layout) */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="workers" element={<AdminWorkers />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="jobs" element={<AdminJobs />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
