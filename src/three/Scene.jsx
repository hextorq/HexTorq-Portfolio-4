import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { scrollStore } from './scrollStore'
import {
  skyVertex,
  skyFragment,
  xVertex,
  xFragment,
  xHaloFragment,
} from './shaders'

const lerp = THREE.MathUtils.lerp
const damp = THREE.MathUtils.damp

// Exact User-Specified Section Color Stops:
//   Hero (0%):       #3D6BFF electric blue → #5C4DFF indigo
//   Services (25%):  #5C4DFF indigo → #9E42F2 violet
//   Products (50%):  #9E42F2 violet → #21B8DB teal-cyan
//   Projects (75%):  #21B8DB teal → #3D6BFF blue
//   Contact (100%):  #3D6BFF blue → #7D56F2 violet
const COLOR_STOPS = {
  hero: { a: new THREE.Color('#3D6BFF'), b: new THREE.Color('#5C4DFF') },
  services: { a: new THREE.Color('#5C4DFF'), b: new THREE.Color('#9E42F2') },
  products: { a: new THREE.Color('#9E42F2'), b: new THREE.Color('#21B8DB') },
  projects: { a: new THREE.Color('#21B8DB'), b: new THREE.Color('#3D6BFF') },
  contact: { a: new THREE.Color('#3D6BFF'), b: new THREE.Color('#7D56F2') },
}

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

/* ── Animated nebula background ──────────────────────────────────── */
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

/* ── THE HEXTORQ "X" — 3D element with exact section color stops ──── */
function XMark() {
  const group = useRef()

  const uniforms = useMemo(
    () => ({
      uBlue: { value: COLOR_STOPS.hero.a.clone() },
      uViolet: { value: COLOR_STOPS.hero.b.clone() },
    }),
    []
  )

  const beam = [0.62, 3.2, 0.62]

  useFrame((state, dt) => {
    const p = scrollStore.progress
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return

    // Exact Section Stop Color Interpolation:
    // 0.00 - 0.25 (Hero → Services): #3D6BFF/#5C4DFF → #5C4DFF/#9E42F2
    // 0.25 - 0.50 (Services → Products): #5C4DFF/#9E42F2 → #9E42F2/#21B8DB
    // 0.50 - 0.75 (Products → Projects): #9E42F2/#21B8DB → #21B8DB/#3D6BFF
    // 0.75 - 1.00 (Projects → Contact): #21B8DB/#3D6BFF → #3D6BFF/#7D56F2
    const cA = new THREE.Color()
    const cB = new THREE.Color()

    if (p < 0.25) {
      const f = p / 0.25
      cA.lerpColors(COLOR_STOPS.hero.a, COLOR_STOPS.services.a, f)
      cB.lerpColors(COLOR_STOPS.hero.b, COLOR_STOPS.services.b, f)
    } else if (p < 0.50) {
      const f = (p - 0.25) / 0.25
      cA.lerpColors(COLOR_STOPS.services.a, COLOR_STOPS.products.a, f)
      cB.lerpColors(COLOR_STOPS.services.b, COLOR_STOPS.products.b, f)
    } else if (p < 0.75) {
      const f = (p - 0.50) / 0.25
      cA.lerpColors(COLOR_STOPS.products.a, COLOR_STOPS.projects.a, f)
      cB.lerpColors(COLOR_STOPS.products.b, COLOR_STOPS.projects.b, f)
    } else {
      const f = (p - 0.75) / 0.25
      cA.lerpColors(COLOR_STOPS.projects.a, COLOR_STOPS.contact.a, f)
      cB.lerpColors(COLOR_STOPS.projects.b, COLOR_STOPS.contact.b, f)
    }

    uniforms.uBlue.value.copy(cA)
    uniforms.uViolet.value.copy(cB)

    // Drift & rotation across sections
    const targetX = Math.sin(p * Math.PI * 1.6) * 2.2 + scrollStore.pointer.x * 0.5
    const targetY = -p * 1.5 + Math.sin(p * Math.PI * 2.4) * 0.5 + scrollStore.pointer.y * 0.4
    const targetZ = -0.5 + Math.sin(p * Math.PI) * 1.2

    g.position.x = damp(g.position.x, targetX, 3, dt)
    g.position.y = damp(g.position.y, targetY, 3, dt)
    g.position.z = damp(g.position.z, targetZ, 3, dt)

    g.rotation.z += dt * (0.25 + p * 1.8)
    g.rotation.y = damp(g.rotation.y, p * Math.PI * 1.2 + scrollStore.pointer.x * 0.5, 2.5, dt)
    g.rotation.x = damp(g.rotation.x, Math.sin(t * 0.4) * 0.15 + scrollStore.pointer.y * 0.3, 2.5, dt)

    const s = 1.0 + Math.sin(p * Math.PI) * 0.22 + Math.sin(t * 0.7) * 0.02
    g.scale.setScalar(damp(g.scale.x || 1, s, 3, dt))
  })

  const Material = (frag, extra = {}) => (
    <shaderMaterial vertexShader={xVertex} fragmentShader={frag} uniforms={uniforms} {...extra} />
  )

  return (
    <group ref={group}>
      <group rotation={[0, 0, Math.PI * 0.3]}>
        <RoundedBox args={beam} radius={0.16} smoothness={4}>
          {Material(xFragment)}
        </RoundedBox>
      </group>
      <group rotation={[0, 0, -Math.PI * 0.3]}>
        <RoundedBox args={beam} radius={0.16} smoothness={4}>
          {Material(xFragment)}
        </RoundedBox>
      </group>

      <group rotation={[0, 0, Math.PI * 0.3]} scale={1.16}>
        <RoundedBox args={beam} radius={0.16} smoothness={2}>
          {Material(xHaloFragment, {
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide,
          })}
        </RoundedBox>
      </group>
      <group rotation={[0, 0, -Math.PI * 0.3]} scale={1.16}>
        <RoundedBox args={beam} radius={0.16} smoothness={2}>
          {Material(xHaloFragment, {
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide,
          })}
        </RoundedBox>
      </group>
    </group>
  )
}

/* ── FLOWING PARTICLE NEBULA ─────────────────────────────────────── */
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

/* ── GLOWING ENERGY SHARDS ──────────────────────────────────────── */
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

/* ── LIGHTING SCENE ─────────────────────────────────────────────── */
function Lights() {
  const l1 = useRef()
  const l2 = useRef()

  useFrame(() => {
    const p = scrollStore.progress
    if (l1.current && l2.current) {
      l1.current.color.setHSL(0.60 + p * 0.3, 0.85, 0.5)
      l2.current.color.setHSL(0.75 - p * 0.25, 0.85, 0.5)
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={l1} position={[6, 4, 6]} intensity={45} color="#3D6BFF" distance={50} />
      <pointLight ref={l2} position={[-6, -3, 5]} intensity={40} color="#7D56F2" distance={50} />
      <pointLight position={[0, 6, -4]} intensity={25} color="#5C4DFF" distance={40} />
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
      <XMark />
      <FlowField />
      <GlowOrbits />
    </Canvas>
  )
}
