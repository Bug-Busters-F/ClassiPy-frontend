import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import NotFound from "../pages/NotFound";
import Process from "../pages/Process";
import CenteredLayout from "../components/CenteredLayout"; 
import ValidatePartNumber from "../pages/ValidatePartNumber";

const AppRoutes = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/validate-partnumber" element={<ValidatePartNumber />} />
            <Route element={<CenteredLayout />}>
              <Route path="/process" element={<Process />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRoutes;