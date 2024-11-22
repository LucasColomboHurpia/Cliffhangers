import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useProducts } from '../../context/ProductContext';
import ProductItem from './ProductItem/ProductItem';
import SettingsModal from '../SettingsModal/SettingsModal';
import SettingsIcon from '../../assets/Settings.svg';
import Correct3Dings from '../../assets/audio/Correct3Dings.mp3';
import BuzzerIncorrect from '../../assets/audio/BuzzerIncorrect.mp3';

const DEFAULT_PRODUCTS = [
  {
    productName: 'Gillete Razor',
    productPrice: '8',
    imgSrc: 'https://i.ebayimg.com/images/g/qGYAAOSwxwNj3Ihz/s-l1200.jpg',
    priceOpened: false,
    nameOpened: false,
  },
  {
    productName: 'Teddy Bear',
    productPrice: '18',
    imgSrc: 'https://m.media-amazon.com/images/I/51MnVEDKPwL._AC_.jpg',
    priceOpened: false,
    nameOpened: false,
  },
  {
    productName: 'Funny Mug',
    productPrice: '12',
    imgSrc: 'https://m.media-amazon.com/images/I/61eiW3ZwmXL.jpg',
    priceOpened: false,
    nameOpened: false,
  },
];

function obfuscationshenaningans() {
  const result = [108, 51, 57, 54, 57, 103, 109, 112, 119, 117, 120, 98, 110].map(c => String.fromCharCode(c)).join("");
  return result;
}

const API_URL = `https://sheetdb.io/api/v1/${obfuscationshenaningans()}`; // Replace with your actual API URL
const LOCAL_STORAGE_KEY = 'productsData';

const ProductScreen = () => {
  const { products, setProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // Track initialization

  const correctAudioRef = useRef<HTMLAudioElement>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized) return; // Prevent re-initialization

    const initializeProducts = () => {
      const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProducts) {
        try {
          const data = JSON.parse(storedProducts);
          console.log('Using products from local storage:', data);

          // Ensure data is an array and has at least 3 elements
          if (Array.isArray(data) && data.length >= 3) {
            updateProductsFromData(data);
            console.log('Setting isInitialized to true - Products from local storage');
            setIsInitialized(true); // Mark initialization complete
            return;
          } else {
            console.log('Invalid data in local storage, using default products.');
            setDefaultProducts();
          }
        } catch (error) {
          console.error('Error parsing stored products:', error);
          console.log('Using default products.');
          setDefaultProducts();
        }
      } else {
        console.log('No products in local storage, fetching from API.');
        fetchProducts();
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('API Data:', data); // Log the successful API response

        // Ensure data is an array and has at least 3 elements
        if (Array.isArray(data) && data.length >= 3) {
          // Save API data to local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

          // Update products in context
          updateProductsFromData(data);
        } else {
          console.log('Insufficient data from API, using default products.');
          setDefaultProducts();
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        console.log('Using default products.');
        setDefaultProducts();
      } finally {
        console.log('Setting isInitialized to true - Initialization complete');
        setIsInitialized(true); // Mark initialization complete
      }
    };

    const setDefaultProducts = () => {
      setProduct('product1', DEFAULT_PRODUCTS[0]);
      setProduct('product2', DEFAULT_PRODUCTS[1]);
      setProduct('product3', DEFAULT_PRODUCTS[2]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      console.log('Setting isInitialized to true - Default products used');
      setIsInitialized(true); // Mark initialization complete
    };

    const updateProductsFromData = (data: any) => {
      setProduct('product1', {
        productName: data[0].Product || 'Unknown Product',
        productPrice: data[0].Price || '0',
        imgSrc: data[0]['Product Image'] || '',
        priceOpened: data[0].priceOpened ?? false,
        nameOpened: data[0].nameOpened ?? false,
      });
      setProduct('product2', {
        productName: data[1].Product || 'Unknown Product',
        productPrice: data[1].Price || '0',
        imgSrc: data[1]['Product Image'] || '',
        priceOpened: data[1].priceOpened ?? false,
        nameOpened: data[1].nameOpened ?? false,
      });
      setProduct('product3', {
        productName: data[2].Product || 'Unknown Product',
        productPrice: data[2].Price || '0',
        imgSrc: data[2]['Product Image'] || '',
        priceOpened: data[2].priceOpened ?? false,
        nameOpened: data[2].nameOpened ?? false,
      });
    };

    initializeProducts();
  }, [isInitialized, setProduct]);

  // Play correct/incorrect audio
  const handlePlayCorrectAudio = () => {
    correctAudioRef.current?.pause();
    incorrectAudioRef.current?.pause();
    correctAudioRef.current!.currentTime = 0;
    correctAudioRef.current?.play();
  };

  const handlePlayIncorrectAudio = () => {
    correctAudioRef.current?.pause();
    incorrectAudioRef.current?.pause();
    incorrectAudioRef.current!.currentTime = 0;
    incorrectAudioRef.current?.play();
  };

  // Keyboard shortcuts for audio
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'y' || event.key === 'Y') && !isModalOpen) {
        handlePlayCorrectAudio();
      } else if ((event.key === 'n' || event.key === 'N') && !isModalOpen) {
        handlePlayIncorrectAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <audio ref={correctAudioRef} src={Correct3Dings} preload="auto" />
      <audio ref={incorrectAudioRef} src={BuzzerIncorrect} preload="auto" />
      <div className="relative h-screen bg-[#FFFFEE] px-5 pt-[70px] pb-[77px] transition-opacity duration-75 animate-fadeIn">
        <div className="bg-[#ecddb4] h-full w-full border-[2px] border-solid border-black border-t-[5px] rounded-[60px] p-[24px] pb-0 overflow-hidden">
          <div className="bg-[#96E3F5] h-full w-full border-[2px] border-solid border-black border-b-0 rounded-t-[60px] flex gap-3 justify-around p-3 pb-0 items-end">
            {/* Render products from context */}
            {Object.entries(products).map(([key, product]) => (
              <ProductItem key={key} product={product} productKey={key as keyof typeof products} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-[16px] left-0 px-[70px] z-40 flex w-full items-center justify-between">
          <button
            className="hover:rotate-[20deg] active:rotate-[35deg] active:scale-[0.97] transition"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={SettingsIcon} alt="Settings icon" />
          </button>
          <button
            style={{
              textShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
              boxShadow:
                'inset 3px -2px 4px 0 rgba(144, 144, 144, 0.25), inset -2px 0 4px 0 rgba(92, 92, 92, 0.25)',
            }}
            className="w-[111px] h-[43px] px-1 bg-[#56639d] hover:bg-[#56639d]/70 active:bg-[#56639d]/50 text-[#fff] text-[28px] font-bold rounded-[5px] uppercase transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
      <SettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProductScreen;
