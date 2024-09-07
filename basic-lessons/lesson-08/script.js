import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

// Debug

const gui = new GUI();

const debugObject = {
	color: 0xff0000,
	wireframe: true,
	spin: () => {
		gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
	},
	subdivision: 30,
};

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

// Resize
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

const geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);

gui.add(debugObject, "subdivision").min(1).max(10).step(1).onFinishChange(() => {

	mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);
}
)

debugObject.color = "#0affe2";

const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: debugObject.wireframe });
gui.add(material, "wireframe");

gui.addColor(debugObject, "color").onChange((value) => {
	material.color.set(debugObject.color);
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const cubeTweaks = gui.addFolder("Cube Tweaks");

cubeTweaks.add(mesh.position, "x").min(-3).max(3).step(0.01).name("x");
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("y");

// Sizes
const aspectRatio = sizes.width / sizes.height;

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

gui.add(controls, "autoRotate");

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

gui.add(debugObject, "spin");


tick();
