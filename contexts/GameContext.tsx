import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { socketService } from '../services/socketService';
import { GameState, QuestionData } from '../types';

interface GameContextType {
  gameState: GameState | null;
  socket: typeof socketService;
  questions: QuestionData | null;
  unlockAudio: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [questions, setQuestions] = useState<QuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bellSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);



  // Effect for timer countdown sound
  useEffect(() => {
    const sound = countdownSoundRef.current;
    if (!gameState || !sound) return;

    // Play sound when timer hits 10 seconds
    if (gameState.timer === 10) {
      sound.currentTime = 0; // Rewind
      sound.play().catch(e => console.error("Failed to play countdown sound:", e));
    }
    // Stop sound if timer is reset, expires, or set to a value > 10
    else if (gameState.timer === 0 || gameState.timer > 10) {
      if (!sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
    }
  }, [gameState?.timer]);

  useEffect(() => {
    const handleStateUpdate = (state: GameState) => {
      setGameState(state);
    };

    const handleInit = (data: { gameState: GameState, questions: QuestionData }) => {
      if (data && data.gameState && data.questions) {
        setGameState(data.gameState);
        setQuestions(data.questions);
        setIsLoading(false);
      } else {
        setError("Failed to receive valid initial data from server.");
        setIsLoading(false);
      }
    };

    const handleScoreUpdate = ({ playerId, newScore }: { playerId: string, newScore: number }) => {
      setGameState(prevState => {
        if (!prevState) return null;
        return {
          ...prevState,
          players: prevState.players.map(p =>
            p.id === playerId ? { ...p, score: newScore } : p
          )
        };
      });
    };

    // Play bell sound when any player buzzes
    const handleBuzzed = () => {
      if (bellSoundRef.current) {
        bellSoundRef.current.currentTime = 0; // Rewind to start
        bellSoundRef.current.play().catch((error) => {
          console.error('Failed to play sound:', error);
          // This error is expected if the user hasn't interacted with the page yet.
          // The unlockAudio function handles getting permission on the first interaction.
        });
      }
    };

    try {
      socketService.on('init', handleInit);
      socketService.on('gameStateUpdate', handleStateUpdate);
      socketService.on('scoreUpdated', handleScoreUpdate);
      socketService.on('buzzed', handleBuzzed);
    } catch (e) {
      console.error("Socket initialization failed:", e);
      setError("Could not connect to the game server.");
      setIsLoading(false);
    }

    return () => {
      socketService.off('init', handleInit);
      socketService.off('gameStateUpdate', handleStateUpdate);
      socketService.off('scoreUpdated', handleScoreUpdate);
      socketService.off('buzzed', handleBuzzed);
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Connecting to Game Server...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-red-400">{error}</div>;
  }

  return (
    <GameContext.Provider value={{ gameState, socket: socketService, questions }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};