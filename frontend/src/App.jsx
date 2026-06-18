import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/Header';
import WelcomeScreen from './pages/WelcomeScreen';
import TopicScreen from './pages/TopicScreen';
import ArenaScreen from './pages/ArenaScreen';
import LoadingScreen from './pages/LoadingScreen';
import ResultsScreen from './pages/ResultsScreen';
import LandingPage from './pages/LandingPage';

function AppContent() {
  const { state, SCREEN_STATES } = useGame();

  const renderActiveScreen = () => {
    switch (state.screen) {
      case SCREEN_STATES.LANDING:
        return <LandingPage />;
      case SCREEN_STATES.LOBBY:
        return <WelcomeScreen />;
      case SCREEN_STATES.TOPIC_SELECT:
        return <TopicScreen />;
      case SCREEN_STATES.ARENA:
        return <ArenaScreen />;
      case SCREEN_STATES.EVALUATING:
        return <LoadingScreen />;
      case SCREEN_STATES.RESULTS:
        return <ResultsScreen />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="app-frame">
      {/* Universal Sticky Header */}
      <Header />

      {/* Main Game Screen Portal */}
      <main className="app-main">
        {renderActiveScreen()}
      </main>

      {/* Elegant minimalist footer */}
      <footer className="app-footer">
        <p>Fact Arena © 2026. Powered by Groq AI. Debate honestly, think critically.</p>
      </footer>

      <style>{`
        .app-footer {
          text-align: center;
          padding: 24px;
          color: var(--text-muted);
          font-size: 0.8rem;
          border-top: 1px solid var(--glass-border);
          margin-top: 40px;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
