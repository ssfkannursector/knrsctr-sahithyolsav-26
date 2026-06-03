// src/components/Poster2.jsx
// Uses Poster2.png as base image, text overlaid with absolute CSS positioning
import React from 'react';
import poster2Img from '../assets/Poster2.png';
import './poster.css';

export default function PosterTwo({ program, category, winners = [] }) {
  const first      = winners[0]?.student_name || '';
  const second     = winners[1]?.student_name || '';
  const third      = winners[2]?.student_name || '';
  const firstUnit  = winners[0]?.unit_name || '';
  const secondUnit = winners[1]?.unit_name || '';
  const thirdUnit  = winners[2]?.unit_name || '';

  return (
    <div className="p2-container">
      <img className="p2-base" src={poster2Img} alt="" />

      <div className="p2-program">{program}</div>
      <div className="p2-category">{category}</div>

      <div className="p2-first-name">{first}</div>
      <div className="p2-first-unit">{firstUnit}</div>

      <div className="p2-second-name">{second}</div>
      <div className="p2-second-unit">{secondUnit}</div>

      <div className="p2-third-name">{third}</div>
      <div className="p2-third-unit">{thirdUnit}</div>
    </div>
  );
}
