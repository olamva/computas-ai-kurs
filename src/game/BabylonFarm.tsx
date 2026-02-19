import { useEffect, useRef } from 'react'
import {
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PhotoDome,
  Scene,
  StandardMaterial,
  Color3,
  Vector3,
  UniversalCamera,
  DirectionalLight,
  TransformNode,
} from 'babylonjs'
import { useGameStore } from '../state/store'
import { beer } from '../data/words'
import { AnimalEntity, WordEntry } from '../types'

interface Crop {
  id: string
  position: Vector3
}

interface AnimalInstance {
  id: string
  entity: AnimalEntity
  position: Vector3
}

export default function BabylonFarm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
    const scene = new Scene(engine)
    scene.clearColor = Color3.FromHexString('#8fb7d3').toColor4(1)

    const camera = new UniversalCamera('camera', new Vector3(0, 2, -8), scene)
    camera.attachControl(canvas, true)
    camera.speed = 0.12
    camera.inertia = 0.6

    scene.ambientColor = new Color3(0.3, 0.34, 0.36)

    const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene)
    hemi.intensity = 1.2
    hemi.diffuse = new Color3(0.75, 0.8, 0.78)
    hemi.groundColor = new Color3(0.22, 0.26, 0.2)

    const sunDir = new Vector3(-0.2, -1, 0.15).normalize()
    const sun = new DirectionalLight('sun', sunDir, scene)
    sun.intensity = 1.05
    sun.diffuse = new Color3(1, 0.97, 0.9)

    const skyDome = new PhotoDome(
      'skyDome',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Autumn_field_puresky_-_Panorama_%28Sergej_Majboroda_and_Jarod_Guest_via_Poly_Haven%29.jpg/2560px-Autumn_field_puresky_-_Panorama_%28Sergej_Majboroda_and_Jarod_Guest_via_Poly_Haven%29.jpg',
      { size: 220 },
      scene
    )
    skyDome.fovMultiplier = 1.0

    const sunMesh = MeshBuilder.CreateDisc('sunMesh', { radius: 8, tessellation: 48 }, scene)
    sunMesh.position = sunDir.scale(-120)
    sunMesh.billboardMode = Mesh.BILLBOARDMODE_ALL
    sunMesh.isPickable = false
    const sunMat = new StandardMaterial('sunMat', scene)
    sunMat.emissiveColor = new Color3(1, 0.95, 0.75)
    sunMat.diffuseColor = new Color3(1, 0.95, 0.75)
    sunMat.alpha = 0.8
    sunMesh.material = sunMat

    const makeMat = (name: string, hex: string) => {
      const mat = new StandardMaterial(name, scene)
      mat.diffuseColor = Color3.FromHexString(hex)
      mat.specularColor = new Color3(0.05, 0.05, 0.05)
      return mat
    }

    const ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50, subdivisions: 10 }, scene)
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.28, 0.42, 0.24)
    groundMat.specularColor = new Color3(0, 0, 0)
    ground.material = groundMat

    const barnMat = new StandardMaterial('barnMat', scene)
    barnMat.diffuseColor = new Color3(0.55, 0.2, 0.18)
    const roofMat = new StandardMaterial('barnRoofMat', scene)
    roofMat.diffuseColor = new Color3(0.25, 0.15, 0.12)

    const barnCenter = new Vector3(6, 0, 8)
    const barnWidth = 10
    const barnHeight = 5
    const barnDepth = 8
    const wallThickness = 0.3

    const barnFloor = MeshBuilder.CreateBox('barnFloor', { width: barnWidth - wallThickness, height: 0.2, depth: barnDepth - wallThickness }, scene)
    barnFloor.position = new Vector3(barnCenter.x, 0.1, barnCenter.z)
    barnFloor.material = makeMat('barnFloorMat', '#3a2a1f')

    const backWall = MeshBuilder.CreateBox('barnBack', { width: barnWidth, height: barnHeight, depth: wallThickness }, scene)
    backWall.position = new Vector3(barnCenter.x, barnHeight / 2, barnCenter.z + barnDepth / 2)
    backWall.material = barnMat

    const leftWall = MeshBuilder.CreateBox('barnLeft', { width: wallThickness, height: barnHeight, depth: barnDepth }, scene)
    leftWall.position = new Vector3(barnCenter.x - barnWidth / 2, barnHeight / 2, barnCenter.z)
    leftWall.material = barnMat

    const rightWall = MeshBuilder.CreateBox('barnRight', { width: wallThickness, height: barnHeight, depth: barnDepth }, scene)
    rightWall.position = new Vector3(barnCenter.x + barnWidth / 2, barnHeight / 2, barnCenter.z)
    rightWall.material = barnMat

    const frontWallLeft = MeshBuilder.CreateBox('barnFrontLeft', { width: (barnWidth / 2) - 1.2, height: barnHeight, depth: wallThickness }, scene)
    frontWallLeft.position = new Vector3(barnCenter.x - (barnWidth / 4) - 0.6, barnHeight / 2, barnCenter.z - barnDepth / 2)
    frontWallLeft.material = barnMat

    const frontWallRight = MeshBuilder.CreateBox('barnFrontRight', { width: (barnWidth / 2) - 1.2, height: barnHeight, depth: wallThickness }, scene)
    frontWallRight.position = new Vector3(barnCenter.x + (barnWidth / 4) + 0.6, barnHeight / 2, barnCenter.z - barnDepth / 2)
    frontWallRight.material = barnMat

    const barnRoof = MeshBuilder.CreateBox('barnRoof', { width: barnWidth + 1, height: 1.6, depth: barnDepth + 1 }, scene)
    barnRoof.position = new Vector3(barnCenter.x, barnHeight + 0.6, barnCenter.z)
    barnRoof.rotation.z = Math.PI / 12
    barnRoof.material = roofMat

    const cropPositions: Crop[] = []
    const animalInstances: AnimalInstance[] = []
    const animalCooldowns = new Map<string, number>()

    const cowEntity: AnimalEntity = {
      id: 'cow',
      name: 'Cow',
      words: [beer],
      cooldownSec: 6,
    }
    const pigEntity: AnimalEntity = { id: 'pig', name: 'Pig' }
    const sheepEntity: AnimalEntity = { id: 'sheep', name: 'Sheep' }
    const horseEntity: AnimalEntity = { id: 'horse', name: 'Horse' }
    const chickenEntity: AnimalEntity = { id: 'chicken', name: 'Chicken' }

    const createCow = (entity: AnimalEntity, name: string, position: Vector3): AnimalInstance => {
      const root = new TransformNode(`${name}-root`, scene)
      root.position = position
      const body = MeshBuilder.CreateBox(`${name}-body`, { width: 2.4, height: 1.1, depth: 1.2 }, scene)
      body.position = new Vector3(0, 1, 0)
      body.material = makeMat(`${name}-body-mat`, '#d7d1c9')
      body.parent = root
      const head = MeshBuilder.CreateBox(`${name}-head`, { width: 0.8, height: 0.6, depth: 0.7 }, scene)
      head.position = new Vector3(1.6, 1.2, 0)
      head.material = makeMat(`${name}-head-mat`, '#c5bfb7')
      head.parent = root
      const snout = MeshBuilder.CreateBox(`${name}-snout`, { width: 0.3, height: 0.3, depth: 0.5 }, scene)
      snout.position = new Vector3(2.1, 1.05, 0)
      snout.material = makeMat(`${name}-snout-mat`, '#9a8f86')
      snout.parent = root
      ;[-0.9, 0.9].forEach((x) => {
        ;[-0.4, 0.4].forEach((z) => {
          const leg = MeshBuilder.CreateCylinder(`${name}-leg-${x}-${z}`, { height: 0.9, diameter: 0.22 }, scene)
          leg.position = new Vector3(x, 0.45, z)
          leg.material = makeMat(`${name}-leg-mat`, '#4b4a48')
          leg.parent = root
        })
      })
      return { id: name, entity, position: root.position }
    }

    const createPig = (entity: AnimalEntity, name: string, position: Vector3): AnimalInstance => {
      const root = new TransformNode(`${name}-root`, scene)
      root.position = position
      const body = MeshBuilder.CreateBox(`${name}-body`, { width: 1.8, height: 0.9, depth: 1.1 }, scene)
      body.position = new Vector3(0, 0.8, 0)
      body.material = makeMat(`${name}-body-mat`, '#d7a2a4')
      body.parent = root
      const head = MeshBuilder.CreateBox(`${name}-head`, { width: 0.6, height: 0.5, depth: 0.6 }, scene)
      head.position = new Vector3(1.2, 0.9, 0)
      head.material = makeMat(`${name}-head-mat`, '#d29a9c')
      head.parent = root
      const snout = MeshBuilder.CreateCylinder(`${name}-snout`, { height: 0.2, diameter: 0.28 }, scene)
      snout.rotation.x = Math.PI / 2
      snout.position = new Vector3(1.6, 0.85, 0)
      snout.material = makeMat(`${name}-snout-mat`, '#b77f82')
      snout.parent = root
      ;[-0.6, 0.6].forEach((x) => {
        ;[-0.35, 0.35].forEach((z) => {
          const leg = MeshBuilder.CreateCylinder(`${name}-leg-${x}-${z}`, { height: 0.55, diameter: 0.18 }, scene)
          leg.position = new Vector3(x, 0.28, z)
          leg.material = makeMat(`${name}-leg-mat`, '#8a5b5d')
          leg.parent = root
        })
      })
      return { id: name, entity, position: root.position }
    }

    const createSheep = (entity: AnimalEntity, name: string, position: Vector3): AnimalInstance => {
      const root = new TransformNode(`${name}-root`, scene)
      root.position = position
      const body = MeshBuilder.CreateSphere(`${name}-body`, { diameter: 1.6 }, scene)
      body.position = new Vector3(0, 1, 0)
      body.material = makeMat(`${name}-body-mat`, '#e6e2da')
      body.parent = root
      const head = MeshBuilder.CreateBox(`${name}-head`, { width: 0.6, height: 0.5, depth: 0.5 }, scene)
      head.position = new Vector3(1.1, 1.1, 0)
      head.material = makeMat(`${name}-head-mat`, '#6b5c55')
      head.parent = root
      ;[-0.5, 0.5].forEach((x) => {
        ;[-0.35, 0.35].forEach((z) => {
          const leg = MeshBuilder.CreateCylinder(`${name}-leg-${x}-${z}`, { height: 0.6, diameter: 0.16 }, scene)
          leg.position = new Vector3(x, 0.3, z)
          leg.material = makeMat(`${name}-leg-mat`, '#4b403c')
          leg.parent = root
        })
      })
      return { id: name, entity, position: root.position }
    }

    const createHorse = (entity: AnimalEntity, name: string, position: Vector3): AnimalInstance => {
      const root = new TransformNode(`${name}-root`, scene)
      root.position = position
      const body = MeshBuilder.CreateBox(`${name}-body`, { width: 2.8, height: 1.2, depth: 1 }, scene)
      body.position = new Vector3(0, 1.15, 0)
      body.material = makeMat(`${name}-body-mat`, '#8b6a4e')
      body.parent = root
      const neck = MeshBuilder.CreateBox(`${name}-neck`, { width: 0.6, height: 1.2, depth: 0.6 }, scene)
      neck.position = new Vector3(1.4, 1.7, 0)
      neck.rotation.z = Math.PI / 10
      neck.material = makeMat(`${name}-neck-mat`, '#7a5a40')
      neck.parent = root
      const head = MeshBuilder.CreateBox(`${name}-head`, { width: 0.8, height: 0.6, depth: 0.5 }, scene)
      head.position = new Vector3(2.1, 1.9, 0)
      head.material = makeMat(`${name}-head-mat`, '#6a4d37')
      head.parent = root
      ;[-1.0, 1.0].forEach((x) => {
        ;[-0.35, 0.35].forEach((z) => {
          const leg = MeshBuilder.CreateCylinder(`${name}-leg-${x}-${z}`, { height: 1.1, diameter: 0.2 }, scene)
          leg.position = new Vector3(x, 0.55, z)
          leg.material = makeMat(`${name}-leg-mat`, '#3b2b22')
          leg.parent = root
        })
      })
      return { id: name, entity, position: root.position }
    }

    const createChicken = (entity: AnimalEntity, name: string, position: Vector3): AnimalInstance => {
      const root = new TransformNode(`${name}-root`, scene)
      root.position = position
      const body = MeshBuilder.CreateSphere(`${name}-body`, { diameter: 0.8 }, scene)
      body.position = new Vector3(0, 0.7, 0)
      body.material = makeMat(`${name}-body-mat`, '#f2e6cf')
      body.parent = root
      const head = MeshBuilder.CreateSphere(`${name}-head`, { diameter: 0.4 }, scene)
      head.position = new Vector3(0.45, 0.95, 0)
      head.material = makeMat(`${name}-head-mat`, '#f2e6cf')
      head.parent = root
      const beak = MeshBuilder.CreateCylinder(`${name}-beak`, { height: 0.18, diameterTop: 0, diameterBottom: 0.16 }, scene)
      beak.rotation.z = Math.PI / 2
      beak.position = new Vector3(0.7, 0.92, 0)
      beak.material = makeMat(`${name}-beak-mat`, '#d18a3b')
      beak.parent = root
      return { id: name, entity, position: root.position }
    }

    animalInstances.push(
      createCow(cowEntity, 'cow-1', new Vector3(-6, 0, 2)),
      createCow(cowEntity, 'cow-2', new Vector3(-8, 0, 5)),
      createPig(pigEntity, 'pig-1', new Vector3(-3, 0, 3)),
      createSheep(sheepEntity, 'sheep-1', new Vector3(-5, 0, 6)),
      createHorse(horseEntity, 'horse-1', new Vector3(1, 0, 6)),
      createHorse(horseEntity, 'horse-2', new Vector3(2, 0, 3)),
      createChicken(chickenEntity, 'chicken-1', new Vector3(-1, 0, 1)),
      createChicken(chickenEntity, 'chicken-2', new Vector3(0.6, 0, 0.8)),
      createChicken(chickenEntity, 'chicken-3', new Vector3(-0.6, 0, 0.9))
    )

    const pressed = new Set<string>()
    const store = useGameStore.getState()

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

    const pickWord = (entity: AnimalEntity): WordEntry | undefined => {
      if (!entity.words || entity.words.length === 0) return undefined
      const idx = Math.floor(Math.random() * entity.words.length)
      return entity.words[idx]
    }

    const canSpeak = (entity: AnimalEntity) =>
      Boolean(entity.soundUrl || (entity.words && entity.words.length > 0))

    const triggerAnimal = (instance: AnimalInstance) => {
      const word = pickWord(instance.entity)
      const audioUrl = word?.audioUrl ?? instance.entity.soundUrl
      if (!audioUrl) return

      const now = Date.now()
      const cooldownMs = (word?.cooldownSec ?? instance.entity.cooldownSec ?? 4) * 1000
      const last = animalCooldowns.get(instance.id) ?? 0
      if (now - last < cooldownMs) return
      animalCooldowns.set(instance.id, now)

      if (word) {
        useGameStore.getState().selectWord(word.id)
      }

      const audio = new Audio(audioUrl)
      audio.volume = useGameStore.getState().player.settings.volume
      audio.play().catch(() => {})
    }

    const update = (delta: number) => {
      const dir = new Vector3(0, 0, 0)
      if (pressed.has('w')) dir.z += 1
      if (pressed.has('s')) dir.z -= 1
      if (pressed.has('a')) dir.x -= 1
      if (pressed.has('d')) dir.x += 1
      if (!dir.equals(Vector3.Zero())) {
        dir.normalize()
        const forward = camera.getDirection(new Vector3(0, 0, 1))
        const right = camera.getDirection(new Vector3(1, 0, 0))
        forward.y = 0
        right.y = 0
        if (!forward.equals(Vector3.Zero())) forward.normalize()
        if (!right.equals(Vector3.Zero())) right.normalize()
        const move = forward.scale(dir.z).add(right.scale(dir.x))
        camera.position.addInPlace(move.scale(camera.speed * delta * 60))
      }

      // cheap gravity jiggle
      camera.position.y = 1.8 + Math.sin(engine.getDeltaTime() * 0.002) * 0.05

      // Animal proximity check
      const nearestAnimal = animalInstances
        .filter((animal) => canSpeak(animal.entity))
        .map((animal) => ({
          animal,
          dist: Vector3.Distance(camera.position, animal.position),
        }))
        .sort((a, b) => a.dist - b.dist)[0]

      if (nearestAnimal && nearestAnimal.dist < 2.2) {
        triggerAnimal(nearestAnimal.animal)
      }

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
          store.selectWord(beer.id)
          store.recordResult({
            wordId: beer.id,
            type: 'typing',
            score: Math.max(10, 50 - Math.round(nearest.dist * 10)),
            accuracy: 0.92,
            completedAt: new Date().toISOString(),
          })
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
      engine.stopRenderLoop()
      engine.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-screen block" />
}
