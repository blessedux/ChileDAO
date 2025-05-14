'use client';

import React, { useEffect, useState, useRef } from 'react';
import SplineWrapper from './components/SplineWrapper';
import './globals.css';
import Image from 'next/image';

export default function Home() {
  const [titleOpacity, setTitleOpacity] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splineZIndex, setSplineZIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      // Calculate progress with a smoother curve using cubic easing
      const rawProgress = scrollTop / maxScroll;
      const progress = Math.min(Math.max(0, rawProgress), 1);
      
      // Apply cubic easing for smoother transitions
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      // Update scroll progress for both Spline and title
      setScrollProgress(easedProgress);
      
      // Calculate title opacity based on scroll position with smoother transition
      const fadeDistance = 200;
      const opacity = Math.max(0, Math.min(1, 1 - (scrollTop / fadeDistance)));
      setTitleOpacity(opacity);

      // Calculate which section we're in (0-4)
      const sectionHeight = container.clientHeight;
      const currentSection = Math.floor(scrollTop / sectionHeight);
      
      // Set z-index based on section with smooth transition
      setSplineZIndex(currentSection % 2 === 0 ? 3 : 1);

      // Log scroll progress for debugging
      console.log('Scroll Progress:', {
        raw: progress,
        eased: easedProgress,
        scrollTop,
        maxScroll
      });
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      style={{ 
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        scrollBehavior: 'smooth'
      }}
    >
      {/* Fixed Spline Scene */}
      <div style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%', 
        height: '100%', 
        zIndex: splineZIndex,
        pointerEvents: 'none'
      }}>
        <SplineWrapper 
          src="https://my.spline.design/rotatinginteractiveherosection-07OxQV3OFRZakYfyaJ026jK7/"
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Fixed Title */}
      <div 
        style={{ 
          position: 'fixed',
          top: 100,
          left: 24,
          zIndex: 4,
          pointerEvents: 'none',
          width: '50%',
          opacity: titleOpacity,
          transition: 'opacity 0.2s ease-out',
          willChange: 'opacity'
        }}
      >
        <Image
          src="/Frame1.png"
          alt="ChileDAO Title"
          width={400}
          height={400}
          style={{ 
            objectFit: 'contain',
            height: 'auto',
            width: '100%',
            maxHeight: '100vh'
          }}
          priority
        />
      </div>
      
      {/* Scrollable Content */}
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        minHeight: '200vh',
        pointerEvents: 'auto'
      }}>
        <div style={{ height: '100vh' }}></div>
        <div style={{ height: '100vh' }}></div>
        <div style={{ height: '100vh' }}></div>
        <div style={{ height: '100vh' }}></div>
        <div style={{ height: '100vh' }}></div>
      </div>
    </div>
  );
}
