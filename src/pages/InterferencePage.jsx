import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function InterferencePage() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglSupported(false);
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0.5rem" }}>
        <div className="interference-layout" style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {/* Left column: 3D terrain */}
          <div className="terrain-col" style={{ flex: "2", minWidth: "250px" }}>
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 80px)",
                border: "1px solid #9afc97",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#111",
              }}
            >
              {!webglSupported ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    padding: "2rem",
                    color: "#ff0000",
                    fontFamily: "monospace",
                    fontSize: "1rem",
                  }}
                >
                  <div>
                    <strong>WebGL not supported</strong>
                    <br />
                    Your browser or device does not support WebGL, which is required for the 3D terrain view. Please try using a browser on a desktop.
                  </div>
                </div>
              ) : (
                <iframe
                  src="./terrain/gps_axes_km_labels.html"
                  title="3D Terrain Map"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="fullscreen"
                />
              )}
            </div>
          </div>

          {/* Right column: description text */}
          <div className="description-col" style={{ flex: "1", minWidth: "200px" }}>
            <div
              style={{
                border: "1px solid #9afc97",
                padding: "1rem",
                height: "calc(100vh - 80px)",
                overflowY: "auto",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "0.8rem" }}>Interference as an investigative condition</h3>
              <p>
                This terrain is built from raw GPS tracking data recorded from a single Griffon Vulture moving across the Negev Desert near the Dead Sea. The dataset remains unfiltered, preserving moments where the positional signal collapses or disappears.
              </p>
              <p>
                Rather than treating these disruptions as technical errors, the project reads them as traces of the surrounding electromagnetic environment. The signal losses repeatedly cluster in specific geographic locations associated with military radar infrastructures operating within the region.
              </p>
              <p>
                The terrain visualises these interference events spatially. Elevation represents the density of signal disruption, while colour fields indicate surrounding radar frequency bands, including UHF and X-band transmissions.
              </p>
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                Interaction: drag to rotate, scroll to zoom, right‑click to pan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}