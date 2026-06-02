import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { slides } from './data';
import { ClimbingWall } from './components/ClimbingWall';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClimbing, setIsClimbing] = useState(false);

  const triggerClimb = (newIndex: number) => {
    setIsClimbing(true);
    setCurrentIndex(newIndex);
    // Add small delay to simulate effort and reset limbs
    setTimeout(() => {
      setIsClimbing(false);
    }, 600);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      triggerClimb(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      triggerClimb(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#E8E6E1] text-[#2C2C2C] font-sans select-none">
      {/* Left Wall - Climbing Area */}
      <div className="w-64 lg:w-72 2xl:w-80 shrink-0 h-full relative bg-[#D1CFCA] border-r-4 border-[#2C2C2C] overflow-hidden shadow-2xl z-20">
        <ClimbingWall currentIndex={currentIndex} />
      </div>

      {/* Right Pane - Content Area */}
      <div className="flex-1 h-full flex flex-col justify-between p-16 relative">
        
        {/* Background Graphic */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#2C2C2C] opacity-5 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>

        {/* Top Controls / Breadcrumbs */}
        <div className="flex items-center justify-between w-full">
          <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">
            Smart Attribution Agent
          </div>
          <div className="flex gap-2 relative z-20">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 bg-white/40 border-2 border-[#2C2C2C] rounded shadow-[4px_4px_0_#2C2C2C] disabled:opacity-30 disabled:shadow-none disabled:translate-y-1 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronUp size={24} />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className="p-3 bg-[#2C2C2C] text-[#E8E6E1] border-2 border-[#2C2C2C] rounded shadow-[4px_4px_0_#2C2C2C] disabled:opacity-30 disabled:shadow-none disabled:translate-y-1 hover:bg-black transition-all cursor-pointer"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        </div>

        {/* Main Content Area with AnimatePresence for slide transitions */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl mt-12 mb-12 relative z-10">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentSlide.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
             >
               <div className="inline-block bg-[#2C2C2C] text-[#E8E6E1] text-[10px] px-3 py-1 font-bold uppercase tracking-widest mb-8">
                 {currentSlide.grade}
               </div>
               
               <h1 className="text-6xl lg:text-7xl font-sans font-black tracking-tighter leading-none mb-8 text-balance">
                 {currentSlide.title}
               </h1>
               
               {currentSlide.subtitle && (
                 <p className="text-xl lg:text-2xl font-medium max-w-3xl opacity-80 italic underline underline-offset-8 decoration-4 decoration-[#2C2C2C] mb-12 leading-relaxed">
                   {currentSlide.subtitle}
                 </p>
               )}
               
               {/* Decorative separator */}
               <div className="flex gap-3 mt-4">
                 <div className="w-4 h-4 bg-[#2C2C2C] rotate-45" />
                 <div className="w-4 h-4 bg-[#2C2C2C] opacity-50 rotate-45" />
                 <div className="w-4 h-4 bg-[#2C2C2C] opacity-20 rotate-45" />
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-3 relative z-20">
          {slides.map((slide, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={() => triggerClimb(idx)}
              className={`h-2 transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-[#2C2C2C]' : 'w-2 bg-[#2C2C2C] opacity-30 hover:opacity-60'
              }`}
              aria-label={`Go to ${slide.grade}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
