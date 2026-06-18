import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import ScoreCard from '../components/ScoreCard';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, Users, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export default function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { evaluation, playerA, playerB } = state;
  const [activeFeedbackTab, setActiveFeedbackTab] = useState('playerA');

  const { winner, scores, verdict, feedback } = evaluation || {};

  // Confetti pop on victory!
  useEffect(() => {
    if (winner === 'tie') return;

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 28, spread: 360, ticks: 60, zIndex: 999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 45 * (timeLeft / duration);
      
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      });
    }, 250);

    return () => clearInterval(interval);
  }, [winner]);

  const handleRematch = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleNewLobby = () => {
    dispatch({ type: 'NAVIGATE_TO_LOBBY' });
  };

  const getWinnerAnnouncement = () => {
    if (winner === 'tie') {
      return {
        title: "IT'S A DRAW!",
        subtitle: "Equal forces clash. A perfect stalemate.",
        color: 'var(--text-secondary)',
        accent: 'rgba(255, 255, 255, 0.05)'
      };
    }
    
    const winningPlayer = winner === 'playerA' ? playerA : playerB;
    return {
      title: `${winningPlayer.name.toUpperCase()} WINS!`,
      subtitle: 'Impartial AI consensus declares the victor.',
      color: winningPlayer.color,
      accent: winner === 'playerA' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(6, 182, 212, 0.1)'
    };
  };

  const announcement = getWinnerAnnouncement();
  const activeFeedback = activeFeedbackTab === 'playerA' ? feedback.playerA : feedback.playerB;
  const activeTabName = activeFeedbackTab === 'playerA' ? playerA.name : playerB.name;
  const activeTabColor = activeFeedbackTab === 'playerA' ? 'var(--color-player-a)' : 'var(--color-player-b)';

  return (
    <div className="results-screen-container container animate-fade-in">
      {/* Winner Hero Banner */}
      <div 
        className="winner-hero-card glass-panel"
        style={{ 
          borderColor: announcement.color,
          background: `radial-gradient(circle at center, ${announcement.accent} 0%, var(--glass-bg) 100%)`
        }}
      >
        <div className="winner-icon-crown" style={{ backgroundColor: announcement.color }}>
          <Award size={32} />
        </div>
        <h2 className="winner-title-text" style={{ color: announcement.color }}>
          {announcement.title}
        </h2>
        <p className="winner-subtitle-text">{announcement.subtitle}</p>
      </div>

      {/* Comparative Scorecard Section */}
      <ScoreCard 
        scores={scores} 
        winner={winner} 
        playerNames={{ playerA: playerA.name, playerB: playerB.name }} 
      />

      {/* Verdict Panel */}
      <div className="verdict-panel glass-panel">
        <h3 className="verdict-title">
          <MessageSquare size={18} className="title-icon" />
          <span>Judge's Verdict</span>
        </h3>
        <p className="verdict-text">"{verdict}"</p>
      </div>

      {/* Critiques and Feedback tabs */}
      <div className="critique-container glass-panel">
        <div className="critique-tab-header">
          <button
            type="button"
            className={`critique-tab-btn ${activeFeedbackTab === 'playerA' ? 'active' : ''}`}
            onClick={() => setActiveFeedbackTab('playerA')}
            style={{ 
              color: activeFeedbackTab === 'playerA' ? 'var(--color-player-a)' : undefined,
              borderBottomColor: activeFeedbackTab === 'playerA' ? 'var(--color-player-a)' : undefined
            }}
          >
            {playerA.name}'s Feedback
          </button>
          <button
            type="button"
            className={`critique-tab-btn ${activeFeedbackTab === 'playerB' ? 'active' : ''}`}
            onClick={() => setActiveFeedbackTab('playerB')}
            style={{ 
              color: activeFeedbackTab === 'playerB' ? 'var(--color-player-b)' : undefined,
              borderBottomColor: activeFeedbackTab === 'playerB' ? 'var(--color-player-b)' : undefined
            }}
          >
            {playerB.name}'s Feedback
          </button>
        </div>

        <div className="critique-tab-body">
          <div className="critique-grid">
            {/* Strengths */}
            <div className="critique-col strengths-col">
              <h4>
                <CheckCircle size={16} className="text-green" />
                <span>Strengths</span>
              </h4>
              <ul className="critique-list">
                {activeFeedback.strengths.map((str, idx) => (
                  <li key={idx} className="critique-item animate-fade-in">
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="critique-col weaknesses-col">
              <h4>
                <AlertTriangle size={16} className="text-danger" />
                <span>Areas for Improvement</span>
              </h4>
              <ul className="critique-list">
                {activeFeedback.weaknesses.map((weak, idx) => (
                  <li key={idx} className="critique-item animate-fade-in">
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="results-actions-row">
        <button onClick={handleNewLobby} className="btn btn-secondary flex-1">
          <Users size={18} />
          <span>Change Players</span>
        </button>

        <button onClick={handleRematch} className="btn btn-primary flex-1 btn-rematch-action">
          <RotateCcw size={18} />
          <span>Rematch (Same Names)</span>
        </button>
      </div>

      <style>{`
        .results-screen-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 0;
        }

        .winner-hero-card {
          padding: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .winner-icon-crown {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .winner-title-text {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }

        .winner-subtitle-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .verdict-panel {
          padding: 24px;
        }

        .verdict-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          margin-bottom: 12px;
          color: var(--text-primary);
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          padding-bottom: 12px;
        }

        .verdict-panel .title-icon {
          color: var(--accent-secondary);
        }

        .verdict-text {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          font-style: italic;
        }

        /* Critiques tabs details */
        .critique-container {
          padding: 24px;
        }

        .critique-tab-header {
          display: flex;
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          margin-bottom: 20px;
          gap: 16px;
        }

        .critique-tab-btn {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 16px;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .critique-tab-btn:hover {
          color: var(--text-primary);
        }

        .critique-tab-btn.active {
          font-weight: 700;
        }

        .critique-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        .critique-col h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          margin-bottom: 14px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .critique-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
        }

        .critique-item {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-secondary);
          position: relative;
          padding-left: 14px;
        }

        .critique-item::before {
          content: '•';
          position: absolute;
          left: 0;
          color: ${activeTabColor};
        }

        .strengths-col .critique-item::before {
          color: var(--accent-success);
        }

        .weaknesses-col .critique-item::before {
          color: var(--accent-danger);
        }

        .results-actions-row {
          display: flex;
          gap: 16px;
          margin-top: 10px;
        }

        .btn-rematch-action {
          box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.2);
        }

        @media (max-width: 700px) {
          .critique-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .results-actions-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
