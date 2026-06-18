import React from 'react';
import { useGame } from '../context/GameContext';
import { Play, Clock, Mic, BarChart2, Shield } from 'lucide-react';

export default function LandingPage() {
  const { dispatch } = useGame();

  const handleLaunch = () => {
    dispatch({ type: 'NAVIGATE_TO_LOBBY' });
  };

  return (
    <div className="landing-page-container container animate-fade-in">
      {/* Social Proof Bar */}
      <div className="social-proof">
        <div className="avatar-stack">
          <span className="proof-avatar" style={{ backgroundColor: 'var(--color-player-a)' }}>A</span>
          <span className="proof-avatar" style={{ backgroundColor: 'var(--color-player-b)' }}>B</span>
          <span className="proof-avatar" style={{ backgroundColor: 'var(--accent-success)' }}>J</span>
        </div>
        <div className="rating-info">
          <div className="stars">★★★★★</div>
          <p className="rating-text">Impartial AI Debate Referee</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-headline">
          Settle arguments. <br />
          <span className="gradient-text-accent underline-effect">Reveal the truth.</span>
        </h2>
        <p className="hero-description">
          A local multiplayer debate game powered by AI. Share a single device, face off with chess-style timers, and let our objective judge score your reasoning.
        </p>

        <div className="hero-cta">
          <button onClick={handleLaunch} className="btn btn-primary btn-hero-start">
            <span>Launch Arena</span>
            <Play size={16} fill="currentColor" />
          </button>
        </div>
      </section>

      {/* Live Preview Mockup Card */}
      <div className="preview-mockup-wrapper animate-fade-in">
        <div className="preview-mockup-card glass-panel">
          <div className="mockup-header">
            <div className="mockup-dots">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
            </div>
            <span className="mockup-indicator">LIVE PREVIEW</span>
          </div>
          
          <div className="mockup-body">
            <div className="mockup-topic">
              <span>Debate Topic: <strong>"Pineapple belongs on pizza."</strong></span>
            </div>
            
            <div className="mockup-timers">
              <div className="mockup-timer active">
                <span className="player-indicator-dot" style={{ backgroundColor: 'var(--color-player-a)' }}></span>
                <span>Ahmad: <strong>00:45</strong></span>
              </div>
              <div className="mockup-timer">
                <span className="player-indicator-dot" style={{ backgroundColor: 'var(--color-player-b)' }}></span>
                <span>Sophia: <strong>00:52</strong></span>
              </div>
            </div>
            
            <div className="mockup-bubbles">
              <div className="mockup-bubble-wrapper left">
                <div className="mockup-avatar" style={{ backgroundColor: 'var(--color-player-a)' }}>A</div>
                <div className="mockup-bubble">
                  Pineapple's sweet acidity balances the savory cheese and rich tomato sauce perfectly.
                </div>
              </div>
              <div className="mockup-bubble-wrapper right">
                <div className="mockup-bubble">
                  Fruit does not belong on warm cheese. It upsets the traditional savory profile.
                </div>
                <div className="mockup-avatar" style={{ backgroundColor: 'var(--color-player-b)' }}>S</div>
              </div>
            </div>
            
            <div className="mockup-verdict">
              <div className="verdict-header">
                <strong>AI Scorecard Analysis</strong>
                <span className="winner-tag">Sophia Wins By 1.5 pts</span>
              </div>
              <div className="verdict-bar">
                <div className="fill-a" style={{ width: '48%', backgroundColor: 'var(--color-player-a)' }}>48%</div>
                <div className="fill-b" style={{ width: '52%', backgroundColor: 'var(--color-player-b)' }}>52%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="features-section">
        <h3 className="section-title">How Fact Arena Works</h3>
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper" style={{ color: 'var(--color-player-a)', backgroundColor: 'rgba(99, 102, 241, 0.08)' }}>
              <Clock size={20} />
            </div>
            <h4>Dual Chess Timers</h4>
            <p>Each player gets a 1-minute pool. Clocks tick down only when it is your turn to speak, forcing concise logic.</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper" style={{ color: 'var(--color-player-b)', backgroundColor: 'rgba(2, 132, 199, 0.08)' }}>
              <Mic size={20} />
            </div>
            <h4>Speech-to-Text</h4>
            <p>Hands-free dictation using the Web Speech API. Speak your arguments directly and edit them before submitting.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper" style={{ color: 'var(--accent-success)', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <Shield size={20} />
            </div>
            <h4>Impartial AI Judge</h4>
            <p>Powered by Groq's high-speed inference. Analyzes logic, counterarguments, and relevance without bias.</p>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
        }

        /* Rating Proof Header */
        .social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .avatar-stack {
          display: flex;
          align-items: center;
        }

        .proof-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2.5px solid var(--bg-secondary);
          margin-left: -8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 800;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .proof-avatar:first-child {
          margin-left: 0;
        }

        .rating-info {
          text-align: left;
        }

        .stars {
          color: #6366f1; /* Indigo stars */
          font-size: 0.95rem;
          line-height: 1;
        }

        .rating-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
          margin-top: 2px;
        }

        /* Hero Text */
        .hero-section {
          max-width: 650px;
          margin-bottom: 60px;
        }

        .hero-headline {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .underline-effect {
          position: relative;
          display: inline-block;
        }

        .underline-effect::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 2px;
        }

        .hero-description {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .btn-hero-start {
          padding: 14px 32px;
          font-size: 1.05rem;
          border-radius: 12px;
        }

        /* Features Section */
        .features-section {
          width: 100%;
          max-width: 900px;
          border-top: 1px solid var(--glass-border);
          padding-top: 48px;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 32px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: left;
        }

        .feature-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-radius: 16px;
        }

        .feature-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .feature-card p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Mockup Live Preview Card Styles */
        .preview-mockup-wrapper {
          width: 100%;
          max-width: 600px;
          margin: 0 auto 50px auto;
        }

        .preview-mockup-card {
          border-radius: 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
          overflow: hidden;
          text-align: left;
        }

        .mockup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: rgba(15, 23, 42, 0.02);
          border-bottom: 1px solid var(--glass-border);
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .mockup-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .mockup-dot.red { background: #ef4444; }
        .mockup-dot.yellow { background: #f59e0b; }
        .mockup-dot.green { background: #10b981; }

        .mockup-indicator {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--accent-primary);
          letter-spacing: 0.05em;
          background: rgba(79, 70, 229, 0.06);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .mockup-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mockup-topic {
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.02);
          border-left: 3px solid var(--accent-primary);
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .mockup-timers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mockup-timer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.02);
          border: 1px solid var(--glass-border);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .mockup-timer.active {
          border-color: var(--color-player-a);
          background: rgba(99, 102, 241, 0.03);
          color: var(--text-primary);
        }

        .player-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .mockup-bubbles {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 0;
        }

        .mockup-bubble-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 85%;
        }

        .mockup-bubble-wrapper.left {
          align-self: flex-start;
        }

        .mockup-bubble-wrapper.right {
          align-self: flex-end;
        }

        .mockup-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: white;
          font-weight: 700;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .mockup-bubble {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.82rem;
          line-height: 1.45;
          color: var(--text-secondary);
          background: var(--bg-primary);
          border: 1px solid var(--glass-border);
        }

        .mockup-bubble-wrapper.left .mockup-bubble {
          border-top-left-radius: 2px;
          background: rgba(99, 102, 241, 0.03);
          border-color: rgba(99, 102, 241, 0.1);
        }

        .mockup-bubble-wrapper.right .mockup-bubble {
          border-top-right-radius: 2px;
          background: rgba(2, 132, 199, 0.03);
          border-color: rgba(2, 132, 199, 0.1);
        }

        .mockup-verdict {
          border-top: 1px dashed var(--glass-border);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .verdict-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .winner-tag {
          color: var(--accent-success);
          font-weight: 700;
        }

        .verdict-bar {
          height: 18px;
          border-radius: 9px;
          overflow: hidden;
          display: flex;
          font-size: 0.65rem;
          font-weight: 800;
          color: white;
          text-align: center;
          line-height: 18px;
        }

        .fill-a, .fill-b {
          height: 100%;
          transition: width 0.3s ease;
        }

        /* Feature Card hover optimizations */
        .feature-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-3px);
          border-color: var(--glass-border-hover);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
        }

        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.2rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .landing-page-container {
            padding: 20px 10px;
          }
        }
      `}</style>
    </div>
  );
}
