import {useRef, useState, useEffect} from 'react';
import { useNavigate} from '@remix-run/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Thumbs} from 'swiper/modules';
import {Image} from '@shopify/hydrogen';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export function ProductImage({images = [], variants = [], selectedVariant}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to selected variant image
  useEffect(() => {
    if (selectedVariant?.image?.id && mainSwiperRef.current) {
      const imageIndex = images.findIndex((img) => img.id === selectedVariant.image.id);
      if (imageIndex !== -1) {
        mainSwiperRef.current.slideToLoop(imageIndex); // slideToLoop for looping swiper
      }
    }
  }, [selectedVariant?.image?.id, images]);

  return (
    <div className="product-image-slider w-[40vw]">
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{clickable: true}}
        loop
        spaceBetween={10}
        slidesPerView={1}
        thumbs={{swiper: thumbsSwiper}}
        onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
        className="main-swiper"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <Image
              alt={image.altText || 'Product image'}
              data={image}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        spaceBetween={10}
        slidesPerView={4}
        className="thumb-swiper mt-4"
      >
        {images.map((image) => {
          // Find the variant that matches this image
          const matchingVariant = variants.find(
            (v) => v.image?.id === image.id
          );
          const isSelected = matchingVariant?.id === selectedVariant?.id;

          return (
            <SwiperSlide key={image.id}>
              <div
                role='button'
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && matchingVariant) {
                    const query = new URLSearchParams(
                      matchingVariant.selectedOptions.map((opt) => [
                        opt.name,
                        opt.value,
                      ])
                    ).toString();
                    navigate(`?${query}`, {
                      replace: true,
                      preventScrollReset: true,
                    });
                  }
                }}
                className={`
                  border 
                  ${isSelected ? 'border-black' : 'border-gray-300'} 
                  rounded p-1
                `}
                onClick={() => {
                  if (matchingVariant) {
                    const query = new URLSearchParams(
                      matchingVariant.selectedOptions.map((opt) => [
                        opt.name,
                        opt.value,
                      ])
                    ).toString();
                    navigate(`?${query}`, {
                      replace: true,
                      preventScrollReset: true,
                    });
                  }
                }}
              >
                <Image
                  alt={image.altText || 'Thumbnail'}
                  data={image}
                  aspectRatio="1/1"
                  sizes="100px"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}



<style>
  
</style>