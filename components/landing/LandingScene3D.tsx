"use client";

import { Component, useEffect, useMemo, useRef, useState } from "react";
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
const DIM = "#07c472"; // muted version for secondary elements

// ─── Camera Rig ───────────────────────────────────────────────────────────────
function CameraRig({
  scroll,
  mouse,
}: {
  scroll: React.RefObject<number>;
  mouse: React.RefObject<[number, number]>;
}) {
  const { camera } = useThree();
  const lerpPos = useRef(new THREE.Vector3(0, 0, 8));
  const lerpLook = useRef(new THREE.Vector3(0, -2, 0));
  const tPos = useRef(new THREE.Vector3());
  const tLook = useRef(new THREE.Vector3());

  const cameraPath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 8),
        new THREE.Vector3(-1.4, -5, 7.5),
        new THREE.Vector3(1.6, -11, 7),
        new THREE.Vector3(-0.8, -17, 7.5),
        new THREE.Vector3(0.6, -22, 7),
        new THREE.Vector3(0, -28, 8.5),
      ]),
    [],
  );

  const lookAtPath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(0, -8, 0),
        new THREE.Vector3(0, -14, 0),
        new THREE.Vector3(0, -20, 0),
        new THREE.Vector3(0, -25, 0),
        new THREE.Vector3(0, -31, 0),
      ]),
    [],
  );

  useFrame(() => {
    const t = Math.max(0, Math.min(1, scroll.current));
    cameraPath.getPoint(t, tPos.current);
    lookAtPath.getPoint(t, tLook.current);

    // Mouse parallax offset
    tPos.current.x += mouse.current[0] * 2.2;
    tPos.current.y += mouse.current[1] * 1.4;

    lerpPos.current.lerp(tPos.current, 0.042);
    lerpLook.current.lerp(tLook.current, 0.042);

    camera.position.copy(lerpPos.current);
    camera.lookAt(lerpLook.current);
  });

  return null;
}

// ─── Cursor Light ─────────────────────────────────────────────────────────────
// A green point light that follows the mouse in 3D space
function CursorLight({ mouse }: { mouse: React.RefObject<[number, number]> }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!lightRef.current) return;
    target.current.set(
      mouse.current[0] * 8,
      mouse.current[1] * 5 + camera.position.y,
      camera.position.z - 5,
    );
    lightRef.current.position.lerp(target.current, 0.07);
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={1.2}
      color={PRIMARY}
      distance={10}
      decay={2}
    />
  );
}

// ─── Grid Tunnel ─────────────────────────────────────────────────────────────
// Scrolling shader grid that creates tunnel depth
function GridTunnel({ scroll }: { scroll: React.RefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: new THREE.Color(PRIMARY) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec3 uColor;
        varying vec2 vUv;

        float gridLine(vec2 uv, float res, float thickness) {
          vec2 g = abs(fract(uv * res - 0.5) - 0.5) / fwidth(uv * res);
          return 1.0 - min(min(g.x, g.y), 1.0) * thickness;
        }

        void main() {
          vec2 uv = vUv;
          uv.y += uTime * 0.1 + uScroll * 2.5;

          float g1 = gridLine(uv, 6.0, 0.6);
          float g2 = gridLine(uv, 30.0, 0.3) * 0.35;
          float g = clamp(g1 + g2, 0.0, 1.0);

          float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
          float depthFade = smoothstep(0.0, 0.22, vUv.y);
          float farFade   = smoothstep(1.0, 0.55, vUv.y);

          float alpha = g * edgeFade * depthFade * farFade * 0.22;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [],
  );

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    matRef.current.uniforms.uScroll.value = scroll.current;
  });

  return (
    <mesh position={[0, -14, -4.5]} rotation={[-0.12, 0, 0]}>
      <planeGeometry args={[30, 72, 1, 1]} />
      <shaderMaterial ref={matRef} {...shader} />
    </mesh>
  );
}

// ─── Node Network ─────────────────────────────────────────────────────────────
const NODE_COUNT = 28;
const MAX_LINE_PAIRS = NODE_COUNT * (NODE_COUNT - 1); // upper bound

