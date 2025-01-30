"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  logos: string[];
}

export default function ThreeDLogoScroller({ logos }: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add console log to debug logo loading
    console.log("Loading logos:", logos);

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create logo meshes
    const logosGroup = new THREE.Group();
    const radius = 5;
    const textureLoader = new THREE.TextureLoader();

    logos.forEach((logo, index) => {
      const angle = (index / logos.length) * Math.PI * 2;
      const geometry = new THREE.PlaneGeometry(1, 1);
      
      textureLoader.load(logo, (texture) => {
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.lookAt(0, 0, 0);
        
        logosGroup.add(mesh);
      });
    });

    scene.add(logosGroup);
    camera.position.z = 8;

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      logosGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
    }

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [logos]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[400px] relative"
      style={{ background: 'transparent' }}
    >
      {/* Debug overlay */}
      <div className="absolute top-2 left-2 text-white text-sm">
        {logos.length} logos loaded
      </div>
    </div>
  );
}
