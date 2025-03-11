import * as THREE from 'three';

export const shaderMaterial = (config) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      intensity: { value: config.intensity },
      baseParticleCount: { value: config.particles },
      isLightTheme: { value: config.isLightTheme },
      loadingProgress: { value: config.loadingProgress },
      isExploding: { value: config.isExploding },
      explosionTime: { value: config.explosionTime },
      particleBrightness: { value: config.particleBrightness },
      particleColor: { value: new THREE.Vector3(0, 0, 0) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      #define PI 3.14159265359
      #define TWO_PI 6.28318530718
      
      uniform float time;
      uniform vec2 resolution;
      uniform float intensity;
      uniform float baseParticleCount;
      uniform bool isLightTheme;
      uniform float loadingProgress;
      uniform bool isExploding;
      uniform float explosionTime;
      uniform float particleBrightness;
      uniform vec3 particleColor;

      vec2 rand2(vec2 p) {
          p = vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
          return fract(sin(p)*43758.5453);
      }

      float createParticle(vec2 uv, vec2 center, float intensity) {
          float dist = length(uv - center);
          float particle = exp(-350.0 * dist);
          particle *= step(dist, 0.015);
          particle += exp(-800.0 * dist) * 0.5;
          return particle * intensity;
      }

      void main() {
          vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / resolution.y * 0.8;
          float progressFactor = loadingProgress * 0.01;
          float areaFactor = 1.0 + progressFactor * progressFactor * 3.0;
          float maxParticles = floor(baseParticleCount * areaFactor);
          
          vec3 baseColor = isLightTheme ? vec3(1.0) : vec3(0.0);
          vec3 particleColorFinal = isLightTheme ? particleColor : vec3(0.1, 0.5, 0.8);
          float particleIntensity = intensity * (isLightTheme ? 1.5 : 1.0);
          
          if (isExploding) {
              particleIntensity *= max(0.0, 1.0 - (explosionTime - 1.0));
          }
          
          vec3 finalColor = baseColor;
          
          for(float i = 0.0; i < maxParticles; i++) {
              float normalizedI = i / maxParticles;
              vec2 randomVec = rand2(vec2(i, normalizedI)) * 2.0 - 1.0;
              
              vec2 q = vec2(
                  mod(time/9.0 + tan(normalizedI) + 1.0, 0.35) * 
                  sin(i + vec2(0.0, PI/2.0))
              );
              
              if (isExploding) {
                  float explodeAngle = normalizedI * TWO_PI + randomVec.x * 2.0;
                  float speed = (0.5 + randomVec.y * 0.5) * explosionTime * 2.0;
                  vec2 expDir = vec2(cos(explodeAngle), sin(explodeAngle));
                  expDir.x *= resolution.x / resolution.y;
                  q += expDir * speed * 2.0;
              } else {
                  float maxRadius = 0.4;
                  float loadingRadius = maxRadius * progressFactor;
                  if (length(q) > loadingRadius) {
                      continue;
                  }
              }
              
              float particle = createParticle(uv, q, particleIntensity);
              vec3 particleEffect = particleColorFinal * particle;
              
              finalColor += isLightTheme ? -particleEffect : particleEffect;
          }
          
          gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
      }
    `
  });
}; 