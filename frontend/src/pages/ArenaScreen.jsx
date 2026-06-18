import React, { useState, useRef, useEffect } from "react";
import { useGame } from "../context/GameContext";
import Timer from "../components/Timer";
import VoiceMic from "../components/VoiceMic";
import { Send, Sparkles, MessageSquare, CornerRightDown } from "lucide-react";

export default function ArenaScreen() {
  const { state, dispatch } = useGame();
  const { playerA, playerB, activePlayer, transcript, topic } = state;
  const [inputText, setInputText] = useState("");
  const [isMicListening, setIsMicListening] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const activePlayerData = activePlayer === "playerA" ? playerA : playerB;
  const isInputLocked = activePlayerData.time === 0 || state.isLoading;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  useEffect(() => {
    if (inputRef.current && !isInputLocked) {
      inputRef.current.focus();
    }
    setInputText("");
  }, [activePlayer, isInputLocked]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const cleanText = inputText.trim();
    if (!cleanText || cleanText.length < 3) return;

    dispatch({ type: "SUBMIT_ARGUMENT", payload: cleanText });
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (text) => {
    setInputText((prev) => prev + text);
  };

  const handleManualSkip = () => {
    if (
      window.confirm(
        `${activePlayerData.name}, do you want to pass your turn? Your clock will pause and switch to your opponent.`,
      )
    ) {
      dispatch({ type: "SUBMIT_ARGUMENT", payload: "[Passed Turn]" });
    }
  };

  const handleForceFinish = () => {
    if (
      window.confirm(
        "Ready to end the debate early and send arguments for AI judging?",
      )
    ) {
      dispatch({ type: "START_EVALUATION" });
    }
  };

  return (
    <div className="arena-screen-container container animate-fade-in">
      {/* SaaS Alert Debate Topic Banner */}
      {/* <div className="arena-topic-card glass-panel">
        <div className="topic-inner-layout">
          <MessageSquare size={16} className="text-indigo animate-pulse-slow" />
          <h2 className="arena-topic-text">Topic: "{topic}"</h2>
        </div>
      </div> */}

      {/* Side-by-side Chess Timers */}
      <div className="sticky-timer-wrapper">
        <Timer />
      </div>

      {/* Transcript Board */}
      <div className="transcript-board glass-panel">
        {transcript.length === 0 ? (
          <div className="empty-transcript-state">
            <div className="empty-icon-wrapper">
              <Sparkles size={24} className="text-indigo" />
            </div>
            <h3>The Debate Arena is Live</h3>
            <p>
              <b>Topic: </b>{topic}
            </p>
          </div>
        ) : (
          <div className="chat-feed-scrollable">
            {transcript.map((arg) => {
              const isPlayerA = arg.player === "playerA";
              const playerColor = isPlayerA
                ? "var(--color-player-a)"
                : "var(--color-player-b)";
              const alignClass = isPlayerA
                ? "player-a-align"
                : "player-b-align";
              const initial = arg.playerName
                ? arg.playerName.trim().substring(0, 1).toUpperCase()
                : "?";

              return (
                <div
                  key={arg.id}
                  className={`chat-bubble-wrapper ${alignClass} animate-fade-in`}
                >
                  <div className="bubble-row">
                    {isPlayerA && (
                      <div
                        className="bubble-avatar"
                        style={{ backgroundColor: playerColor }}
                      >
                        {initial}
                      </div>
                    )}

                    <div className="bubble-msg-container">
                      <div className="chat-bubble-header">
                        <span
                          className="bubble-player-name"
                          style={{ color: playerColor }}
                        >
                          {arg.playerName}
                        </span>
                        <span className="bubble-metadata">
                          ⏱️ {arg.timeSpent}s
                        </span>
                      </div>
                      <div
                        className="chat-bubble-content"
                        style={{
                          borderColor: playerColor,
                          background: isPlayerA
                            ? "rgba(99, 102, 241, 0.04)"
                            : "rgba(2, 132, 199, 0.04)",
                        }}
                      >
                        {arg.text}
                      </div>
                    </div>

                    {!isPlayerA && (
                      <div
                        className="bubble-avatar"
                        style={{ backgroundColor: playerColor }}
                      >
                        {initial}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Floating Console Input Dock */}
      <div
        className="arena-input-console glass-panel"
        style={{
          borderColor: isMicListening
            ? "var(--accent-primary)"
            : "var(--glass-border)",
          boxShadow: isMicListening
            ? "0 10px 25px -5px rgba(79,70,229,0.1)"
            : undefined,
        }}
      >
        <div className="input-console-header">
          <span
            className="active-player-indicator"
            style={{ color: activePlayerData.color }}
          >
            <span
              className="indicator-dot"
              style={{ backgroundColor: activePlayerData.color }}
            ></span>
            {activePlayerData.name}'s Turn
          </span>
          <span className="instructions-hint">Press Enter to submit turn</span>
        </div>

        <form onSubmit={handleSubmit} className="input-console-form">
          <textarea
            ref={inputRef}
            rows={2}
            className="arena-input-textarea"
            placeholder={
              isInputLocked
                ? "Debate ended. Requesting AI analysis..."
                : `Write your response, ${activePlayerData.name}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isInputLocked}
          />

          <div className="input-console-actions">
            <div className="mic-action-group">
              <VoiceMic
                onTranscriptChange={handleVoiceTranscript}
                isListeningExternal={isMicListening}
                onListeningStateChange={setIsMicListening}
              />
            </div>

            <div className="action-buttons-group">
              {transcript.length >= 2 && (
                <button
                  type="button"
                  onClick={handleForceFinish}
                  className="btn btn-secondary btn-force-eval"
                  title="Request AI judge scorecard early"
                >
                  Judge Now
                </button>
              )}

              <button
                type="button"
                onClick={handleManualSkip}
                className="btn btn-secondary btn-skip"
                disabled={isInputLocked}
              >
                Pass Turn
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-submit-arg"
                style={{
                  backgroundColor: activePlayerData.color,
                  boxShadow: `0 4px 10px ${activePlayerData.color}25`,
                }}
                disabled={
                  isInputLocked ||
                  !inputText.trim() ||
                  inputText.trim().length < 3
                }
              >
                <span>Submit</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .arena-screen-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: calc(100vh - 120px);
          max-height: 800px;
        }

        .arena-topic-card {
          padding: 14px 20px;
          border-radius: 12px;
          background: var(--bg-secondary);
        }

        .topic-inner-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .text-indigo {
          color: var(--accent-primary);
        }

        .arena-topic-text {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .transcript-board {
          flex: 1;
          min-height: 300px;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 20px;
          border-radius: 20px;
          background: var(--bg-secondary);
        }

        .sticky-timer-wrapper {
          position: sticky;
          top: 80px;
          z-index: 50;
          background: var(--bg-primary);
          padding: 4px 0;
          margin: 0 -4px;
        }

        .empty-transcript-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-secondary);
          gap: 12px;
          padding: 10px 0;
          width: 100%;
          margin: 0 auto;
        }

        .empty-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(79, 70, 229, 0.15);
        }

        .empty-transcript-state h3 {
          font-size: 1.2rem;
          color: var(--text-primary);
          text-align: center;
        }

        .empty-transcript-state p {
          font-size: 0.9rem;
          max-width: 420px;
          line-height: 1.5;
          text-align: center;
        }

        .chat-feed-scrollable {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 8px;
        }

        .chat-bubble-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          gap: 4px;
        }

        .player-a-align {
          align-self: flex-start;
        }

        .player-b-align {
          align-self: flex-end;
        }

        .bubble-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
        }

        .bubble-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          color: white;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
          margin-top: 14px;
        }

        .bubble-msg-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .chat-bubble-header {
          display: flex;
          gap: 10px;
          font-size: 0.72rem;
          color: var(--text-muted);
          padding: 0 4px;
        }

        .player-a-align .chat-bubble-header {
          justify-content: flex-start;
        }

        .player-b-align .chat-bubble-header {
          justify-content: flex-end;
        }

        .bubble-player-name {
          font-family: var(--font-display);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .chat-bubble-content {
          border: 1px solid transparent;
          border-radius: 16px;
          padding: 12px 16px;
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-primary);
          word-break: break-word;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
        }

        .player-a-align .chat-bubble-content {
          border-top-left-radius: 2px;
        }

        .player-b-align .chat-bubble-content {
          border-top-right-radius: 2px;
        }

        /* Input Dock */
        .arena-input-console {
          padding: 14px 18px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-secondary);
        }

        .input-console-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 8px;
          margin-bottom: 4px;
        }

        .active-player-indicator {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .instructions-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .arena-input-textarea {
          width: 100%;
          background: transparent;
          border: none;
          padding: 8px 0;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          resize: none;
          outline: none;
        }

        .input-console-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
          border-top: 1px dashed var(--glass-border);
          padding-top: 8px;
        }

        .action-buttons-group {
          display: flex;
          gap: 8px;
        }

        .btn-submit-arg {
          color: white;
          padding: 10px 18px;
          height: 40px;
          border-radius: 10px;
          font-size: 0.85rem;
          border: none;
        }

        .btn-submit-arg:hover {
          filter: brightness(0.95);
        }

        .btn-skip, .btn-force-eval {
          height: 40px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
        }

        .btn-force-eval {
          border-color: rgba(2, 132, 199, 0.2);
          color: var(--color-player-b);
          background: transparent;
        }

        .btn-force-eval:hover {
          background: rgba(2, 132, 199, 0.05);
        }

        @media (max-width: 600px) {
          .arena-screen-container {
            height: auto;
            max-height: none;
          }
          .transcript-board {
            height: 300px;
          }
          .chat-bubble-wrapper {
            max-width: 88%;
          }
          .btn-skip, .btn-force-eval {
            font-size: 0.72rem;
            padding: 8px;
          }
          .btn-submit-arg {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
}
