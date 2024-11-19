import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  MAX_MOVES,
  START_POSITION_X,
  START_POSITION_Y,
} from '../components/GameScreen/constants';

interface GameContextProps {
  remainingMoves: number;
  setRemainingMoves: React.Dispatch<React.SetStateAction<number>>;

  positionX: number;
  setPositionX: React.Dispatch<React.SetStateAction<number>>;

  positionY: number;
  setPositionY: React.Dispatch<React.SetStateAction<number>>;

  savedPositionX: number | null;
  setSavesPositionX: React.Dispatch<React.SetStateAction<number | null>>;

  savedPositionY: number | null;
  setSavesPositionY: React.Dispatch<React.SetStateAction<number | null>>;

  startPoint: number | null;
  setStartPoint: React.Dispatch<React.SetStateAction<number | null>>;

  startPositionY: number;
  setStartPositionY: React.Dispatch<React.SetStateAction<number>>;

  startPositionX: number;
  setStartPositionX: React.Dispatch<React.SetStateAction<number>>;

  leftLimit: number;
  setLeftLimit: React.Dispatch<React.SetStateAction<number>>;

  resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [remainingMoves, setRemainingMoves] = useState<number>(MAX_MOVES);
  const [positionX, setPositionX] = useState<number>(START_POSITION_X);
  const [positionY, setPositionY] = useState<number>(START_POSITION_Y);

  const [savedPositionX, setSavesPositionX] = useState<number | null>(null);
  const [savedPositionY, setSavesPositionY] = useState<number | null>(null);

  const [startPoint, setStartPoint] = useState<number | null>(null);
  const [startPositionY, setStartPositionY] = useState<number>(0);
  const [startPositionX, setStartPositionX] = useState<number>(0);
  const [leftLimit, setLeftLimit] = useState<number>(0);

  const resetGame = () => {
    setRemainingMoves(MAX_MOVES);
    setPositionX(START_POSITION_X);
    setPositionY(START_POSITION_Y);

    setStartPositionY(START_POSITION_X);
    setStartPositionX(START_POSITION_Y);
    setLeftLimit(0);

    setSavesPositionX(null);
    setSavesPositionY(null);

    setStartPoint(null);
  };

  return (
    <GameContext.Provider
      value={{
        remainingMoves,
        setRemainingMoves,
        positionX,
        setPositionX,
        positionY,
        setPositionY,
        savedPositionX,
        setSavesPositionX,
        savedPositionY,
        setSavesPositionY,
        startPoint,
        setStartPoint,
        resetGame,
        startPositionY,
        setStartPositionY,
        startPositionX,
        setStartPositionX,
        leftLimit,
        setLeftLimit,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
