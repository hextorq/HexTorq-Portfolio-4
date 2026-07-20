import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollStore } from './scrollStore'
import { skyVertex, skyFragment, knotVertex, knotFragment } from './shaders'

const lerp = THREE.MathUtils.lerp
const damp = THREE.MathUtils.damp

const BLUE = new THREE.Color('#3d6bff')
const VIOLET = new THREE.Color('#7c3aed')

/* ── Smooths shared scroll/pointer state once per frame ──────────── */
function StoreSmoother() {
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0015, dt)
    scrollStore.progress = lerp(scrollStore.progress, scrollStore.progressTarget, k)
    scrollStore.pointer.x = lerp(scrollStore.pointer.x, scrollStore.pointerTarget.x, k)
    scrollStore.pointer.y = lerp(scrollStore.pointer.y, scrollStore.pointerTarget.y, k)
  })
  return null
}

/* ── Geometric pattern background (inside-out sphere) ────────────── */
function Nebula() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uScroll: { value: 0 } }), [])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uScroll.value = scrollStore.progress
  })

  return (
    <mesh scale={[40, 40, 40]}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── MORPHING TORUS KNOT ───────────────────────────────────────────
     A torus knot with noise-based vertex displacement that makes it
     look alive and organic. Responds to cursor (tilt + bulge) and
     scroll (morph intensity + pulse).                               */
function MorphKnot() {
  const group = useRef()
  const meshRef = useRef()
  const prevPointer = useRef({ x: 0, y: 0 })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uScale: { value: 1 },
      uBlue: { value: BLUE.clone() },
      uViolet: { value: VIOLET.clone() },
    }),
    []
  )

  useFrame((state, dt) => {
    const p = scrollStore.progress
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return

    uniforms.uTime.value = t
    uniforms.uScroll.value = p

    // Smooth pointer for the bulge
    prevPointer.current.x = lerp(prevPointer.current.x, scrollStore.pointer.x, 0.05)
    prevPointer.current.y = lerp(prevPointer.current.y, scrollStore.pointer.y, 0.05)
    uniforms.uPointer.value.set(prevPointer.current.x, prevPointer.current.y, 0)

    // Interactive tilt toward cursor
    g.rotation.x = damp(g.rotation.x, scrollStore.pointer.y * 0.5, 3, dt)
    g.rotation.y = damp(g.rotation.y, scrollStore.pointer.x * 0.5, 3, dt)

    // Slow base rotation
    g.rotation.z += dt * 0.08

    // Floating drift
    g.position.y = Math.sin(t * 0.25 + p * 1.5) * 0.15
    g.position.x = Math.sin(t * 0.18 + p * 1.2) * 0.1
    g.position.z = damp(g.position.z, -0.5 + p * 0.6, 2, dt)

    // Scale pulse with scroll
    const s = 1 + Math.sin(p * Math.PI * 2) * 0.05 + Math.sin(t * 0.5) * 0.01
    g.scale.setScalar(damp(g.scale.x || 1, s, 3, dt))
  })

  return (
    <group ref={group} position={[0, 0, -0.5]}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.0, 0.34, 180, 24]} />
        <shaderMaterial
          vertexShader={knotVertex}
          fragmentShader={knotFragment}
          uniforms={uniforms}
          transparent={false}
        />
      </mesh>
    </group>
  )
}

/* ── FLOWING PARTICLE NEBULA ───────────────────────────────────────
     Two concentric layers of particles: a dense toroidal inner ring
     and a sparse outer cloud. Both orbit slowly and react to scroll. ──*/
function FlowField() {
  const innerRef = useRef()
  const outerRef = useRef()
  const innerCount = 1800
  const outerCount = 800

  const innerPos = useMemo(() => {
    const arr = new Float32Array(innerCount * 3)
    for (let i = 0; i < innerCount; i++) {
      const radius = 2.2 + Math.random() * 1.8
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 1.6
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = height
      arr[i * 3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [])

  const outerPos = useMemo(() => {
    const arr = new Float32Array(outerCount * 3)
    for (let i = 0; i < outerCount; i++) {
      const radius = 5 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    const inner = innerRef.current
    const outer = outerRef.current
    const p = scrollStore.progress

    if (inner) {
      inner.rotation.y += dt * (0.08 + p * 0.06)
      inner.rotation.x = damp(inner.rotation.x, p * 0.3, 2, dt)
    }
    if (outer) {
      outer.rotation.y -= dt * (0.02 + p * 0.03)
      outer.rotation.x = damp(outer.rotation.x, p * 0.4, 2, dt)
    }
  })

  return (
    <>
      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={innerCount} array={innerPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          color="#5d84ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={outerCount} array={outerPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          color="#7c3aed"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  )
}

/* ── GLOWING ENERGY SHARDS ────────────────────────────────────────
     Small emissive octahedrons orbiting the knot at various
     radii and speeds, with a pulsing glow.                         */
function GlowOrbits({ count = 8 }) {
  const group = useRef()
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: 2.0 + (i % 2) * 0.8,
        speed: 0.2 + (i % 3) * 0.07,
        phase: (i / count) * Math.PI * 2,
        tilt: (i - count / 2) * 0.2,
      })),
    [count]
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.rotation.x = damp(g.rotation.x, scrollStore.progress * 0.8, 2.5, dt)
    g.children.forEach((m, i) => {
      const s = seeds[i]
      const a = t * s.speed + s.phase
      m.position.set(
        Math.cos(a) * s.radius,
        Math.sin(a * 0.8) * s.radius * 0.3 + s.tilt,
        Math.sin(a) * s.radius * 0.7
      )
      m.rotation.x += dt * 0.5
      m.rotation.y += dt * 0.3 + scrollStore.progress * 0.1

      const pulse = 0.5 + Math.sin(t * 1.2 + s.phase) * 0.5
      m.material.emissiveIntensity = 0.6 + pulse * 1.2
    })
  })

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} scale={0.08 + (i % 4) * 0.015}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#3d6bff' : '#7c3aed'}
            emissive={i % 2 === 0 ? '#3d6bff' : '#7c3aed'}
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.9}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── DRAMATIC LIGHTING ──────────────────────────────────────────── */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 4, 6]} intensity={40} color="#3d6bff" distance={50} />
      <pointLight position={[-6, -3, 5]} intensity={35} color="#7c3aed" distance={50} />
      <pointLight position={[0, 6, -4]} intensity={20} color="#5d84ff" distance={40} />
    </>
  )
}

/* ── Cinematic camera dolly ──────────────────────────────────────── */
function CameraRig() {
  useFrame((state, dt) => {
    const p = scrollStore.progress
    const cam = state.camera
    const tx = scrollStore.pointer.x * 0.8
    const ty = 0.4 + scrollStore.pointer.y * 0.5 - p * 0.5
    const tz = 6 + p * 1.8
    cam.position.x = damp(cam.position.x, tx, 2, dt)
    cam.position.y = damp(cam.position.y, ty, 2, dt)
    cam.position.z = damp(cam.position.z, tz, 2, dt)
    cam.lookAt(0, -p * 0.6, 0)
  })
  return null
}

export default function Scene() {
  return (
    <Canvas
      className="webgl-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 6], fov: 45 }}
    >
      <StoreSmoother />
      <CameraRig />
      <Nebula />
      <Lights />
      <MorphKnot />
      <FlowField />
      <GlowOrbits />
    </Canvas>
  )
}
