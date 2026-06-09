import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import TimelinePage from "./pages/TimelinePage";
import BirdMapPage from "./pages/BirdMapPage";
import InterferencePage from "./pages/InterferencePage";
import ConditionsPage from "./pages/Conditions";
import ArchiveMapPage from "./pages/ArchiveMapPage";
import InterviewPage from "./pages/InterviewPage";
import AboutPage from "./pages/AboutPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/birdmap" element={<BirdMapPage />} />
        <Route path="/interference" element={<InterferencePage />} />
        <Route path="/ecosemiotics" element={<ConditionsPage />} />
        <Route path="/archive-map" element={<ArchiveMapPage />} />
        <Route path="/interviews" element={<InterviewPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);