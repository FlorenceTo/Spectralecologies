import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import RadarMap from "../components/RadarMap";
import locations from "../data/locations";

export default function LocationDetailPage() {
  const { id } = useParams();
  const location = locations.find((loc) => loc.id === parseInt(id));

  if (!location) {
    return (
      <div>
        <Header />
        <div className="container">
          <p>Location not found.</p>
          <Link to="/archive" className="back-link">← Back to archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Link to="/archive" className="back-link">← Back to archive</Link>
        <h1>{location.name}</h1>
        <p>{location.description}</p>
        <p><strong>Date:</strong> {location.date}</p>
        <div className="map-wrapper">
          <RadarMap center={[location.lat, location.lng]} zoom={12} />
        </div>
      </div>
    </div>
  );
}