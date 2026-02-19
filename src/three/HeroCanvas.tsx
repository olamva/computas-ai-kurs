import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Blob() {
  const mesh = useRef<THREE.Mesh>(null)
  const colorA = '#7af9f0'
  const colorB = '#9bff4f'

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = clock.getElapsedTime() * 0.08
    mesh.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <mesh ref={mesh} scale={2.4}>
      <icosahedronGeometry args={[1.2, 64]} />
      <MeshDistortMaterial
        color={colorA}
        distort={0.45}
        speed={2.4}
        roughness={0.2}
        metalness={0.3}
        emissive={colorB}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function GroundGlow() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.z = clock.getElapsedTime() * 0.03
  })
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: '#0d1a10',
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    }),
    []
  )
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[4, 12, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 1.6, 5], fov: 55 }} dpr={[1, 2]}>
      <color attach="background" args={[0.02, 0.03, 0.06]} />
      <fog attach="fog" args={[0x05060a, 6, 14]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#b2ff8b" />
      <pointLight position={[-6, 3, -4]} intensity={2} color="#7af9f0" distance={12} />
      <Blob />
      <GroundGlow />
      <Stars radius={80} depth={50} count={4000} factor={3} fade speed={0.6} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={12} />
    </Canvas>
  )
}
