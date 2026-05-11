import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [showPicker, setShowPicker] = useState(false);
  const [bgColor, setBgColor] = useState("#adadad");
  const [opacity, setOpacity] = useState(1);
  const pickerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const headerRef = useRef(null);

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Preset colors (Grey, Light, Dark)
  const presets = [
    { name: "Grey", bg: "#adadad", light: false },
    { name: "Light", bg: "#f5f3ef", light: true },
    { name: "Dark", bg: "#1c1c1b", light: false }
  ];
  const [presetIndex, setPresetIndex] = useState(0);

  // Helper to extract hex and opacity from rgba string
  const rgbaToHexOpacity = (rgba) => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const a = match[4] ? parseFloat(match[4]) : 1;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      return { hex, opacity: a };
    }
    return { hex: "#adadad", opacity: 1 };
  };

  // Apply background and toggle 'light-bg' class, also save to localStorage
  const applyBackground = (color, isLight) => {
    document.body.style.backgroundColor = color;
    if (isLight) {
      document.body.classList.add('light-bg');
    } else {
      document.body.classList.remove('light-bg');
    }
    setBgColor(color);
    // Save to localStorage
    localStorage.setItem('aelectrosonic_bg', color);
    localStorage.setItem('aelectrosonic_light', isLight ? 'true' : 'false');
    if (color.startsWith('rgba')) {
      const { hex, opacity: a } = rgbaToHexOpacity(color);
      localStorage.setItem('aelectrosonic_hex', hex);
      localStorage.setItem('aelectrosonic_opacity', a.toString());
    } else {
      localStorage.setItem('aelectrosonic_hex', color);
      localStorage.setItem('aelectrosonic_opacity', '1');
    }
  };

  // Apply preset by index
  const applyPreset = (index) => {
    const p = presets[index % presets.length];
    applyBackground(p.bg, p.light);
    setPresetIndex(index);
    setShowPicker(false);
  };

  // Cycle presets
  const cyclePreset = () => {
    const nextIndex = (presetIndex + 1) % presets.length;
    applyPreset(nextIndex);
  };

  // Handle custom color (hex)
  const handleCustomColorChange = (hex) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isLightMode = luminance > 0.5;
    applyBackground(`rgba(${r}, ${g}, ${b}, ${opacity})`, isLightMode);
    setBgColor(hex);
  };

  // Handle custom opacity
  const handleOpacityChange = (newOpacity) => {
    const r = parseInt(bgColor.slice(1,3), 16);
    const g = parseInt(bgColor.slice(3,5), 16);
    const b = parseInt(bgColor.slice(5,7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isLightMode = luminance > 0.5 || newOpacity < 0.4;
    applyBackground(`rgba(${r}, ${g}, ${b}, ${newOpacity})`, isLightMode);
    setOpacity(newOpacity);
  };

  // Hide picker with delay
  const resetHideTimeout = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowPicker(false), 5000);
  };

  const togglePicker = () => {
    if (showPicker) {
      setShowPicker(false);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    } else {
      setShowPicker(true);
      resetHideTimeout();
    }
  };

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) && !event.target.closest(".color-btn")) {
        setShowPicker(false);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Hide header on scroll
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      if (!headerRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(scrollTop - lastScrollTop) <= 5) return;
      if (scrollTop > lastScrollTop && scrollTop > 80) {
        headerRef.current.classList.add("header-hidden");
      } else {
        headerRef.current.classList.remove("header-hidden");
      }
      lastScrollTop = scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live clock (24‑hour format)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Load saved colour from localStorage on mount
  useEffect(() => {
    const savedBg = localStorage.getItem('aelectrosonic_bg');
    const savedLight = localStorage.getItem('aelectrosonic_light');
    const savedHex = localStorage.getItem('aelectrosonic_hex');
    const savedOpacity = localStorage.getItem('aelectrosonic_opacity');
    if (savedBg && savedLight !== null) {
      // Restore background
      document.body.style.backgroundColor = savedBg;
      if (savedLight === 'true') {
        document.body.classList.add('light-bg');
      } else {
        document.body.classList.remove('light-bg');
      }
      if (savedHex) setBgColor(savedHex);
      if (savedOpacity) setOpacity(parseFloat(savedOpacity));
      // Try to match preset index
      const matchIndex = presets.findIndex(p => p.bg === savedBg);
      if (matchIndex !== -1) setPresetIndex(matchIndex);
    } else {
      // Default Grey
      applyPreset(0);
    }
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-links">
        {/* Left side: clock */}
        <div className="nav-left">
          <div className="clock">{formattedTime}</div>
        </div>

        {/* Right side: Navigation + Color buttons */}
        <div className="nav-right" style={{ display: "flex", gap: "1.5rem", alignItems: "center", position: "relative" }}>
          <Link to="/">Home</Link>
          <Link to="/timeline">Timeline</Link>
          <Link to="/birdmap">Bird Map</Link>
          <Link to="/archive">Sound Archive</Link>
          <button className="color-btn" onClick={cyclePreset}>
            {presets[presetIndex].name}
          </button>
          <button className="color-btn" onClick={togglePicker}>
            Custom
          </button>
          {showPicker && (
            <div className="picker-panel" ref={pickerRef} onMouseEnter={resetHideTimeout} onMouseLeave={() => setShowPicker(false)}>
              <div className="color-input-group">
                <label>Color:</label>
                <input type="color" value={bgColor} onChange={(e) => handleCustomColorChange(e.target.value)} />
              </div>
              <div className="color-input-group">
                <label>Opacity:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#333333",
                    height: "2px",
                    borderRadius: "2px",
                  }}
                />
              </div>
              <div className="rgba-value">
                {(() => {
                  const r = parseInt(bgColor.slice(1,3), 16);
                  const g = parseInt(bgColor.slice(3,5), 16);
                  const b = parseInt(bgColor.slice(5,7), 16);
                  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}