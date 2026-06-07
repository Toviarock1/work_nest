"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sparkles,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

// Auth palette — matches primary2 (#1d6d6b) used on login/register
const PRIMARY = "#1d6d6b";
const ACCENT = "#3a9c95";
const HIGHLIGHT = "#5fb8b0";

function FloatingKnot({
  position,
  scale = 1,
  color = PRIMARY,
  distort = 0.32,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  distort?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.22;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusKnotGeometry args={[0.9, 0.28, 160, 24]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.65}
          distort={distort}
          speed={1.2}
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
    ref.current.rotation.x = t * 0.18;
    ref.current.rotation.z = t * 0.12;
  });
  return (
    <Float speed={1} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({
  position,
  scale = 1,
  color = HIGHLIGHT,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.22;
    ref.current.rotation.y = t * 0.35;
  });
  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[0.7, 0.22, 24, 56]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.28}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(PRIMARY);
    const c2 = new THREE.Color(HIGHLIGHT);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 14;
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
    ref.current.rotation.y = t * 0.02;
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
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MouseCamera() {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    const tx = mouse.x * 1.1;
    const ty = mouse.y * 0.7;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(target.current);
  });
  return null;
}

function SceneContents() {
  return (
    <>
      <fog attach="fog" args={["#0a2725", 14, 36]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 5]} intensity={1} color={ACCENT} />
      <pointLight position={[-5, -3, -3]} intensity={1.2} color={PRIMARY} />
      <pointLight position={[5, 5, -2]} intensity={0.6} color={HIGHLIGHT} />

      <Environment preset="city" />

      <ParticleField count={500} />

      <Sparkles
        count={70}
        scale={[18, 10, 10]}
        size={1.8}
        speed={0.3}
        color={HIGHLIGHT}
        opacity={0.55}
      />

      {/* A small, calm cluster — no scroll movement on auth pages */}
      <FloatingKnot position={[3.4, 1, -1.5]} scale={1} />
      <FloatingIcosahedron position={[-3.8, -0.6, -2]} scale={1.2} />
      <FloatingTorus position={[0.2, -2.4, -3]} scale={1.1} />
      <FloatingKnot
        position={[-2.5, 2.3, -3.5]}
        scale={0.7}
        color={ACCENT}
        distort={0.4}
      />
      <FloatingIcosahedron
        position={[3.6, -2.2, -2.5]}
        scale={0.8}
        color={HIGHLIGHT}
      />
    </>
  );
}

export default function AuthScene3D() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden>
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
        <SceneContents />
        <MouseCamera />
      </Canvas>
    </div>
  );
}
