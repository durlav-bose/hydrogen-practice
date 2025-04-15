import {useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Thumbs, Controller} from 'swiper/modules';
import {Image} from '@shopify/hydrogen';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export function ProductImage({images = []}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images.length) return <div className="product-image" />;

  if (images.length === 1) {
    const image = images[0];
    return (
      <div className="product-image">
        <Image
          alt={image.altText || 'Product image'}
          data={image}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div className="product-image-slider w-[40vw]">
      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{clickable: true}}
        loop={true}
        spaceBetween={10}
        slidesPerView={1}
        thumbs={{swiper: thumbsSwiper}}
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

      {/* Thumbnail Slider */}
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        spaceBetween={10}
        slidesPerView={4}
        className="thumb-swiper mt-4"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <Image
              alt={image.altText || 'Thumbnail'}
              data={image}
              aspectRatio="1/1"
              sizes="100px"
              className="cursor-pointer border border-gray-300"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


