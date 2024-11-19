import { FC, useEffect, useState } from 'react';

import ProductItemBG from '../../../assets/ProductItem.svg';
import { ProductType, ProductsState, useProducts } from '../../../context/ProductContext';

interface IProductItemProps {
  product: ProductType;
  productKey: keyof ProductsState;
}

const ProductItem: FC<IProductItemProps> = ({ productKey, product }) => {
  const { setProduct } = useProducts();
  const { priceOpened } = product;

  const [productImage, setProductImage] = useState<string>('');

  const handleShowPrice = () => {
    if (product.productPrice) {
      setProduct(productKey, { ...product, priceOpened: true });
    }
  };

  useEffect(() => {
    setProductImage(product.imgSrc); // Set the product image
  }, [product]);

  return (
    <div className="w-fit pt-5">
      <div className="w-full h-[200px] lg:h-[200px]">
        {productImage && (
          <img
            src={productImage}
            alt="Product image"
            className="max-w-[315px] w-full h-[200px] lg:h-[200px] rounded-[5px] object-contain"
          />
        )}
      </div>
      <div className="relative w-fit">
        <div className="absolute top-[55px] left-0 right-0 m-auto z-40">
          {/* Always Visible Name */}
          <div
            style={{ boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.5)' }}
            className="bg-[#56639d] w-full md:h-[46px] h-[36px] mb-2 flex items-center justify-center rounded-[5px] transition"
          >
            <p className="md:text-[28px] text-[26px] font-bold uppercase text-white">
              {product.productName}
            </p>
          </div>
          {/* Price Button */}
          <div
            style={{ boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.5)' }}
            className={`bg-[#e3e3e3] w-[142px] md:h-[46px] h-[36px] m-auto flex items-center justify-center rounded-[5px] transition ${
              priceOpened ? 'cursor-pointer hover:brightness-110 active:brightness-[1.18]' : 'cursor-pointer'
            }`}
            onClick={handleShowPrice}
          >
            {/* Conditional Rendering of Price */}
            {priceOpened ? (
              <p className="text-center md:text-[32px] text-[26px] font-bold uppercase text-[#333]">
                ${product.productPrice}
              </p>
            ) : (
              <p className="text-center md:text-[32px] text-[26px] font-bold uppercase text-[#333]">
                ?
              </p>
            )}
          </div>
        </div>
        <img
          src={ProductItemBG}
          alt="Product item"
          className="relative top-[16px]"
        />
      </div>
    </div>
  );
};

export default ProductItem;
