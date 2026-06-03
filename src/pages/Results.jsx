// src/pages/Results.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { supabase } from '../lib/supabase';
import Poster1 from '../components/Poster1';
import Poster2 from '../components/Poster2';
import Poster3 from '../components/Poster3';
import Poster4 from '../components/Poster4';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

// ─── POSTER CARD ─────────────────────────────────────────────────────────────
function PosterCard({ label, filename, children }) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!ref.current) return;
    setLoading(true);
    toPng(ref.current, { pixelRatio: 3, cacheBust: true })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="poster-card">
      <div className="poster-label">{label}</div>
      <div ref={ref} className="poster-wrapper">{children}</div>
      <button
        className={`download-btn ${loading ? 'loading' : ''}`}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? 'Preparing…' : '⬇ Download'}
      </button>
    </div>
  );
}

// ─── RESULTS PAGE ─────────────────────────────────────────────────────────────
export default function Results() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [programs, setPrograms]     = useState([]);
  const [winners, setWinners]       = useState([]);

  const [selCategory, setSelCategory] = useState(null);
  const [selProgram, setSelProgram]   = useState(null);

  const [loadingCats, setLoadingCats]       = useState(true);
  const [loadingProgs, setLoadingProgs]     = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').order('name')
      .then(({ data }) => { setCategories(data || []); setLoadingCats(false); });
  }, []);

  useEffect(() => {
    if (!selCategory) { setPrograms([]); setSelProgram(null); setWinners([]); return; }
    setLoadingProgs(true);
    setSelProgram(null);
    setWinners([]);
    supabase.from('programs').select('*').eq('category_id', selCategory.id).order('name')
      .then(({ data }) => { setPrograms(data || []); setLoadingProgs(false); });
  }, [selCategory]);

  useEffect(() => {
    if (!selProgram) { setWinners([]); return; }
    setLoadingResults(true);
    supabase.from('results').select('*').eq('program_id', selProgram.id).order('position')
      .then(({ data }) => { setWinners(data || []); setLoadingResults(false); });
  }, [selProgram]);

  const hasResults = winners.length > 0;

  return (
    <div className="results-page">

      {/* ── Top nav ─────────────────────────────────────── */}
      <div className="results-topnav">
        <button className="results-back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="results-nav-title">Results</div>
        <div style={{ width: 60 }} />
      </div>

      {/* ── Selectors ───────────────────────────────────── */}
      <div className="selectors">
        <div className="select-group">
          <label>CATEGORY</label>
          <div className="select-wrapper">
            <select
              value={selCategory?.id || ''}
              onChange={e => {
                const cat = categories.find(c => c.id === e.target.value);
                setSelCategory(cat || null);
              }}
              disabled={loadingCats}
            >
              <option value="">{loadingCats ? 'Loading…' : '— Select Category —'}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>

        <div className="select-group">
          <label>PROGRAM</label>
          <div className="select-wrapper">
            <select
              value={selProgram?.id || ''}
              onChange={e => {
                const prog = programs.find(p => p.id === e.target.value);
                setSelProgram(prog || null);
              }}
              disabled={!selCategory || loadingProgs}
            >
              <option value="">{loadingProgs ? 'Loading…' : '— Select Program —'}</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>
      </div>

      {/* ── States ──────────────────────────────────────── */}
      {!selCategory && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <p>Select a category to explore results</p>
        </div>
      )}
      {selCategory && !selProgram && !loadingProgs && (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <p>Now select a program</p>
        </div>
      )}
      {loadingResults && (
        <div className="empty-state">
          <div className="empty-spinner" />
          <p>Loading results…</p>
        </div>
      )}
      {selProgram && !loadingResults && !hasResults && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Results not yet announced</p>
        </div>
      )}

      {/* ── Results & Posters ───────────────────────────── */}
      {hasResults && !loadingResults && (
        <div className="posters-section">
          <div className="result-heading">
            <div className="result-label">RESULTS FOR</div>
            <div className="result-title">{selProgram.name}</div>
            <div className="result-category">{selCategory.name}</div>
          </div>

          {/* Quick winner list */}
          <div className="winners-quick-list">
            {winners.map((w, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={i} className="winner-quick-row">
                  <span className="winner-medal">{medals[i]}</span>
                  <div className="winner-info">
                    <span className="winner-name">{w.student_name}</span>
                    <span className="winner-unit">{w.unit_name}{w.grade ? ` · ${w.grade}` : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="posters-section-label">Download Posters</div>

          <div className="posters-grid">
            <PosterCard label="Design 1 — Gold & Navy" filename={`${selProgram.name}-design1.png`}>
              <Poster1 program={selProgram.name} category={selCategory.name} winners={winners} />
            </PosterCard>
            <PosterCard label="Design 2 — Editorial Red" filename={`${selProgram.name}-design2.png`}>
              <Poster2 program={selProgram.name} category={selCategory.name} winners={winners} />
            </PosterCard>
            <PosterCard label="Design 3 — Emerald Art Deco" filename={`${selProgram.name}-design3.png`}>
              <Poster3 program={selProgram.name} category={selCategory.name} winners={winners} />
            </PosterCard>
            <PosterCard label="Design 4 — Violet Gradient" filename={`${selProgram.name}-design4.png`}>
              <Poster4 program={selProgram.name} category={selCategory.name} winners={winners} />
            </PosterCard>
          </div>
        </div>
      )}
      
      
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
