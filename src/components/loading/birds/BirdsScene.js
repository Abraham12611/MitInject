// components/BirdsScene.js
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { fragmentShaderPosition, fragmentShaderVelocity, vertexShader, fragmentShader } from './shaders';
import { fillPositionTexture, fillVelocityTexture } from './fillTextures';

const BOUNDS = 800;
const BOUNDS_HALF = BOUNDS / 2;
const WIDTH = 32;
const BIRDS = WIDTH * WIDTH;

class BirdGeometry extends THREE.BufferGeometry {
  constructor() {
    super();

    const trianglesPerBird = 3;
    const triangles = BIRDS * trianglesPerBird;
    const points = triangles * 3;

    const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
    const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
    const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
    const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);

    this.setAttribute('position', vertices);
    this.setAttribute('birdColor', birdColors);
    this.setAttribute('reference', references);
    this.setAttribute('birdVertex', birdVertex);

    let v = 0;

    function verts_push() {
      for (let i = 0; i < arguments.length; i++) {
        vertices.array[v++] = arguments[i];
      }
    }

    const wingsSpan = 20;

    for (let f = 0; f < BIRDS; f++) {
      // Body
      verts_push(
        0, -0, -20,
        0, 4, -20,
        0, 0, 30
      );

      // Wings
      verts_push(
        0, 0, -15,
        -wingsSpan, 0, 0,
        0, 0, 15
      );

      verts_push(
        0, 0, 15,
        wingsSpan, 0, 0,
        0, 0, -15
      );
    }

    for (let v = 0; v < triangles * 3; v++) {
      const triangleIndex = ~~(v / 3);
      const birdIndex = ~~(triangleIndex / trianglesPerBird);
      const x = (birdIndex % WIDTH) / WIDTH;
      const y = ~~(birdIndex / WIDTH) / WIDTH;

      const c = new THREE.Color(
        0x666666 + ~~(v / 9) / BIRDS * 0x666666
      );

      birdColors.array[v * 3 + 0] = c.r;
      birdColors.array[v * 3 + 1] = c.g;
      birdColors.array[v * 3 + 2] = c.b;

      references.array[v * 2] = x;
      references.array[v * 2 + 1] = y;

      birdVertex.array[v] = v % 9;
    }

    this.scale(0.2, 0.2, 0.2);
  }
}

