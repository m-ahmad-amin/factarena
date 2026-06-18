import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export default function VoiceMic({ onTranscriptChange, isListeningExternal, onListeningStateChange }) {
  const [isListening, setIsListening] = useState(false);
  const [supportSpeech, setSupportSpeech] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportSpeech(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      if (onListeningStateChange) onListeningStateChange(true);
      setErrorMsg('');
    };

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        onTranscriptChange(finalTranscript);
      }
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access blocked. Please enable permissions.');
      } else if (event.error === 'no-speech') {
        // No speech is a common harmless timeout
      } else {
        setErrorMsg(`Voice input error: ${event.error}`);
      }
      handleStop();
    };

    rec.onend = () => {
      setIsListening(false);
      if (onListeningStateChange) onListeningStateChange(false);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Monitor external triggers (like switching turns should stop the mic)
  useEffect(() => {
    if (isListeningExternal === false && isListening) {
      handleStop();
    }
  }, [isListeningExternal]);

  const handleStart = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech:', err);
    }
  };

  const handleStop = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Failed to stop speech:', err);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      handleStop();
    } else {
      handleStart();
    }
  };

  if (!supportSpeech) {
    return (
      <button
        type="button"
        className="btn-mic disabled"
        title="Voice input not supported in this browser"
        disabled
      >
        <MicOff size={20} />
      </button>
    );
  }

  return (
    <div className="voice-mic-wrapper">
      <button
        type="button"
        className={`btn-mic ${isListening ? 'listening' : ''}`}
        onClick={toggleListen}
        title={isListening ? 'Stop Voice Input' : 'Start Voice Input (Speech-to-Text)'}
      >
        <Mic size={20} />
        {isListening && (
          <span className="listening-pulse"></span>
        )}
      </button>

      {isListening && (
        <div className="soundwave-container mic-waves">
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
        </div>
      )}

      {errorMsg && (
        <div className="mic-error-tooltip">
          <AlertCircle size={12} />
          <span>{errorMsg}</span>
        </div>
      )}

      <style>{`
        .voice-mic-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-mic {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          cursor: pointer;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-mic:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--glass-border-hover);
          transform: scale(1.05);
        }

        .btn-mic.listening {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--accent-secondary);
          color: var(--accent-secondary);
          box-shadow: 0 0 15px var(--accent-secondary-glow);
          animation: listeningPulse 2s infinite ease-in-out;
        }

        .btn-mic.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .listening-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid var(--accent-secondary);
          border-radius: 12px;
          animation: ringPulse 1.5s infinite ease-out;
          pointer-events: none;
        }

        .mic-waves {
          height: 24px;
        }

        .mic-error-tooltip {
          position: absolute;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(239, 68, 68, 0.95);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          z-index: 50;
          pointer-events: none;
          animation: fadeIn 0.2s ease-out;
        }

        .mic-error-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px;
          border-style: solid;
          border-color: rgba(239, 68, 68, 0.95) transparent transparent transparent;
        }

        @keyframes listeningPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
