// src/components/common/LoadingSpinner.tsx
import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  overlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Carregando...",
  size = "medium",
  overlay = false,
  className = "",
}) => {
  return (
    <div
      className={`loading-container ${overlay ? "overlay" : ""} ${className}`}
    >
      <div className={`spinner ${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
