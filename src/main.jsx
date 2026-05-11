import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import LocationDetailPage from "./pages/LocationDetailPage";
import TimelinePage from "./pages/TimelinePage";
import BirdMapPage from "./pages/BirdMapPage";     // <-- import

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/archive", element: <ArchivePage /> },
  { path: "/location/:id", element: <LocationDetailPage /> },
  { path: "/timeline", element: <TimelinePage /> },
  { path: "/birdmap", element: <BirdMapPage /> }, // <-- new route
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);