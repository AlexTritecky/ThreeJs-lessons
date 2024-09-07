import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

// Debug

const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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

// Textures

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// Door Textures
const dooralphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorambientOcclusionTexture = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg"
);
const doorcolorTexture = textureLoader.load("/textures/door/color.jpg");
const doorheightTexture = textureLoader.load(
	"/textures/door/height.jpg"
);
const doormetalnessTexture = textureLoader.load(
	"/textures/door/metalness.jpg"
);
const doornormalTexture = textureLoader.load(
	"/textures/door/normal.jpg"
);
const doorroughnessTexture = textureLoader.load(
	"/textures/door/roughness.jpg"
);

// Environment Textures
const envTexture = textureLoader.load(
	"/textures/environmentMap/2k.hdr"
);

// Gradient Texture

const gradient3Texture = textureLoader.load(
	"/textures/gradients/3.jpg"
);

// Matcap Textures
const matcap_1_Texture = textureLoader.load("/textures/matcaps/1.png");

doorcolorTexture.colorSpace = THREE.SRGBColorSpace;
matcap_1_Texture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
// const material = new THREE.MeshBasicMaterial();
// material.map = doorcolorTexture;
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = dooralphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcap_1_Texture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
// gradient3Texture.minFilter = THREE.NearestFilter;
// gradient3Texture.magFilter = THREE.NearestFilter;
// material.gradientMap = gradient3Texture;

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.map = doorcolorTexture;
// material.aoMap = doorambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorheightTexture;
// material.metalnessMap = doormetalnessTexture;
// material.roughnessMap = doorroughnessTexture;

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorcolorTexture;
// material.aoMap = doorambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorheightTexture;
// material.metalnessMap = doormetalnessTexture;
// material.roughnessMap = doorroughnessTexture;

// material.clearcoat = 1;
// material.clearcoatRoughness = 0.2;

// material.sheen = new THREE.Color(0x0000ff);
// material.sheenRoughness = 0.5;

// Iridescence
// material.iridescence = 0.6;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// Transmission

material.transmission = 1;
material.ior = 2.417;
material.thickness = 0.5;

// Debug

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(2.333).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001);

// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

// gui.addColor(material, "sheen").name("sheenColor");
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);

/**
 * Geometries
 */
// Sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1.5; // Move to the left

// Plane Geometry
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMesh = new THREE.Mesh(planeGeometry, material);
// No need to move it, it will be at the center by default

// Torus Geometry
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 100);
const torusMesh = new THREE.Mesh(torusGeometry, material);
torusMesh.position.x = 1.5; // Move to the right

/**
 * Adding to scene
 */
scene.add(sphereMesh);
scene.add(planeMesh);
scene.add(torusMesh);

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// Environment Map

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k-1.hdr", (envMap) => {
	envMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.environment = envMap;
	scene.background = envMap;
});

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	sphereMesh.rotation.y = elapsedTime * 0.1;
	planeMesh.rotation.y = elapsedTime * 0.1;
	torusMesh.rotation.y = elapsedTime * 0.1;

	sphereMesh.rotation.x = -0.15 * elapsedTime;
	planeMesh.rotation.x = -0.15 * elapsedTime;
	torusMesh.rotation.x = -0.15 * elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
