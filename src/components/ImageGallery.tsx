import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

const slideVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -60 }),
};

interface ImageGalleryProps {
  images: string[];
  alt: string;
  /** Optional shared layout id for the first image (open animation). */
  layoutId?: string;
}

export function ImageGallery({ images, alt, layoutId }: ImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const safeImages = images.length ? images : [''];

  function go(next: number) {
    const clamped = (next + safeImages.length) % safeImages.length;
    setDirection(next > index ? 1 : -1);
    setIndex(clamped);
  }

  return (
    <div className="relative">
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-mint-50">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={safeImages[index]}
            alt={alt}
            layoutId={index === 0 && layoutId ? layoutId : undefined}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={safeImages.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
            className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
          />
        </AnimatePresence>
      </div>

      {safeImages.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {safeImages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Фото ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand' : 'w-2 bg-mint-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
