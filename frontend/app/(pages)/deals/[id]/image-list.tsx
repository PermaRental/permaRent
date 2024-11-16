import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function ImageList({ hash }: { hash: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const { data: images = [] } = useQuery({
    queryKey: ['get-image-list', hash],
    queryFn: async () => {
      if (!hash) {
        throw new Error('Please upload your file first!');
      }

      const images = (await getImageInfoFromIpfs(hash)) as string[];

      return images?.map(
        (ele) => `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}${ele}`
      );
    },
  });

  async function getImageInfoFromIpfs(hash: string) {
    const response = await fetch(`/api/extract-image-data?hash=${hash}`);
    const results = await response.json();
    return results?.folderContents;
  }

  // 准备 lightbox 需要的数据格式
  const slides = images.map((src) => ({ src }));

  return (
    <div>
      <span className='text-xl font-bold mb-4 flex'>Contract detail</span>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {images?.map((image, index) => (
          <div
            key={index}
            className='relative aspect-square cursor-pointer'
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className='w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity'
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
        // 基础配置
        carousel={{
          finite: true,
          preload: 1,
        }}
        render={{
          buttonPrev: images.length <= 1 ? () => null : undefined,
          buttonNext: images.length <= 1 ? () => null : undefined,
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, .8)' },
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </div>
  );
}
