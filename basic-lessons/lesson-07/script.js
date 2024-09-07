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
	//   resize the pixel ratio to the minimum between the device pixel ratio and 2
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen

window.addEventListener("dblclick", () => {
	const fullscreenElement =
		document.fullscreenElement || document.webkitFullscreenElement;

	if (!fullscreenElement) {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
});

// Scene
const scene = new THREE.Scene();

// Geometry

const geometry = new THREE.BufferGeometry();
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
	positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});

// Mesh

const mesh = new THREE.Mesh(geometry, material);

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
