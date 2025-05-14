'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SplineWrapperProps {
  src: string;
  scrollProgress: number;
}

// Extend Window interface to include spline property
declare global {
  interface Window {
    spline?: {
      scrollY: number;
      scrollProgress: number;
    };
  }
}

export default function SplineWrapper({ src, scrollProgress }: SplineWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true);
      console.log('Spline iframe loaded');
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, []);

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

  // Send scroll progress to Spline scene
  useEffect(() => {
    if (!isLoaded) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        // Normalize progress between 0 and 1
        const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // Calculate scroll position in pixels (assuming 1000px total scroll height)
        const scrollPosition = normalizedProgress * 1000;
        
        // Send multiple event formats to ensure Spline receives the scroll
        const events = [
          // Format 1: Spline's preferred format
          {
            type: 'spline-scroll',
            data: {
              scrollY: scrollPosition,
              scrollProgress: normalizedProgress
            }
          },
          // Format 2: Alternative format
          {
            type: 'scroll',
            data: scrollPosition
          },
          // Format 3: Another common format
          {
            type: 'scrollProgress',
            value: normalizedProgress
          },
          // Format 4: Direct scroll event
          {
            type: 'scrollEvent',
            detail: {
              scrollY: scrollPosition,
              progress: normalizedProgress
            }
          }
        ];

        // Send all events with a small delay between them
        events.forEach((event, index) => {
          setTimeout(() => {
            iframeWindow.postMessage(event, '*');
            console.log(`Sent scroll event ${index + 1}:`, event);
          }, index * 50); // 50ms delay between events
        });

        // Also try to set the scroll position directly if possible
        if (iframeWindow.spline) {
          iframeWindow.spline.scrollY = scrollPosition;
          iframeWindow.spline.scrollProgress = normalizedProgress;
          console.log('Set direct spline properties:', { scrollY: scrollPosition, scrollProgress: normalizedProgress });
        }
      }
    } catch (error) {
      console.error('Error sending scroll progress to Spline:', error);
    }
  }, [scrollProgress, isLoaded]);

  // Listen for messages from Spline to debug
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        console.log('Received message from Spline:', event.data);
        
        // Check if the message is a response to our scroll events
        if (event.data.type === 'scroll-response' || 
            event.data.type === 'spline-scroll-response' ||
            event.data.type === 'scrollEvent-response') {
          console.log('Spline acknowledged scroll event:', event.data);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'none'
      }}
    />
  );
} 