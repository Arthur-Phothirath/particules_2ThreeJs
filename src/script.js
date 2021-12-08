import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Texture Loader 

const loader = new THREE.TextureLoader()
const cross = loader.load('+.png')

// Debug
const gui = new dat.GUI()



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const torusGeometry = new THREE.TorusGeometry( .9, .2, 16, 100 );
// const geometry = new THREE.BoxGeometry( .2, .9, 16, 100 );
// const geometry = new THREE.TorusKnotGeometry( .7, .2, 64, 100 );

const particulesGeometry = new THREE.BufferGeometry;
const particlesCnt = 5000;

const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt* 3; i++){
    // posArray[i] = Math.random()
    // posArray[i] = Math.random() - 0.5
    posArray[i] = (Math.random() - 0.5) * 5
    
}

particulesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

// PointGeometry
const torusMaterial = new THREE.PointsMaterial({
    size: 0.0005,
    color: 0x0BCEE9
})

// ParticulesMaterial
var particulesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    map : cross,
    transparent: true,
    color: 0x1FE90B,
    blending: THREE.AdditiveBlending
})


// Mesh
const torusMesh = new THREE.Points(torusGeometry,torusMaterial)
const particlesMesh = new THREE.Points(particulesGeometry, particulesMaterial)
scene.add(torusMesh, particlesMesh)

// GUI 

var particulesSelected = particlesMesh;
var torusSelected = torusMesh;

const particulesFolder = gui.addFolder('Particules')
const torusFolder = gui.addFolder('Torus')

var guiParticulesControls = new function(){
    this.color = particulesMaterial.color.getStyle();
}();

var guiTorusControls = new function(){
    this.color = torusMaterial.color.getStyle();
}();

particulesFolder
    .addColor(guiParticulesControls,'color')
    .listen()
    .onChange(function(e){
        particulesSelected.material.color.setStyle(e);
    });
particulesFolder.add(particulesMaterial, "size").min(0.005).max(0.02).step(0.0001)

torusFolder
    .addColor(guiTorusControls,'color')
    .listen()
    .onChange(function(e){
        torusSelected.material.color.setStyle(e);
    });

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1)

// Mouse 

document.addEventListener("mousemove", animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseY = event.clientY
    mouseX = event.clientX
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    torusMesh.rotation.y = .5 * elapsedTime
    particlesMesh.rotation.y = -.03 * elapsedTime

    // if (mouseX > 0) {

    //     particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00009)
    //     particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00009)
    // }
    

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()