import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Spectrogram from "../components/Spectrogram";

const audioTracks = [
  {
    id: 1,
    title: "Soil, Hai Carmel",
    description: "EMFS of Soil",
    file: "/audio/HCarmel_Haifa_Nesher_Soil_1341.mp3",
  },
  {
    id: 2,
    title: "Air, Judean Desert, Hebron",
    description: "Environment (Birds, Helicopters)",
    file: "/audio/Hebron_1528.mp3",
  },
  {
    id: 3,
    title: "Air, Judean Desert, Hebron",
    description: "EMFS in Arid land.",
    file: "/audio/Hebron_Al_Bueib_Masafer_EMF_1709.mp3",
  },
];

export default function ArchivePage() {
  const [playingId, setPlayingId] = useState(null);
  const [currentTimes, setCurrentTimes] = useState({});
  const [durations, setDurations] = useState({});
  const audioRefs = useRef({});
  const intervalRefs = useRef({});
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
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
      // Pause current
      audio.pause();
      if (intervalRefs.current[id]) {
        clearInterval(intervalRefs.current[id]);
        delete intervalRefs.current[id];
      }
      setPlayingId(null);
    } else {
      // Stop any other playing track
      if (playingId !== null && audioRefs.current[playingId]) {
        const prevAudio = audioRefs.current[playingId];
        prevAudio.pause();
        if (intervalRefs.current[playingId]) {
          clearInterval(intervalRefs.current[playingId]);
          delete intervalRefs.current[playingId];
        }
      }
      // Play new track
      try {
        await audio.play();
        setPlayingId(id);
        // Start interval to update current time
        intervalRefs.current[id] = setInterval(() => {
          const currentAudio = audioRefs.current[id];
          if (currentAudio && !currentAudio.paused) {
            setCurrentTimes(prev => ({ ...prev, [id]: currentAudio.currentTime }));
            if (currentAudio.ended) {
              clearInterval(intervalRefs.current[id]);
              delete intervalRefs.current[id];
              setPlayingId(null);
              setCurrentTimes(prev => ({ ...prev, [id]: 0 }));
            }
          }
        }, 100);
      } catch (err) {
        console.warn("Playback failed:", err);
        setPlayingId(null);
      }
    }
  };

  const handleLoadedMetadata = (id, audio) => {
    setDurations(prev => ({ ...prev, [id]: audio.duration }));
  };

  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) audio.pause();
      });
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="no-underline">Sound Archive</h2>
        <p>Spectrograms visualise frequency content over time – each row is a snapshot of the sound.</p>
        <div className="archive-grid audio-grid">
          {audioTracks.map((track) => (
            <div key={track.id} className="archive-card audio-card">
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
                  }
                }}
                src={track.file}
                onEnded={() => {
                  if (intervalRefs.current[track.id]) {
                    clearInterval(intervalRefs.current[track.id]);
                    delete intervalRefs.current[track.id];
                  }
                  setPlayingId(null);
                  setCurrentTimes(prev => ({ ...prev, [track.id]: 0 }));
                }}
                preload="metadata"
              />
              <Spectrogram audioElement={audioRefs.current[track.id]} isPlaying={playingId === track.id} theme={theme} />
              <button
                className="audio-play-btn"
                onClick={() => handlePlayPause(track.id)}
              >
                {playingId === track.id ? "Pause" : "Play"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}