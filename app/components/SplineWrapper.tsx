'use client';

import React, { useEffect, useRef } from 'react';

interface SplineWrapperProps {
  src: string;
}

export default function SplineWrapper({ src }: SplineWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const removeWatermark = () => {
      if (iframeRef.current) {
        try {
          const iframe = iframeRef.current;
          iframe.onload = () => {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDocument) {
              const watermark = iframeDocument.querySelector('[class*="watermark"]');
              if (watermark) {
                watermark.remove();
              }
            }
          };
        } catch (error) {
          console.error('Error accessing iframe content:', error);
        }
      }
    };

    removeWatermark();
  }, []);

  // Workaround to block scroll/zoom events on the iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
    };

    iframe.addEventListener('wheel', preventScroll, { passive: false });
    iframe.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      iframe.removeEventListener('wheel', preventScroll);
      iframe.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      frameBorder="0"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  );
} 