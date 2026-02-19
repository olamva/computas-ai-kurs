import { useEffect, useRef } from 'react'
import { Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Color3, Vector3, GlowLayer, UniversalCamera } from 'babylonjs'
import { useGameStore } from '../state/store'
import { beer } from '../data/words'

interface Crop {
  id: string
  position: Vector3
}

export default function BabylonFarm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
    const scene = new Scene(engine)
    scene.clearColor = Color3.FromHexString('#05060a').toColor4(1)

    const camera = new UniversalCamera('camera', new Vector3(0, 2, -8), scene)
    camera.attachControl(canvas, true)
    camera.speed = 0.12
    camera.inertia = 0.6

    const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene)
    hemi.intensity = 1.1
    hemi.diffuse = new Color3(0.6, 1, 0.4)
    hemi.groundColor = new Color3(0.06, 0.14, 0.1)

    const glow = new GlowLayer('glow', scene, { blurKernelSize: 32 })
    glow.intensity = 1.5

    const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 40, subdivisions: 2 }, scene)
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.08, 0.11, 0.12)
    groundMat.specularColor = new Color3(0, 0, 0)
    ground.material = groundMat

    const barn = MeshBuilder.CreateBox('barn', { width: 4, height: 3, depth: 3 }, scene)
    barn.position = new Vector3(0, 1.5, 6)
    const barnMat = new StandardMaterial('barnMat', scene)
    barnMat.diffuseColor = new Color3(0.15, 0.12, 0.2)
    barnMat.emissiveColor = new Color3(0.35, 0.05, 0.5)
    barn.material = barnMat
    glow.addIncludedOnlyMesh(barn)

    const cropPositions: Crop[] = [
      {
        id: beer.id,
        position: new Vector3(0, 0.6, 8),
      },
    ]

    cropPositions.forEach((crop) => {
      const stalk = MeshBuilder.CreateCylinder(`crop-${crop.id}`, { height: 1.2, diameter: 0.35 }, scene)
      stalk.position = crop.position
      const mat = new StandardMaterial(`mat-${crop.id}`, scene)
      mat.diffuseColor = Color3.FromHexString('#f4c542')
      mat.emissiveColor = mat.diffuseColor.scale(0.8)
      stalk.material = mat
      glow.addIncludedOnlyMesh(stalk)
    })

    const pressed = new Set<string>()
    const store = useGameStore.getState()
    const beerAudio = new Audio(beer.audioUrl)
    beerAudio.preload = 'auto'

    const playBeerAudio = () => {
      const volume = useGameStore.getState().player.settings.volume
      beerAudio.volume = Math.max(0, Math.min(1, volume))
      beerAudio.currentTime = 0
      beerAudio.play().catch(() => {})
    }

    const handleKey = (ev: KeyboardEvent) => {
      if (ev.type === 'keydown') pressed.add(ev.key.toLowerCase())
      else pressed.delete(ev.key.toLowerCase())
      if (ev.key.toLowerCase() === 'f' && ev.type === 'keydown') {
        if (!document.fullscreenElement) {
          canvas.requestFullscreen?.()
        } else {
          document.exitFullscreen?.()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)

    const tmp = { mode: 'explore', score: 0 }

    const update = (delta: number) => {
      const dir = new Vector3(0, 0, 0)
      if (pressed.has('w')) dir.z += 1
      if (pressed.has('s')) dir.z -= 1
      if (pressed.has('a')) dir.x -= 1
      if (pressed.has('d')) dir.x += 1
      if (!dir.equals(Vector3.Zero())) dir.normalize()
      camera.position.addInPlace(dir.scale(camera.speed * delta * 60))

      // cheap gravity jiggle
      camera.position.y = 1.8 + Math.sin(engine.getDeltaTime() * 0.002) * 0.05

      // Interaction check
      if (pressed.has('e')) {
        const nearest = cropPositions
          .map((crop) => ({
            crop,
            dist: Vector3.Distance(camera.position, crop.position),
          }))
          .sort((a, b) => a.dist - b.dist)[0]

        if (nearest && nearest.dist < 2.2) {
          tmp.mode = 'encounter'
          store.selectBeer()
          store.recordResult({
            wordId: beer.id,
            type: 'typing',
            score: Math.max(10, 50 - Math.round(nearest.dist * 10)),
            accuracy: 0.92,
            completedAt: new Date().toISOString(),
          })
          playBeerAudio()
          tmp.score += 10
        }
      } else {
        tmp.mode = 'explore'
      }
    }

    engine.runRenderLoop(() => {
      const delta = engine.getDeltaTime() / 1000
      update(delta)
      scene.render()
    })

    // Testing hooks
    ;(window as any).render_game_to_text = () => {
      return JSON.stringify({
        mode: tmp.mode,
        score: tmp.score,
        player: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
        word: useGameStore.getState().currentWordId,
        crops: cropPositions.map((c) => ({ id: c.id, x: c.position.x, z: c.position.z })),
      })
    }

    ;(window as any).advanceTime = (ms: number) => {
      const steps = Math.max(1, Math.round(ms / (1000 / 60)))
      for (let i = 0; i < steps; i++) {
        update(1 / 60)
        scene.render()
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
      beerAudio.pause()
      beerAudio.currentTime = 0
      engine.stopRenderLoop()
      engine.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-screen block" />
}
