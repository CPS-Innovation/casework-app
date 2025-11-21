import { useEffect, useRef, useState, type ReactNode } from 'react';

export const useWindowMouseListener = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const updateMousePosition = () => {
      setMousePos({ ...mousePosRef.current });
      rafIdRef.current = requestAnimationFrame(updateMousePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafIdRef.current = requestAnimationFrame(updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return mousePos;
};

export const PdfRedactorMiniModal = (p: {
  coordX: number;
  coordY: number;
  children: ReactNode;
  onBackgroundClick: () => void;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: p.coordX, y: p.coordY });

  useEffect(() => {
    if (!popupRef.current) return;

    const popup = popupRef.current;
    const rect = popup.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const isRightHalf = p.coordX > screenWidth / 2;
    const x = isRightHalf ? p.coordX - rect.width : p.coordX;

    const isBottomHalf = p.coordY > screenHeight / 2;
    const y = isBottomHalf ? p.coordY - rect.height : p.coordY;

    setPosition({ x, y });
  }, [p.coordX, p.coordY]);

  return (
    <>
      <style>
        {`
      body {
        overflow: hidden
      }
    `}
      </style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          pointerEvents: 'auto'
        }}
        onClick={p.onBackgroundClick}
      />
      <div
        ref={popupRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 0 .3125rem .3125rem #0003',
          padding: '16px',
          zIndex: 1000,
          filter: 'drop-shadow(0 1px .15rem #000)',
          pointerEvents: 'auto'
        }}
      >
        {p.children}
      </div>
    </>
  );
};
