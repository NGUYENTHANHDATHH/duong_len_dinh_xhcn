import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { socketService } from '../services/socketService';
import { GameState, QuestionData } from '../types';

interface GameContextType {
  gameState: GameState | null;
  socket: typeof socketService;
  questions: QuestionData | null;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [questions, setQuestions] = useState<QuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    try {
      socketService.on('init', handleInit);
      socketService.on('gameStateUpdate', handleStateUpdate);
      // Play bell sound when any player buzzes
      const handleBuzzed = () => {
        try {
          console.log('Playing buzz sound...');
          const sound = new Audio('/assets/sounds/bell.mp3');
          sound.play().catch((error) => {
            console.error('Failed to play sound:', error);
          });
        } catch (error) {
          console.error('Error creating audio:', error);
        }
      };
      socketService.on('buzzed', handleBuzzed);
    } catch (e) {
      console.error("Socket initialization failed:", e);
      setError("Could not connect to the game server.");
      setIsLoading(false);
    }

    return () => {
      socketService.off('init', handleInit);
      socketService.off('gameStateUpdate', handleStateUpdate);
      socketService.off('buzzed');
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
