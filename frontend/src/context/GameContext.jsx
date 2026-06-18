import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { evaluateDebate } from '../services/groq';

const GameContext = createContext();

const SCREEN_STATES = {
  LANDING: 'LANDING',
  LOBBY: 'LOBBY',
  TOPIC_SELECT: 'TOPIC_SELECT',
  ARENA: 'ARENA',
  EVALUATING: 'EVALUATING',
  RESULTS: 'RESULTS'
};

const initialState = {
  screen: SCREEN_STATES.LANDING,
  playerA: { name: '', time: 60, color: '#6366f1' }, // Indigo
  playerB: { name: '', time: 60, color: '#0284c7' }, // Sky Blue
  topic: '',
  activePlayer: 'playerA',
  transcript: [],
  evaluation: null,
  error: '',
  isLoading: false,
  turnStartTime: 60 // Keeps track of when the current turn started to calculate time spent
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYERS':
      return {
        ...state,
        playerA: { ...state.playerA, name: action.payload.playerA || 'Player A' },
        playerB: { ...state.playerB, name: action.payload.playerB || 'Player B' },
        screen: SCREEN_STATES.TOPIC_SELECT,
        error: ''
      };

    case 'SET_TOPIC':
      return {
        ...state,
        topic: action.payload,
        screen: SCREEN_STATES.ARENA,
        playerA: { ...state.playerA, time: 60 },
        playerB: { ...state.playerB, time: 60 },
        activePlayer: 'playerA',
        transcript: [],
        turnStartTime: 60,
        evaluation: null,
        error: ''
      };


    case 'TICK_TIMER': {
      const active = state.activePlayer;
      const nextTime = Math.max(0, state[active].time - 1);
      
      const updatedPlayerState = {
        ...state[active],
        time: nextTime
      };

      if (nextTime === 0) {
        // Active player ran out of time! Switch to other player if they have time left.
        const other = active === 'playerA' ? 'playerB' : 'playerA';
        const otherHasTime = state[other].time > 0;

        if (otherHasTime) {
          return {
            ...state,
            [active]: updatedPlayerState,
            activePlayer: other,
            turnStartTime: state[other].time
          };
        } else {
          // Both players out of time!
          return {
            ...state,
            [active]: updatedPlayerState,
            screen: SCREEN_STATES.EVALUATING,
            isLoading: true
          };
        }
      }

      return {
        ...state,
        [active]: updatedPlayerState
      };
    }

    case 'SUBMIT_ARGUMENT': {
      const active = state.activePlayer;
      const opponent = active === 'playerA' ? 'playerB' : 'playerA';
      
      const activeName = state[active].name;
      const timeSpent = state.turnStartTime - state[active].time;

      const newArgument = {
        id: `arg-${Date.now()}`,
        player: active,
        playerName: activeName,
        text: action.payload,
        timeSpent: Math.max(1, timeSpent) // Min 1s spent
      };

      const updatedTranscript = [...state.transcript, newArgument];

      // Switch turn if opponent has time left
      const opponentHasTime = state[opponent].time > 0;
      const activeHasTime = state[active].time > 0;

      let nextActivePlayer = active;
      if (opponentHasTime) {
        nextActivePlayer = opponent;
      } else if (!activeHasTime) {
        // Both ran out of time
        return {
          ...state,
          transcript: updatedTranscript,
          screen: SCREEN_STATES.EVALUATING,
          isLoading: true
        };
      }

      return {
        ...state,
        transcript: updatedTranscript,
        activePlayer: nextActivePlayer,
        turnStartTime: state[nextActivePlayer].time
      };
    }

    case 'START_EVALUATION':
      return {
        ...state,
        screen: SCREEN_STATES.EVALUATING,
        isLoading: true,
        error: ''
      };

    case 'SET_EVALUATION_SUCCESS':
      return {
        ...state,
        evaluation: action.payload,
        screen: SCREEN_STATES.RESULTS,
        isLoading: false,
        error: ''
      };

    case 'SET_EVALUATION_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'RETRY_EVALUATION':
      return {
        ...state,
        screen: SCREEN_STATES.EVALUATING,
        isLoading: true,
        error: ''
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        playerA: { ...initialState.playerA, name: state.playerA.name },
        playerB: { ...initialState.playerB, name: state.playerB.name },
        screen: SCREEN_STATES.TOPIC_SELECT
      };

    case 'NAVIGATE_TO_LOBBY':
      return {
        ...initialState,
        screen: SCREEN_STATES.LOBBY
      };

    case 'NAVIGATE_TO_LANDING':
      return {
        ...initialState,
        screen: SCREEN_STATES.LANDING
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // 1. Timer Tick Interval Effect
  useEffect(() => {
    let intervalId = null;

    if (state.screen === SCREEN_STATES.ARENA && !state.isLoading) {
      intervalId = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.screen, state.activePlayer, state.isLoading]);

  // 2. AI Judging API Effect
  useEffect(() => {
    const runEvaluation = async () => {
      if (state.screen !== SCREEN_STATES.EVALUATING || !state.isLoading) return;

      try {
        const results = await evaluateDebate(
          state.topic,
          { playerA: state.playerA.name, playerB: state.playerB.name },
          state.transcript
        );
        dispatch({ type: 'SET_EVALUATION_SUCCESS', payload: results });
      } catch (err) {
        console.error('AI Judge Error:', err);
        dispatch({ 
          type: 'SET_EVALUATION_ERROR', 
          payload: err.message || 'Failed to analyze debate. Please check your server connection or API key config.' 
        });
      }
    };

    runEvaluation();
  }, [state.screen, state.isLoading, state.topic, state.transcript]);

  return (
    <GameContext.Provider value={{ state, dispatch, SCREEN_STATES }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
