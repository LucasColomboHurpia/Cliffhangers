import { FC } from 'react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const ConfirmationPopup: FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onReset,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed w-screen h-screen bg-black/70 z-50 flex justify-center items-center transition-opacity duration-[50ms] animate-fadeIn'
      onClick={handleBackdropClick}
    >
      <div className='bg-[#ffffee] rounded-[15px] m-auto w-full max-w-[500px] p-5'>
        <h6 className='text-[28px] font-bold text-black/80 font-inter text-center mb-5'>
          Are you sure you want to reset the game?
        </h6>
        <div className='flex justify-around'>
          <button
            style={{
              textShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
              boxShadow:
                'inset 3px -2px 4px 0 rgba(144, 144, 144, 0.25), inset -2px 0 4px 0 rgba(92, 92, 92, 0.25)',
            }}
            className='w-fit h-[43px] bg-[#56639d] hover:bg-[#56639d]/70 active:bg-[#56639d]/50 transition text-[#fff] text-[28px] font-bold rounded-[5px] uppercase px-2'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={{
              textShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
              boxShadow:
                'inset 3px -2px 4px 0 rgba(144, 144, 144, 0.25), inset -2px 0 4px 0 rgba(92, 92, 92, 0.25)',
            }}
            className='w-[111px] h-[43px] px-1 bg-[#9D5656] hover:bg-[#9D5656]/70 active:bg-[#9D5656]/50 transition text-[#fff] text-[28px] font-bold rounded-[5px] uppercase'
            onClick={() => {
              onClose(), onReset();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