function NodeNetwork({
  scroll,
  mouse,
}: {
  scroll: React.RefObject<number>;
  mouse: React.RefObject<[number, number]>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const instanceRef = useRef<THREE.InstancedMesh>(null);
  const mat4 = useRef(new THREE.Matrix4());

  // Node positions (mutable typed array)
  const nodePos = useRef(
    (() => {
      const arr = new Float32Array(NODE_COUNT * 3);
      for (let i = 0; i < NODE_COUNT; i++) {
        arr[i * 3 + 0] = (Math.random() - 0.5) * 20;
        arr[i * 3 + 1] = -2 - Math.random() * 26;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      }
      return arr;
    })(),
  );

  // Line geometry — created imperatively so we can update it each frame
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(MAX_LINE_PAIRS * 6), 3),
    );
    return g;
  }, []);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.07, 8, 8), []);
  const sphereMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#aaffdd",
        transparent: true,
        opacity: 0.3,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const np = nodePos.current;

    // Slowly drift each node
    for (let i = 0; i < NODE_COUNT; i++) {
      np[i * 3 + 0] += Math.sin(t * 0.28 + i * 1.27) * 0.003;
      np[i * 3 + 1] += Math.cos(t * 0.19 + i * 0.91) * 0.0012;
    }

    // Update instanced sphere positions
    if (instanceRef.current) {
      for (let i = 0; i < NODE_COUNT; i++) {
        mat4.current.setPosition(np[i * 3], np[i * 3 + 1], np[i * 3 + 2]);
        instanceRef.current.setMatrixAt(i, mat4.current);
      }
      instanceRef.current.instanceMatrix.needsUpdate = true;
    }

    // Rebuild line segments between close-enough nodes
    const attr = lineGeo.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    let idx = 0;
    const thresh2 = 5.5 * 5.5;

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = np[i * 3] - np[j * 3];
        const dy = np[i * 3 + 1] - np[j * 3 + 1];
        const dz = np[i * 3 + 2] - np[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < thresh2) {
          arr[idx++] = np[i * 3];
          arr[idx++] = np[i * 3 + 1];
          arr[idx++] = np[i * 3 + 2];
          arr[idx++] = np[j * 3];
          arr[idx++] = np[j * 3 + 1];
          arr[idx++] = np[j * 3 + 2];
        }
      }
    }
    for (let k = idx; k < MAX_LINE_PAIRS * 6; k++) arr[k] = 0;
    attr.needsUpdate = true;

    // Whole network moves with scroll + mouse
    if (groupRef.current) {
      groupRef.current.position.y = scroll.current * 28;
      groupRef.current.position.x +=
        (mouse.current[0] * 0.6 - groupRef.current.position.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instanceRef}
        args={[sphereGeo, sphereMat, NODE_COUNT]}
      />
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color="#aaffdd"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ─── Hoverable Floating Knot ──────────────────────────────────────────────────
function FloatingKnot({
  position,
  scale = 1,
  speed = 1,
  color = PRIMARY,
  distort = 0.35,
  mouse,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
  distort?: number;
  mouse: React.RefObject<[number, number]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);
  const hoverEmissive = useRef(0.15);
  const hoverCooldown = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseVec = useMemo(() => new THREE.Vector2(), []);
  const { camera } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.25;
    meshRef.current.rotation.y = t * 0.35;

    mouseVec.set(mouse.current[0], mouse.current[1]);
    raycaster.setFromCamera(mouseVec, camera);
    const hits = raycaster.intersectObject(meshRef.current, true);

    // Hysteresis: stay "hovered" for 12 frames after the last hit
    if (hits.length > 0) hoverCooldown.current = 12;
    else hoverCooldown.current = Math.max(0, hoverCooldown.current - 1);
    const hovered = hoverCooldown.current > 0;

    hoverEmissive.current +=
      ((hovered ? 0.85 : 0.15) - hoverEmissive.current) * 0.07;
    if (matRef.current)
      matRef.current.emissiveIntensity = hoverEmissive.current;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale} castShadow>
        <torusKnotGeometry args={[0.9, 0.28, 180, 28]} />
        <MeshDistortMaterial
          ref={matRef}
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

// ─── Hoverable Icosahedron ────────────────────────────────────────────────────
function FloatingIcosahedron({
  position,
  scale = 1,
  color = ACCENT,
  mouse,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  mouse: React.RefObject<[number, number]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const hoverEmissive = useRef(0.1);
  const hoverCooldown = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseVec = useMemo(() => new THREE.Vector2(), []);
  const { camera } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.z = t * 0.15;

    mouseVec.set(mouse.current[0], mouse.current[1]);
    raycaster.setFromCamera(mouseVec, camera);
    const hits = raycaster.intersectObject(meshRef.current, true);

    if (hits.length > 0) hoverCooldown.current = 12;
    else hoverCooldown.current = Math.max(0, hoverCooldown.current - 1);
    const hovered = hoverCooldown.current > 0;

    hoverEmissive.current +=
      ((hovered ? 0.75 : 0.1) - hoverEmissive.current) * 0.07;
    if (matRef.current)
      matRef.current.emissiveIntensity = hoverEmissive.current;
  });

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.25}
          metalness={0.85}
          flatShading
        />
      </mesh>
    </Float>
  );
}

