import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Fixed colour palette for birds
const BIRD_PALETTE = [
  "#e6194b", // red
  "#3cb44b", // green
  "#4363d8", // blue
  "#f032e6", // magenta
  "#46f0f0", // cyan
  "#f58231", // orange
  "#911eb4", // purple
  "#ffe119", // yellow
];

function getBirdColor(index) {
  return BIRD_PALETTE[index % BIRD_PALETTE.length];
}

// Auto-pan component (only used in single bird mode)
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function BirdTracker() {
  // Bird data state
  const [allPointsByBird, setAllPointsByBird] = useState({});
  const [birdList, setBirdList] = useState([]);
  const [selectedBirdId, setSelectedBirdId] = useState(null);
  const [points, setPoints] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedFactor, setSpeedFactor] = useState(30);
  const [mapCenter, setMapCenter] = useState([30.8569, 34.8036]);
  const [mapZoom, setMapZoom] = useState(12);
  const intervalRef = useRef(null);

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [visibleBirds, setVisibleBirds] = useState(new Set());

  // Radar overlay state
  const [radarPoints, setRadarPoints] = useState([]);
  const [radarEnabled, setRadarEnabled] = useState(false);
  const [radarYear, setRadarYear] = useState(2025);
  const [minRadarYear, setMinRadarYear] = useState(1998);
  const [maxRadarYear, setMaxRadarYear] = useState(2025);

  // Label overlay – ref to avoid re-rendering
  const labelLayerRef = useRef(null);
  const labelOpacityRef = useRef(0.0);

  // Load bird data
  useEffect(() => {
    fetch("/data/bird_data.csv")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, dynamicTyping: true });
        const rows = parsed.data.filter(
          (row) => row["location-long"] && row["location-lat"] && row["tag-local-identifier"]
        );

        const groups = {};
        rows.forEach((row) => {
          const tag = row["tag-local-identifier"];
          if (!groups[tag]) groups[tag] = [];
          groups[tag].push({
            lat: row["location-lat"],
            lng: row["location-long"],
            timestamp: new Date(row.timestamp),
            speed: row["ground-speed"] * 3.6,
            heading: row.heading,
            species: row["individual-taxon-canonical-name"],
            tag: tag,
          });
        });

        const sortedGroups = {};
        const birdInfo = [];
        for (const tag in groups) {
          const sorted = groups[tag].sort((a, b) => a.timestamp - b.timestamp);
          sortedGroups[tag] = sorted;
          birdInfo.push({
            id: tag,
            species: sorted[0]?.species || "Unknown",
            pointCount: sorted.length,
          });
        }
        birdInfo.sort((a, b) => a.id - b.id);
        setBirdList(birdInfo);
        setAllPointsByBird(sortedGroups);

        if (birdInfo.length > 0) {
          setSelectedBirdId(birdInfo[0].id);
          setPoints(sortedGroups[birdInfo[0].id]);
          setVisibleBirds(new Set(birdInfo.map((b) => b.id)));
          if (sortedGroups[birdInfo[0].id].length) {
            setMapCenter([
              sortedGroups[birdInfo[0].id][0].lat,
              sortedGroups[birdInfo[0].id][0].lng,
            ]);
            setCurrentIdx(0);
          }
        }
      })
      .catch((err) => console.error("Bird data error:", err));
  }, []);

  // Load radar data
  useEffect(() => {
    fetch("/data/radarlist.csv")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const rows = parsed.data.filter(
          (row) => row.Latitude && row.Longitude && row["Date Installed"]
        );
        const pointsList = [];
        let minYear = 9999,
          maxYear = 0;
        rows.forEach((row) => {
          const yearStr = row["Date Installed"].toString();
          const yearMatch = yearStr.match(/\d{4}/);
          if (!yearMatch) return;
          const year = parseInt(yearMatch[0]);
          if (isNaN(year)) return;
          const lat = parseFloat(row.Latitude);
          const lng = parseFloat(row.Longitude);
          if (isNaN(lat) || isNaN(lng)) return;
          pointsList.push({
            lat,
            lng,
            name: row.Name,
            bandType: row["Band Type"],
            purpose: row["Description of Purpose"],
            jurisdiction: row.Jurisdiction,
            operator: row.Operator,
            area: row.Area,
            usedBy: row["Used by Which Institutes"],
            brand: row["Company/Brand"],
            status: row.Status,
            notes: row["Notes on Dates"],
            source: row["Source URL"],
            year: year,
          });
          if (year < minYear) minYear = year;
          if (year > maxYear) maxYear = year;
        });
        setRadarPoints(pointsList);
        setMinRadarYear(minYear);
        setMaxRadarYear(maxYear);
        setRadarYear(maxYear);
      })
      .catch((err) => console.error("Radar data error:", err));
  }, []);

  // Colour map for birds
  const birdColorMap = {};
  birdList.forEach((bird, idx) => {
    birdColorMap[bird.id] = getBirdColor(idx);
  });

  // Reset animation when selected bird changes (single mode)
  useEffect(() => {
    if (compareMode) return;
    if (!selectedBirdId || !allPointsByBird[selectedBirdId]) return;
    const newPoints = allPointsByBird[selectedBirdId];
    setPoints(newPoints);
    setCurrentIdx(0);
    setIsPlaying(false);
    if (newPoints.length) {
      setMapCenter([newPoints[0].lat, newPoints[0].lng]);
    }
    if (intervalRef.current) clearTimeout(intervalRef.current);
  }, [selectedBirdId, allPointsByBird, compareMode]);

  // Animation loop (single mode)
  useEffect(() => {
    if (compareMode) return;
    if (!isPlaying || points.length === 0 || currentIdx >= points.length - 1) {
      if (currentIdx >= points.length - 1 && isPlaying) setIsPlaying(false);
      return;
    }
    const now = points[currentIdx].timestamp;
    const next = points[currentIdx + 1].timestamp;
    let waitMs = (next - now) / speedFactor;
    waitMs = Math.min(waitMs, 2000);
    waitMs = Math.max(waitMs, 30);
    intervalRef.current = setTimeout(() => {
      setCurrentIdx((prev) => prev + 1);
    }, waitMs);
    return () => clearTimeout(intervalRef.current);
  }, [isPlaying, currentIdx, points, speedFactor, compareMode]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentIdx(0);
    if (points.length) setMapCenter([points[0].lat, points[0].lng]);
  };
  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleBirdVisibility = (birdId) => {
    setVisibleBirds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(birdId)) newSet.delete(birdId);
      else newSet.add(birdId);
      return newSet;
    });
  };
  const selectAllBirds = () => setVisibleBirds(new Set(birdList.map((b) => b.id)));
  const deselectAllBirds = () => setVisibleBirds(new Set());

  // Filter radar points by selected year
  const visibleRadarPoints = radarEnabled
    ? radarPoints.filter((p) => p.year <= radarYear)
    : [];

  if (Object.keys(allPointsByBird).length === 0)
    return <div style={{ padding: "1rem" }}>Loading bird tracking data...</div>;

  // Prepare polylines and start markers for compare mode
  const comparePolylines = [];
  const compareStartMarkers = [];
  if (compareMode) {
    for (const bird of birdList) {
      if (visibleBirds.has(bird.id)) {
        const birdPoints = allPointsByBird[bird.id];
        const positions = birdPoints.map((p) => [p.lat, p.lng]);
        const col = birdColorMap[bird.id];
        comparePolylines.push(
          <Polyline
            key={`line-${bird.id}`}
            positions={positions}
            color={col}
            weight={0.8}
            opacity={0.5}
          />
        );
        const firstPoint = birdPoints[0];
        if (firstPoint) {
          compareStartMarkers.push(
            <CircleMarker
              key={`start-${bird.id}`}
              center={[firstPoint.lat, firstPoint.lng]}
              radius={4}
              fillColor={col}
              color={col}
              weight={1}
              opacity={0.8}
              fillOpacity={1}
            />
          );
        }
      }
    }
  }

  // Single mode data
  const currentPoint = points[currentIdx];
  const trail = points.slice(0, currentIdx + 1).map((p) => [p.lat, p.lng]);
  const firstPoint = points[0];
  const currentColor = birdColorMap[selectedBirdId] || "#f39c12";

  return (
    <div className="bird-tracker" style={{ marginTop: "2rem" }}>
      <style>{`
        .bird-tracker input[type="range"] {
          -webkit-appearance: none;
          background: #444;
          height: 3px;
          border-radius: 2px;
        }
        .bird-tracker input[type="range"]:focus {
          outline: none;
        }
        .bird-tracker input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3f3f3f;
          cursor: pointer;
          border: none;
        }
        .bird-tracker input[type="range"]::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #aaa;
          cursor: pointer;
          border: none;
        }
        .bird-tracker input[type="range"]::-ms-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #aaa;
          cursor: pointer;
          border: none;
        }
      `}</style>

      {/* Mode toggle, radar toggle, year slider */}
      <div
        style={{
          marginBottom: "0.5rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontFamily: "monospace" }}>
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => {
              setCompareMode(e.target.checked);
              if (e.target.checked) setIsPlaying(false);
            }}
          />{" "}
          Compare Mode (show multiple birds)
        </label>

        <label style={{ fontFamily: "monospace" }}>
          <input
            type="checkbox"
            checked={radarEnabled}
            onChange={(e) => setRadarEnabled(e.target.checked)}
          />{" "}
          Show Radar Installations
        </label>

        {radarEnabled && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
          >
            <span>Radar year:</span>
            <input
              type="range"
              min={minRadarYear}
              max={maxRadarYear}
              step={1}
              value={radarYear}
              onChange={(e) => setRadarYear(parseInt(e.target.value))}
              style={{ width: "150px" }}
            />
            <span>{radarYear}</span>
          </div>
        )}
      </div>

      {!compareMode ? (
        // ----- Single Bird Animation Mode -----
        <>
          <div
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <label htmlFor="bird-select" style={{ fontFamily: "monospace" }}>
              Select bird:
            </label>
            <select
              id="bird-select"
              value={selectedBirdId || ""}
              onChange={(e) => setSelectedBirdId(parseInt(e.target.value))}
              style={{ padding: "0.2rem 0.5rem", fontFamily: "monospace" }}
            >
              {birdList.map((bird) => (
                <option key={bird.id} value={bird.id}>
                  {bird.species} (ID {bird.id}) – {bird.pointCount} fixes
                </option>
              ))}
            </select>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: currentColor,
                borderRadius: "2px",
              }}
            />
          </div>

          <div className="map-wrapper" style={{ border: "1px solid #9afc97" }}>
            <MapContainer
              key={`single-${selectedBirdId}`}
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "400px", width: "100%" }}
              attributionControl={false}
              zoomControl={true}
            >
              {/* Base satellite layer */}
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

              {/* English street map (labels + streets) */}
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                opacity={labelOpacityRef.current}
                ref={labelLayerRef}
              />

              {/* Bird trail and start dot */}
              <Polyline
                positions={trail}
                color={currentColor}
                weight={0.8}
                opacity={0.9}
              />
              {firstPoint && (
                <CircleMarker
                  center={[firstPoint.lat, firstPoint.lng]}
                  radius={4}
                  fillColor={currentColor}
                  color={currentColor}
                  weight={1}
                  opacity={0.8}
                  fillOpacity={1}
                />
              )}

              {/* Radar markers */}
              {visibleRadarPoints.map((radar, idx) => (
                <CircleMarker
                  key={`radar-${idx}`}
                  center={[radar.lat, radar.lng]}
                  radius={5}
                  fillColor="#000000"
                  color="#ffffff"
                  weight={1.5}
                  opacity={0.9}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <strong>{radar.name}</strong>
                    <br />
                    <strong>Year installed:</strong> {radar.year}
                    <br />
                    <strong>Band Type:</strong> {radar.bandType}
                    <br />
                    <strong>Purpose:</strong> {radar.purpose}
                    <br />
                    <strong>Jurisdiction:</strong> {radar.jurisdiction}
                    <br />
                    <strong>Operator:</strong> {radar.operator}
                    <br />
                    <strong>Status:</strong> {radar.status}
                    <br />
                    {radar.source && radar.source !== "" && (
                      <a href={radar.source} target="_blank" rel="noopener noreferrer">
                        Source
                      </a>
                    )}
                  </Popup>
                </CircleMarker>
              ))}

              <MapUpdater position={[currentPoint.lat, currentPoint.lng]} />
            </MapContainer>
          </div>

          {/* Label opacity slider */}
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span>Labels opacity:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={0.0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                labelOpacityRef.current = val;
                if (labelLayerRef.current) labelLayerRef.current.setOpacity(val);
              }}
              style={{ width: "200px" }}
            />
            <span>{Math.round((labelOpacityRef.current || 0) * 100)}%</span>
          </div>

          <div
            className="bird-controls"
            style={{
              marginTop: "0.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
          >
            <button
              onClick={togglePlay}
              className="color-btn"
              style={{ padding: "0.2rem 0.8rem" }}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={reset}
              className="color-btn"
              style={{ padding: "0.2rem 0.8rem" }}
            >
              Reset
            </button>
            <div>
              <span>Speed: </span>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={speedFactor}
                onChange={(e) => setSpeedFactor(parseFloat(e.target.value))}
                style={{ width: "120px" }}
              />
              <span style={{ marginLeft: "0.5rem" }}>{speedFactor}x</span>
            </div>
            <div>
              {currentPoint.timestamp.toLocaleString()} | Speed:{" "}
              {currentPoint.speed?.toFixed(1) || "?"} km/h | Heading:{" "}
              {currentPoint.heading?.toFixed(0) || "?"}°
            </div>
            <div>
              {currentIdx + 1} / {points.length} fixes
            </div>
          </div>
        </>
      ) : (
        // ----- Compare Mode (Static Overlays) -----
        <>
          <div
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={selectAllBirds}
              className="color-btn"
              style={{ padding: "0.2rem 0.8rem" }}
            >
              Select All
            </button>
            <button
              onClick={deselectAllBirds}
              className="color-btn"
              style={{ padding: "0.2rem 0.8rem" }}
            >
              Deselect All
            </button>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {birdList.map((bird) => (
                <label
                  key={bird.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleBirds.has(bird.id)}
                    onChange={() => toggleBirdVisibility(bird.id)}
                  />
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: birdColorMap[bird.id],
                      borderRadius: "2px",
                    }}
                  />
                  {bird.species} (ID {bird.id})
                </label>
              ))}
            </div>
          </div>

          <div className="map-wrapper" style={{ border: "1px solid #9afc97" }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "400px", width: "100%" }}
              attributionControl={false}
              zoomControl={true}
              key={compareMode ? "compare" : "single"}
            >
              {/* Base satellite layer */}
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

              {/* English street map (same as single mode) */}
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                opacity={labelOpacityRef.current}
                ref={labelLayerRef}
              />

              {comparePolylines}
              {compareStartMarkers}

              {/* Radar markers */}
              {visibleRadarPoints.map((radar, idx) => (
                <CircleMarker
                  key={`radar-${idx}`}
                  center={[radar.lat, radar.lng]}
                  radius={5}
                  fillColor="#000000"
                  color="#ffffff"
                  weight={1.5}
                  opacity={0.9}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <strong>{radar.name}</strong>
                    <br />
                    <strong>Year installed:</strong> {radar.year}
                    <br />
                    <strong>Band Type:</strong> {radar.bandType}
                    <br />
                    <strong>Purpose:</strong> {radar.purpose}
                    <br />
                    <strong>Jurisdiction:</strong> {radar.jurisdiction}
                    <br />
                    <strong>Operator:</strong> {radar.operator}
                    <br />
                    <strong>Status:</strong> {radar.status}
                    <br />
                    {radar.source && radar.source !== "" && (
                      <a href={radar.source} target="_blank" rel="noopener noreferrer">
                        Source
                      </a>
                    )}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Label opacity slider (same as single mode) */}
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span>Labels opacity:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={0.0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                labelOpacityRef.current = val;
                if (labelLayerRef.current) labelLayerRef.current.setOpacity(val);
              }}
              style={{ width: "200px" }}
            />
            <span>{Math.round((labelOpacityRef.current || 0) * 100)}%</span>
          </div>

          <div
            style={{
              marginTop: "0.5rem",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              textAlign: "center",
            }}
          >
            Showing full tracks of selected birds. Small dots mark the first recorded
            location.
          </div>
        </>
      )}
    </div>
  );
}