import { useEffect, useState, useRef } from "react";

export default function FadeParagraph({ text, delay = 0, duration = 5000, onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      if (onComplete) onComplete();
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [delay, onComplete]);

  return (
    <p
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "blur(0px)" : "blur(8px)",
        transition: `opacity ${duration}ms ease-out, filter ${duration}ms ease-out`,
        marginBottom: "1rem",
        lineHeight: 1.6,
      }}
    >
      {text}
    </p>
  );
}