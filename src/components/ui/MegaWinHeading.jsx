import React from "react";
import "./mega-win-heading.css";

export default function MegaWinHeading({ children, className = "" }) {
  return (
    <div className="mega-win-burst">
      <h1 className={`mega-win-heading ${className}`}>
        {children}
      </h1>
    </div>
  );
}
