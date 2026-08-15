import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/landingPage.jsx";
import Login from "../pages/login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* FIRST PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;