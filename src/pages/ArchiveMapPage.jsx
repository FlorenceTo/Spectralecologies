import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Spectrogram from "../components/Spectrogram";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper to center map programmatically
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, map, zoom]);
  return null;
}

// Custom green circle marker (small green dot)
const getGreenCircleIcon = () => {
  return L.divIcon({
    html: '<div style="background-color: #6ecc39; width: 16px; height: 16px; border-radius: 50%; border: 1px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>',
    iconSize: [16, 16],
    className: '',
    popupAnchor: [0, -8],
  });
};

export default function ArchiveMapPage() {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio player state
  const [playingId, setPlayingId] = useState(null);
  const [currentTimes, setCurrentTimes] = useState({});
  const [durations, setDurations] = useState({});
  const audioRefs = useRef({});
  const intervalRefs = useRef({});
  const [theme, setTheme] = useState("dark");
  const [selectedSoundId, setSelectedSoundId] = useState(null);
  const [mapCenter, setMapCenter] = useState([31.5, 35.0]);
  const [mapZoom, setMapZoom] = useState(8);
  const cardRefs = useRef({});

  // Map tile selection state
  const [tileType, setTileType] = useState("carto");

  // Help panel visibility
  const [helpVisible, setHelpVisible] = useState(false);

  // Field Notes visibility per card
  const [fieldNotesOpen, setFieldNotesOpen] = useState({});

  const toggleFieldNotes = (id) => {
    setFieldNotesOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // SELECTED FILENAMES (edit as needed)
  const SELECTED_FILENAMES = [
    "HCarmel_Haifa_Nesher_Soil_324528008N_35129.180E_436.98m_040126_1352_1",
    "Hebron_312928.710N_351346.728E_510.99m_110126_1511_1",
    "Hebron_312928.710N_351346.728E_510.99m_110126_1528_1",
    "Hebron_312928.710N_351346.728E_510.99m_110126_1530_1",
    "Hebron_Al_Bueib_Masafer_EMF_312924.120N_351218.612E_530.15m_110126_1709_1",
    "Hebron_Al_Bueib_Masafer_Geo_312924.120N_351218.612E_530.15m_110126_1721_1",
    "Hebron_EMF_312924.108N_351218.612E_532.30m_110126_1537_1",
    "Hebron_Geomic_312928.710N_351346.728E_510.99m_110126_1622_1",
    "Jericho__32421.960N_352951.540E_-275.59m_170126_1238_1",
    "Jericho__EMF_315042.642N_352534.188E_8.24m_170126_0822_1",
    "Ma'agan_Mikha'el_Jzralzarqa_323258.302N_345449.452E_6.72m_060126_0918_1",
    "PNHM_Bethlehem_Soil_314304.5N_351221.4E_231225_1315_1",
  ];

  // Load CSV
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch("./data/sound_recordings.csv");
        if (!response.ok) throw new Error("Failed to load CSV");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const allRows = results.data;
            const filteredRows = allRows.filter((row) =>
              SELECTED_FILENAMES.includes(row.filename)
            );
            if (filteredRows.length === 0) {
              setError("No selected recordings found. Check SELECTED_FILENAMES.");
              setLoading(false);
              return;
            }
            const recordings = filteredRows.map((row, idx) => ({
              id: idx,
              title: `${row.location} (${row.recording_type}) - ${row.time}`,
              description: `${row.city_region}, ${row.jurisdiction} | ${row.date}`,
              file: `./audio/${row.filename}.mp3`,
              lat: parseFloat(row.latitude_decimal),
              lon: parseFloat(row.longitude_decimal),
              region: row.city_region,
              recordingType: row.recording_type,
              date: row.date,
              time: row.time,
              altitude: parseFloat(row.altitude_m),
              filename: row.filename,
            }));
            setSounds(recordings);
            setLoading(false);
          },
          error: (err) => {
            console.error("CSV parse error:", err);
            setError("Could not parse CSV file");
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load CSV file");
        setLoading(false);
      }
    };
    loadCSV();
  }, []);

  // Theme detection
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  // Cleanup audio intervals
  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
      Object.values(audioRefs.current).forEach((audio) => audio?.pause());
    };
  }, []);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = async (id) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    if (playingId === id) {
      audio.pause();
      if (intervalRefs.current[id]) clearInterval(intervalRefs.current[id]);
      setPlayingId(null);
    } else {
      if (playingId !== null && audioRefs.current[playingId]) {
        const prevAudio = audioRefs.current[playingId];
        prevAudio.pause();
        if (intervalRefs.current[playingId]) clearInterval(intervalRefs.current[playingId]);
      }
      try {
        await audio.play();
        setPlayingId(id);
        intervalRefs.current[id] = setInterval(() => {
          const currentAudio = audioRefs.current[id];
          if (currentAudio && !currentAudio.paused) {
            setCurrentTimes((prev) => ({ ...prev, [id]: currentAudio.currentTime }));
            if (currentAudio.ended) {
              clearInterval(intervalRefs.current[id]);
              setPlayingId(null);
              setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
            }
          }
        }, 100);
      } catch (err) {
        console.error("Playback failed:", err);
        setPlayingId(null);
      }
    }
  };

  const handleLoadedMetadata = (id, audio) => {
    setDurations((prev) => ({ ...prev, [id]: audio.duration }));
  };

  const handleAudioError = (id, e) => {
    console.error(`Audio error for id ${id}:`, e);
  };

  const handleMarkerClick = (sound) => {
    setSelectedSoundId(sound.id);
    setMapCenter([sound.lat, sound.lon]);
    setMapZoom(12);
    cardRefs.current[sound.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCardClick = (sound) => {
    setSelectedSoundId(sound.id);
    setMapCenter([sound.lat, sound.lon]);
    setMapZoom(12);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">Loading sound archive...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="error-container">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="archive-map-container">
        {/* LEFT: MAP */}
        <div className="map-side">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            {tileType === "carto" ? (
              <TileLayer
                url={
                  theme === "dark"
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
            ) : (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; <a href="https://www.esri.com">Esri</a>'
              />
            )}
            <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={4}>
              {sounds.map((sound) => (
                <Marker
                  key={sound.id}
                  position={[sound.lat, sound.lon]}
                  icon={getGreenCircleIcon()}
                  eventHandlers={{ click: () => handleMarkerClick(sound) }}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{sound.title}</strong><br />
                      <small>{sound.description}</small><br />
                      <button
                        className="popup-play-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(sound.id);
                        }}
                      >
                        {playingId === sound.id ? "Pause" : "Play"}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
            <MapController center={mapCenter} zoom={mapZoom} />
          </MapContainer>
          <div className="map-tile-switcher">
            <button
              className={`tile-btn ${tileType === "carto" ? "active" : ""}`}
              onClick={() => setTileType("carto")}
            >
              Map
            </button>
            <button
              className={`tile-btn ${tileType === "arcgis" ? "active" : ""}`}
              onClick={() => setTileType("arcgis")}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* RIGHT: SOUND LIST WITH SPECTROGRAMS */}
        <div className="archive-list-side">
          <h2 className="no-underline">Sonic Dispossession</h2>
          <p>Spectrograms show frequency, vibration, and energy over time. Click any marker or card to focus location.</p>

          <button className="help-toggle-btn" onClick={() => setHelpVisible(!helpVisible)}>
            How to read spectrograms
          </button>

          {helpVisible && (
            <div className="help-panel">
              <h4>Spectrogram colour legend</h4>
              <div className="gradient-legend">
                <div className="gradient-bar"></div>
                <div className="gradient-labels">
                  <span>Low energy</span>
                  <span>High energy</span>
                </div>
              </div>
              <p>
                <strong>Colours</strong> represent signal intensity: dark purple/blue = weak,
                yellow/white = strong. The <strong>vertical axis</strong> shows frequency
                (higher frequencies at the top), the <strong>horizontal axis</strong> is time.
              </p>
              <h4>Waveform</h4>
              <p>The waveform shows amplitude (loudness) over time. Taller peaks = louder sounds.</p>
              <h4>Controls</h4>
              <p>
                <strong>Dynamic range</strong> adjusts contrast – higher values reveal quieter details.
                <strong>Fill width</strong> crops empty high frequencies to use the full width.
              </p>
            </div>
          )}

          <div className="archive-grid audio-grid">
            {sounds.map((track) => (
              <div
                key={track.id}
                className={`archive-card audio-card ${selectedSoundId === track.id ? "selected-card" : ""}`}
                ref={(el) => { if (el) cardRefs.current[track.id] = el; }}
                onClick={() => handleCardClick(track)}
                style={{ cursor: "pointer" }}
              >
                <h3>{track.title}</h3>
                <p className="audio-description">{track.description}</p>
                <div className="audio-meta">
                  {durations[track.id] ? (
                    `${formatTime(currentTimes[track.id] || 0)} / ${formatTime(durations[track.id])}`
                  ) : (
                    "Loading..."
                  )}
                </div>
                <audio
                  ref={(el) => {
                    if (el) {
                      audioRefs.current[track.id] = el;
                      el.addEventListener("loadedmetadata", () => handleLoadedMetadata(track.id, el));
                      el.addEventListener("error", (e) => handleAudioError(track.id, e));
                    }
                  }}
                  src={track.file}
                  onEnded={() => {
                    if (intervalRefs.current[track.id]) clearInterval(intervalRefs.current[track.id]);
                    setPlayingId(null);
                    setCurrentTimes((prev) => ({ ...prev, [track.id]: 0 }));
                  }}
                  preload="metadata"
                />
                <Spectrogram audioElement={audioRefs.current[track.id]} isPlaying={playingId === track.id} theme={theme} />
                <button
                  className="audio-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(track.id);
                  }}
                >
                  {playingId === track.id ? "Pause" : "Play"}
                </button>
                <div className="location-badge">
                  {track.region} · {track.recordingType} · {track.date}
                </div>

                {/* FIELD NOTES */}
                <div className="field-notes-wrapper">
                  <button
                    className="field-notes-toggle"
                    onClick={(e) => { e.stopPropagation(); toggleFieldNotes(track.id); }}
                  >
                    Field Notes {fieldNotesOpen[track.id] ? "▲" : "▼"}
                  </button>
                  {fieldNotesOpen[track.id] && (
                    <div className="field-notes-panel" onClick={(e) => e.stopPropagation()}>
                      <p>
                        <strong>Recording notes:</strong><br />
                        • Location: {track.region}<br />
                        • Type: {track.recordingType}<br />
                        • Altitude: {track.altitude ? `${track.altitude}m` : "N/A"}<br />
                        • Equipment / conditions – add your observations here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .archive-map-container {
          display: flex;
          flex-direction: row;
          height: calc(100vh - 70px);
          width: 100%;
          overflow: hidden;
        }
        .map-side {
          flex: 0 0 45%;
          height: 100%;
          position: relative;
          border-right: 1px solid rgba(128, 128, 128, 0.3);
        }
        .archive-list-side {
          flex: 0 0 55%;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          height: 100%;
        }
        .archive-list-side::-webkit-scrollbar {
          width: 8px;
        }
        .archive-list-side::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .archive-list-side::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.5);
          border-radius: 4px;
        }
        .audio-card {
          transition: all 0.2s ease;
          position: relative;
        }
        .selected-card {
          border: 2px solid #ffaa44;
          background: rgba(255, 170, 68, 0.1);
          transform: scale(1.01);
        }
        .location-badge {
          font-size: 0.75rem;
          margin-top: 0.5rem;
          color: #aaa;
          text-align: center;
          padding: 0.2rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          display: inline-block;
          width: auto;
        }
        .map-popup {
          min-width: 150px;
          font-family: inherit;
        }
        .map-popup strong {
          font-size: 0.9rem;
        }
        .popup-play-btn {
          margin-top: 6px;
          padding: 4px 10px;
          background: #050505;
          border: none;
          color: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: background 0.2s;
        }
        .popup-play-btn:hover {
          background: #333333;
        }
        .loading-container,
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          font-size: 1.2rem;
          color: #aaa;
        }
        .map-tile-switcher {
          position: absolute;
          bottom: 20px;
          left: 20px;
          z-index: 1000;
          background: rgba(30, 30, 30, 0.85);
          backdrop-filter: blur(4px);
          border-radius: 40px;
          padding: 4px;
          display: flex;
          gap: 2px;
          border: 1px solid rgba(128, 128, 128, 0.5);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .tile-btn {
          background: transparent;
          border: none;
          padding: 6px 16px;
          border-radius: 32px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          color: #ccc;
          font-family: inherit;
        }
        .tile-btn.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .tile-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
          color: #eee;
        }
        .help-toggle-btn {
          background: transparent;
          border: 1px solid #9afc97;
          border-radius: 20px;
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem;
          font-family: monospace;
          cursor: pointer;
          color: inherit;
          margin-bottom: 1rem;
        }
        .help-toggle-btn:hover {
          background: rgba(154, 252, 151, 0.2);
        }
        .help-panel {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.8rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          border-radius: 0;
        }
        .help-panel h4 {
          margin: 0.5rem 0 0.2rem;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .help-panel p {
          margin: 0.2rem 0 0.6rem;
          font-size: 0.8rem;
          line-height: 1.4;
        }
        .gradient-legend {
          margin: 0.5rem 0 1rem;
        }
        .gradient-bar {
          width: 100%;
          height: 20px;
          background: linear-gradient(to right, #140025, #4a0e5e, #b0245c, #f2823c, #f7e36b);
          border-radius: 4px;
          margin-bottom: 0.2rem;
        }
        .gradient-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: inherit;
        }
        .field-notes-wrapper {
          margin-top: 1rem;
          width: 100%;
        }
        .field-notes-toggle {
          display: block;
          margin-left: auto;
          margin-right: 0;
          background: transparent;
          border: 1px solid #9afc97;
          border-radius: 0;
          padding: 0.2rem 0.5rem;
          font-size: 0.65rem;
          font-family: monospace;
          cursor: pointer;
          color: #9afc97;
          transition: background 0.2s;
          width: fit-content;
        }
        .field-notes-toggle:hover {
          background: rgba(154, 252, 151, 0.2);
        }
        .field-notes-panel {
          margin-top: 0.5rem;
          padding: 0.6rem;
          background: rgba(0, 0, 0, 0.4);
          border-left: none;
          font-size: 0.75rem;
          line-height: 1.3;
          width: 100%;
          box-sizing: border-box;
        }
        .field-notes-panel p {
          margin: 0;
          font-size: 0.7rem;
        }
        :global(.light-bg) .location-badge {
          color: #555;
          background: rgba(200, 200, 200, 0.5);
        }
        :global(.light-bg) .selected-card {
          border-color: #cc7b00;
          background: rgba(204, 123, 0, 0.1);
        }
        :global(.light-bg) .map-tile-switcher {
          background: rgba(240, 240, 240, 0.9);
          border-color: rgba(100, 100, 100, 0.4);
        }
        :global(.light-bg) .tile-btn {
          color: #333;
        }
        :global(.light-bg) .tile-btn.active {
          background: rgba(0, 0, 0, 0.15);
          color: #000;
        }
        :global(.light-bg) .help-panel {
          background: rgba(255, 255, 255, 0.6);
        }
        :global(.light-bg) .help-toggle-btn {
          border-color: #2c6e2c;
          color: #2c6e2c;
        }
        :global(.light-bg) .field-notes-toggle {
          border-color: #2c6e2c;
          color: #2c6e2c;
        }
        :global(.light-bg) .field-notes-panel {
          background: rgba(255, 255, 255, 0.7);
        }
        :global(.leaflet-control-attribution) {
          display: none !important;
        }
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 0 !important;
        }
        :global(.leaflet-popup-tip) {
          border-radius: 0 !important;
        }
        @media (max-width: 768px) {
          .archive-map-container {
            flex-direction: column;
            height: auto;
          }
          .map-side {
            flex: 0 0 300px;
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(128, 128, 128, 0.3);
          }
          .archive-list-side {
            flex: 1;
            height: auto;
            overflow-y: visible;
          }
          .map-tile-switcher {
            bottom: 12px;
            left: 12px;
            padding: 3px;
          }
          .tile-btn {
            padding: 4px 12px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}