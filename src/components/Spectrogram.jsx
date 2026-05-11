import { useEffect, useRef, useCallback } from "react";

export default function Spectrogram({ audioElement, theme }) {
  const specCanvasRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const animationRef = useRef();
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const contextRef = useRef(null);
  const imageDataRef = useRef(null);
  const isPlayingRef = useRef(false);
  const currentAudioRef = useRef(null);

  const amplitudeToColor = (value) => {
    const t = Math.min(1, Math.max(0, value));
    const r = Math.floor(255 * t);
    const g = Math.floor(80 * t);
    const b = Math.floor(40 * t);
    return [r, g, b];
  };

  // Initialize audio context and source once
  useEffect(() => {
    if (!audioElement) return;
    if (contextRef.current) return; // already initialized

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    contextRef.current = context;
    const source = context.createMediaElementSource(audioElement);
    sourceRef.current = source;
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    source.connect(analyser);
    analyser.connect(context.destination);

    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch(e) {}
      }
      if (contextRef.current && contextRef.current.state !== "closed") {
        contextRef.current.close();
      }
    };
  }, [audioElement]);

  // Reset spectrogram when audio element changes
  useEffect(() => {
    if (currentAudioRef.current === audioElement) return;
    currentAudioRef.current = audioElement;

    // Clear image data
    if (specCanvasRef.current) {
      const canvas = specCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w;
      canvas.height = h;
      const imageData = ctx.createImageData(w, h);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0;
        imageData.data[i+1] = 0;
        imageData.data[i+2] = 0;
        imageData.data[i+3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      imageDataRef.current = imageData;
    }
  }, [audioElement]);

  // Start drawing loop
  useEffect(() => {
    if (!specCanvasRef.current || !waveCanvasRef.current) return;

    const specCanvas = specCanvasRef.current;
    const specCtx = specCanvas.getContext("2d");
    const waveCanvas = waveCanvasRef.current;
    const waveCtx = waveCanvas.getContext("2d");

    let specWidth, specHeight, waveWidth, waveHeight;

    const resize = () => {
      specWidth = specCanvas.clientWidth;
      specHeight = specCanvas.clientHeight;
      specCanvas.width = specWidth;
      specCanvas.height = specHeight;
      waveWidth = waveCanvas.clientWidth;
      waveHeight = waveCanvas.clientHeight;
      waveCanvas.width = waveWidth;
      waveCanvas.height = waveHeight;

      // Reinitialize image data on resize
      if (imageDataRef.current) {
        const newImageData = specCtx.createImageData(specWidth, specHeight);
        // copy old data? not necessary, just reset
        for (let i = 0; i < newImageData.data.length; i += 4) {
          newImageData.data[i] = 0;
          newImageData.data[i+1] = 0;
          newImageData.data[i+2] = 0;
          newImageData.data[i+3] = 255;
        }
        imageDataRef.current = newImageData;
        specCtx.putImageData(newImageData, 0, 0);
      } else {
        const imageData = specCtx.createImageData(specWidth, specHeight);
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] = 0;
          imageData.data[i+1] = 0;
          imageData.data[i+2] = 0;
          imageData.data[i+3] = 255;
        }
        specCtx.putImageData(imageData, 0, 0);
        imageDataRef.current = imageData;
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      if (!analyserRef.current) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      if (isPlayingRef.current) {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        const timeData = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);

        // Shift spectrogram
        const rowWidth = specWidth * 4;
        for (let y = 1; y < specHeight; y++) {
          const srcStart = y * rowWidth;
          const destStart = (y - 1) * rowWidth;
          imageDataRef.current.data.copyWithin(destStart, srcStart, srcStart + rowWidth);
        }
        // Add new row
        const bottomRowStart = (specHeight - 1) * rowWidth;
        for (let x = 0; x < specWidth; x++) {
          const freqIndex = Math.floor((x / specWidth) * bufferLength);
          const amp = freqData[freqIndex] / 255;
          const [r, g, b] = amplitudeToColor(amp);
          const pos = bottomRowStart + x * 4;
          imageDataRef.current.data[pos] = r;
          imageDataRef.current.data[pos+1] = g;
          imageDataRef.current.data[pos+2] = b;
        }
        specCtx.putImageData(imageDataRef.current, 0, 0);

        // Draw waveform
        waveCtx.clearRect(0, 0, waveWidth, waveHeight);
        waveCtx.beginPath();
        waveCtx.strokeStyle = theme === "light" ? "#333333" : "#9afc97";
        waveCtx.lineWidth = 1.5;
        const step = waveWidth / timeData.length;
        for (let i = 0; i < timeData.length; i++) {
          const x = i * step;
          const y = waveHeight / 2 + (timeData[i] - 128) / 128 * (waveHeight / 2 - 4);
          if (i === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [theme]);

  // Attach play/pause listeners
  useEffect(() => {
    if (!audioElement) return;

    const handlePlay = async () => {
      isPlayingRef.current = true;
      if (contextRef.current && contextRef.current.state === "suspended") {
        await contextRef.current.resume();
      }
    };
    const handlePause = () => {
      isPlayingRef.current = false;
    };
    const handleEnded = () => {
      isPlayingRef.current = false;
    };

    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [audioElement]);

  return (
    <div style={{ width: "100%", marginTop: "0.5rem" }}>
      <div style={{ marginBottom: "0.25rem", fontSize: "0.65rem", fontFamily: "monospace", opacity: 0.7 }}>
        waveform (amplitude) · spectrogram (frequency)
      </div>
      <canvas
        ref={waveCanvasRef}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: theme === "light" ? "#eaeaea" : "#1a1a1a",
          display: "block",
        }}
      />
      <canvas
        ref={specCanvasRef}
        style={{
          width: "100%",
          height: "100px",
          backgroundColor: theme === "light" ? "#eaeaea" : "#1a1a1a",
          display: "block",
          marginTop: "1px",
        }}
      />
    </div>
  );
}