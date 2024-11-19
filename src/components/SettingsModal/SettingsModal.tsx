import React, { FC, useEffect, useState } from 'react';
import CrossIcon from '../../assets/CrossIcon.svg';
import AcceptImages from '../../assets/AcceptImages.svg';
import { ProductType, useProducts } from '../../context/ProductContext';
import ConfirmationPopup from './ConfirmationPopup/ConfirmationPopup';
import { useGame } from '../../context/GameContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const { products, setProduct, resetProducts } = useProducts();
  const { resetGame } = useGame();

  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [product1, setProduct1] = useState<ProductType>(products.product1);
  const [product2, setProduct2] = useState<ProductType>(products.product2);
  const [product3, setProduct3] = useState<ProductType>(products.product3);

  const [imagePreview1, setImagePreview1] = useState<
    string | ArrayBuffer | null
  >(product1.imgSrc || null);
  const [imagePreview2, setImagePreview2] = useState<
    string | ArrayBuffer | null
  >(product2.imgSrc || null);
  const [imagePreview3, setImagePreview3] = useState<
    string | ArrayBuffer | null
  >(product3.imgSrc || null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productSetter: React.Dispatch<React.SetStateAction<ProductType>>,
    setImagePreview: React.Dispatch<
      React.SetStateAction<string | ArrayBuffer | null>
    >,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        productSetter((prev) => ({
          ...prev,
          imgSrc: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setProduct('product1', product1);
  }, [product1]);

  useEffect(() => {
    setProduct('product2', product2);
  }, [product2]);

  useEffect(() => {
    setProduct('product3', product3);
  }, [product3]);

  if (!isOpen) return null;

  return (
    <div
      id='default-modal'
      tabIndex={-1}
      className='fixed inset-0 z-50 overflow-auto'
    >
      <div
        className='fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-[50ms] animate-fadeIn'
        onClick={handleBackdropClick}
      />
      <div className='absolute top-5 left-0 right-0 pb-5 z-10 w-fit h-fit flex justify-center items-center m-auto transition-opacity duration-[200ms] animate-fadeIn'>
        <button
          style={{ boxShadow: 'inset 0 0 7px 0 rgba(255, 255, 255, 0.15)' }}
          className='absolute top-[10px] right-5 px-4 py-[6px] bg-[#e3e3e3] hover:bg-[#e3e3e3]/70 active:bg-[#e3e3e3]/50 transition rounded-[5px]'
          onClick={onClose}
        >
          <img src={CrossIcon} alt='CrossIcon' />
        </button>
        <div className='bg-[#ffe] rounded-[15px] p-8 w-full max-w-[788px]'>
          <h3 className='font-bold text-[18px] font-inter mb-[5px]'>
            How To Play
          </h3>
          <ul className='list-disc pl-5 text-[18px] font-inter font-normal mb-[26px] ml-[10px]'>
            <li>
              The player needs to prevent the climber from falling off the
              mountain by guessing the prices of three different items. The
              difference between their guess and the actual retail price of the
              item will dictate how successful they are.
            </li>
            <li>
              Start the game by showing the player the first item, describing
              that item, and asking them to guess the price. For every dollar
              the guess is off from the actual price, the climber moves up one
              step on the mountain.
            </li>
            <li>Then move on to the second and third items.</li>
            <li>
              The goal is to guess as accurately as possible to minimize the
              climber's movement. If the climber moves more than 25 steps, he
              falls off the mountain, and the game is lost. The game is won if
              the climber does not fall after all three prices have been
              guessed.
            </li>
          </ul>

          <h3 className='font-bold text-[18px] font-inter mb-[5px]'>
            Game Controls
          </h3>
          <p className='text-[18px] font-inter font-normal underline'>
            Game Screen
          </p>
          <ul className='list-disc pl-5 text-[18px] font-inter font-normal mb-[5px] ml-[10px]'>
            <li>&larr; &rarr; : Move Climber (left and right arrows)</li>
            <li>(Spacebar) Button: Winning sound effect</li>
          </ul>
          <p className='text-[18px] font-inter font-normal underline'>
            Product Page
          </p>
          <ul className='list-disc pl-5 text-[18px] font-inter font-normal mb-[23px] ml-[10px]'>
            <li>Click the nameplate to reveal the product</li>
            <li>Y Button: Correct Guess sound effect</li>
            <li>N Button: Incorrect Guess sound effect</li>
            <li>Click the price to reveal the price</li>
          </ul>

          <div className='flex justify-between items-start gap-[25px]'>
            <div className='w-full'>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-base font-inter'>Product 1:</p>
                <input
                  type='text'
                  value={product1.productName}
                  onChange={(e) =>
                    setProduct1((prev) => ({
                      ...prev,
                      productName: e.target.value,
                    }))
                  }
                  placeholder='Product Name'
                  className='font-inter max-w-[142px] w-full h-[28px] rounded-[2px] p-2 border border-[#c0bfc1] border-solid mb-[5px]'
                />
              </div>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-base font-inter'>Price:</p>
                <input
                  type='text'
                  value={product1.productPrice}
                  onChange={(e) =>
                    +e.target.value < 999999 &&
                    setProduct1((prev) => ({
                      ...prev,
                      productPrice: e.target.value,
                    }))
                  }
                  placeholder='Product Price'
                  className='font-inter max-w-[142px] w-full h-[28px] rounded-[2px] p-2 border border-[#c0bfc1] border-solid mb-[5px]'
                />
              </div>
              <div className='relative w-[223px] h-[101px] bg-white flex flex-col items-center justify-center text-center text-[#B6BBC1] border border-[#c0bfc1] rounded-[2px]'>
                {imagePreview1 ? (
                  <img
                    src={imagePreview1 as string}
                    alt='Product 1'
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <>
                    <img src={AcceptImages} alt='Accept images' />
                    <span className='text-xs font-inter font-normal text-[#B6BBC1]'>
                      Upload image
                    </span>
                  </>
                )}
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={(e) =>
                    handleFileChange(e, setProduct1, setImagePreview1)
                  }
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </div>
            </div>
            <div className='w-full'>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-base font-inter'>Product 2:</p>
                <input
                  type='text'
                  value={product2.productName}
                  onChange={(e) =>
                    setProduct2((prev) => ({
                      ...prev,
                      productName: e.target.value,
                    }))
                  }
                  placeholder='Product Name'
                  className='font-inter max-w-[142px] w-full h-[28px] rounded-[2px] p-2 border border-[#c0bfc1] border-solid mb-[5px]'
                />
              </div>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-base font-inter'>Price:</p>
                <input
                  type='text'
                  value={product2.productPrice}
                  onChange={(e) =>
                    +e.target.value < 999999 &&
                    setProduct2((prev) => ({
                      ...prev,
                      productPrice: e.target.value,
                    }))
                  }
                  placeholder='Product Price'
                  className='font-inter max-w-[142px] w-full h-[28px] rounded-[2px] p-2 border border-[#c0bfc1] border-solid mb-[5px]'
                />
              </div>
              <div className='relative w-[223px] h-[101px] bg-white flex flex-col items-center justify-center text-center text-[#B6BBC1] border border-[#c0bfc1] rounded-[2px]'>
                {imagePreview2 ? (
                  <img
                    src={imagePreview2 as string}
                    alt='Product 2'
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <>
                    <img src={AcceptImages} alt='Accept images' />
                    <span className='text-xs font-inter font-normal text-[#B6BBC1]'>
                      Upload image
                    </span>
                  </>
                )}
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={(e) =>
                    handleFileChange(e, setProduct2, setImagePreview2)
                  }
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </div>
            </div>
            <div className='w-full'>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-base font-inter'>Product 3:</p>
                <input
                  type='text'
                  value={product3.productName}
                  onChange={(e) =>
                    setProduct3((prev) => ({
                      ...prev,
                      productName: e.target.value,
                    }))
                  }
                  placeholder='Product Name'
                  className='font-inter max-w-[142px] w-full h-[28px] rounded-[2px] p-2 border border-[#c0bfc1] border-solid mb-[5px]'
                />
              </div>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-base font-inter'>Price:</p>
                <input
                  type='text'
                  value={product3.productPrice}
                  onChange={(e) =>
                    +e.target.value < 999999 &&
                    setProduct3((prev) => ({
                      ...prev,
                      productPrice: e.target.value,
                    }))
                  }
                  placeholder='Product Price'
                  className='font-inter max-w-[142px] w-full h-[28px] rounded-[2px] p-2 border border-[#c0bfc1] border-solid mb-[5px]'
                />
              </div>
              <div className='relative w-[223px] h-[101px] bg-white flex flex-col items-center justify-center text-center text-[#B6BBC1] border border-[#c0bfc1] rounded-[2px]'>
                {imagePreview3 ? (
                  <img
                    src={imagePreview3 as string}
                    alt='Product 3'
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <>
                    <img src={AcceptImages} alt='Accept images' />
                    <span className='text-xs font-inter font-normal text-[#B6BBC1]'>
                      Upload image
                    </span>
                  </>
                )}
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={(e) =>
                    handleFileChange(e, setProduct3, setImagePreview3)
                  }
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </div>
            </div>
          </div>
          <div className='w-full mt-3 flex'>
            <button
              style={{
                textShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                boxShadow:
                  'inset 3px -2px 4px 0 rgba(144, 144, 144, 0.25), inset -2px 0 4px 0 rgba(92, 92, 92, 0.25)',
              }}
              className='w-[111px] h-[43px] px-1 bg-[#9D5656] hover:bg-[#9D5656]/70 active:bg-[#9D5656]/50 transition text-[#fff] text-[28px] font-bold rounded-[5px] uppercase ml-auto'
              onClick={() => setOpenConfirmationModal(true)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <ConfirmationPopup
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onReset={() => {
          resetProducts();
          resetGame();
        }}
      />
    </div>
  );
};

export default SettingsModal;
