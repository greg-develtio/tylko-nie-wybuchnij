import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights

const ambientLight = new THREE.AmbientLight(0xaaaaaa);
// const pointLight = new THREE.PointLight(0xffffff, 0.1)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight);
scene.add(ambientLight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

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

const clock = new THREE.Clock();

const loader = new OBJLoader();
const loader_g = new GLTFLoader();

var stoliczek = null;

// load a resource
loader_g.load(
    // resource URL
    'stoliczek.glb',
    // called when resource is loaded
    function ( object ) {

        // console.log(object.scene.children[0]);
        console.log(object);
        stoliczek = object.scene.children[0];
        stoliczek.rotation.x = 0.5;

        scene.add( stoliczek );

    },
    // called when loading is in progresses
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

document.addEventListener('keydown', (k) => {
    const texture = new THREE.TextureLoader().load( "replacement-the-decade-in-content-sad-keanu.jpg" );
    texture.flipY = false;

    const material = new THREE.MeshBasicMaterial( {
        map: texture,
    } );

    stoliczek.children[0].material = material;

    stoliczek.children[0].material.needsUpdate = true;
});

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = .5 * elapsedTime

    if (stoliczek) {
        stoliczek.rotation.y = .5 * elapsedTime;
    }


    // controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()