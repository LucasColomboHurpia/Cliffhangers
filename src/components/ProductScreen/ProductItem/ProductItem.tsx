import { FC, useEffect, useRef, useState } from 'react';

import ProductItemBG from '../../../assets/ProductItem.svg';
import {
  ProductsState,
  ProductType,
  useProducts,
} from '../../../context/ProductContext';

interface IProductItemProps {
  product: ProductType;
  productKey: keyof ProductsState;
}

const ProductItem: FC<IProductItemProps> = ({ productKey, product }) => {
  const { setProduct } = useProducts();
  const { nameOpened, priceOpened } = product;

  const [productName, setProductName] = useState<string>('');
  const [productImage, setProductImage] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [parentHeight, setParentHeight] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleShowName = () => {
    !!product.productName.length &&
      setProduct(productKey, { ...product, nameOpened: true });
  };

  const handleShowPrice = () => {
    !!product.productPrice.length &&
      setProduct(productKey, { ...product, priceOpened: true });
  };

  useEffect(() => {
    if (containerRef.current) {
      const parentElement = containerRef.current.parentElement;
      if (parentElement) {
        setParentHeight(parentElement.clientHeight);
      }
    }
  }, [containerRef]);

  useEffect(() => {
    if (!nameOpened) {
      setProductName('');
      setProductImage('');
    }
    if (nameOpened) {
      setProductName(product.productName);
      setProductImage(product.imgSrc);
    }
  }, [nameOpened, product]);

  useEffect(() => {
    if (priceOpened) {
      setProductPrice(product.productPrice);
    }
  }, [priceOpened, product]);

  return (
    <div
      className='w-fit pt-5'
      ref={containerRef}
      style={parentHeight ? { maxHeight: parentHeight } : {}}
    >
      <div className='w-full h-[200px] lg:h-[200px]'>
        {productImage && (
          <img
            src={productImage}
            alt='Product image'
            className={`max-w-[315px] w-full h-[200px] lg:h-[200px] rounded-[5px] transition-opacity duration-500 object-contain ${
              productImage ? 'opacity-100 animate-fadeIn' : 'opacity-0'
            }`}
          />
        )}
      </div>
      <div className='relative w-fit'>
        <div className='absolute top-[55px] left-0 right-0 m-auto z-40'>
          <div
            style={{ boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.5)' }}
            className='bg-[#56639d] hover:brightness-110 active:brightness-[1.18] transition w-full md:h-[46px] h-[36px] mb-2 flex items-center justify-center cursor-pointer rounded-[5px]'
            onClick={handleShowName}
          >
            <p
              className={`md:text-[28px] text-[26px] font-bold uppercase text-white transition-opacity duration-500 ${
                nameOpened ? 'opacity-100 animate-fadeIn' : 'opacity-0'
              }`}
            >
              {productName}
            </p>
          </div>
          <div
            style={{ boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.5)' }}
            className='bg-[#e3e3e3] hover:brightness-110 active:brightness-[1.18] transition w-[142px] md:h-[46px] h-[36px] m-auto flex items-center justify-center rounded-[5px]'
            onClick={() => productName && handleShowPrice()}
          >
            <p
              className={`text-center md:text-[32px] text-[26px] font-bold uppercase text-[#333] cursor-pointer transition-opacity duration-500 ${
                priceOpened && productPrice
                  ? 'opacity-100 animate-fadeIn'
                  : 'opacity-0'
              }`}
            >
              {productPrice ? '$' + productPrice : ''}
            </p>
          </div>
        </div>
        <img
          src={ProductItemBG}
          alt='Product item'
          className='relative top-[16px]'
        />
      </div>
    </div>
  );
};

export default ProductItem;
