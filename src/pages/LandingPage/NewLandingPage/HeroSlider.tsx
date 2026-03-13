import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/Routes';

const slides = [
  
  {
    id: 3,
    title: 'خبرة وموثوقية',
    subtitle: 'نخدمكم منذ أكثر من 10 سنوات في قلب جدة الصناعية',
    image: '../../../../src/assets/hero-image.jpeg'
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, []);

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % slides.length);
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  // };

  return (
    <section id="hero" className="relative h-[600px] md:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 xl:bg-origin-content background-hero bg-center w-full "
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
          </div>
         <div className='absolute w-full hero-btn bottom-[15%] right-[-15px] '>
           <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4  justify-center "
              >
                <button
                  onClick={() => navigate(ROUTES.HOME)}
                  className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg transition-colors"
                >
                  تسجيل الدخول 
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg border border-white/30 transition-colors"
                >
                  اعرف المزيد
                </button>
              </motion.div>
         </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button> */}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-[#f5a623] w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