// ─── Hoverable Torus ──────────────────────────────────────────────────────────
function FloatingTorus({
  position,
  scale = 1,
  color = PRIMARY,
  mouse,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  mouse: React.RefObject<[number, number]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const hoverEmissive = useRef(0.12);
  const hoverCooldown = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseVec = useMemo(() => new THREE.Vector2(), []);
  const { camera } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.5;

    mouseVec.set(mouse.current[0], mouse.current[1]);
    raycaster.setFromCamera(mouseVec, camera);
    const hits = raycaster.intersectObject(meshRef.current, true);

    if (hits.length > 0) hoverCooldown.current = 12;
    else hoverCooldown.current = Math.max(0, hoverCooldown.current - 1);
    const hovered = hoverCooldown.current > 0;

    hoverEmissive.current +=
      ((hovered ? 0.85 : 0.12) - hoverEmissive.current) * 0.07;
    if (matRef.current)
      matRef.current.emissiveIntensity = hoverEmissive.current;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[0.7, 0.22, 24, 64]} />
        <meshStandardMaterial
          ref={matRef}
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

// ─── Particle Field ───────────────────────────────────────────────────────────
function ParticleField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#4dffc0"); // softer mint, not full neon
    const c2 = new THREE.Color("#ffffff");
    for (let i = 0; i < count; i++) {
      // Distribute over a tall volume matching the scene depth
      const r = 14 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 14;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const mix = Math.random();
      const c = c1.clone().lerp(c2, mix);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = t * 0.008;
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
        size={0.065}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Dynamic lighting that shifts hue with scroll ────────────────────────────
function ScrollLights({ scroll }: { scroll: React.RefObject<number> }) {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const light3 = useRef<THREE.PointLight>(null);

  // Section color themes [hero, features, feature-alt, trust, pricing, footer]
  const colorStops = useMemo(
    () => [
      new THREE.Color("#0df293"),
      new THREE.Color("#00e5cc"),
      new THREE.Color("#0df293"),
      new THREE.Color("#11d662"),
      new THREE.Color("#00bfff"),
      new THREE.Color("#0df293"),
    ],
    [],
  );

  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const t = Math.max(0, Math.min(1, scroll.current));
    const section = t * (colorStops.length - 1);
    const idx = Math.floor(section);
    const frac = section - idx;
    tmpColor
      .copy(colorStops[Math.min(idx, colorStops.length - 1)])
      .lerp(colorStops[Math.min(idx + 1, colorStops.length - 1)], frac);

    if (light1.current) {
      light1.current.color.copy(tmpColor);
      light1.current.position.y = -t * 28 + 8;
    }
    if (light2.current) {
      light2.current.position.y = -t * 28 - 4;
    }
    if (light3.current) {
      light3.current.position.y = -t * 28 + 6;
    }
  });

  return (
    <>
      <pointLight
        ref={light1}
        intensity={0.7}
        color={DIM}
        position={[5, 8, 5]}
      />
      <pointLight
        ref={light2}
        intensity={0.6}
        color={DIM}
        position={[-6, -4, -4]}
      />
      <pointLight
        ref={light3}
        intensity={1.1}
        color="#ffffff"
        position={[6, 6, -2]}
      />
    </>
  );
}

