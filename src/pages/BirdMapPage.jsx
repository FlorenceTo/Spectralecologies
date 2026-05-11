import Header from "../components/Header";
import BirdTracker from "../components/BirdTracker";

export default function BirdMapPage() {
  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: "0.5rem" }}>
        <h2 style={{ borderBottom: "none", marginBottom: "0.25rem", paddingBottom: 0 }}>
          Bird Movement Tracker
        </h2>
        <p style={{ marginTop: 0, marginBottom: "0.5rem" }}>
          Griffon vulture GPS telemetry
        </p>
        <BirdTracker />
      </div>
    </div>
  );
}