'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ARScene() {
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
  } else {
    config.name = searchParams.get('name') || config.name;
    config.title = searchParams.get('title') || config.title;
    config.color = searchParams.get('color') || config.color;
  }

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const registerComponent = () => {
      const AFRAME = (window as any).AFRAME;
      if (AFRAME && !AFRAME.components['ar-hit-test']) {
        AFRAME.registerComponent('ar-hit-test', {
          init: function () {
            this.xrHitTestSource = null;
            this.viewerSpace = null;
            this.refSpace = null;

            this.el.sceneEl.renderer.xr.addEventListener('sessionstart', () => {
              const session = this.el.sceneEl.renderer.xr.getSession();
              if (!session) return;
              
              session.requestReferenceSpace('viewer').then((space: any) => {
                this.viewerSpace = space;
                session.requestHitTestSource({ space: this.viewerSpace })
                  .then((hitTestSource: any) => {
                    this.xrHitTestSource = hitTestSource;
                  });
              });

              session.requestReferenceSpace('local-floor').then((space: any) => {
                this.refSpace = space;
              });

              session.addEventListener('select', () => {
                if (!this.el.getAttribute('visible')) return;
                
                const card = document.getElementById('ar-card');
                if (card) {
                  // Move the card to the reticle's location
                  card.setAttribute('position', this.el.getAttribute('position') as any);
                  card.setAttribute('visible', 'true');
                  // We leave the reticle visible for repositioning
                }
              });
            });
          },
          tick: function () {
            const sceneEl = this.el.sceneEl;
            if (sceneEl.is('ar-mode')) {
              if (!this.xrHitTestSource) return;
              const frame = sceneEl.frame;
              if (!frame) return;
              
              const hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
              if (hitTestResults.length > 0) {
                const pose = hitTestResults[0].getPose(this.refSpace);
                this.el.setAttribute('visible', 'true');
                this.el.object3D.position.copy(pose.transform.position);
                this.el.object3D.quaternion.copy(pose.transform.orientation);
              } else {
                this.el.setAttribute('visible', 'false');
              }
            } else {
               this.el.setAttribute('visible', 'false');
            }
          }
        });
      }
      setScriptLoaded(true);
    };

    if (typeof window !== 'undefined' && !(window as any).AFRAME) {
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
      script.onload = registerComponent;
      document.head.appendChild(script);
    } else {
      setTimeout(registerComponent, 0);
    }
  }, []);

  if (!scriptLoaded) {
    return <div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-white font-sans">Loading AR Engine...</div>;
  }

  const animationHtml = config.animation === 'float' 
    ? `animation="property: position; to: 0 0.2 0; dir: alternate; dur: 2000; loop: true"`
    : config.animation === 'spin'
    ? `animation="property: rotation; to: 0 360 0; dur: 5000; loop: true; easing: linear"`
    : '';

  const imageHtml = config.imageUrl 
    ? `<a-image src="${config.imageUrl}" position="-0.8 0 0.06" width="0.6" height="0.6" border-radius="0.3"></a-image>`
    : `<a-circle position="-0.8 0 0.05" radius="0.3" color="#FFFFFF" material="opacity: 0.2; transparent: true"></a-circle>`;

  const sceneHtml = `
    <a-scene webxr="optionalFeatures: hit-test;" background="color: #111">
      <!-- Reticle for hit testing -->
      <a-entity ar-hit-test visible="false">
        <a-ring radius-inner="0.1" radius-outer="0.15" color="${config.color}" rotation="-90 0 0"></a-ring>
      </a-entity>

      <!-- The AR Card (initially hidden, anchored dynamically) -->
      <a-entity id="ar-card" position="0 0 0" visible="false">
        <!-- Offset wrapper for animation so it animates relative to the anchor point on the floor -->
        <a-entity position="0 0.6 0" ${animationHtml}>
          <!-- Card Background -->
          <a-plane position="0 0 0" width="2.5" height="1.2" color="${config.color}" material="opacity: 0.9; transparent: true"></a-plane>
          
          <!-- Image / Avatar -->
          ${imageHtml}
          
          <!-- Text -->
          <a-text value="${config.name}" position="-0.3 0.2 0.05" width="5" color="#FFFFFF" align="left"></a-text>
          <a-text value="${config.title}" position="-0.3 -0.2 0.05" width="3" color="#E0E7FF" align="left"></a-text>
        </a-entity>
      </a-entity>

      <a-entity camera position="0 1.6 0" look-controls></a-entity>
      
      <!-- Lighting -->
      <a-light type="ambient" color="#fff" intensity="0.5"></a-light>
      <a-light type="directional" color="#fff" intensity="0.8" position="-1 2 1"></a-light>
    </a-scene>
  `;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-6 left-6 z-50 bg-black/60 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 max-w-xs font-sans shadow-2xl">
        <h2 className="text-lg font-bold mb-1">AR Portal</h2>
        <p className="text-sm text-neutral-300">Look around your room. Click the <strong>AR</strong> button in the bottom right to place this card in your physical space!</p>
      </div>
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: sceneHtml }}
      />
    </div>
  );
}

export default function ARView() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-white">Loading...</div>}>
      <ARScene />
    </Suspense>
  );
}
