import React, { useEffect, useState } from 'react';
import { Award, Check, TrendingUp } from 'lucide-react';

export default function ScoreCard({ scores, winner, playerNames }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Delay animation start slightly for smoother entry
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const criteria = [
    { key: 'relevance', label: 'Relevance', description: 'Staying on topic and answering prompt' },
    { key: 'logic', label: 'Logical Reasoning', description: 'Structure, facts, and coherent flow' },
    { key: 'persuasiveness', label: 'Persuasiveness', description: 'Rhetoric, impact, and conviction' },
    { key: 'counterarguments', label: 'Counterarguments', description: 'Rebutting opponent points' }
  ];

  const getWinnerEmoji = (pA, pB) => {
    if (pA > pB) return '🏆';
    if (pB > pA) return '🏆';
    return '';
  };

  return (
    <div className="scorecard-wrapper animate-fade-in">
      <div className="overall-summary glass-panel">
        <div className="overall-player-score player-a">
          <div className="overall-avatar" style={{ backgroundColor: 'var(--color-player-a)' }}>
            A
          </div>
          <span className="overall-name">{playerNames.playerA}</span>
          <div className="overall-number">{scores.playerA.overall.toFixed(1)}</div>
          {winner === 'playerA' && <span className="winner-ribbon">WINNER</span>}
        </div>

        <div className="vs-sign">VS</div>

        <div className="overall-player-score player-b">
          <div className="overall-avatar" style={{ backgroundColor: 'var(--color-player-b)' }}>
            B
          </div>
          <span className="overall-name">{playerNames.playerB}</span>
          <div className="overall-number">{scores.playerB.overall.toFixed(1)}</div>
          {winner === 'playerB' && <span className="winner-ribbon">WINNER</span>}
        </div>
      </div>

      <div className="criteria-breakdown glass-panel">
        <h3 className="breakdown-title">
          <TrendingUp size={18} className="title-icon" />
          <span>Metric Comparison</span>
        </h3>

        <div className="criteria-list">
          {criteria.map((c) => {
            const valA = scores.playerA[c.key];
            const valB = scores.playerB[c.key];
            const maxVal = Math.max(valA, valB);

            return (
              <div key={c.key} className="criteria-row">
                <div className="criteria-info">
                  <span className="criteria-name">{c.label}</span>
                  <span className="criteria-desc">{c.description}</span>
                </div>

                <div className="bars-comparison">
                  {/* Player A Bar */}
                  <div className="player-bar-container">
                    <span className={`bar-value ${valA === maxVal && valA !== valB ? 'highest' : ''}`}>
                      {valA}
                    </span>
                    <div className="bar-track">
                      <div 
                        className="bar-fill player-a-fill"
                        style={{ 
                          width: animate ? `${valA}%` : '0%',
                          backgroundColor: 'var(--color-player-a)',
                          boxShadow: valA === maxVal && valA !== valB ? '0 0 10px rgba(139, 92, 246, 0.4)' : 'none'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Player B Bar */}
                  <div className="player-bar-container align-right">
                    <div className="bar-track">
                      <div 
                        className="bar-fill player-b-fill"
                        style={{ 
                          width: animate ? `${valB}%` : '0%',
                          backgroundColor: 'var(--color-player-b)',
                          boxShadow: valB === maxVal && valA !== valB ? '0 0 10px rgba(6, 182, 212, 0.4)' : 'none'
                        }}
                      ></div>
                    </div>
                    <span className={`bar-value ${valB === maxVal && valA !== valB ? 'highest' : ''}`}>
                      {valB}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .scorecard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .overall-summary {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .overall-player-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 40%;
          position: relative;
        }

        .overall-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .overall-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .overall-number {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
        }

        .player-a .overall-number {
          color: var(--color-player-a);
        }

        .player-b .overall-number {
          color: var(--color-player-b);
        }

        .winner-ribbon {
          position: absolute;
          top: -10px;
          background: var(--accent-success);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 5px rgba(16, 185, 129, 0.3);
        }

        .vs-sign {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(15, 23, 42, 0.03);
          border: 1px solid var(--glass-border);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .criteria-breakdown {
          padding: 24px;
        }

        .breakdown-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          padding-bottom: 12px;
          color: var(--text-primary);
        }

        .title-icon {
          color: var(--accent-secondary);
        }

        .criteria-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .criteria-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .criteria-info {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .criteria-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .criteria-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .bars-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .player-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .player-bar-container.align-right {
          justify-content: flex-end;
        }

        .bar-value {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          min-width: 20px;
        }

        .bar-value.highest {
          color: var(--text-primary);
          font-weight: 800;
        }

        .bar-track {
          flex: 1;
          height: 6px;
          background: rgba(15, 23, 42, 0.06);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          width: 0%;
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Adjustments for right bar to grow towards the left for mirroring */
        .player-b-fill {
          float: left;
        }

        @media (max-width: 600px) {
          .bars-comparison {
            gap: 12px;
          }
          .criteria-info {
            flex-direction: column;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
}
