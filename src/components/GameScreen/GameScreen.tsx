import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import OuterRocks1366 from '../../assets/OuterRocks1366.png';
import OuterRocks1920 from '../../assets/OuterRocks1920.png';
import OuterRocks2560 from '../../assets/OuterRocks2560.png';
import Header1366 from '../../assets/Header1366.png';
import Header1920 from '../../assets/Header1920.png';
import Header2560 from '../../assets/Header2560.png';
import GameBackground1366 from '../../assets/GameBackground1366.svg';
import GameBackground1920 from '../../assets/GameBackground1920.svg';
import GameBackground2560 from '../../assets/GameBackground2560.svg';
import YellowRulerRotate from '../../assets/YellowRulerRotate.svg';
import YodelyGuy from '../../assets/YodelyGuy.svg';

import ScreamCrash from '../../assets/audio/ScreamCrash.mp3';
import SingleDing from '../../assets/audio/SingleDing.mp3';
import ThePriceIsRightYodelling from '../../assets/audio/ThePriceIsRightYodelling.mp3';
import WinningDingX10 from '../../assets/audio/WinningDingX10.mp3';

import { useGame } from '../../context/GameContext';
import { getStepXCoefficient } from './constants';

const GameScreen = () => {
  const yodelAudioRef = useRef<any>(null);
  const climberStopsMovingAudioRef = useRef<any>(null);
  const winningAudioRef = useRef<any>(null);
  const fallAudioRef = useRef<any>(null);

  const {
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
    startPoint: startPointContext,
    setStartPoint: setStartPointContext,
    startPositionY,
    setStartPositionY,
    startPositionX,
    setStartPositionX,
    leftLimit,
    setLeftLimit,
  } = useGame();

  const MAX_MOVES = 25;

  const [isStartPositionSet, setStartPositionSet] = useState<boolean>(false);
  const [falling, setFalling] = useState<boolean>(false);
  const [isYodeling, setIsYodeling] = useState<boolean>(false);
  const [outerRocksSize, setOuterRocksSize] = useState<null | {
    width: number;
    height: number;
  }>(null);
  const [headerHeight, setHeaderHeight] = useState<null | number>(null);
  const [isGameStarted, setIsGmeStarted] = useState<boolean>(false);
  const [rightLimit, setRightLimit] = useState<number>(0);
  const [points, setPoints] = useState<{ [key: number]: number }>({});

  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [isMainBgLoaded, setMainBgLoaded] = useState<boolean>(false);
  const [isGameContainerLoaded, setGameContainerLoaded] =
    useState<boolean>(false);

  const [gameBackgroundElement, setGameBackgroundElement] = useState<any>(null);
  const [yodelyGuyElement, setYodelyGuyElement] = useState<any>(null);
  const [rulerElement, setRulerElement] = useState<any>(null);
  const [gameMarginBottom, setGameMarginBottom] = useState<number | null>(null);

  const navigate = useNavigate();

  const handlePlayYodelAudioRef = () => {
    climberStopsMovingAudioRef.current.pause();
    winningAudioRef.current.pause();
    fallAudioRef.current.pause();
    yodelAudioRef.current.pause();
    yodelAudioRef.current.currentTime = 0;
    yodelAudioRef.current.play();
  };

  const handlePlayClimberStopsAudioRef = () => {
    yodelAudioRef.current.pause();
    winningAudioRef.current.pause();
    fallAudioRef.current.pause();
    climberStopsMovingAudioRef.current.pause();
    climberStopsMovingAudioRef.current.currentTime = 0;
    climberStopsMovingAudioRef.current.play();
  };

  const handlePlayWinningAudioRef = () => {
    yodelAudioRef.current.pause();
    climberStopsMovingAudioRef.current.pause();
    fallAudioRef.current.pause();
    winningAudioRef.current.pause();
    winningAudioRef.current.currentTime = 0;
    winningAudioRef.current.play();
  };

  const handlePlayFallAudioRef = () => {
    yodelAudioRef.current.pause();
    climberStopsMovingAudioRef.current.pause();
    winningAudioRef.current.pause();
    fallAudioRef.current.pause();
    fallAudioRef.current.currentTime = 0;
    fallAudioRef.current.play();
  };

  const getClosestPointKey = (x: number) => {
    let closestKey = null;
    for (const [key, value] of Object.entries(points)) {
      if (value <= x) {
        closestKey = key;
      } else {
        break;
      }
    }
    return closestKey;
  };

  useEffect(() => {
    const { x: xCoefficient, y: yCoefficient } = getStepXCoefficient(
      window.innerWidth,
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        handlePlayWinningAudioRef();
      }

      if (
        event.key === 'ArrowLeft' &&
        positionX < rightLimit &&
        positionX > leftLimit
      ) {
        setIsYodeling(true);
        setIsGmeStarted(true);
        setPositionX((prevPositionX) =>
          Math.max(prevPositionX - xCoefficient, -window.innerWidth),
        );
        setPositionY((prevPositionY) =>
          Math.max(prevPositionY - yCoefficient, 0),
        );
      }

      if (event.key === 'ArrowLeft' && positionX === leftLimit) {
        yodelAudioRef.current.pause();
      }

      if (event.key === 'ArrowRight') {
        positionX < rightLimit && setIsYodeling(true);
        setIsGmeStarted(true);

        setPositionX((prevPositionX) => {
          const newPositionX = Math.min(
            prevPositionX + xCoefficient,
            rightLimit,
          );
          return newPositionX;
        });
        setPositionY((prevPositionY) =>
          positionX < rightLimit
            ? Math.min(prevPositionY + yCoefficient, window.innerHeight)
            : startPositionY,
        );
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setIsYodeling(false);
        yodelAudioRef.current.pause();
        positionX < rightLimit && handlePlayClimberStopsAudioRef();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [positionX, positionY, isRendered]);

  useEffect(() => {
    if (positionX === rightLimit) {
      positionY !== startPositionY && setFalling(true);
      positionY !== startPositionY && !falling && handlePlayFallAudioRef();
      setPositionY(startPositionY);
    }
  }, [positionX, rightLimit, positionY, startPositionY, falling]);

  useEffect(() => {
    const centerPosition = yodelyGuyElement ? yodelyGuyElement.width / 2 : 0;
    const closestKey = getClosestPointKey(positionX + centerPosition);
    if (closestKey !== null) {
      setRemainingMoves(MAX_MOVES - +closestKey);
    }
  }, [positionX, yodelyGuyElement]);

  useEffect(() => {
    if (falling) {
      const timer = setTimeout(() => {
        setFalling(false);
      }, 1500);
      const play = setTimeout(() => {
        handlePlayFallAudioRef();
      }, 0);

      return () => {
        clearTimeout(timer);
        clearTimeout(play);
      };
    }
  }, [falling]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isYodeling) {
      handlePlayYodelAudioRef();
    }
  }, [isYodeling]);

  useEffect(() => {
    setTimeout(() => {
      if (yodelyGuyElement && gameBackgroundElement) {
        const yodelyGuyRect = yodelyGuyElement.getBoundingClientRect();
        const gameBackgroundRect =
          gameBackgroundElement.getBoundingClientRect();

        const relativeX = yodelyGuyRect.left - gameBackgroundRect.left;
        const relativeY = gameBackgroundRect.bottom - yodelyGuyRect.bottom;

        if (
          (!savedPositionX || savedPositionX <= startPositionX) &&
          (!savedPositionY || savedPositionY <= startPositionY) &&
          !isStartPositionSet
        ) {
          setPositionX(relativeX);
          setPositionY(relativeY);
          setStartPositionX(relativeX);
          setStartPositionY(relativeY);
          setStartPositionSet(true);
        } else if (savedPositionX && savedPositionY) {
          setPositionX(savedPositionX);
          setPositionY(savedPositionY);
        }
      }
    }, 50);
  }, [
    isStartPositionSet,
    yodelyGuyElement,
    gameBackgroundElement,
    isRendered,
    isMainBgLoaded,
    isGameContainerLoaded,
    savedPositionX,
    savedPositionY,
    startPositionX,
    startPositionY,
  ]);

  useEffect(() => {
    if (rulerElement && gameBackgroundElement && yodelyGuyElement) {
      const rulerRect = rulerElement.getBoundingClientRect();
      const gameBackgroundRect = gameBackgroundElement.getBoundingClientRect();
      const yodelyGuyRect = yodelyGuyElement.getBoundingClientRect();

      const rulerRight = rulerRect.right;
      const gameBackgroundLeft = gameBackgroundRect.left;

      const distanceFromLeft = rulerRight - gameBackgroundLeft;

      const yodelyGuyWidth = yodelyGuyRect.width / 1.3;
      const adjustedDistance = distanceFromLeft - yodelyGuyWidth;
      const reightLimit =
        outerRocksSize && outerRocksSize.width > 2000
          ? adjustedDistance + 9
          : outerRocksSize && outerRocksSize.width > 1900
          ? adjustedDistance + 8
          : outerRocksSize && outerRocksSize.width > 1800
          ? adjustedDistance + 7
          : outerRocksSize && outerRocksSize.width > 1700
          ? adjustedDistance + 6
          : outerRocksSize && outerRocksSize.width > 1600
          ? adjustedDistance + 5
          : outerRocksSize && outerRocksSize.width > 1500
          ? adjustedDistance + 5
          : outerRocksSize && outerRocksSize.width > 1400
          ? adjustedDistance + 4
          : outerRocksSize && outerRocksSize.width > 1300
          ? adjustedDistance + 3
          : outerRocksSize && outerRocksSize.width > 1200
          ? adjustedDistance + 3
          : outerRocksSize && outerRocksSize.width > 1100
          ? adjustedDistance + 4
          : outerRocksSize && outerRocksSize.width > 1000
          ? adjustedDistance + 2
          : adjustedDistance + 3;

      setRightLimit(reightLimit);

      const distanceFromLeftLimit =
        yodelyGuyRect.left - gameBackgroundRect.left;

      if (leftLimit === 0 || !leftLimit) setLeftLimit(distanceFromLeftLimit);

      const koeficient = !outerRocksSize
        ? 0.97
        : outerRocksSize.width > 0 && outerRocksSize.width <= 700
        ? 0.98
        : outerRocksSize.width > 700 && outerRocksSize.width <= 800
        ? 0.99
        : outerRocksSize.width > 800 && outerRocksSize.width <= 1080
        ? 1
        : outerRocksSize.width > 1080 && outerRocksSize.width <= 1320
        ? 1.007
        : outerRocksSize.width > 1320 && outerRocksSize.width <= 1324
        ? 1.014
        : outerRocksSize.width > 1324 && outerRocksSize.width <= 1500
        ? 1.01
        : outerRocksSize.width > 1500 && outerRocksSize.width <= 1600
        ? 1.012
        : outerRocksSize.width > 1600 && outerRocksSize.width <= 1820
        ? 1.015
        : outerRocksSize.width > 1820 && outerRocksSize.width <= 1900
        ? 1.017
        : outerRocksSize.width > 1900 && outerRocksSize.width <= 2000
        ? 1.0171
        : outerRocksSize.width > 2000 && outerRocksSize.width <= 2400
        ? 1.0175
        : outerRocksSize.width > 2400 && outerRocksSize.width <= 2560
        ? 1.018
        : outerRocksSize.width > 2560 && outerRocksSize.width <= 2800
        ? 1.024
        : outerRocksSize.width > 2800 && outerRocksSize.width <= 3000
        ? 1.025
        : outerRocksSize.width > 3000 && outerRocksSize.width <= 3200
        ? 1.026
        : outerRocksSize.width > 3200 && outerRocksSize.width <= 4000
        ? 1.028
        : 1.03;

      const moveForBigScreen = !outerRocksSize ? 0 : 3;

      const numberOfPoints = 25;

      const startPoint = startPointContext
        ? startPointContext
        : yodelyGuyRect.left +
          yodelyGuyRect.width / 2 -
          gameBackgroundRect.left -
          moveForBigScreen;

      !startPointContext && setStartPointContext(startPoint);

      const pointDistance =
        ((adjustedDistance - startPoint) / numberOfPoints) * koeficient;
      const pointsObject: { [key: number]: number } = {};

      for (let i = 0; i <= numberOfPoints; i++) {
        pointsObject[i] = startPoint + i * pointDistance + i;
      }

      setPoints({
        ...pointsObject,
        25:
          outerRocksSize && outerRocksSize.width > 2800
            ? pointsObject[25] - 6
            : outerRocksSize && outerRocksSize.width > 2000
            ? pointsObject[25] - 8
            : outerRocksSize && outerRocksSize.width > 1600
            ? pointsObject[25] - 3
            : pointsObject[25] - 2.5,
      });
    }
  }, [
    rulerElement,
    gameBackgroundElement,
    yodelyGuyElement,
    isRendered,
    isMainBgLoaded,
    isGameContainerLoaded,
    outerRocksSize,
    startPointContext,
    leftLimit,
  ]);

  const updateDimensions = () => {
    const element = document.getElementById('outer-rocks');
    if (element) {
      const { offsetWidth, offsetHeight } = element;
      setOuterRocksSize({
        width: offsetWidth,
        height: offsetHeight,
      });
    }
  };

  const updateDimensionsBackground = () => {
    const element = document.getElementById('game-background');
    if (element) {
      setGameBackgroundElement(element);
    }
  };

  const updateDimensionsHeader = () => {
    const element = document.getElementById('heaeder');
    if (element) {
      const { offsetHeight } = element;
      setHeaderHeight(offsetHeight);
    }
  };

  const updateDimensionsYodelyGuy = () => {
    const element = document.getElementById('yodely-guy');
    if (element) {
      setYodelyGuyElement(element);
    }
  };

  const updateDimensionsRuler = () => {
    const element = document.getElementById('ruler');
    if (element) {
      setRulerElement(element);
    }
  };

  useEffect(() => {
    updateDimensions();
    updateDimensionsBackground();
    updateDimensionsHeader();
    updateDimensionsYodelyGuy();
    updateDimensionsRuler();

    window.addEventListener('resize', () => {
      updateDimensions();
      updateDimensionsBackground();
      updateDimensionsHeader();
      updateDimensionsYodelyGuy();
      updateDimensionsRuler();
    });

    const rerender1 = setTimeout(() => {
      updateDimensions();
      updateDimensionsBackground();
      updateDimensionsHeader();
      updateDimensionsYodelyGuy();
      updateDimensionsRuler();
    }, 100);

    const rerender2 = setTimeout(() => {
      updateDimensions();
      updateDimensionsBackground();
      updateDimensionsHeader();
      updateDimensionsYodelyGuy();
      updateDimensionsRuler();
    }, 500);

    return () => {
      window.removeEventListener('resize', () => {
        updateDimensions();
        updateDimensionsBackground();
        updateDimensionsHeader();
        updateDimensionsYodelyGuy();
        updateDimensionsRuler();
      });
      clearTimeout(rerender1);
      clearTimeout(rerender2);
    };
  }, []);

  useEffect(() => {
    if (
      outerRocksSize &&
      gameBackgroundElement &&
      rulerElement &&
      rulerElement.y < 0
    ) {
      setGameMarginBottom(Math.abs(rulerElement.y));
    }

    if (
      outerRocksSize &&
      gameBackgroundElement &&
      rulerElement &&
      rulerElement.y > 0
    ) {
      setGameMarginBottom(null);
    }
  }, [rulerElement, gameBackgroundElement, outerRocksSize]);

  const fallAnimation = falling
    ? {
        animation: `fall ${
          Math.abs(positionY - startPositionY) / 100
        }s ease-out, rotate 1.5s linear`,
        transition: 'bottom 1.5s ease-out',
        bottom: `${startPositionY}px`,
        transform: 'rotate(360deg)',
      }
    : {};

  return (
    <div className='relative m-auto w-screen h-screen transition-opacity duration-500 animate-fadeIn'>
      <audio
        ref={yodelAudioRef}
        src={ThePriceIsRightYodelling}
        preload='auto'
      />
      <audio ref={climberStopsMovingAudioRef} src={SingleDing} preload='auto' />
      <audio ref={winningAudioRef} src={WinningDingX10} preload='auto' />
      <audio ref={fallAudioRef} src={ScreamCrash} preload='auto' />

      <img
        src={
          outerRocksSize && outerRocksSize.width >= 2560
            ? OuterRocks2560
            : outerRocksSize && outerRocksSize.width >= 1920
            ? OuterRocks1920
            : OuterRocks1366
        }
        alt='OuterRocks'
        className='w-full absolute bottom-0 left-0 right-0 m-auto z-[42] max-w-screen max-h-[101vh]'
        onLoad={() => setMainBgLoaded(true)}
        id='outer-rocks'
      />
      <img
        src={
          outerRocksSize && outerRocksSize.width >= 2100
            ? Header2560
            : outerRocksSize && outerRocksSize.width >= 1700
            ? Header1920
            : Header1366
        }
        style={
          outerRocksSize
            ? {
                maxWidth:
                  outerRocksSize && outerRocksSize.width >= 2100
                    ? 1896
                    : outerRocksSize && outerRocksSize.width >= 1700
                    ? 1487
                    : 1067,
                bottom:
                  outerRocksSize.height <= 0 ||
                  outerRocksSize.height === undefined ||
                  !headerHeight
                    ? 'auto'
                    : outerRocksSize.height - headerHeight,
                opacity:
                  outerRocksSize.height === undefined || !isMainBgLoaded
                    ? '0'
                    : '1',
              }
            : {}
        }
        alt='Header'
        className='w-full h-auto absolute left-0 right-[20px] m-auto z-50 bottom-[365px] max-w-[1400px] animate-fadeIn'
        id='heaeder'
      />
      <img
        src={
          outerRocksSize && outerRocksSize.width >= 2560
            ? GameBackground2560
            : outerRocksSize && outerRocksSize.width >= 1920
            ? GameBackground1920
            : GameBackground1366
        }
        style={{
          transform: gameMarginBottom
            ? `translateY(${gameMarginBottom}px)`
            : `translateY(0)`,
        }}
        alt='GameBackground'
        id='game-background'
        className='w-[96%] min-[1920px]:w-[96%] min-[2560px]:w-[93%] absolute bottom-0 left-0 right-0 m-auto z-0'
        onLoad={() => setIsRendered(true)}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 m-auto w-full h-full z-50 ${
          !falling && positionY === startPositionY ? '!z-0' : ''
        }`}
        style={{
          maxWidth: !!gameBackgroundElement?.offsetWidth
            ? gameBackgroundElement.offsetWidth
            : 'auto',
          maxHeight: !!gameBackgroundElement?.offsetHeight
            ? gameBackgroundElement.offsetHeight
            : 'auto',
          transform: gameMarginBottom
            ? `translateY(${gameMarginBottom}px)`
            : `translateY(0)`,
          zIndex: falling ? 0 : 50,
        }}
        onLoad={() => setGameContainerLoaded(true)}
      >
        <img
          src={YellowRulerRotate}
          id='ruler'
          alt='Ruler'
          style={{
            opacity: isGameContainerLoaded && isMainBgLoaded ? '1' : '0',
          }}
          className={`h-full absolute ${
            outerRocksSize && outerRocksSize.width >= 2560
              ? ' w-[65%] bottom-[14.1%] left-[17.5%]'
              : outerRocksSize && outerRocksSize.width >= 1920
              ? ' w-[65%] bottom-[14%] left-[17.4%]'
              : ' w-[65%] bottom-[13.7%] left-[17.3%]'
          } m-auto z-30 object-contain`}
        />
        <img
          src={YodelyGuy}
          alt='YodelyGuy'
          id='yodely-guy'
          className={`absolute yodely-guy z-[100] ${
            falling ? 'fall rotate' : ''
          }
          ${
            outerRocksSize && outerRocksSize.width >= 2560
              ? 'w-[4.8%] left-[17.4%] bottom-[44.8%]'
              : outerRocksSize && outerRocksSize.width >= 1920
              ? 'w-[4.3%] left-[17.5%] bottom-[44.9%]'
              : 'w-[4.7%] left-[17.3%] bottom-[44.3%]'
          }`}
          style={
            (isGameStarted && positionX !== 0 && positionY !== 0) ||
            (savedPositionX && savedPositionY)
              ? {
                  opacity: isGameContainerLoaded && isMainBgLoaded ? '1' : '0',
                  left: `${positionX}px`,
                  bottom: `${positionY}px`,
                  ...fallAnimation,
                }
              : {}
          }
        />
      </div>

      <div className='absolute bottom-[27px] min-[2560px]:bottom-[24px] left-[50px] w-[70px] min-[2560px]:w-[140px] h-[40px] min-[2560px]:h-[80px] text-[32px] min-[2560px]:text-[64px] bg-[#e3e3e3] text-[#333] font-bold rounded-[5px] flex items-center justify-center z-[9999]'>
        {remainingMoves}
      </div>
      <div className='absolute bottom-[27px] min-[2560px]:bottom-[24px] right-[50px] flex items-center justify-center z-[9999]'>
        <button
          className='w-fit h-[43px] min-[2560px]:h-[86px] text-[28px] min-[2560px]:text-[56px] px-1 min-[800px]:px-[8px] min-[1200px]:px-[12px] bg-[#56639d] hover:bg-[#56639d]/70 active:bg-[#56639d]/50 text-[#fff] font-bold rounded-[5px] uppercase transition'
          onClick={() => {
            setSavesPositionX(positionX);
            setSavesPositionY(positionY);
            navigate('/products');
          }}
        >
          products
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