// ─── Scene Contents ───────────────────────────────────────────────────────────
function SceneContents({
  scroll,
  mouse,
}: {
  scroll: React.RefObject<number>;
  mouse: React.RefObject<[number, number]>;
}) {
  const sharedMouse = mouse;

  return (
    <>
      <fog attach="fog" args={["#0d1117", 18, 48]} />
      <ambientLight intensity={0.5} />
      <ScrollLights scroll={scroll} />
      <CursorLight mouse={sharedMouse} />
      <Environment preset="city" />

      <ParticleField count={900} />
      <Sparkles
        count={80}
        scale={[22, 30, 14]}
        position={[0, -14, 0]}
        size={1.8}
        speed={0.3}
        color="#ffffff"
        opacity={0.35}
      />

      <GridTunnel scroll={scroll} />
      <NodeNetwork scroll={scroll} mouse={sharedMouse} />

      {/* ── Hero section (scroll ≈ 0, camera y ≈ 0) ── */}
      <FloatingKnot
        position={[3.5, 0.6, -1]}
        scale={1.1}
        speed={1}
        mouse={sharedMouse}
      />
      <FloatingIcosahedron
        position={[-3.8, -0.4, -2]}
        scale={1.3}
        color="#c8fde8"
        mouse={sharedMouse}
      />
      <FloatingTorus
        position={[0, 2.6, -4]}
        scale={1.1}
        color="#e0e0e0"
        mouse={sharedMouse}
      />

      {/* ── Feature grid (scroll ≈ 0.2, camera y ≈ -5) ── */}
      <FloatingTorus
        position={[-4.5, -5, -1]}
        scale={0.85}
        color="#d0fde8"
        mouse={sharedMouse}
      />
      <FloatingKnot
        position={[4, -6, -3]}
        scale={1}
        color={PRIMARY}
        distort={0.4}
        mouse={sharedMouse}
      />

      {/* ── Feature alt-1 (scroll ≈ 0.4, camera y ≈ -11) ── */}
      <FloatingIcosahedron
        position={[-3.5, -10, -2]}
        scale={1.2}
        color="#ffffff"
        mouse={sharedMouse}
      />
      <FloatingTorus
        position={[3.8, -11, -2]}
        scale={1.1}
        color={ACCENT}
        mouse={sharedMouse}
      />

      {/* ── Feature alt-2 (scroll ≈ 0.55, camera y ≈ -17) ── */}
      <FloatingKnot
        position={[0, -15, -3]}
        scale={1.3}
        color={ACCENT}
        distort={0.55}
        mouse={sharedMouse}
      />
      <FloatingIcosahedron
        position={[4, -16, -1]}
        scale={1.1}
        color="#e8e8e8"
        mouse={sharedMouse}
      />

      {/* ── Trust / Pricing (scroll ≈ 0.75, camera y ≈ -22) ── */}
      <FloatingTorus
        position={[-4.2, -20, -2]}
        scale={1.2}
        color="#d0fde8"
        mouse={sharedMouse}
      />
      <FloatingKnot
        position={[3.5, -21, -2]}
        scale={1.1}
        color={PRIMARY}
        distort={0.45}
        mouse={sharedMouse}
      />

      {/* ── CTA / Footer (scroll ≈ 1, camera y ≈ -28) ── */}
      <FloatingIcosahedron
        position={[-3.8, -26, -2]}
        scale={1.3}
        color="#ffffff"
        mouse={sharedMouse}
      />
      <FloatingTorus
        position={[3.2, -28, -3]}
        scale={1.4}
        color={ACCENT}
        mouse={sharedMouse}
      />

      {/* Depth ring */}
      <mesh position={[0, -14, -9]} rotation={[-Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[3, 14, 72]} />
        <meshBasicMaterial
          color={PRIMARY}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// ─── WebGL support check ──────────────────────────────────────────────────────
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    // Three.js r152+ uses WebGL2 by default; fall back to WebGL1
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

// ─── Error boundary — swallows Canvas crashes silently ────────────────────────
class CanvasErrorBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function LandingScene3D() {
  const scroll = useRef(0);
  const mouse = useRef<[number, number]>([0, 0]);
  // Lazy initializer — runs once on the client, never on the server
  const [webglOk] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isWebGLAvailable();
  });

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = h > 0 ? window.scrollY / h : 0;
    };
    const onMouse = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ];
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // Don't render until we know WebGL status; skip entirely if unavailable
  if (!webglOk) return null;

  return (
    <CanvasErrorBoundary>
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 55 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ background: "transparent" }}
        >
          <SceneContents scroll={scroll} mouse={mouse} />
          <CameraRig scroll={scroll} mouse={mouse} />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
