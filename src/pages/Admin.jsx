// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = 'sahityotsav2026'; // Change this!

export default function Admin() {
  const [authed, setAuthed]     = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError]   = useState(false);

  // ── Data ────────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms]     = useState([]);
  const [existingResults, setExistingResults] = useState([]);

  const [selCategory, setSelCategory] = useState(null);
  const [selProgram, setSelProgram]   = useState(null);

  // Form rows: [{ position, student_name, unit_name, grade }]
  const [rows, setRows] = useState([
    { position: 1, student_name: '', unit_name: '', grade: '' },
    { position: 2, student_name: '', unit_name: '', grade: '' },
    { position: 3, student_name: '', unit_name: '', grade: '' },
  ]);

  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError]     = useState('');

  // ── Fetch categories on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    supabase.from('categories').select('*').order('name')
      .then(({ data }) => setCategories(data || []));
  }, [authed]);

  // ── Fetch programs when category changes ─────────────────────────────────────
  useEffect(() => {
    if (!selCategory) { setPrograms([]); setSelProgram(null); return; }
    supabase.from('programs').select('*').eq('category_id', selCategory.id).order('name')
      .then(({ data }) => setPrograms(data || []));
    setSelProgram(null);
    resetRows();
  }, [selCategory]);

  // ── Fetch existing results when program changes ──────────────────────────────
  useEffect(() => {
    if (!selProgram) { resetRows(); return; }
    supabase.from('results').select('*').eq('program_id', selProgram.id).order('position')
      .then(({ data }) => {
        setExistingResults(data || []);
        // Pre-fill form with existing data
        const filled = [1, 2, 3].map(pos => {
          const found = (data || []).find(r => r.position === pos);
          return found
            ? { position: pos, student_name: found.student_name, unit_name: found.unit_name, grade: found.grade }
            : { position: pos, student_name: '', unit_name: '', grade: '' };
        });
        setRows(filled);
      });
  }, [selProgram]);

  const resetRows = () => setRows([
    { position: 1, student_name: '', unit_name: '', grade: '' },
    { position: 2, student_name: '', unit_name: '', grade: '' },
    { position: 3, student_name: '', unit_name: '', grade: '' },
  ]);

  const updateRow = (index, field, value) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selProgram) return;
    setSaving(true);
    setError('');
    setSaveMsg('');

    try {
      // Delete existing results for this program
      await supabase.from('results').delete().eq('program_id', selProgram.id);

      // Insert only rows that have a student name
      const toInsert = rows
        .filter(r => r.student_name.trim())
        .map(r => ({
          program_id:   selProgram.id,
          position:     r.position,
          student_name: r.student_name.trim(),
          unit_name:    r.unit_name.trim(),
          grade:        r.grade.trim(),
        }));

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from('results').insert(toInsert);
        if (insertError) throw insertError;
      }

      setSaveMsg('✓ Saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete all results for a program ─────────────────────────────────────────
  const handleClear = async () => {
    if (!selProgram) return;
    if (!window.confirm('Clear all results for this program?')) return;
    await supabase.from('results').delete().eq('program_id', selProgram.id);
    resetRows();
    setSaveMsg('Cleared.');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  // ── Login ────────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <div className="admin-login-title">Admin Panel</div>
          <div className="admin-login-sub">Sahityotsav 2026</div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`admin-input ${pwError ? 'error' : ''}`}
          />
          {pwError && <div className="admin-error">Incorrect password</div>}
          <button className="admin-save-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  // ── Panel ────────────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-title">Admin Panel</div>
        <div className="admin-sub">Sahityotsav 2026 — Set Winners</div>
        <button className="admin-logout" onClick={() => setAuthed(false)}>Logout</button>
      </div>

      <div className="admin-form">
        {/* Category & Program selectors */}
        <div className="admin-row">
          <div className="admin-field">
            <label>Category</label>
            <select value={selCategory?.id || ''} onChange={e => setSelCategory(categories.find(c => c.id === e.target.value) || null)}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Program</label>
            <select value={selProgram?.id || ''} onChange={e => setSelProgram(programs.find(p => p.id === e.target.value) || null)} disabled={!selCategory}>
              <option value="">Select Program</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Winner rows */}
        {selProgram && (
          <>
            <div className="admin-winners">
              {rows.map((row, i) => {
                const medals = ['🥇 First Place', '🥈 Second Place', '🥉 Third Place'];
                return (
                  <div key={i} className="admin-winner-row">
                    <div className="admin-winner-label">{medals[i]}</div>
                    <div className="admin-winner-fields">
                      <input
                        type="text"
                        placeholder="Student name"
                        value={row.student_name}
                        onChange={e => updateRow(i, 'student_name', e.target.value)}
                        className="admin-input"
                      />
                      <input
                        type="text"
                        placeholder="Unit name"
                        value={row.unit_name}
                        onChange={e => updateRow(i, 'unit_name', e.target.value)}
                        className="admin-input"
                      />
                      <input
                        type="text"
                        placeholder="Grade (e.g. A, A+)"
                        value={row.grade}
                        onChange={e => updateRow(i, 'grade', e.target.value)}
                        className="admin-input admin-input-small"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {error   && <div className="admin-error-msg">{error}</div>}
            {saveMsg && <div className="admin-success-msg">{saveMsg}</div>}

            <div className="admin-actions">
              <button className="admin-clear-btn" onClick={handleClear}>Clear</button>
              <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Results'}
              </button>
            </div>
          </>
        )}

        {/* Overview of all results */}
        <AdminOverview categories={categories} />
      </div>
    </div>
  );
}

// ── Overview component ────────────────────────────────────────────────────────
function AdminOverview({ categories }) {
  const [overview, setOverview] = useState({}); // { category_id: { program_id: count } }

  useEffect(() => {
    if (!categories.length) return;
    // Fetch all programs
    supabase.from('programs').select('*').then(async ({ data: progs }) => {
      if (!progs) return;
      // Fetch all results
      const { data: results } = await supabase.from('results').select('program_id');
      const countMap = {};
      (results || []).forEach(r => {
        countMap[r.program_id] = (countMap[r.program_id] || 0) + 1;
      });
      // Build overview: { cat_id: [{ prog, count }] }
      const ov = {};
      progs.forEach(p => {
        if (!ov[p.category_id]) ov[p.category_id] = [];
        ov[p.category_id].push({ prog: p, count: countMap[p.id] || 0 });
      });
      setOverview(ov);
    });
  }, [categories]);

  if (!categories.length) return null;

  return (
    <div className="admin-overview">
      <div className="admin-overview-title">All Programs</div>
      {categories.map(cat => (
        <div key={cat.id} className="admin-overview-cat">
          <div className="admin-overview-cat-name">{cat.name}</div>
          {(overview[cat.id] || []).map(({ prog, count }) => (
            <div key={prog.id} className={`admin-overview-row ${count > 0 ? 'has-result' : ''}`}>
              <span className="admin-overview-prog">{prog.name}</span>
              <span className="admin-overview-status">{count > 0 ? `${count} result${count > 1 ? 's' : ''}` : 'Not set'}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
