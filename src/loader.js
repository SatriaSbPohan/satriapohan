import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Cache for loaded models
const cache = {};

export function loadCarModel(url, onLoad, onProgress, onError) {
    if (!url) {
        // Return a placeholder abstract "concept car" geometry if no URL
        createPlaceholderModel(onLoad);
        return;
    }

    if (cache[url]) {
        onLoad(cache[url].clone());
        return;
    }

    loader.load(
        url,
        (gltf) => {
            const model = gltf.scene;

            // Auto-center and normalize size
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim; // Scale to fit in ~5 unit box

            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            // Lift it up slightly to sit on floor
            model.position.y += (size.y * scale) / 2;

            // Enable shadows
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // Apply a nice material if it lacks one, or enhance existing
                    if (child.material) {
                        child.material.envMapIntensity = 1.0;
                    }
                }
            });

            cache[url] = model;
            onLoad(model.clone());
        },
        onProgress,
        onError
    );
}

function createPlaceholderModel(onLoad) {
    // Create a futuristic "Concept" shape
    const group = new THREE.Group();

    // Main body - abstract sweeping shape
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Add some "wheels" or floating pads
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.5 });

    const positions = [
        [-1.5, -1, 1], [1.5, -1, 1],
        [-1.5, -1, -1], [1.5, -1, -1]
    ];

    positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
    });

    // Call onLoad immediately
    setTimeout(() => onLoad(group), 0);
}
