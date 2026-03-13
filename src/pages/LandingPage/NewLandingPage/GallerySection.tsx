import { useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1761519609120-0f0a84a9932b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd2FyZWhvdXNlJTIwaW50ZXJpb3IlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcwMzgyMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'مستودع المعدات'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1715322554946-1b22a9800aec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwdG9vbHMlMjBoYXJkd2FyZSUyMHN0b3JlfGVufDF8fHx8MTc3MDM4MjEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'أدوات صناعية'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1763025747123-bb3a2e3a5ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHRvb2xzJTIwb3JnYW5pemVkJTIwc2hlbHZlc3xlbnwxfHx8fDE3NzAzODIyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'ورشة العمل'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1733683296842-c5c32fe36a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZXF1aXBtZW50JTIwZmFjdG9yeSUyMGZsb29yfGVufDF8fHx8MTc3MDM4MjIxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'المعدات الثقيلة'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1596459984865-5d03744a3467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBoYXJkd2FyZSUyMHdhcmVob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc3MDM4MjIyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'المتجر الداخلي'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1758789667762-56175fe4601c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBpbmR1c3RyaWFsJTIwYnVpbGRpbmclMjBleHRlcmlvcnxlbnwxfHx8fDE3NzAzODIxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'المبنى الخارجي'
  }
];

export function GallerySection() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">معرض الصور</h2>
          <div className="w-20 h-1 bg-[#f5a623] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            تعرف على المركز من خلال معرض الصور الذي يوضح التنظيم الداخلي والشكل العام للمحلات
          </p>
        </motion.div>

        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {galleryImages.map((image) => (
              <div key={image.id} className="px-2">
                <div className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-lg font-semibold text-center">{image.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Custom Navigation Buttons */}
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#f5a623] hover:bg-[#d68f1a] p-3 rounded-full shadow-lg transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#f5a623] hover:bg-[#d68f1a] p-3 rounded-full shadow-lg transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
