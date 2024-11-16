'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export default function ShareDeal() {
  const [locationHref, setLocationHref] = useState('');

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(locationHref);
      setCopied(true);

      // 3秒后重置状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    setLocationHref(window.location.href);
  }, []);

  return (
    <div className='flex flex-col gap-2 items-center mb-4'>
      <div className='w-[50vw] h-[50vw] border-blue-500 border-4 p-2'>
        {locationHref && (
          <QRCodeSVG width='100%' height='100%' value={locationHref} />
        )}
      </div>
      <div>
        <button
          onClick={handleCopy}
          className={`
        inline-flex items-center gap-2 px-4 py-2 
        border rounded-full transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          copied
            ? 'border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-500'
            : 'border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500'
        }
      `}
        >
          {copied ? (
            <>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
