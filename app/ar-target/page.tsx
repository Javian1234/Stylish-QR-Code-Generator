'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ARTargetScene() {
  const searchParams = useSearchParams();
  const configParam = searchParams.get('config');
  
  let config = {
    name: 'Jane Doe',
    title: 'Creative Director',
    color: '#4F46E5',
    imageUrl: '',
    animation: 'float'
  };

  if (configParam) {
    try {
      config = { ...config, ...JSON.parse(decodeURIComponent(atob(configParam))) };
    } catch (e) {
      console.error("Failed to parse config", e);
    }
  }

  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadScripts = async () => {
      // Load A-Frame first
      if (typeof window !== 'undefined' && !(window as any).AFRAME) {
        const aframe = document.createElement('script');
        aframe.src = 'https://aframe.io/releases/1.3.0/aframe.min.js';
        document.head.appendChild(aframe);
        await new Promise(r => { aframe.onload = r; });
      }
      
      // Load AR.js
      if (typeof window !== 'undefined' && !(window as any).THREEx) {
        const arjs = document.createElement('script');
        arjs.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
        document.head.appendChild(arjs);
        await new Promise(r => { arjs.onload = r; });
      }

      if (isMounted) {
        setTimeout(() => setScriptsLoaded(true), 0);
      }
    };

    loadScripts();

    return () => { isMounted = false; };
  }, []);

  if (!scriptsLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-900 text-white font-sans">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm">Loading Image Tracking Engine...</p>
      </div>
    );
  }

  const animationHtml = config.animation === 'float' 
    ? `animation="property: position; to: 0 0.8 0; dir: alternate; dur: 2000; loop: true"`
    : config.animation === 'spin'
    ? `animation="property: rotation; to: -90 360 0; dur: 5000; loop: true; easing: linear"`
    : '';

  const imageHtml = config.imageUrl 
    ? `<a-image src="${config.imageUrl}" crossorigin="anonymous" position="-0.8 0 0.06" width="0.6" height="0.6" material="alphaTest: 0.5"></a-image>`
    : `<a-circle position="-0.8 0 0.05" radius="0.3" color="#FFFFFF" material="opacity: 0.2; transparent: true"></a-circle>`;

  const sceneHtml = `
    <a-scene 
      arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;" 
      vr-mode-ui="enabled: false"
    >
      <!-- We use the standard Hiro marker for the prototype -->
      <a-marker preset="hiro">
        <!-- Rotated -90 on X so the card stands up vertically from the flat paper -->
        <a-entity position="0 0.2 0" rotation="-90 0 0" ${animationHtml}>
          
          <!-- Card Background -->
          <a-plane position="0 0 0" width="2.5" height="1.2" color="${config.color}" material="opacity: 0.95; transparent: true"></a-plane>
          
          <!-- Image / Avatar -->
          ${imageHtml}
          
          <!-- Text -->
          <a-text value="${config.name}" position="-0.3 0.2 0.05" width="5" color="#FFFFFF" align="left"></a-text>
          <a-text value="${config.title}" position="-0.3 -0.2 0.05" width="2.5" color="#E0E7FF" align="left"></a-text>
          
        </a-entity>
      </a-marker>
      
      <a-entity camera></a-entity>
    </a-scene>
  `;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent">
      {/* AR.js injects a video element directly into the body. 
          We must force the body to be transparent and have no scrollbars so the camera feed is visible underneath the React app.
          We also ensure the AR.js video tag takes up the full screen and centers itself properly on mobile. */}
      <style dangerouslySetInnerHTML={{__html: `
        body, html { margin: 0; padding: 0; overflow: hidden !important; width: 100%; height: 100%; background-color: transparent !important; }
        video { object-fit: cover !important; width: 100vw !important; height: 100vh !important; margin: 0 !important; top: 0 !important; left: 0 !important; position: absolute !important; z-index: -2 !important; }
        .a-canvas { z-index: -1 !important; }
      `}} />
      <div className="absolute top-6 left-6 z-50 bg-black/60 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 max-w-xs font-sans shadow-2xl">
        <h2 className="text-lg font-bold mb-1">Image Tracking Active</h2>
        <p className="text-sm text-neutral-300">Point your camera at the <strong>Target Image</strong> (Hiro Pattern) to see the magic happen!</p>
      </div>
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: sceneHtml }}
      />
    </div>
  );
}

export default function ARTargetView() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-white">Loading...</div>}>
      <ARTargetScene />
    </Suspense>
  );
}
