import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Loaders
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

scene.environmentIntensity = 4;
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;


gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001).name('Environment Intensity');
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001).name('Background Blurriness');
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001).name('Background Intensity');

gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('Background Rotation Y');
gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('Environment Rotation Y');


// Real time environment map


// /**
//  * Real time environment map
//  */
// // Base environment map
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap

// // Holy donut
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)
holyDonut.layers.enable(1)
holyDonut.position.y = 3.5
scene.add(holyDonut)

// // Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.FloatType
    }
)

scene.environment = cubeRenderTarget.texture

// // Cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
	new THREE.MeshStandardMaterial({
		roughness: 0.3,
		metalness: 1,
		color: 0xaaaaaa,
	})
)
torusKnot.position.x = - 4;
torusKnot.position.y = 4;
scene.add(torusKnot);


// Load model

gltfLoader.load(
	'/models/FlightHelmet/glTF/FlightHelmet.gltf',
	(gltf) => {
		console.log('success');

		gltf.scene.scale.set(10, 10, 10);
		scene.add(gltf.scene);
	},
	(progress) => {
		console.log('progress', progress);
	},
	(error) => {
		console.log('error', error);
	}
);


/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Lights


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
	// Time
	const elapsedTime = clock.getElapsedTime()


	    // // Real time environment map
    if(holyDonut)
    {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2

        cubeCamera.update(renderer, scene)
    }

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
