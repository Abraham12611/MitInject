'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from './shaders';

const ParticleCanvas = ({ configRef, explosionStartTimeRef }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef({
    initialized: false,
    scene: null,
    camera: null,
    renderer: null,
    material: null,
    animationId: null
  });

  useEffect(() => {
    if (!canvasRef.current || contextRef.current.initialized) return;

    const ctx = contextRef.current;
    ctx.initialized = true;

    // Initialize scene
    ctx.scene = new THREE.Scene();
    ctx.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    ctx.renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    
    ctx.renderer.setSize(window.innerWidth, window.innerHeight);
    ctx.renderer.setClearColor(configRef.current.isLightTheme ? 0xffffff : 0x000000, 1);
    
    ctx.material = shaderMaterial(configRef.current);
    const geometry = new THREE.PlaneGeometry(10, 10);
    const mesh = new THREE.Mesh(geometry, ctx.material);
    
    ctx.scene.add(mesh);
    ctx.camera.position.z = 1;

    // Animation loop
    let lastTime = 0;
    const animate = (time) => {
      ctx.animationId = requestAnimationFrame(animate);
      
      // Update time value
      const config = configRef.current;
      ctx.material.uniforms.time.value += 0.01 * config.speed;
      
      // Batch uniform updates
      const uniforms = ctx.material.uniforms;
      uniforms.intensity.value = config.intensity;
      uniforms.baseParticleCount.value = config.particles;
      uniforms.loadingProgress.value = config.loadingProgress;
      uniforms.isExploding.value = config.isExploding;
      
      if (config.isExploding) {
        const elapsed = (Date.now() - explosionStartTimeRef.current) / 1000;
        uniforms.explosionTime.value = Math.min(elapsed, 2.0);
      }

      uniforms.particleBrightness.value = config.particleBrightness;
      uniforms.particleColor.value.set(
        config.particleColor.r,
        config.particleColor.g,
        config.particleColor.b
      );
      
      ctx.renderer.render(ctx.scene, ctx.camera);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.camera.aspect = width / height;
      ctx.camera.updateProjectionMatrix();
      ctx.renderer.setSize(width, height);
      ctx.material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(ctx.animationId);
      geometry.dispose();
      ctx.material.dispose();
      ctx.renderer.dispose();
      ctx.initialized = false;
    };
  }, []); // Empty dependency array for single initialization

  return <canvas ref={canvasRef} />;
};

export default ParticleCanvas; 