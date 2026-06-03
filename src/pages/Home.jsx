// src/pages/Home.jsx
import React from 'react';
import logo from '../assets/logo.svg';
import Poster from '../assets/Poster.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header>
        <img src={logo} alt="Sahityotsav Logo" className="header-logo" />
      </header>

      {/* ── POSTER ─────────────────────────────────────── */}
      <div className="poster-container">
        <img src={Poster} alt="Sahityotsav 2026" className="poster" />
        <button className="results-btn" onClick={() => navigate('/results')}>
          View Results →
        </button>
      </div>

      {/* ── ABOUT ──────────────────────────────────────── */}
      <section className="about-section">
        <div className="accent-line" />
        <p className="about-text">
          <span className="highlight">Incepted 32 years ago in 1993</span>, Sahityotsav began
          its journey from the grassroots level as a family-centered literary festival, nurturing
          creativity, expression, and intellectual growth among students. Over the years, it has
          evolved into one of the most prestigious literary and cultural platforms in the country,
          progressing through units, sectors, divisions, districts, and state-level competitions
          before culminating at the national stage. Bringing together thousands of talented
          participants from across India, Sahityotsav serves as a vibrant space for young minds
          to showcase their literary, artistic, and intellectual abilities. Through a wide range
          of competitions and creative engagements, the festival continues to inspire generations
          of students, fostering a deep appreciation for literature, culture, critical thinking,
          and meaningful dialogue while preserving the rich heritage of knowledge and artistic
          excellence.
        </p>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-inner">

          <div className="footer-logo-wrap">
            <img src={logo} alt="Sahityotsav" />
          </div>

          <div className="footer-tagline">Celebrating Literary Excellence</div>

          <div className="footer-divider" />

          <nav className="footer-links">
            <a href="/">Home</a>
            <a href="/results">Results</a>
          </nav>

          <div className="footer-copy">
            © 2026 Sahityotsav — <span>32nd Edition</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;
