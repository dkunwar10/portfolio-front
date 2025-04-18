
import React, { ReactNode, forwardRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ id, className, children }, ref) => {
    const [inViewRef, inView] = useInView({
      threshold: 0.3,
      triggerOnce: false,
    });

    const setRefs = (node: HTMLDivElement) => {
      // @ts-ignore - forwardRef types can be tricky
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      inViewRef(node);
    };

    return (
      <section
        id={id}
        ref={setRefs}
        className={cn(
          'min-h-screen w-full flex flex-col items-center justify-center transition-opacity duration-700',
          inView ? 'opacity-100' : 'opacity-0',
          className
        )}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
