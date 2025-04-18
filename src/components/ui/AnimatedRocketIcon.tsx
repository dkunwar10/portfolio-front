import React from 'react';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedRocketIconProps extends React.ComponentPropsWithoutRef<typeof Rocket> {
  isActive?: boolean;
}

const AnimatedRocketIcon = React.forwardRef<
  React.ElementRef<typeof Rocket>,
  AnimatedRocketIconProps
>(({ className, isActive = false, ...props }, ref) => {
  return (
    <div className="relative">
      <Rocket
        ref={ref}
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isActive ? "text-blue-300" : "text-gray-400",
          className
        )}
        {...props}
      />

      {/* Fire animation */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-4 overflow-hidden">
          <div className="w-3 h-6 flex flex-col items-center justify-center">
            {/* Core flame */}
            <div className="w-1.5 h-4 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-b-full animate-flame" />

            {/* Flame particles */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse absolute -left-1 bottom-0" />
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping opacity-75 absolute -right-1 bottom-0" />
              <div className="w-1 h-1 bg-red-400 rounded-full animate-ping opacity-50 absolute left-0 -bottom-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AnimatedRocketIcon.displayName = 'AnimatedRocketIcon';

export { AnimatedRocketIcon };
