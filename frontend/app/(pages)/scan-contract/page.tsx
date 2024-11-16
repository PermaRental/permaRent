'use client';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function ScanContract() {
  return (
    <div className='absolute top-0 right-0 bottom-0 left-0 bg-background z-50 flex flex-col items-center justify-between'>
      <header className='w-full p-4'>
        <div>Cancel</div>
      </header>
      <div className='w-[90vw] h-[90vw]'>
        <Scanner
          onScan={(result) =>
            result?.[0]?.rawValue &&
            window.location.assign(result?.[0]?.rawValue)
          }
        />
      </div>
      <div></div>
    </div>
  );
}
