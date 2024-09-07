import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
let mixer = null;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();

gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
  console.log(2, gltf);

  mixer = new THREE.AnimationMixer(gltf.scene);
  //   const action = mixer.clipAction(gltf.animations[2]);

  gltf.animations.forEach((clip) => {
    console.log(clip);

    const action = mixer.clipAction(clip);

    action.play();

    gui
      .add(action, "time")
      .min(0)
      .max(clip.duration)
      .step(0.01)
      .name(clip.name);
    gui.add(action, "timeScale").min(0).max(2).step(0.01).name("timeScale");
    gui.add(action, "paused").name("paused");
    gui.add(action, "enabled").name("enabled");
    gui.add(action, "clampWhenFinished").name("clampWhenFinished");
    gui.add(action, "loop").name("loop");
    gui.add(action, "repetitions").min(0).max(10).step(1).name("repetitions");
    gui.add(action, "timeScale").min(0).max(2).step(0.01).name("timeScale");
    action.setEffectiveTimeScale(0.5);

    action.setEffectiveWeight(1);
  });

  //   action.play();

  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  mixer?.update(deltaTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
