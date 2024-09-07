import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;
object1.updateMatrixWorld();

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object2.updateMatrixWorld();

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

object3.updateMatrixWorld();

// scene.add(object1, object2, object3);

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

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

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  if (currentIntersect) {

      currentIntersect.object.material.color.set("#ff0000");
      currentIntersect = null;
  }
})

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// GLTFLoader and DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');


const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let duck = null;

gltfLoader.load(
  '/models/burger.glb', (gltf) => {
    duck = gltf.scene;
    duck.scale.set(0.5, 0.5, 0.5);
    // gltf.scene.position.y = -1.5;
    scene.add(gltf.scene);
  
  }
)

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);


/**
 * Animate
 */
const clock = new THREE.Clock();
let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // object1.position.y = Math.sin(elapsedTime * 0.4) * 1.5;
  // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  // object3.position.y = Math.sin(elapsedTime * 1.2) * 1.5;

  // Cast a ray

  raycaster.setFromCamera(mouse, camera);

  // const objectsToTest = [object1, object2, object3];
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const object of objectsToTest) {
  //   object.material.color.set("#ff0000");
  // }

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  // if (intersects.length) {
  //   if (currentIntersect === null) {
  //     console.log("mouse enter");
  //   }
  //   currentIntersect = intersects[0];
  // }

  if(duck){
    const modelIntersects = raycaster.intersectObject(duck);

    if (modelIntersects.length) {

      // duck.scale.set(1.5, 1.5, 1.5);
    }
    else {
      // duck.scale.set(1, 1, 1);
    }

  }


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
