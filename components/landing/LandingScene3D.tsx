"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sparkles,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

const PRIMARY = "#0df293";
const ACCENT = "#11d662";
const DEEP = "#0a3b2a";

function FloatingKnot({
  position,
  scale = 1,
  speed = 1,
  color = PRIMARY,
  distort = 0.35,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
  distort?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.25;
    ref.current.rotation.y = t * 0.35;
  });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <torusKnotGeometry args={[0.9, 0.28, 180, 28]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.6}
          distort={distort}
          speed={1.8}
        />
      </mesh>
    </Float>
  );
}

function FloatingIcosahedron({
  position,
  scale = 1,
  color = ACCENT,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.z = t * 0.15;
  });
  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.25}
          metalness={0.85}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({
  position,
  scale = 1,
  color = PRIMARY,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[0.7, 0.22, 24, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(PRIMARY);
    const c2 = new THREE.Color("#ffffff");
    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const mix = Math.random();
      const c = c1.clone().lerp(c2, mix);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = t * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MouseCamera({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    const tx = mouse.x * 1.6;
    const ty = mouse.y * 1.0 - scroll.current * 4;
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.lookAt(target.current);
  });
  return null;
}

function SceneContents({
  scroll,
}: {
  scroll: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.position.y = scroll.current * 28;
    group.current.rotation.y = scroll.current * Math.PI * 0.6;
  });

  return (
    <>
      <fog attach="fog" args={["#06140e", 16, 42]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color={PRIMARY} />
      <pointLight position={[-6, -4, -4]} intensity={1.4} color={ACCENT} />
      <pointLight position={[6, 6, -2]} intensity={0.8} color="#ffffff" />

      <Environment preset="city" />

      <ParticleField count={900} />

      <Sparkles
        count={120}
        scale={[20, 12, 12]}
        size={2.4}
        speed={0.4}
        color={PRIMARY}
        opacity={0.7}
      />

      <group ref={group}>
        {/* Hero cluster (scroll ~0) */}
        <FloatingKnot position={[3.5, 0.6, -1]} scale={1.1} speed={1} />
        <FloatingIcosahedron position={[-3.8, -0.4, -2]} scale={1.3} />
        <FloatingTorus position={[0, 2.6, -4]} scale={1.1} />

        {/* Feature-grid section (scroll ~0.15) */}
        <FloatingTorus position={[-4.5, -4, -1]} scale={0.85} color={ACCENT} />
        <FloatingKnot
          position={[4, -5, -3]}
          scale={1}
          color={PRIMARY}
          distort={0.4}
        />

        {/* Scale header + Feature alt 1 (scroll ~0.3) */}
        <FloatingIcosahedron position={[-3.5, -9, -2]} scale={1.2} color={PRIMARY} />
        <FloatingTorus position={[3.8, -10, -2]} scale={1.1} color={ACCENT} />

        {/* Feature alt 2 (scroll ~0.45) */}
        <FloatingKnot
          position={[0, -14, -3]}
          scale={1.3}
          color={ACCENT}
          distort={0.55}
        />
        <FloatingIcosahedron position={[4, -15, -1]} scale={1} color={ACCENT} />

        {/* Trust grid + Pricing (scroll ~0.6) */}
        <FloatingTorus position={[-4.2, -19, -2]} scale={1.2} color={PRIMARY} />
        <FloatingKnot
          position={[3.5, -20, -2]}
          scale={1.1}
          color={PRIMARY}
          distort={0.45}
        />

        {/* CTA + footer (scroll ~0.85) */}
        <FloatingIcosahedron position={[-3.8, -25, -2]} scale={1.3} color={PRIMARY} />
        <FloatingTorus position={[3.2, -27, -3]} scale={1.4} color={ACCENT} />

        {/* Floor disc */}
        <mesh
          position={[0, -6, -8]}
          rotation={[-Math.PI / 2.2, 0, 0]}
          receiveShadow
        >
          <ringGeometry args={[3, 12, 64]} />
          <meshBasicMaterial
            color={DEEP}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}

export default function LandingScene3D() {
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = h > 0 ? window.scrollY / h : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0"
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <SceneContents scroll={scroll} />
        <MouseCamera scroll={scroll} />
      </Canvas>
    </div>
  );
}
