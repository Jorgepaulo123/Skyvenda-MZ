import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiArrowRight } from 'react-icons/fi';

const banners = [
  {
    id: 1,
    title: 'Descubra a Tecnologia do Futuro',
    description: 'Encontre os melhores produtos eletrônicos com preços imbatíveis!',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    id: 2,
    title: 'Ofertas Imperdíveis',
    description: 'Aproveite descontos de até 50% em produtos selecionados!',
    gradient: 'from-green-400 to-blue-500',
  },
  {
    id: 3,
    title: 'Novidades em Smartphones',
    description: 'Conheça os últimos lançamentos das melhores marcas!',
    gradient: 'from-pink-500 to-orange-400',
  },
];

function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="mb-12 w-full">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="relative">
            <div className={`w-full h-[350px] bg-gradient-to-r ${banner.gradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-xl mb-8">{banner.description}</p>
                  <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300 flex items-center mx-auto">
                    Explorar Agora
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;