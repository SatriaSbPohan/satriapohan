import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadCarModel } from './loader.js';
import { cars } from './state.js';

let scene, camera, renderer, controls;
let currentCarModel = null;
let floor;

export function initScene(container) {
    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505); // Match dark-bg
    scene.fog = new THREE.Fog(0x050505, 10, 50);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 3, 6);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 4. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going below floor
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // 5. Lighting
    setupLights();

    // 6. Floor
    setupFloor();

    // 7. Loop
    animate();

    // 8. Resize Handler
    window.addEventListener('resize', onWindowResize);
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Main Key Light
    const spotLight = new THREE.SpotLight(0xffffff, 20);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    // Rim Lights (Neon Blue/Red depending on car? For now white/blue)
    const rectLight = new THREE.RectAreaLight(0x00f3ff, 5, 4, 10);
    rectLight.position.set(-5, 0, 5);
    rectLight.lookAt(0, 0, 0);
    // Note: RectAreaLight needs helpers to work fully effectively but works for ambient glow.
    // Standard SpotLights are safer for reliable shadows.

    const blueRim = new THREE.SpotLight(0x00f3ff, 10);
    blueRim.position.set(-5, 2, -5);
    blueRim.lookAt(0, 0, 0);
    scene.add(blueRim);

    const redRim = new THREE.SpotLight(0xff003c, 10);
    redRim.position.set(5, 2, -5);
    redRim.lookAt(0, 0, 0);
    scene.add(redRim);
}

function setupFloor() {
    const geometry = new THREE.PlaneGeometry(50, 50);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.1,
        metalness: 0.5,
    });
    floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Helper for "Tech" feel
    const grid = new THREE.GridHelper(50, 50, 0x333333, 0x111111);
    grid.position.y = 0.01;
    scene.add(grid);
}

export function switchCar(carIndex) {
    const carData = cars[carIndex];

    if (currentCarModel) {
        scene.remove(currentCarModel);
        currentCarModel = null;
    }

    loadCarModel(carData.modelUrl, (model) => {
        currentCarModel = model;
        scene.add(currentCarModel);

        // Apply car color accent to the "Concept" model if applicable
        // Or just let the model be.
        // If it is our placeholder, we can tint the material
        if (!carData.modelUrl) {
            currentCarModel.traverse((child) => {
                if (child.isMesh && child.geometry.type === 'TorusKnotGeometry') {
                    child.material.color.set(carData.color);
                    child.material.emissive.set(carData.color);
                    child.material.emissiveIntensity = 0.2;
                }
            });
        }

        // Animate entry?
        currentCarModel.scale.set(0, 0, 0);
        // Simple Tween via logic loop or library. Let's do a simple expanding scale in animate loop or just here
        let s = 0;
        const expand = setInterval(() => {
            s += 0.05;
            if (s >= 1) {
                s = 1;
                clearInterval(expand);
            }
            if (currentCarModel) currentCarModel.scale.setScalar(s);
        }, 16);

    }, undefined, (err) => {
        console.error('Error loading car:', err);
    });

    // Update lights to match car color?
    // Ideally yes, but maybe too flashy. Let's keep it simple.
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
