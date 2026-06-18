import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ShieldAlert, RefreshCw, Cpu, Brain, Check } from 'lucide-react';

const LOG_MESSAGES = [
  'Establishing secure connection to Groq Cloud...',
  'Ingesting transcript text and tagging player statements...',
  'Analyzing relevance of each argument to the prompt...',
  'Scanning statements for logical consistency and structure...',
  'Measuring rhetorical persuasiveness and emotional impact...',
  'Reviewing the strength of counterarguments and rebuttals...',
  'Aggregating points and synthesizing final score averages...',
  'Formulating constructive feedback and final verdict...'
];

export default function LoadingScreen() {
  const { state, dispatch } = useGame();
  const [logIndex, setLogIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState([]);

  // Sequence the fake analysis logs
  useEffect(() => {
    if (state.error) return; // Stop log sequencing if there is an error

    setVisibleLogs([LOG_MESSAGES[0]]);
    setLogIndex(1);
  }, [state.error]);

  useEffect(() => {
    if (state.error || logIndex >= LOG_MESSAGES.length) return;

    const interval = setTimeout(() => {
      setVisibleLogs((prev) => [...prev, LOG_MESSAGES[logIndex]]);
      setLogIndex((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(interval);
  }, [logIndex, state.error]);

  const handleRetry = () => {
    dispatch({ type: 'RETRY_EVALUATION' });
  };

  return (
    <div className="loading-screen-container container animate-fade-in">
      <div className="loading-card glass-panel">
        {state.error ? (
          /* Error State UI */
          <div className="error-panel animate-fade-in">
            <div className="error-icon-wrapper">
              <ShieldAlert size={36} className="text-danger" />
            </div>
            <h2 className="error-title">Deliberation Halted</h2>
            <p className="error-message">{state.error}</p>
            
            <div className="error-actions">
              <button 
                type="button" 
                onClick={handleRetry} 
                className="btn btn-primary btn-retry"
              >
                <RefreshCw size={16} />
                <span>Retry Evaluation</span>
              </button>
            </div>
          </div>
        ) : (
          /* Processing State UI */
          <div className="processing-panel">
            <div className="brain-animation-wrapper">
              <div className="brain-pulse-ring"></div>
              <div className="brain-pulse-ring-outer"></div>
              <div className="brain-icon-container">
                <Brain size={40} className="brain-pulse-icon" />
              </div>
            </div>

            <h2 className="loading-title">AI Judge is Deliberating</h2>
            <p className="loading-subtitle">Impartially analyzing debate transcript...</p>

            <div className="analysis-progress-panel glass-panel">
              <div className="progress-pipeline">
                {LOG_MESSAGES.map((log, index) => {
                  const isCompleted = index < visibleLogs.length - 1;
                  const isActive = index === visibleLogs.length - 1 && visibleLogs.includes(log);
                  const isPending = !visibleLogs.includes(log);

                  let statusClass = 'pending';
                  if (isCompleted) statusClass = 'completed';
                  else if (isActive) statusClass = 'active';

                  return (
                    <div key={index} className={`pipeline-step ${statusClass} animate-fade-in`}>
                      <div className="step-badge-col">
                        <div className="step-badge">
                          {isCompleted ? <Check size={10} /> : isActive ? <span className="step-spinner"></span> : null}
                        </div>
                        {index < LOG_MESSAGES.length - 1 && <div className="step-line-connector"></div>}
                      </div>
                      <div className="step-content">
                        <span className="step-text">{log}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .loading-screen-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
        }

        .loading-card {
          width: 100%;
          max-width: 600px;
          padding: 40px 30px;
          text-align: center;
        }

        /* Brain Pulse Animation */
        .brain-animation-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 24px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brain-icon-container {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .brain-pulse-icon {
          color: var(--accent-primary);
          filter: drop-shadow(0 0 10px var(--accent-primary-glow));
          animation: floatBrain 3s ease-in-out infinite;
        }

        .brain-pulse-ring {
          position: absolute;
          width: 74px;
          height: 74px;
          border: 2px solid var(--accent-primary-glow);
          border-radius: 50%;
          animation: pulseRing 2s infinite ease-out;
          z-index: 1;
        }

        .brain-pulse-ring-outer {
          position: absolute;
          width: 84px;
          height: 84px;
          border: 1px dashed var(--accent-secondary-glow);
          border-radius: 50%;
          animation: rotateRing 10s infinite linear;
          z-index: 1;
        }

        .loading-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .loading-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        /* Progress Pipeline Stepper */
        .analysis-progress-panel {
          padding: 24px;
          border-radius: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          width: 100%;
          margin-top: 10px;
        }

        .progress-pipeline {
          display: flex;
          flex-direction: column;
        }

        .pipeline-step {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          opacity: 0.35;
          transition: opacity 0.4s;
        }

        .pipeline-step.completed, .pipeline-step.active {
          opacity: 1;
        }

        .step-badge-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 20px;
          flex-shrink: 0;
        }

        .step-badge {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--glass-border);
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.3s;
        }

        .pipeline-step.completed .step-badge {
          background: var(--accent-success);
          border-color: var(--accent-success);
          color: white;
        }

        .pipeline-step.active .step-badge {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          box-shadow: 0 0 10px rgba(79, 70, 229, 0.15);
        }

        .step-line-connector {
          width: 2px;
          height: 22px;
          background: var(--glass-border);
          transition: background 0.3s;
        }

        .pipeline-step.completed .step-line-connector {
          background: var(--accent-success);
        }

        .step-spinner {
          width: 10px;
          height: 10px;
          border: 2px solid var(--accent-primary);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s infinite linear;
          display: inline-block;
        }

        .step-content {
          padding-bottom: 20px;
          text-align: left;
        }

        .pipeline-step:last-child .step-content {
          padding-bottom: 0;
        }

        .step-text {
          font-size: 0.88rem;
          font-weight: 550;
          color: var(--text-secondary);
          transition: color 0.3s;
        }

        .pipeline-step.active .step-text {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Error States styling */
        .error-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
        }

        .error-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .error-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fca5a5;
          margin-bottom: 8px;
        }

        .error-message {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 440px;
          margin-bottom: 28px;
        }

        .btn-retry {
          padding: 12px 24px;
          font-size: 0.95rem;
        }

        /* Keyframe Animations */
        @keyframes floatBrain {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
