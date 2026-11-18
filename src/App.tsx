import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "@/team/nivethith/pages/Home";
import { Auth } from "@/team/saeyon/pages/Auth";
import { Dashboard } from "@/team/gobiraam/pages/Dashboard";
import { NotFound } from "@/team/sarukan/pages/NotFound";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/panel" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
