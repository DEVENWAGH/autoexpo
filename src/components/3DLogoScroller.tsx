"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { useLogoStore } from "@/store/useLogoStore";
import { getBrandNameFromLogo } from "@/utils/brandNameMapping";

interface Props {
  readonly logos: readonly string[];
}

export default function ThreeDLogoScroller({ logos }: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const activeCategory = useLogoStore((state) => state.activeCategory);
  const [loadedLogos, setLoadedLogos] = useState(0);
  const [errorLogos, setErrorLogos] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const currentContainer = containerRef.current;
    if (!container) return;

    // Reset counters
    setLoadedLogos(0);
    setErrorLogos(0);

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    if (containerRef.current) {
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    }
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create logo meshes
    const logosGroup = new THREE.Group();
    const radius = 5;
    const textureLoader = new THREE.TextureLoader();
    const clickableAreas: THREE.Mesh[] = [];

    // Track loaded and error counts
    let loadedCount = 0;
    let errorCount = 0;

    logos.forEach((logo, index) => {
      const angle = (index / logos.length) * Math.PI * 2;
      const geometry = new THREE.PlaneGeometry(1, 1);

      textureLoader.load(
        logo,
        (texture) => {
          // Success handler
          loadedCount++;
          setLoadedLogos(loadedCount);

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geometry, material);

          mesh.position.x = Math.cos(angle) * radius;
          mesh.position.z = Math.sin(angle) * radius;
          mesh.lookAt(0, 0, 0);

          logosGroup.add(mesh);

          // Add invisible clickable area
          const clickGeometry = new THREE.PlaneGeometry(1.2, 1.2);
          const clickMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
          });
          const clickMesh = new THREE.Mesh(clickGeometry, clickMaterial);
          clickMesh.position.copy(mesh.position);
          clickMesh.userData.logo = logo; // Store logo path for later
          clickableAreas.push(clickMesh);
          scene.add(clickMesh);
        },
        undefined, // Progress handler (not used)
        () => {
          // Error handler
          errorCount++;
          setErrorLogos(errorCount);
          console.error(`Failed to load texture: ${logo}`);

          // Create a placeholder mesh with a color instead
          const material = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geometry, material);

          mesh.position.x = Math.cos(angle) * radius;
          mesh.position.z = Math.sin(angle) * radius;
          mesh.lookAt(0, 0, 0);

          logosGroup.add(mesh);
        }
      );
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
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    }

    window.addEventListener("resize", handleResize);

    // Handle click events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Cast ray from camera through mouse position
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableAreas);

      if (intersects.length > 0) {
        const clickedLogo = intersects[0].object.userData.logo;
        handleLogoClick(clickedLogo);
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    // Handle logo click to navigate to filter page
    const handleLogoClick = (logo: string) => {
      const brandName = getBrandNameFromLogo(logo);

      if (brandName) {
        // Navigate to cars or bikes page with brand filter
        const path = activeCategory === "cars" ? "/cars" : "/bikes";
        router.push(`${path}?brand=${encodeURIComponent(brandName)}`);
      }
    };

    animate();

    // Cleanup
    return () => {
      if (currentContainer && currentContainer.contains(renderer.domElement)) {
        try {
          currentContainer.removeChild(renderer.domElement);
        } catch (err) {
          console.error("Error removing renderer:", err);
        }
      }
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);
      scene.clear();
    };
  }, [logos, activeCategory, router]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] relative"
      style={{ background: "transparent" }}
    >
      {/* Debug overlay */}
      <div className="absolute top-2 left-2 text-white text-xs bg-black/50 rounded px-2 py-1">
        {loadedLogos} logos loaded, {errorLogos} failed
      </div>
    </div>
  );
}
