import React, { useState } from 'react';
import ColdStartModal from './ColdStart';

const getIconContainerStyle = (borderColor) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  backgroundColor: '#0f172a',
  border: `1px solid ${borderColor}`, 
  borderRadius: '14px', 
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'transform 0.2s ease, opacity 0.2s ease',
});

const ChurnPredictor = () => {
  const [formData, setFormData] = useState({
    Tenure: '',
    WarehouseToHome: '',
    NumberOfDeviceRegistered: '',
    PreferedOrderCat: '',
    SatisfactionScore: '',
    MaritalStatus: '',
    NumberOfAddress: '',
    Complain: '',
    DaySinceLastOrder: '',
    CashbackAmount: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailedError, setDetailedError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServerWaking, setIsServerWaking] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    setDetailedError("");

    // setIsLoading(true);
    setIsServerWaking(false);
    const coldStartTimer = setTimeout(() => {
      setIsServerWaking(true);
    }, 3000);

    const cleanedData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key, value]) => String(value).trim() !== '') 
        
        .map(([key, value]) => [
          key,
          ['PreferedOrderCat', 'MaritalStatus'].includes(key) ? value.trim() : Number(value)
        ])
    );


    // const cleanedData = Object.fromEntries(
    //   Object.entries(formData).map(([key, value]) => [
    //     key,
    //     value === '' ? null : (['PreferedOrderCat', 'MaritalStatus'].includes(key) ? value : Number(value))
    //   ])
    // );

    setDetailedError("");
    try { 
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data
        // throw new Error(data.detail?.[0]?.msg || data.detail || 'Failed to get prediction');
      }

      setPrediction(data['predicted probablity that customer churns']);
    } catch (err) {
      if (err?.detail && Array.isArray(err.detail)) {
        
        const combinedErrorMessage = err.detail
          .map(itemm => `${itemm.loc[1]} : ${itemm.msg}`)
          .join("\n"); 

        
        setDetailedError(combinedErrorMessage);
      } else {
        setDetailedError("An unexpected error occurred.");
      }
      // setError(err.message);
    } finally {
      setLoading(false);
      clearTimeout(coldStartTimer);
      // setIsLoading(false);
      setIsServerWaking(false);
    }
  };

  const filledCount = Object.values(formData).filter(v => v !== '').length;
  const totalFields = Object.keys(formData).length;
  const fillPercent = Math.round((filledCount / totalFields) * 100);

  const getRiskLevel = (prob) => {
    if (prob < 25) return { label: 'Low Risk', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' };
    if (prob < 60) return { label: 'Medium Risk', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' };
    return { label: 'High Risk', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
  };

  const numericFields = [
    { name: 'Tenure', label: 'Tenure', unit: 'months'},
    { name: 'WarehouseToHome', label: 'Warehouse Distance', unit: 'km'},
    { name: 'NumberOfDeviceRegistered', label: 'Registered Devices', unit: 'count'},
    { name: 'SatisfactionScore', label: 'Satisfaction Score', unit: '1–5' },
    { name: 'NumberOfAddress', label: 'No. of Saved Addresses', unit: 'count' },
    { name: 'DaySinceLastOrder', label: 'Days Since Last Order', unit: 'days' },
    { name: 'CashbackAmount', label: 'Avg. Cashback', unit: 'Dollars' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2rem 1rem',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .input-field {
          width: 100%;
          padding: 0.6rem 0.85rem;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: #f1f5f9;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
          appearance: none;
          -webkit-appearance: none;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.3); }
        .input-field:focus {
          border-color: #f97316;
          background: rgba(249, 115, 22, 0.08);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.15);
        }
        .input-field option {
          background: #1e3a5f;
          color: #f1f5f9;
        }

        .field-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0.9rem 1rem;
          transition: border-color 0.2s;
        }
        .field-card:focus-within {
          border-color: rgba(249,115,22,0.4);
        }

        .submit-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #fb923c, #f97316);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(249,115,22,0.4);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .progress-bar-inner {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #f97316);
          border-radius: 9999px;
          transition: width 0.4s ease;
        }

        .result-ring {
          animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes pop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        .label-text {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.45);
          margin-bottom: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .section-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 1.5rem 0;
        }

        .badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 600;
        }
      `}</style>


      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ position:'relative', textAlign: 'center', marginBottom: '2rem' }}>

          <div style={{
            position : 'absolute',left: '-100px',top: '-10px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(63, 192, 197, 0.15)', border: '1px solid rgba(3, 118, 185, 0.3)',
            borderRadius: '9px', padding: '0.3rem 0.9rem', marginBottom: '1rem',
          }}>
            {/* <span style={{ width: 7, height: 7, borderRadius: '0%', background: '#7294b0', display: 'inline-block' }}></span> */}
            <span style={{ color: '#2cb2a2', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
             CONNECT
            </span>
            <br/>
            <a href="https://www.linkedin.com/in/maaz-khan-63100b313/" target="_blank" rel="noreferrer" 
             style={getIconContainerStyle('rgba(10, 102, 194, 0.3)')}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#0a66c2">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            </a>

            {/* Email Link */}
          <a href="mailto:kmaaz7256@gmail.com" 
             style={getIconContainerStyle('rgba(16, 185, 129, 0.3)')}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#10b981">
            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.833l5.567-6.812zm9.201-1.264l4.623-3.747v9.458l-4.623-5.711z"/>
            </svg>
          </a>

          <a href="https://github.com/maaz7409" target="_blank" rel="noreferrer" 
            style={getIconContainerStyle('rgba(226, 232, 240, 0.2)')}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#e2e8f0">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: '999px', padding: '0.3rem 0.9rem', marginBottom: '1rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', display: 'inline-block' }}></span>
            <span style={{ color: '#fb923c', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              ML-POWERED PREDICTIONS...
            </span>
          </div>

          <div style={{
            position : 'absolute',right: '-100px',top: '-10px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(63, 192, 197, 0.15)', border: '1px solid rgba(3, 118, 185, 0.3)',
            borderRadius: '9px', padding: '0.3rem 0.9rem', marginBottom: '1rem',
          }}>
            {/*<span style={{ width: 7, height: 7, borderRadius: '0%', background: '#7294b0', display: 'inline-block' }}></span>*/}
            <span style={{ color: '#2cb2a2', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
             MORE ABOUT PROJECT
            </span>
            <br/>
            <a href="https://github.com/maaz7409/customer-churn-predictor" target="_blank" rel="noreferrer" 
            style={getIconContainerStyle('rgba(226, 232, 240, 0.2)')}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#e2e8f0">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            </a>
          </div>
        
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: '#f8fafc',
            margin: 0,
            lineHeight: 1.2,
          }}>
            <span style={{ color: '#b1a297' }}>E-Commerce</span>{' '}
            Customer Churn{' '}
            <span style={{ color: '#f97316' }}>Predictor</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: '0.6rem', fontSize: '0.9rem' }}>
            Enter customer data below to estimate churn probability
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}>

          {/* Progress bar */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 500 }}>
                Fields filled
              </span>
              <span style={{ color: filledCount >= 4 ? '#f97316' : 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 600 }}>
                {filledCount} / {totalFields}
                {filledCount >= 7 && <span style={{ marginLeft: '0.4rem', color: '#22c55e' }}>✓ Ready</span>}
              </span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div className="progress-bar-inner" style={{ width: `${fillPercent}%` }}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Behavioral Section */}
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                Behavioral Data
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
                {numericFields.map((field) => (
                  <div key={field.name} className="field-card">
                    <div className="label-text" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      <span>{field.icon}</span> {field.label}
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
                        {field.unit}
                      </span>
                    </div>
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      step="any"
                      min="0"
                      className="input-field"
                      placeholder="—"
                      style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="section-divider" />

            {/* Profile Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                Customer Profile
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>

                <div className="field-card">
                  <div className="label-text" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Preferred Category</div>
                  <select name="PreferedOrderCat" value={formData.PreferedOrderCat} onChange={handleChange} className="input-field">
                    <option value="">Select…</option>
                    <option value="Laptop & Accessory">Laptop & Accessory</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="field-card">
                  <div className="label-text" style={{ color: 'rgba(255, 255, 255, 0.6)' }} >Marital Status</div>
                  <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} className="input-field">
                    <option value="">Select…</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>

                <div className="field-card">
                  <div className="label-text" style={{ color: 'rgba(255, 255, 255, 0.6)' }} >Complaint Last Month?</div>
                  <select name="Complain" value={formData.Complain} onChange={handleChange} className="input-field">
                    <option value="">Select…</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginBottom: '1.25rem' }}>
              All fields are optional — fill at least 7 for a decent estimate.
            </p>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                    </path>
                  </svg>
                  Analyzing customer data…
                </span>
              ) : (
                '→  Predict Churn Probability'
              )}
            </button>
          </form>

          {/* Error */}
          {detailedError && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              whiteSpace: "pre-wrap"
            }}>
              <span style={{ fontSize: '1.1rem', marginTop: '0.05rem' }}></span> 
              <div>
                <p style={{ textAlign : 'left' ,color: '#fca5a5', fontWeight: 600, margin: 0, fontSize: '0.85rem' }}>Prediction failed</p>
                <p style={{ color: 'rgba(252,165,165,0.7)', margin: '0.2rem 0 0', fontSize: '0.8rem' }}>{detailedError}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {prediction !== null && !error && (() => {
            const risk = getRiskLevel(prediction);
            const circumference = 2 * Math.PI * 44;
            const dashOffset = circumference * (1 - prediction / 100);
            return (
              <div className="result-ring" style={{
                marginTop: '1.5rem',
                padding: '1.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
                flexWrap: 'wrap',
              }}>

                {/* Ring */}
                <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0, margin: '0 auto' }}>
                  <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                    <circle
                      cx="55" cy="55" r="44" fill="none"
                      stroke={risk.color}
                      strokeWidth="9"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                      {prediction.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.4rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                      CHURN RISK
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ marginLeft:'auto',marginRight:'200px', background: risk.color + '22', color: risk.color, border: `1px solid ${risk.color}44` }}>
                      {risk.label}
                    </span>
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {prediction.toFixed(2)}% probability of churning
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                    {prediction < 25
                      ? 'This customer appears stable.... Keep em engaged!'
                      : prediction < 60
                      ? 'Moderate churn risk detected. Consider re-engagement...'
                      : 'High churn risk. Take some retention action...'}
                  </p>
                </div>

              </div>
            );
          })()}


        </div>

        <ColdStartModal isVisible={isServerWaking} />
        
        <div style={{
            // position : 'absolute',right: '-40px',top: '-10px', 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(199, 202, 21, 0.25)', border: '1px solid rgba(3, 118, 185, 0.3)',
            borderRadius: '9px', padding: '0.3rem 0.9rem', marginBottom: '1rem',  marginTop: '2rem',
          }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem', marginTop: '0.4rem', marginBottom: '0.5rem' }}>
            <b> ⚠️ NOTE : </b> Predictions are model estimates, should be used alongside human judgment.
          </p>
          <button 
          onClick={() => setIsModalOpen(true)}
          type="submit" disabled={loading} className="submit-btn"
          style={{
            width: '20%',
            background: 'rgba(210, 84, 84, 0.42)', 
            color: '#ffffff', 
            border: '1px solid rgba(186, 42, 42, 0.54)',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginLeft: '1rem',
            whiteSpace: 'nowrap',
            //transition: 'all 0.2s ease'
          }}
          >
          What ?
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', marginTop: '0.5rem' }}>
          Confidence scores will be added soon.
        </p>
      </div>

    {/* The Popup Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999, // 
          backdropFilter: 'blur(2.5px)' 
        }}>
          {/* Modal Content Box */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            
            {/* Close 'X' Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.5rem',
                cursor: 'pointer'

              }}
            >
              &times;
            </button>

            {/* Modal Content */}
            <h3 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '1rem' }}>
              Model Interpretability
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
              This churn probability is calculated using an ensemble machine learning approach (specifically, ensemble of KNN, SVM, RandomForest & XGBoost). 
              The model assigns varying weights to specific features such as tenure, cashback amount, and satisfaction score. 
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '1rem' }}>
              While the convergence properties of the underlying network provide a mathematically robust estimation, these percentages represent statistical likelihoods rather than deterministic outcomes.
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '1rem' }}>
              Furthermore, this model was trained on an incomplete, small dataset of about 3200 instances and tested on about 800 instances. It purely depends on how data was sampled, and maybe a bias or representative of population accordingly. 
            </p>

            <div style={{
            position : 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(63, 192, 197, 0.15)', border: '1px solid rgba(3, 118, 185, 0.3)',
            borderRadius: '9px', padding: '0.3rem 0.9rem', marginBottom: '0.3rem', marginTop:'1rem',
          }}>
            {/*<span style={{ width: 7, height: 7, borderRadius: '0%', background: '#7294b0', display: 'inline-block' }}></span>*/}
            <span style={{ color: '#2cb2a2', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
             Learn more about this project on github  &rarr; 
            </span>
            {/* <br/> */}
            <a href="https://github.com/maaz7409/customer-churn-predictor" target="_blank" rel="noreferrer" 
            style={getIconContainerStyle('rgba(226, 232, 240, 0.2)')}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#e2e8f0">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            </a>
          </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default ChurnPredictor;