"use client";
import React, { useState, useEffect } from 'react';
import MobileFeed from './MobileFeed';
import DesktopFeed from './DesktopFeed';

export default function AdaptiveFeed() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Render appropriate feed based on screen size
  if (isMobile) {
    return <MobileFeed />;
  }

  return <DesktopFeed />;
}
