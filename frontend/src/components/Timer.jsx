import React from 'react';
import { useGame } from '../context/GameContext';
import { Play, Pause } from 'lucide-react';

export default function Timer() {
  const { state } = useGame();
  const { playerA, playerB, activePlayer } = state;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPercentage = (time) => (time / 60) * 100;
  const isLowTime = (time) => time <= 15;

  const renderPill = (player, playerId) => {
    const isActive = activePlayer === playerId;
    const isExpired = player.time === 0;
    const low = isLowTime(player.time) && player.time > 0;

    return (
      <div
        className={`timer-pill ${isActive ? 'active' : ''} ${isExpired ? 'expired' : ''}`}
        style={{
          '--player-color': player.color,
          borderColor: isActive ? player.color : undefined,
          background: isActive ? `${player.color}08` : undefined,
        }}
      >
        <div
          className="pill-badge"
          style={{ backgroundColor: player.color }}
        >
          {playerId === 'playerA' ? 'A' : 'B'}
        </div>

        <div className="pill-info">
          <span className="pill-name">{player.name || (playerId === 'playerA' ? 'Player A' : 'Player B')}</span>
          <span className="pill-status">
            {isExpired ? (
              <span className="status-expired">Out of time</span>
            ) : isActive ? (
              <span className="status-thinking" style={{ color: player.color }}>
                <Play size={9} fill="currentColor" /> Thinking
              </span>
            ) : (
              <span className="status-waiting">
                <Pause size={9} /> Waiting
              </span>
            )}
          </span>
        </div>

        <div className="pill-right">
          <div className={`pill-digits ${low ? 'low-time' : ''}`} style={{ color: isActive && !low ? player.color : undefined }}>
            {formatTime(player.time)}
          </div>
          <div className="pill-track">
            <div
              className={`pill-fill ${low ? 'fill-danger' : ''}`}
              style={{
                width: `${getPercentage(player.time)}%`,
                backgroundColor: !low ? player.color : undefined,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pill-timers-container animate-fade-in">
      {renderPill(playerA, 'playerA')}
      {renderPill(playerB, 'playerB')}

      <style>{`
        .pill-timers-container {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .timer-pill {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 40px;
          border: 1.5px solid var(--glass-border);
          background: var(--bg-secondary);
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }

        .timer-pill.active {
          box-shadow: 0 4px 16px -4px color-mix(in srgb, var(--player-color) 30%, transparent);
        }

        .timer-pill.expired {
          opacity: 0.6;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }

        .pill-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.75rem;
          color: #fff;
          flex-shrink: 0;
        }

        .pill-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .pill-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pill-status {
          font-size: 0.7rem;
          display: flex;
          align-items: center;
        }

        .status-thinking {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          letter-spacing: 0.03em;
          animation: textPulse 1.5s infinite alternate;
        }

        .status-waiting {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
        }

        .status-expired {
          color: var(--accent-danger);
          font-weight: 600;
        }

        .pill-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }

        .pill-digits {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
          line-height: 1;
          transition: color 0.3s ease;
        }

        .pill-digits.low-time {
          color: var(--accent-danger) !important;
          animation: textFlash 1s infinite alternate;
        }

        .pill-track {
          width: 64px;
          height: 3px;
          border-radius: 2px;
          background: rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .pill-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s linear;
        }

        .fill-danger {
          background-color: var(--accent-danger) !important;
        }

        @keyframes textPulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }

        @keyframes textFlash {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }

        @media (max-width: 600px) {
          .pill-timers-container {
            flex-direction: column;
            gap: 8px;
          }

          .timer-pill {
            border-radius: 14px;
          }

          .pill-track {
            width: 48px;
          }
        }
      `}</style>
    </div>
  );
}