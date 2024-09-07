import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Cursor

const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Canvas
const canvas = document.querySelector(".webgl");

// Sizes
const sizes = {
	width: 800,
	height: 600,
};

// Scene
const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

scene.add(mesh);

const aspectRatio = sizes.width / sizes.height;
// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
