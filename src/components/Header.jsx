import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [showPicker, setShowPicker] = useState(false);
  const [bgColor, setBgColor] = useState("#adadad");
  const [opacity, setOpacity] = useState(1);
  const pickerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile dropdown state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Preset colors (Grey, Light, Dark)
  const presets = [
    { name: "Grey", bg: "#adadad", light: false },
    { name: "Light", bg: "#f5f3ef", light: true },
    { name: "Dark", bg: "#1c1c1b", light: false }
  ];
  const [presetIndex, setPresetIndex] = useState(0);

  // Navigation items (label + path)
  const navItems = [
    //{ label: "About", path: "/about" },
    //{ label: "Home", path: "/" },
    { label: "Ecosemiotics", path: "/ecosemiotics" },
    //{ label: "Vulture Map", path: "/birdmap" },
    //{ label: "Signal Loss", path: "/interference" },
    //{ label: "Sonic Dispossession", path: "/archive-map" },
    //{ label: "Interviews", path: "/interviews" },
    //{ label: "Research Timeline", path: "/timeline" }
  ];

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

  // Hide header on swipe up (for short pages where scroll never triggers)
  useEffect(() => {
    if (window.innerWidth > 768) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEndY = e.touches[0].clientY;
      const deltaY = touchEndY - touchStartY;
      if (deltaY < -30 && headerRef.current && !headerRef.current.classList.contains('header-hidden')) {
        headerRef.current.classList.add('header-hidden');
      }
      if (deltaY > 30 && headerRef.current && headerRef.current.classList.contains('header-hidden')) {
        headerRef.current.classList.remove('header-hidden');
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Live clock (24‑hour format)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      document.body.style.backgroundColor = savedBg;
      if (savedLight === 'true') {
        document.body.classList.add('light-bg');
      } else {
        document.body.classList.remove('light-bg');
      }
      if (savedHex) setBgColor(savedHex);
      if (savedOpacity) setOpacity(parseFloat(savedOpacity));
      const matchIndex = presets.findIndex(p => p.bg === savedBg);
      if (matchIndex !== -1) setPresetIndex(matchIndex);
    } else {
      applyPreset(0);
    }
  }, []);

  // Force dark mode on mobile devices (overrides saved colour on mobile)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      applyPreset(2);
    }
  }, []);

  // Handle dropdown navigation
  const handleMobileNav = (e) => {
    const path = e.target.value;
    if (path) navigate(path);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-links">
        {/* Left side: clock (desktop only) or dropdown (mobile) */}
        <div className="nav-left">
          {!isMobile && <div className="clock">{formattedTime}</div>}
          {isMobile && (
            <select
              className="mobile-nav-dropdown"
              value={location.pathname}
              onChange={handleMobileNav}
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right side: Navigation + Color buttons (desktop only) */}
        {!isMobile && (
          <div className="nav-right" style={{ display: "flex", gap: "1.5rem", alignItems: "center", position: "relative" }}>
        {/* <Link to="/about">About</Link> */}
        {/* <Link to="/">Home</Link> */}
        <Link to="/ecosemiotics">Ecosemiotics</Link>
        {/* <Link to="/birdmap">Vulture Map</Link> */}
        {/* <Link to="/interference">Signal Loss</Link> */}
        {/* <Link to="/archive-map">Sonic Dispossession</Link> */}
        {/* <Link to="/interviews">Interviews</Link> */}
        {/* <Link to="/timeline">Research Timeline</Link> */}
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
        )}
      </div>

      {/* Additional styles for mobile dropdown – placed inside component so it's scoped */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-nav-dropdown {
            background: transparent;
            border: 1px solid #9afc97;
            border-radius: 0;
            padding: 0.3rem 0.5rem;
            font-family: monospace;
            font-size: 0.8rem;
            color: inherit;
            cursor: pointer;
            margin-left: 0;
          }
          .mobile-nav-dropdown option {
            background: #1c1c1b;
            color: #9afc97;
          }
          body.light-bg .mobile-nav-dropdown {
            border-color: #2c6e2c;
            color: #2c6e2c;
          }
          body.light-bg .mobile-nav-dropdown option {
            background: #f5f3ef;
            color: #2c6e2c;
          }
        }
      `}</style>
    </header>
  );
}