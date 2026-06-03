// src/components/Poster4.jsx
// Uses Poster4.png (or fallback to Poster3.png) as base image
import React from 'react';
// If you have a 4th design image, change this import
import poster4Img from '../assets/Poster3.png';
import './poster.css';

export default function PosterFour({ program, category, winners = [] }) {
  const first      = winners[0]?.student_name || '';
  const second     = winners[1]?.student_name || '';
  const third      = winners[2]?.student_name || '';
  const firstUnit  = winners[0]?.unit_name || '';
  const secondUnit = winners[1]?.unit_name || '';
  const thirdUnit  = winners[2]?.unit_name || '';

  return (
    <div className="p4-container">
      <img className="p4-base" src={poster4Img} alt="" />

      <div className="p4-program">{program}</div>
      <div className="p4-category">{category}</div>

      <div className="p4-first-name">{first}</div>
      <div className="p4-first-unit">{firstUnit}</div>

      <div className="p4-second-name">{second}</div>
      <div className="p4-second-unit">{secondUnit}</div>

      <div className="p4-third-name">{third}</div>
      <div className="p4-third-unit">{thirdUnit}</div>
    </div>
  );
}
