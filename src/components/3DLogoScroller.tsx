"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { useLogoStore } from "@/store/useLogoStore";
import { getBrandNameFromLogo } from "@/utils/brandNameMapping";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Props {
  readonly logos?: readonly string[];
  readonly showTitle?: boolean;
}

export default function ThreeDLogoScroller({
  logos,
  showTitle = true,
}: Readonly<Props>) {
  const logoStore = useLogoStore();
  // Use provided logos or all logos from the store
  const allLogos = logos || logoStore.allLogos;

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const activeCategory = useLogoStore((state) => state.activeCategory);
  const [loadedLogos, setLoadedLogos] = useState(0);
  const [errorLogos, setErrorLogos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check if we have logos to display
  const hasLogos = allLogos.length > 0;

  useEffect(() => {
    // Reset loading state
    setIsLoading(true);
    setLoadedLogos(0);
    setErrorLogos(0);

    // Don't try to render if there are no logos
    if (!hasLogos) {
      setIsLoading(false);
      return;
    }

    // Set a timeout to prevent immediate rendering which can cause issues
    const loadingTimer = setTimeout(() => {
      initScene();
    }, 500);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, [allLogos, hasLogos]);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebGLSupported(!!gl);
    } catch (e) {
      console.error("WebGL not supported", e);
      setWebGLSupported(false);
    }
  }, []);

  const initScene = () => {
    const container = containerRef.current;
    const currentContainer = containerRef.current;
    if (!container) return;

    // If WebGL is not supported, set loading to false and return early
    if (!webGLSupported) {
      setIsLoading(false);
      return;
    }

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Use WebGL1Renderer to ensure broader device compatibility
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "default",
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    container.appendChild(renderer.domElement);

    // Create logo meshes
    const logosGroup = new THREE.Group();
    const radius = 5;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous"); // Ensure cross-origin is set properly

    const clickableAreas: THREE.Mesh[] = [];

    // Track loaded and error counts
    let loadedCount = 0;
    let errorCount = 0;
    let totalProcessed = 0;

    // Progress checker to update loading state
    const checkProgress = () => {
      totalProcessed++;
      if (totalProcessed >= allLogos.length) {
        setIsLoading(false);
      }
    };

    allLogos.forEach((logo, index) => {
      const angle = (index / allLogos.length) * Math.PI * 2;
      const geometry = new THREE.PlaneGeometry(1, 1);

      // Add a small timeout to stagger loading and prevent overwhelming the browser
      setTimeout(() => {
        textureLoader.load(
          logo,
          (texture) => {
            // Success handler
            loadedCount++;
            setLoadedLogos(loadedCount);

            // Handle texture to ensure proper rendering
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;

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

            checkProgress();
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
            checkProgress();
          }
        );
      }, index * 50); // Staggered loading - 50ms per logo
    });

    scene.add(logosGroup);
    camera.position.z = 8;

    // Animation - improved with smoother rotation
    let animationFrameId: number;
    let targetRotation = 0;
    let currentRotation = 0;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // Create smoother rotation with easing
      targetRotation += 0.005;
      currentRotation += (targetRotation - currentRotation) * 0.05;
      logosGroup.rotation.y = currentRotation;

      renderer.render(scene, camera);
    }

    // Improved interaction - allow for manual rotation
    let isDragging = false;
    let previousMouseX = 0;

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMouseX = event.clientX;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMouseX;
      targetRotation += deltaX * 0.005;
      previousMouseX = event.clientX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);

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
      cancelAnimationFrame(animationFrameId);
      if (currentContainer && currentContainer.contains(renderer.domElement)) {
        try {
          currentContainer.removeChild(renderer.domElement);
        } catch (err) {
          console.error("Error removing renderer:", err);
        }
      }
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);
      scene.clear();
    };
  };

  // Add title based on the showTitle prop
  const sceneTitle = showTitle ? (
    <h2 className="text-2xl font-bold text-center mb-4">3D Brand Explorer</h2>
  ) : null;

  if (!hasLogos) {
    return (
      <div className="py-4">
        {sceneTitle}
        <div className="w-full h-[400px] relative flex items-center justify-center">
          <p className="text-gray-500">No brand logos available for 3D view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {sceneTitle}
      <div
        ref={containerRef}
        className="w-full h-[400px] relative"
        style={{ background: "transparent" }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <LoadingSpinner />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Loading 3D brands...
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute top-2 left-2 text-xs bg-black/50 text-white rounded px-2 py-1 z-10">
            {loadedLogos} logos loaded, {errorLogos} failed
          </div>
        )}

        {/* Fallback message if WebGL not supported */}
        {!webGLSupported && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
              <h3 className="text-lg font-semibold mb-2">
                3D Visualization Not Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your browser does not support the required 3D features. Please
                try a different browser or device.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
