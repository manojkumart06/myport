import React, { useEffect, useRef, useState } from "react";

const ProgressBar = ({
  label,
  level,
  darkMode = false,
  gradient = "from-blue-600 to-purple-600",
  resetOnExit = true,
  threshold = 0.35,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (resetOnExit) {
          setVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [resetOnExit, threshold]);

  return (
    <div ref={ref} className={className}>
      <div className="flex justify-between mb-2">
        <span
          className={`font-medium ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {level}%
        </span>
      </div>

      <div
        className={`w-full ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full h-2 overflow-hidden`}
      >
        <div
          className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-700 ease-out`}
          style={{ width: visible ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
