// Overlay.tsx
import React from 'react';

interface OverlayProps {
  isVisible: boolean;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-x-0 inset-y-0 w-screen h-screen flex flex-col justify-center items-center gap-4 bg-black bg-opacity-80 text-white z-50 p-6'>
      <div className='flex flex-col items-center gap-2 text-sm text-center text-gray-400'>
        <div className='inline-flex justify-center items-center w-20 h-20'>
          <div className='loader' />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
