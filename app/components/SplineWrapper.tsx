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