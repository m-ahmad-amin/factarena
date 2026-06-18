import React from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Play, Pause } from 'lucide-react';

export default function Timer() {
  const { state } = useGame();
  const { playerA, playerB, activePlayer } = state;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPercentage = (time) => {
    return (time / 60) * 100;
  };

  const isLowTime = (time) => time <= 15;

  return (
    <div className="chess-timers-container animate-fade-in">
      {/* Player A Timer */}
      <div 
        className={`timer-card glass-panel ${activePlayer === 'playerA' ? 'active' : ''} ${playerA.time === 0 ? 'expired' : ''}`}
        style={{ 
          '--player-color': playerA.color,
          '--glow-color': activePlayer === 'playerA' ? 'rgba(139, 92, 246, 0.25)' : 'transparent'
        }}
      >
        <div className="timer-header">
          <span className="player-badge" style={{ backgroundColor: playerA.color }}>A</span>
          <span className="player-name">{playerA.name || 'Player A'}</span>
        </div>
        
        <div className={`timer-digits ${isLowTime(playerA.time) && playerA.time > 0 ? 'low-time' : ''}`}>
          {formatTime(playerA.time)}
        </div>

        <div className="timer-progress-track">
          <div 
            className={`timer-progress-bar ${isLowTime(playerA.time) ? 'bg-danger' : ''}`} 
            style={{ width: `${getPercentage(playerA.time)}%`, backgroundColor: !isLowTime(playerA.time) ? playerA.color : undefined }}
          ></div>
        </div>

        <div className="timer-status">
          {activePlayer === 'playerA' && playerA.time > 0 && (
            <span className="status-label pulse-text">
              <Play size={12} fill="currentColor" /> THINKING
            </span>
          )}
          {activePlayer !== 'playerA' && playerA.time > 0 && (
            <span className="status-label text-muted">
              <Pause size={12} /> WAITING
            </span>
          )}
          {playerA.time === 0 && (
            <span className="status-label text-danger font-bold">
              OUT OF TIME
            </span>
          )}
        </div>
      </div>

      {/* Divider / Clock Icon */}
      <div className="timers-divider">
        <div className="divider-icon-wrapper">
          <Clock size={20} className={activePlayer ? 'ticking-clock' : ''} />
        </div>
      </div>

      {/* Player B Timer */}
      <div 
        className={`timer-card glass-panel ${activePlayer === 'playerB' ? 'active' : ''} ${playerB.time === 0 ? 'expired' : ''}`}
        style={{ 
          '--player-color': playerB.color,
          '--glow-color': activePlayer === 'playerB' ? 'rgba(6, 182, 212, 0.25)' : 'transparent'
        }}
      >
        <div className="timer-header">
          <span className="player-badge" style={{ backgroundColor: playerB.color }}>B</span>
          <span className="player-name">{playerB.name || 'Player B'}</span>
        </div>
        
        <div className={`timer-digits ${isLowTime(playerB.time) && playerB.time > 0 ? 'low-time' : ''}`}>
          {formatTime(playerB.time)}
        </div>

        <div className="timer-progress-track">
          <div 
            className={`timer-progress-bar ${isLowTime(playerB.time) ? 'bg-danger' : ''}`} 
            style={{ width: `${getPercentage(playerB.time)}%`, backgroundColor: !isLowTime(playerB.time) ? playerB.color : undefined }}
          ></div>
        </div>

        <div className="timer-status">
          {activePlayer === 'playerB' && playerB.time > 0 && (
            <span className="status-label pulse-text">
              <Play size={12} fill="currentColor" /> THINKING
            </span>
          )}
          {activePlayer !== 'playerB' && playerB.time > 0 && (
            <span className="status-label text-muted">
              <Pause size={12} /> WAITING
            </span>
          )}
          {playerB.time === 0 && (
            <span className="status-label text-danger font-bold">
              OUT OF TIME
            </span>
          )}
        </div>
      </div>

      <style>{`
        .chess-timers-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
        }

        .timer-card {
          padding: 18px;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 6px -1px var(--glass-shadow), 0 2px 4px -2px var(--glass-shadow);
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .timer-card.active {
          border-color: var(--player-color);
          box-shadow: 0 8px 25px var(--glow-color);
          background: var(--bg-secondary);
        }

        .timer-card.expired {
          border-color: rgba(239, 68, 68, 0.2);
          opacity: 0.7;
        }

        .timer-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .player-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.75rem;
          color: #fff;
        }

        .player-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .timer-digits {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          margin-bottom: 10px;
          line-height: 1;
        }

        .timer-digits.low-time {
          color: var(--accent-danger);
          animation: textFlash 1s infinite alternate;
        }

        .timer-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(15, 23, 42, 0.06);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .timer-progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 1s linear;
        }

        .bg-danger {
          background-color: var(--accent-danger) !important;
        }

        .timer-status {
          display: flex;
          align-items: center;
          height: 18px;
        }

        .status-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .pulse-text {
          color: var(--player-color);
          animation: textPulse 1.5s infinite alternate;
        }

        .timers-divider {
          display: flex;
          justify-content: center;
        }

        .divider-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.03);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .ticking-clock {
          animation: tickTock 1s infinite linear;
          color: var(--text-secondary);
        }

        @keyframes textPulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }

        @keyframes textFlash {
          from { opacity: 0.4; }
          to { opacity: 1; filter: drop-shadow(0 0 4px var(--accent-danger)); }
        }

        @keyframes tickTock {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }

        @media (max-width: 600px) {
          .chess-timers-container {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .timers-divider {
            display: none;
          }

          .timer-digits {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
