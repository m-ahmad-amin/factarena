import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, ArrowRight, ShieldAlert } from 'lucide-react';

export default function WelcomeScreen() {
  const { state, dispatch } = useGame();
  const [nameA, setNameA] = useState(state.playerA.name);
  const [nameB, setNameB] = useState(state.playerB.name);
  const [error, setError] = useState('');

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().substring(0, 2).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanA = nameA.trim();
    const cleanB = nameB.trim();

    if (!cleanA || !cleanB) {
      setError('Both players must enter their names to enter the arena.');
      return;
    }

    if (cleanA.toLowerCase() === cleanB.toLowerCase()) {
      setError('Each competitor must have a unique name.');
      return;
    }

    dispatch({ 
      type: 'SET_PLAYERS', 
      payload: { playerA: cleanA, playerB: cleanB } 
    });
  };

  return (
    <div className="welcome-screen-container container animate-fade-in">
      <div className="lobby-header-section">
        <h2 className="lobby-title">Competitor Setup</h2>
        <p className="lobby-subtitle">Assign your names to register for the official AI-judged debate.</p>
      </div>

      <form onSubmit={handleSubmit} className="welcome-form">
        <div className="lobby-cards-grid">
          {/* Player A Setup Card */}
          <div className="lobby-player-card glass-panel" style={{ '--accent-color': 'var(--color-player-a)' }}>
            <div className="player-avatar-preview" style={{ backgroundColor: 'var(--color-player-a)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
              {getInitials(nameA)}
            </div>
            
            <div className="player-card-body">
              <label htmlFor="playerAName" className="player-field-label">Competitor A</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" style={{ color: 'var(--color-player-a)' }} />
                <input
                  id="playerAName"
                  type="text"
                  maxLength={12}
                  placeholder="Competitor Name..."
                  className="input-field"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Player B Setup Card */}
          <div className="lobby-player-card glass-panel" style={{ '--accent-color': 'var(--color-player-b)' }}>
            <div className="player-avatar-preview" style={{ backgroundColor: 'var(--color-player-b)', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>
              {getInitials(nameB)}
            </div>
            
            <div className="player-card-body">
              <label htmlFor="playerBName" className="player-field-label">Competitor B</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" style={{ color: 'var(--color-player-b)' }} />
                <input
                  id="playerBName"
                  type="text"
                  maxLength={12}
                  placeholder="Competitor Name..."
                  className="input-field"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="lobby-error-alert animate-fade-in">
            <ShieldAlert size={16} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}


        <div className="lobby-submit-row">
          <button type="submit" className="btn btn-primary btn-lobby-submit">
            <span>Select Debate Topic</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <style>{`
        .welcome-screen-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          max-width: 720px !important;
        }

        .lobby-header-section {
          margin-bottom: 36px;
          text-align: center;
        }

        .lobby-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .lobby-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .welcome-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .lobby-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          width: 100%;
        }

        .lobby-player-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
          border-radius: 20px;
          position: relative;
          background: var(--bg-secondary);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--glass-border);
        }

        .lobby-player-card:hover {
          border-color: var(--accent-color);
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
        }

        .lobby-player-card:hover .player-avatar-preview {
          transform: scale(1.08);
        }

        .lobby-player-card[style*='var(--color-player-a)'] .input-field:focus {
          border-color: var(--color-player-a);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
        }

        .lobby-player-card[style*='var(--color-player-b)'] .input-field:focus {
          border-color: var(--color-player-b);
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
        }

        .player-avatar-preview {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .player-card-body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .player-field-label {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          pointer-events: none;
        }

        .input-with-icon .input-field {
          padding-left: 42px;
        }

        .lobby-error-alert {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--accent-danger);
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 14px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .api-config-hint {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 14px;
          text-align: left;
        }

        .hint-icon {
          color: var(--accent-primary);
          margin-top: 3px;
          flex-shrink: 0;
        }

        .api-config-hint p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .api-config-hint strong {
          color: var(--text-primary);
          display: block;
          margin-bottom: 2px;
        }

        .lobby-submit-row {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .btn-lobby-submit {
          padding: 14px 40px;
          font-size: 1rem;
          box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.2);
          border-radius: 12px;
          width: 100%;
          max-width: 320px;
        }

        @media (max-width: 600px) {
          .lobby-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .lobby-player-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
