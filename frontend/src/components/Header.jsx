import React from 'react';
import { useGame } from '../context/GameContext';
import { Home } from 'lucide-react';

export default function Header() {
  const { state, dispatch, SCREEN_STATES } = useGame();

  const handleHomeClick = () => {
    if (state.screen === SCREEN_STATES.LANDING) return;

    const needsConfirm = [
      SCREEN_STATES.ARENA, 
      SCREEN_STATES.EVALUATING, 
      SCREEN_STATES.RESULTS
    ].includes(state.screen);

    if (needsConfirm) {
      if (window.confirm('Are you sure you want to exit the current game? Your progress will be lost.')) {
        dispatch({ type: 'NAVIGATE_TO_LANDING' });
      }
    } else {
      dispatch({ type: 'NAVIGATE_TO_LANDING' });
    }
  };

  const getSubTitle = () => {
    switch (state.screen) {
      case SCREEN_STATES.LOBBY:
        return 'Local Multiplayer 1v1 Arena';
      case SCREEN_STATES.TOPIC_SELECT:
        return 'Select a Debate Topic';
      case SCREEN_STATES.ARENA:
        return 'Debate in Progress';
      case SCREEN_STATES.EVALUATING:
        return 'AI Judge is Deliberating...';
      case SCREEN_STATES.RESULTS:
        return 'Official AI Scorecard';
      default:
        return '';
    }
  };

  return (
    <header className="app-header glass-panel">
      <div className="header-container">
        <div className="brand-section" onClick={handleHomeClick} style={{ cursor: state.screen !== SCREEN_STATES.LANDING ? 'pointer' : 'default' }}>
          <div className="brand-logo-text">
            <span className="logo-first">fact</span>
            <span className="logo-second">arena</span>
            <span className="logo-dot">.</span>
          </div>
          <p className="header-subtitle">{getSubTitle()}</p>
        </div>

        <div className="header-actions">
          {state.screen !== SCREEN_STATES.LANDING && (
            <button 
              className="btn-header-action" 
              onClick={handleHomeClick}
              title="Return to Landing Page"
            >
              <Home size={20} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .app-header {
          border-radius: 0 0 16px 16px !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          padding: 16px 24px;
          margin-bottom: 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .brand-logo-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .logo-first {
          color: var(--accent-primary);
        }

        .logo-second {
          color: var(--text-primary);
        }

        .logo-dot {
          color: var(--accent-secondary);
        }

        .header-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-header-action {
          background: var(--bg-primary);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s;
        }

        .btn-header-action:hover {
          color: var(--text-primary);
          background: rgba(15, 23, 42, 0.04);
          border-color: var(--glass-border-hover);
          transform: translateY(-1px);
        }

        .btn-header-action.has-warning {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.05);
        }

        .warning-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent-warning);
          color: var(--bg-primary);
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-secondary);
          font-weight: bold;
        }

        .pulse-icon {
          animation: rotatePulse 4s infinite linear;
        }

        @keyframes rotatePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); color: var(--accent-warning); }
          100% { transform: scale(1); }
        }
      `}</style>
    </header>
  );
}
