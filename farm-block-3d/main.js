import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#game");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#c6e8ff");
scene.fog = new THREE.Fog("#c6e8ff", 20, 60);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const hemi = new THREE.HemisphereLight(0xffffff, 0x7aa35f, 0.9);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(10, 18, 6);
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(30, 64),
  new THREE.MeshStandardMaterial({ color: "#7dd66f" })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

const dirtPath = new THREE.Mesh(
  new THREE.RingGeometry(6, 9, 48),
  new THREE.MeshStandardMaterial({ color: "#c18f59" })
);
dirtPath.rotation.x = -Math.PI / 2;
dirtPath.position.y = -0.09;
scene.add(dirtPath);

function createFenceSegment(width, depth) {
  const fence = new THREE.Group();
  const postGeo = new THREE.BoxGeometry(0.3, 1.2, 0.3);
  const railGeo = new THREE.BoxGeometry(width, 0.18, 0.25);
  const mat = new THREE.MeshStandardMaterial({ color: "#a86b3f" });

  const leftPost = new THREE.Mesh(postGeo, mat);
  leftPost.position.set(-width / 2, 0.6, 0);
  fence.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, mat);
  rightPost.position.set(width / 2, 0.6, 0);
  fence.add(rightPost);

  for (let i = 0; i < 2; i += 1) {
    const rail = new THREE.Mesh(railGeo, mat);
    rail.position.set(0, 0.35 + i * 0.45, 0);
    fence.add(rail);
  }

  if (depth) {
    fence.rotation.y = Math.PI / 2;
  }

  return fence;
}

const fenceGroup = new THREE.Group();
const fenceSize = 18;

const northFence = createFenceSegment(fenceSize, false);
northFence.position.set(0, 0, -fenceSize / 2);
fenceGroup.add(northFence);

const southFence = createFenceSegment(fenceSize, false);
southFence.position.set(0, 0, fenceSize / 2);
fenceGroup.add(southFence);

const eastFence = createFenceSegment(fenceSize, true);
eastFence.position.set(fenceSize / 2, 0, 0);
fenceGroup.add(eastFence);

const westFence = createFenceSegment(fenceSize, true);
westFence.position.set(-fenceSize / 2, 0, 0);
fenceGroup.add(westFence);

scene.add(fenceGroup);

function addTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.35, 1.6, 8),
    new THREE.MeshStandardMaterial({ color: "#8d5a3b" })
  );
  trunk.position.set(x, 0.7, z);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 14, 14),
    new THREE.MeshStandardMaterial({ color: "#5fbf6a" })
  );
  leaves.position.set(x, 2.1, z);

  scene.add(trunk, leaves);
}

addTree(-7, -6);
addTree(7, -5);
addTree(-6, 6);

const barn = new THREE.Group();
const barnBase = new THREE.Mesh(
  new THREE.BoxGeometry(4.5, 3, 4),
  new THREE.MeshStandardMaterial({ color: "#d85b4d" })
);
const barnRoof = new THREE.Mesh(
  new THREE.ConeGeometry(3.4, 2.2, 4),
  new THREE.MeshStandardMaterial({ color: "#b03b2f" })
);

barnRoof.rotation.y = Math.PI / 4;
barnRoof.position.y = 2.4;
barn.add(barnBase, barnRoof);
barn.position.set(0, 0, -9);
scene.add(barn);

const block = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.6, 1.6),
  new THREE.MeshStandardMaterial({ color: "#ffd166" })
);
block.position.set(0, 0.8, 5);
scene.add(block);

const shadowDisc = new THREE.Mesh(
  new THREE.CircleGeometry(0.8, 32),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 })
);
shadowDisc.rotation.x = -Math.PI / 2;
shadowDisc.position.y = 0.01;
scene.add(shadowDisc);

const keys = new Set();

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

const speed = 0.08;
const farmLimit = 8;

function updatePlayer() {
  const direction = new THREE.Vector3();

  if (keys.has("w") || keys.has("arrowup")) direction.z -= 1;
  if (keys.has("s") || keys.has("arrowdown")) direction.z += 1;
  if (keys.has("a") || keys.has("arrowleft")) direction.x -= 1;
  if (keys.has("d") || keys.has("arrowright")) direction.x += 1;

  if (direction.lengthSq() > 0) {
    direction.normalize().multiplyScalar(speed);
    block.position.add(direction);
  }

  block.position.x = THREE.MathUtils.clamp(block.position.x, -farmLimit, farmLimit);
  block.position.z = THREE.MathUtils.clamp(block.position.z, -farmLimit, farmLimit);

  shadowDisc.position.x = block.position.x;
  shadowDisc.position.z = block.position.z;
}

function updateCamera() {
  const offset = new THREE.Vector3(0, 8, 12);
  const target = new THREE.Vector3().copy(block.position);
  camera.position.copy(target).add(offset);
  camera.lookAt(target.x, target.y + 0.3, target.z);
}

function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  updateCamera();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

updateCamera();
animate();
