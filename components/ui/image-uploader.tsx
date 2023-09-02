// image upload widget



'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image'



interface UploadImageProps {
  disabled?: boolean,
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  urls: string[];
}


// component
const ImageUploader: React.FC<UploadImageProps> = ({

  disabled,
  onChange,
  onRemove,
  urls

}) => {


  // make data in sync
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])


  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  }


  if (!isMounted) {
    return null;
  }


  // visual
  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>


        {/* Image and remove image */}
        {urls.map((url) => (
          <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button type='button' onClick={() => onRemove(url)} variant='destructive' size='sm'>
                <Trash className='w-4 h-4'/>
              </Button>
            </div>
            
            <Image 
              fill
              className='object-cover'
              alt="image"
              src={url}
            />
          </div>
        ))}
      </div>


      {/* upload widget */}
      <CldUploadWidget onUpload={onUpload} uploadPreset='i9emuk2g'>
        {({ open }) => {
            const openWidget = () => {
              open();
            }

          return (
            <Button
              type='button'
              disabled={disabled}
              variant='secondary'
              onClick={openWidget}

            >
              <ImagePlus className='h-4 w-4 mr-2' />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>

    </div>
  );
}


export default ImageUploader;