export default function BirdsScene() {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const gpuComputeRef = useRef();
  const positionVariableRef = useRef();
  const velocityVariableRef = useRef();
  const uniformsRef = useRef({
    position: null,
    velocity: null,
    bird: null
  });
  const [mousePosition, setMousePosition] = useState({ x: 10000, y: 10000 });
  const lastTimeRef = useRef(performance.now());

  // Utility function to properly dispose of materials
  const disposeMaterial = (material) => {
    if (!material) return;
    
    // Dispose of any textures
    for (const key of Object.keys(material)) {
      const value = material[key];
      if (value && typeof value === 'object' && 'minFilter' in value) {
        value.dispose();
      }
    }
    
    // Dispose of the material itself
    material.dispose();
  };

  useEffect(() => {
    let animationFrameId;
    let isDisposed = false;

    const initialize = () => {
      if (!containerRef.current || isDisposed) return;

      // Clean up any existing renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current.domElement.remove();
        rendererRef.current = null;
      }

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      scene.fog = new THREE.Fog(0xffffff, 100, 1000);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );
      camera.position.z = 350;
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      initComputeRenderer(renderer);
      initBirds();

      // Event listeners
      window.addEventListener('resize', onWindowResize);
      // NOTE: Removed because of issue with WebGL -- too many contexts
      // containerRef.current.addEventListener('pointermove', onPointerMove);
      
      // Start animation
      animate();
    };

    const initComputeRenderer = (renderer) => {
      const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
      
      const dtPosition = gpuCompute.createTexture();
      const dtVelocity = gpuCompute.createTexture();
      
      fillPositionTexture(dtPosition);
      fillVelocityTexture(dtVelocity);

      const velocityVariable = gpuCompute.addVariable(
        'textureVelocity',
        fragmentShaderVelocity,
        dtVelocity
      );

      const positionVariable = gpuCompute.addVariable(
        'texturePosition',
        fragmentShaderPosition,
        dtPosition
      );

      gpuCompute.setVariableDependencies(velocityVariable, [
        positionVariable,
        velocityVariable
      ]);

      gpuCompute.setVariableDependencies(positionVariable, [
        positionVariable,
        velocityVariable
      ]);

      const positionUniforms = positionVariable.material.uniforms;
      const velocityUniforms = velocityVariable.material.uniforms;

      positionUniforms['time'] = { value: 0.0 };
      positionUniforms['delta'] = { value: 0.0 };
      velocityUniforms['time'] = { value: 1.0 };
      velocityUniforms['delta'] = { value: 0.0 };
      velocityUniforms['testing'] = { value: 1.0 };
      velocityUniforms['separationDistance'] = { value: 20.0 };
      velocityUniforms['alignmentDistance'] = { value: 20.0 };
      velocityUniforms['cohesionDistance'] = { value: 20.0 };
      velocityUniforms['freedomFactor'] = { value: 0.75 };
      velocityUniforms['predator'] = { value: new THREE.Vector3() };
      
      velocityVariable.wrapS = THREE.RepeatWrapping;
      velocityVariable.wrapT = THREE.RepeatWrapping;
      positionVariable.wrapS = THREE.RepeatWrapping;
      positionVariable.wrapT = THREE.RepeatWrapping;

      const error = gpuCompute.init();
      if (error !== null) {
        console.error(error);
      }

      gpuComputeRef.current = gpuCompute;
      positionVariableRef.current = positionVariable;
      velocityVariableRef.current = velocityVariable;
      uniformsRef.current = {
        position: positionUniforms,
        velocity: velocityUniforms
      };
    };

    const initBirds = () => {
      const geometry = new BirdGeometry();
      const birdUniforms = {
        'color': { value: new THREE.Color(0xff2200) },
        'texturePosition': { value: null },
        'textureVelocity': { value: null },
        'time': { value: 1.0 },
        'delta': { value: 0.0 }
      };

      const material = new THREE.ShaderMaterial({
        uniforms: birdUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
      });

      const birdMesh = new THREE.Mesh(geometry, material);
      birdMesh.rotation.y = Math.PI / 2;
      birdMesh.matrixAutoUpdate = false;
      birdMesh.updateMatrix();

      sceneRef.current.add(birdMesh);
      uniformsRef.current.bird = birdUniforms;
    };

    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };

    const onPointerMove = (event) => {
      if (event.isPrimary === false) return;

      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      setMousePosition({
        x: event.clientX - windowHalfX,
        y: event.clientY - windowHalfY
      });
    };

    const animate = () => {
      const now = performance.now();
      let delta = (now - lastTimeRef.current) / 1000;

      if (delta > 1) delta = 1;
      lastTimeRef.current = now;

      if (uniformsRef.current.position) {
        uniformsRef.current.position.time.value = now;
        uniformsRef.current.position.delta.value = delta;
      }

      if (uniformsRef.current.velocity) {
        uniformsRef.current.velocity.time.value = now;
        uniformsRef.current.velocity.delta.value = delta;
        uniformsRef.current.velocity.predator.value.set(
          0.5 * mousePosition.x / (window.innerWidth / 2),
          -0.5 * mousePosition.y / (window.innerHeight / 2),
          0
        );
      }

      if (uniformsRef.current.bird) {
        uniformsRef.current.bird.time.value = now;
        uniformsRef.current.bird.delta.value = delta;
      }

      if (gpuComputeRef.current) {
        gpuComputeRef.current.compute();

        if (uniformsRef.current.bird) {
          uniformsRef.current.bird.texturePosition.value = 
            gpuComputeRef.current.getCurrentRenderTarget(positionVariableRef.current).texture;
          uniformsRef.current.bird.textureVelocity.value =
            gpuComputeRef.current.getCurrentRenderTarget(velocityVariableRef.current).texture;
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    initialize();

    return () => {
      isDisposed = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Cleanup GPU compute
      if (gpuComputeRef.current) {
        const compute = gpuComputeRef.current;
        if (compute.variables) {
          compute.variables.forEach(variable => {
            if (variable.renderTargets) {
              variable.renderTargets.forEach(target => target.dispose());
            }
          });
        }
      }

      // Cleanup scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => disposeMaterial(material));
            } else {
              disposeMaterial(object.material);
            }
          }
        });
      }

      // Cleanup renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current.domElement.remove();
        rendererRef.current = null;
      }

      // Remove event listeners
      window.removeEventListener('resize', onWindowResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('pointermove', onPointerMove);
      }
    };
  }, [mousePosition]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
