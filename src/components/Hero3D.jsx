import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Outer wireframe shell
const Wireframe = () => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.08;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.6, 1]} />
      <meshBasicMaterial color="#D7E2EA" wireframe transparent opacity={0.55} />
    </mesh>
  );
};

// Inner glowing core that cycles through the CTA palette
const Core = () => {
  const ref = useRef();
  const palette = useMemo(() => [
    new THREE.Color('#B600A8'), // magenta
    new THREE.Color('#7721B1'), // purple
    new THREE.Color('#BE4C00'), // orange
    new THREE.Color('#D946EF'), // pink
  ], []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    // Subtle breathing scale
    const s = 1 + Math.sin(t * 1.2) * 0.05;
    ref.current.scale.set(s, s, s);

    // Cycle through palette: each stage takes ~3s, smoothly lerp into the next
    const stage = (t * 0.33) % palette.length;
    const idx = Math.floor(stage);
    const next = (idx + 1) % palette.length;
    const blend = stage - idx;

    tmp.copy(palette[idx]).lerp(palette[next], blend);

    const mat = ref.current.material;
    mat.emissive.copy(tmp);
    // Pulse intensity slightly with the breath
    mat.emissiveIntensity = 1.0 + Math.sin(t * 1.2) * 0.25;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        color="#1a0026"
        emissive="#B600A8"
        emissiveIntensity={1.2}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  );
};

// Mid wireframe ring — adds depth
const Ring = ({ axis = 'x' }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation[axis] += delta * 0.5;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.015, 16, 100]} />
      <meshBasicMaterial color="#BE4C00" transparent opacity={0.8} />
    </mesh>
  );
};

// Orbiting particle dots
const Particles = ({ count = 90 }) => {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.random() * 0.8;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.x -= delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#EC4899" size={0.045} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
};

const Hero3D = () => (
  <div className="w-full h-full">
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[-4, 2, -2]} color="#BE4C00" intensity={2.5} distance={14} />
        <pointLight position={[4, -2, 2]}  color="#B600A8" intensity={2.5} distance={14} />
        <pointLight position={[0, 4, 3]}   color="#7721B1" intensity={2}   distance={12} />
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
          <group>
            <Wireframe />
            <Core />
            <Ring axis="x" />
            <Ring axis="z" />
            <Particles count={90} />
          </group>
        </Float>
      </Suspense>
    </Canvas>
  </div>
);

export default Hero3D;
