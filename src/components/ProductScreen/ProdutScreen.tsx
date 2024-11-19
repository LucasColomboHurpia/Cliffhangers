import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductsState, useProducts } from '../../context/ProductContext';
import ProductItem from './ProductItem/ProductItem';
import SettingsModal from '../SettingsModal/SettingsModal';
import SettingsIcon from '../../assets/Settings.svg';
import Correct3Dings from '../../assets/audio/Correct3Dings.mp3';
import BuzzerIncorrect from '../../assets/audio/BuzzerIncorrect.mp3';

const ProdutScreen = () => {
  const { products } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const correctAudioRef = useRef<any>(null);
  const incorrectAudioRef = useRef<any>(null);

  const navigate = useNavigate();

  const handlePlayCorrectAudio = () => {
    correctAudioRef.current.pause();
    incorrectAudioRef.current.pause();
    correctAudioRef.current.currentTime = 0;
    correctAudioRef.current.play();
  };

  const handlePlayIncorrectAudio = () => {
    correctAudioRef.current.pause();
    incorrectAudioRef.current.pause();
    incorrectAudioRef.current.currentTime = 0;
    incorrectAudioRef.current.play();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.key === 'y' || event.key === 'Y') && !isModalOpen) {
      handlePlayCorrectAudio();
    } else if ((event.key === 'n' || event.key === 'N') && !isModalOpen) {
      handlePlayIncorrectAudio();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);
  return (
    <>
      <audio ref={correctAudioRef} src={Correct3Dings} preload='auto' />
      <audio ref={incorrectAudioRef} src={BuzzerIncorrect} preload='auto' />
      <div className='relative h-screen bg-[#FFFFEE] px-5 pt-[70px] pb-[77px]  transition-opacity duration-75 animate-fadeIn'>
        <div className='bg-[#ecddb4] h-full w-full border-[2px] border-solid border-black border-t-[5px] rounded-[60px] p-[24px] pb-0 overflow-hidden'>
          <div className='bg-[#96E3F5] h-full w-full border-[2px] border-solid border-black border-b-0 rounded-t-[60px] flex gap-3 justify-around p-3 pb-0 items-end'>
            {Object.entries(products).map(([key, product]) => (
              <ProductItem
                key={key}
                product={product}
                productKey={key as keyof ProductsState}
              />
            ))}
          </div>
        </div>

        <div className='absolute bottom-[16px] left-0 px-[70px] z-40 flex w-full items-center justify-between'>
          <button
            className='hover:rotate-[20deg] active:rotate-[35deg] active:scale-[0.97] transition'
            onClick={() => setIsModalOpen(true)}
          >
            <img src={SettingsIcon} alt='Settings icon' />
          </button>
          <button
            style={{
              textShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
              boxShadow:
                'inset 3px -2px 4px 0 rgba(144, 144, 144, 0.25), inset -2px 0 4px 0 rgba(92, 92, 92, 0.25)',
            }}
            className='w-[111px] h-[43px] px-1 bg-[#56639d] hover:bg-[#56639d]/70 active:bg-[#56639d]/50 text-[#fff] text-[28px] font-bold rounded-[5px] uppercase transition'
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProdutScreen;
