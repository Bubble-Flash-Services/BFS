import React from "react";
import "./mega-win-heading.css";
import { TextGenerateEffect } from "./text-generate-effect";

export default function MegaWinHeading({ children, className = "" }) {
  return (
    <div className="mega-win-burst">
      <h1 className={`mega-win-heading ${className}`} style={{animation: 'none'}}>
        <TextGenerateEffect words={children} className={`mega-win-heading ${className}`} filter={false} duration={0.5} />
      </h1>
    </div>
  );
}
