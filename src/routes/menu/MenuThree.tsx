import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MenuThree() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
    camera.position.set(3.4, 2.4, 5.2)
    camera.lookAt(0, 0.6, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    const key = new THREE.DirectionalLight(0xfff3d1, 1.2)
    key.position.set(5, 6, 4)
    scene.add(ambient, key)

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xc54a3d })
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x7a2c24 })
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0xc7a97a })
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0xc0d6e8 })

    const farm = new THREE.Group()

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.6), baseMaterial)
    base.position.y = 0.4
    farm.add(base)

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.7, 4), roofMaterial)
    roof.rotation.y = Math.PI / 4
    roof.position.y = 1.1
    farm.add(roof)

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.1), woodMaterial)
    door.position.set(0, 0.3, 0.85)
    farm.add(door)

    const silo = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 20), metalMaterial)
    silo.position.set(-1.2, 0.7, -0.2)
    farm.add(silo)

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.4, 18), roofMaterial)
    cap.position.set(-1.2, 1.55, -0.2)
    farm.add(cap)

    const windmill = new THREE.Group()
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.6, 10), woodMaterial)
    pole.position.y = 0.8
    windmill.add(pole)

    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xf3e7d0 })
    const bladeGeometry = new THREE.BoxGeometry(0.9, 0.1, 0.05)
    const blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial)
    blade1.position.y = 1.4
    const blade2 = blade1.clone()
    blade2.rotation.z = Math.PI / 2
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12), metalMaterial)
    hub.rotation.x = Math.PI / 2
    hub.position.y = 1.4
    windmill.add(blade1, blade2, hub)
    windmill.position.set(1.4, 0, -0.4)
    farm.add(windmill)

    scene.add(farm)

    const clock = new THREE.Clock()
    let frameId = 0

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const animate = () => {
      const time = clock.getElapsedTime()
      farm.rotation.y = time * 0.25
      farm.position.y = Math.sin(time * 0.6) * 0.06
      windmill.rotation.z = time * 1.6

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    resize()
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      base.geometry.dispose()
      roof.geometry.dispose()
      door.geometry.dispose()
      silo.geometry.dispose()
      cap.geometry.dispose()
      pole.geometry.dispose()
      bladeGeometry.dispose()
      hub.geometry.dispose()
      baseMaterial.dispose()
      roofMaterial.dispose()
      woodMaterial.dispose()
      metalMaterial.dispose()
      bladeMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div className="menu-three" ref={containerRef} aria-hidden="true" />
}
