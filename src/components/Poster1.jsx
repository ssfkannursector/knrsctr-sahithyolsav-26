// src/components/Poster1.jsx
// Uses Poster1.png as base image, text overlaid with absolute CSS positioning
import React from 'react';
import poster1Img from '../assets/Poster1.png';
import './poster.css';

export default function PosterOne({ program, category, winners = [] }) {
  const first  = winners[0]?.student_name || '';
  const second = winners[1]?.student_name || '';
  const third  = winners[2]?.student_name || '';

  const firstUnit  = winners[0]?.unit_name || '';
  const secondUnit = winners[1]?.unit_name || '';
  const thirdUnit  = winners[2]?.unit_name || '';

  return (
    <div className="p1-container">
      <img className="p1-base" src={poster1Img} alt="poster background" />

      {/* Program name */}
      <div className="p1-program">{program}</div>

      {/* Category */}
      <div className="p1-category">{category}</div>

      {/* 1st place */}
      <div className="p1-first-name">{first}</div>
      <div className="p1-first-unit">{firstUnit}</div>

      {/* 2nd place */}
      <div className="p1-second-name">{second}</div>
      <div className="p1-second-unit">{secondUnit}</div>

      {/* 3rd place */}
      <div className="p1-third-name">{third}</div>
      <div className="p1-third-unit">{thirdUnit}</div>
    </div>
  );
}
