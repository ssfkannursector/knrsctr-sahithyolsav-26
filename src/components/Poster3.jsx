// src/components/Poster3.jsx
// Uses Poster3.png as base image, text overlaid with absolute CSS positioning
import React from 'react';
import poster3Img from '../assets/Poster3.png';
import './poster.css';

export default function PosterThree({ program, category, winners = [] }) {
  const first      = winners[0]?.student_name || '';
  const second     = winners[1]?.student_name || '';
  const third      = winners[2]?.student_name || '';
  const firstUnit  = winners[0]?.unit_name || '';
  const secondUnit = winners[1]?.unit_name || '';
  const thirdUnit  = winners[2]?.unit_name || '';

  return (
    <div className="p3-container">
      <img className="p3-base" src={poster3Img} alt="" />

      <div className="p3-program">{program}</div>
      <div className="p3-category">{category}</div>

      <div className="p3-first-name">{first}</div>
      <div className="p3-first-unit">{firstUnit}</div>

      <div className="p3-second-name">{second}</div>
      <div className="p3-second-unit">{secondUnit}</div>

      <div className="p3-third-name">{third}</div>
      <div className="p3-third-unit">{thirdUnit}</div>
    </div>
  );
}
