import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

  useEffect(() => {
    const scrollable = document.getElementById('scrollable-content');
    if (scrollable) {
      scrollable.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#E8E6E1] text-[#2C2C2C] font-sans">
      {/* Left Wall - Climbing Area */}
      <div className="w-64 lg:w-72 2xl:w-80 shrink-0 h-full relative bg-[#D1CFCA] border-r-4 border-[#2C2C2C] overflow-hidden shadow-2xl z-20">
        <ClimbingWall currentIndex={currentIndex} />
      </div>

      {/* Right Pane - Content Area */}
      <div className="flex-1 h-full flex flex-col relative overflow-hidden">
        
        {/* Background Graphic */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#2C2C2C] opacity-5 pointer-events-none z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>

        {/* Top Controls (Fixed at top) */}
        <div className="flex items-center justify-end w-full px-8 pt-8 pb-4 lg:px-16 lg:pt-16 lg:pb-8 relative z-30 shrink-0">
          <div className="flex gap-2 relative z-20">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 bg-[#E8E6E1] border-2 border-[#2C2C2C] rounded shadow-[4px_4px_0_#2C2C2C] disabled:opacity-30 disabled:shadow-none disabled:translate-y-1 hover:bg-white transition-all cursor-pointer"
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-16 pb-16 relative z-10 w-full" id="scrollable-content">
           <div className="max-w-4xl pt-4 pb-8">
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
                 
                 <h1 className="text-4xl lg:text-6xl font-display font-black tracking-tighter leading-tight mb-8 text-balance">
                   {currentSlide.section && <span className="opacity-30 mr-4">{currentSlide.section}</span>}
                   {currentSlide.title}
                 </h1>
                 
                 {currentSlide.subtitle && (
                   <p className="text-xl lg:text-2xl font-medium max-w-3xl opacity-80 italic underline underline-offset-8 decoration-4 decoration-[#2C2C2C] mb-12 leading-relaxed">
                     {currentSlide.subtitle}
                   </p>
                 )}

                 {currentSlide.content && (
                   <div className="prose prose-slate prose-lg max-w-none text-[#2C2C2C] prose-headings:text-[#2C2C2C] prose-a:text-[#2C2C2C] prose-strong:text-[#2C2C2C] prose-code:text-[#E8E6E1] prose-code:bg-[#2C2C2C] prose-code:px-1 prose-code:rounded prose-pre:bg-[#2C2C2C] prose-pre:text-[#E8E6E1] prose-tr:border-b-[#2C2C2C] prose-th:text-[#2C2C2C] prose-td:text-[#2C2C2C]">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                       {currentSlide.content}
                     </ReactMarkdown>
                   </div>
                 )}
                 
                 {/* Decorative separator */}
                 <div className="flex gap-3 mt-12 pb-8">
                   <div className="w-4 h-4 bg-[#2C2C2C] rotate-45" />
                   <div className="w-4 h-4 bg-[#2C2C2C] opacity-50 rotate-45" />
                   <div className="w-4 h-4 bg-[#2C2C2C] opacity-20 rotate-45" />
                 </div>
               </motion.div>
             </AnimatePresence>
           </div>
        </div>

        {/* Progress Dots (Fixed at bottom) */}
        <div className="flex items-center gap-3 relative z-30 shrink-0 px-8 pb-8 pt-4 lg:px-16 lg:pb-16 lg:pt-8 bg-gradient-to-t from-[#E8E6E1] to-[#E8E6E1]/0 pointer-events-none overflow-visible">
          <div className="flex items-center gap-3 pointer-events-auto">
            {slides.map((slide, idx) => (
              <div key={`dot-${idx}`} className="relative group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-[#2C2C2C] text-[#E8E6E1] text-xs font-bold whitespace-nowrap rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {slide.chapter}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C2C2C]"></div>
                </div>
                <button
                  onClick={() => triggerClimb(idx)}
                  className={`h-2 transition-all duration-300 block ${
                    idx === currentIndex ? 'w-8 bg-[#2C2C2C]' : 'w-2 bg-[#2C2C2C] opacity-30 group-hover:opacity-60'
                  }`}
                  aria-label={`Go to ${slide.grade}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
