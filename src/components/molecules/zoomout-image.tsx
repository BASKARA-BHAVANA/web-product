import { cn } from '@/utils/misc';
import { HTMLMotionProps, useScroll, useTransform } from 'motion/react';
import * as motion from 'motion/react-client';
import { useRef } from 'react';

const ZoomOutImage = ({ src, className, ...props }: HTMLMotionProps<'img'>) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end 70%'],
  });

  const _scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const _radius = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <div ref={ref} className="w-full">
      <motion.img
        style={{
          borderRadius: _radius,
          scale: _scale,
          transformOrigin: 'top center',
        }}
        src={src}
        alt=""
        className={cn('w-full', className)}
        {...props}
      />
    </div>
  );
};

export default ZoomOutImage;
