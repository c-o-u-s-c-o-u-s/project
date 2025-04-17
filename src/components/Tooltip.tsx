import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow,
  useTransitionStyles
} from '@floating-ui/react';
import { motion } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef(null);

  const {
    refs,
    floatingStyles,
    context,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({ element: arrowRef })
    ],
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transform: 'scale(0.95)'
    },
    open: {
      opacity: 1,
      transform: 'scale(1)'
    },
    close: {
      opacity: 0,
      transform: 'scale(0.95)'
    }
  });

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className}
      >
        {children}
      </div>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              ...styles
            }}
            {...getFloatingProps()}
            className="z-50"
          >
            <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm max-w-xs">
              {content}
              <div
                ref={arrowRef}
                className="absolute bg-gray-900 w-2 h-2 rotate-45 -translate-y-1/2"
                style={{
                  left: arrowX != null ? `${arrowX}px` : '',
                  top: arrowY != null ? `${arrowY}px` : ''
                }}
              />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};