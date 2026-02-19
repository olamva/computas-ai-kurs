import {
  Color3,
  DirectionalLight,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PhotoDome,
  Scene,
  SceneLoader,
  StandardMaterial,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "babylonjs"
import "babylonjs-loaders"
import { useEffect, useRef } from "react"
import { beer } from "../data/words"
import { useGameStore } from "../state/store"

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
    scene.clearColor = Color3.FromHexString("#8fb7d3").toColor4(1)

    SceneLoader.OnPluginActivatedObservable.add((plugin) => {
      if (plugin.name === "gltf") {
        ;(plugin as any).loggingEnabled = false
      }
    })

    const camera = new UniversalCamera("camera", new Vector3(0, 2, -8), scene)
    camera.attachControl(canvas, true)
    camera.speed = 0.12
    camera.inertia = 0.6

    scene.ambientColor = new Color3(0.35, 0.38, 0.4)

    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene)
    hemi.intensity = 1.5
    hemi.diffuse = new Color3(0.78, 0.82, 0.8)
    hemi.groundColor = new Color3(0.22, 0.26, 0.2)

    const sunDir = new Vector3(-0.2, -1, 0.15).normalize()
    const sun = new DirectionalLight("sun", sunDir, scene)
    sun.intensity = 1.1
    sun.diffuse = new Color3(1, 0.97, 0.9)

    const skyDome = new PhotoDome(
      "skyDome",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Autumn_field_puresky_-_Panorama_%28Sergej_Majboroda_and_Jarod_Guest_via_Poly_Haven%29.jpg/2560px-Autumn_field_puresky_-_Panorama_%28Sergej_Majboroda_and_Jarod_Guest_via_Poly_Haven%29.jpg",
      { size: 220 },
      scene,
    )
    skyDome.fovMultiplier = 1.0

    const sunMesh = MeshBuilder.CreateDisc("sunMesh", { radius: 8, tessellation: 48 }, scene)
    sunMesh.position = sunDir.scale(-120)
    sunMesh.billboardMode = Mesh.BILLBOARDMODE_ALL
    sunMesh.isPickable = false
    const sunMat = new StandardMaterial("sunMat", scene)
    sunMat.emissiveColor = new Color3(1, 0.95, 0.75)
    sunMat.diffuseColor = new Color3(1, 0.95, 0.75)
    sunMat.alpha = 0.95
    sunMesh.material = sunMat

    const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50, subdivisions: 10 }, scene)
    const groundMat = new StandardMaterial("groundMat", scene)
    groundMat.diffuseColor = new Color3(0.2, 0.32, 0.18)
    groundMat.specularColor = new Color3(0, 0, 0)
    ground.material = groundMat

    const barn = MeshBuilder.CreateBox("barn", { width: 10, height: 5, depth: 8 }, scene)
    barn.position = new Vector3(6, 2.5, 8)
    const barnMat = new StandardMaterial("barnMat", scene)
    barnMat.diffuseColor = new Color3(0.55, 0.2, 0.18)
    barn.material = barnMat

    const barnRoof = MeshBuilder.CreateBox("barnRoof", { width: 11, height: 1.6, depth: 9 }, scene)
    barnRoof.position = new Vector3(6, 5.1, 8)
    barnRoof.rotation.z = Math.PI / 12
    const roofMat = new StandardMaterial("barnRoofMat", scene)
    roofMat.diffuseColor = new Color3(0.25, 0.15, 0.12)
    barnRoof.material = roofMat

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
      mat.diffuseColor = Color3.FromHexString("#f4c542")
      mat.emissiveColor = mat.diffuseColor.scale(0.8)
      stalk.material = mat
    })

    const animalRootUrl = "/models/animals/"
    const animalModels = [
      { id: "cow-1", file: "cow.glb", position: new Vector3(-6, 0, 4), scale: 1, rotationY: Math.PI * 0.1 },
      { id: "cow-2", file: "cow.glb", position: new Vector3(-8, 0, 7), scale: 0.95, rotationY: Math.PI * 0.35 },
      { id: "pig-1", file: "pig.glb", position: new Vector3(-2, 0, 6), scale: 1, rotationY: -Math.PI * 0.1 },
      { id: "sheep-1", file: "sheep.glb", position: new Vector3(-4, 0, 9), scale: 1, rotationY: Math.PI * 0.4 },
      { id: "horse-1", file: "horse.glb", position: new Vector3(2, 0, 10.5), scale: 1, rotationY: -Math.PI * 0.2 },
      { id: "horse-2", file: "horse.glb", position: new Vector3(4.5, 0, 4), scale: 0.95, rotationY: Math.PI * 0.2 },
      { id: "chicken-1", file: "chicken.glb", position: new Vector3(0, 0, 2), scale: 1, rotationY: Math.PI * 0.6 },
      {
        id: "chicken-2",
        file: "chicken.glb",
        position: new Vector3(1.2, 0, 1.2),
        scale: 0.9,
        rotationY: -Math.PI * 0.2,
      },
      {
        id: "chicken-3",
        file: "chicken.glb",
        position: new Vector3(-1.2, 0, 1.4),
        scale: 0.9,
        rotationY: Math.PI * 0.9,
      },
    ]

    const loadAnimalModels = async () => {
      for (const animal of animalModels) {
        try {
          const result = await SceneLoader.ImportMeshAsync("", animalRootUrl, animal.file, scene)
          const wrapper = new TransformNode(`${animal.id}-wrap`, scene)
          const topLevel = result.meshes.filter((mesh) => mesh.parent === null)
          topLevel.forEach((mesh) => {
            mesh.parent = wrapper
          })

          const renderMeshes = result.meshes.filter((mesh) => mesh.getTotalVertices?.() > 0)
          let min = new Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
          let max = new Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
          renderMeshes.forEach((mesh) => {
            mesh.computeWorldMatrix(true)
            const bounds = mesh.getBoundingInfo().boundingBox
            const minW = bounds.minimumWorld
            const maxW = bounds.maximumWorld
            min = Vector3.Minimize(min, minW)
            max = Vector3.Maximize(max, maxW)
          })

          const height = Math.max(0.0001, max.y - min.y)
          const targetHeights: Record<string, number> = {
            "cow.glb": 1.4,
            "horse.glb": 1.6,
            "pig.glb": 0.8,
            "sheep.glb": 0.95,
            "chicken.glb": 0.3,
          }
          const target = targetHeights[animal.file] ?? 1
          const scale = (target / height) * (animal.scale ?? 1)
          wrapper.scaling = new Vector3(scale, scale, scale)
          wrapper.position = animal.position.clone()
          wrapper.position.y += -min.y * scale
          wrapper.rotation = new Vector3(0, animal.rotationY ?? 0, 0)
          if (result.animationGroups.length > 0) {
            result.animationGroups[0].start(true)
          }
        } catch (err) {
          console.warn(`Failed to load ${animalRootUrl}${animal.file}`, err)
        }
      }
    }

    void loadAnimalModels()

    const pressed = new Set<string>()
    const store = useGameStore.getState()
    const beerAudio = new Audio(beer.audioUrl)
    beerAudio.preload = "auto"

    const playBeerAudio = () => {
      const volume = useGameStore.getState().player.settings.volume
      beerAudio.volume = Math.max(0, Math.min(1, volume))
      beerAudio.currentTime = 0
      beerAudio.play().catch(() => {})
    }

    const handleKey = (ev: KeyboardEvent) => {
      if (ev.type === "keydown") pressed.add(ev.key.toLowerCase())
      else pressed.delete(ev.key.toLowerCase())
      if (ev.key.toLowerCase() === "f" && ev.type === "keydown") {
        if (!document.fullscreenElement) {
          canvas.requestFullscreen?.()
        } else {
          document.exitFullscreen?.()
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    window.addEventListener("keyup", handleKey)

    const tmp = { mode: "explore", score: 0 }

    const update = (delta: number) => {
      const dir = new Vector3(0, 0, 0)
      if (pressed.has("w")) dir.z += 1
      if (pressed.has("s")) dir.z -= 1
      if (pressed.has("a")) dir.x -= 1
      if (pressed.has("d")) dir.x += 1
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

      // Interaction check
      if (pressed.has("e")) {
        const nearest = cropPositions
          .map((crop) => ({
            crop,
            dist: Vector3.Distance(camera.position, crop.position),
          }))
          .sort((a, b) => a.dist - b.dist)[0]

        if (nearest && nearest.dist < 2.2) {
          tmp.mode = "encounter"
          store.selectBeer()
          store.recordResult({
            wordId: beer.id,
            type: "typing",
            score: Math.max(10, 50 - Math.round(nearest.dist * 10)),
            accuracy: 0.92,
            completedAt: new Date().toISOString(),
          })
          playBeerAudio()
          tmp.score += 10
        }
      } else {
        tmp.mode = "explore"
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
      window.removeEventListener("keydown", handleKey)
      window.removeEventListener("keyup", handleKey)
      beerAudio.pause()
      beerAudio.currentTime = 0
      engine.stopRenderLoop()
      engine.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-screen block" />
}
