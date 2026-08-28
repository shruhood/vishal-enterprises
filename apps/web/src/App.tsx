import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Placeholder } from "./pages/Placeholder";

const placeholders: { path: string; title: string; description: string }[] = [
  { path: "/about", title: "About", description: "About Vishal Enterprises." },
  { path: "/services", title: "Services", description: "Skilled, semi-skilled and unskilled manpower services." },
  { path: "/industries", title: "Industries", description: "Industries we provide workforce solutions for." },
  { path: "/locations", title: "Locations", description: "Service areas including Daman, Vapi, Bhilad and Silvassa." },
  { path: "/jobs", title: "Jobs", description: "Current job opportunities." },
  { path: "/employers", title: "For Employers", description: "Request manpower for your industry." },
  { path: "/workers", title: "For Workers", description: "Register as a worker." },
  { path: "/contact", title: "Contact", description: "Get in touch with Vishal Enterprises." },
];

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {placeholders.map((p) => (
          <Route
            key={p.path}
            path={p.path}
            element={<Placeholder title={p.title} description={p.description} />}
          />
        ))}
        <Route
          path="*"
          element={<Placeholder title="Page Not Found" description="The page you're looking for doesn't exist." />}
        />
      </Routes>
    </Layout>
  );
}
