import * as THREE from 'three';

const scene = new THREE.Scene();

// Crea la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Crea el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Función para calcular la posición en una órbita elíptica
function calculatePosition(angle, semiMajorAxis, eccentricity) {
    const x = semiMajorAxis * Math.cos(angle);
    const y = semiMajorAxis * Math.sin(angle) * Math.sqrt(1 - eccentricity ** 2);
    const z = 0;

    return new THREE.Vector3(x, y, z);
}

// Crea geometría y material para los planetas
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000, });
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const material3 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material4 = new THREE.MeshBasicMaterial({ color: 0xff00ff });

// Crea los planetas
const planet1 = new THREE.Mesh(geometry, material1);
const planet2 = new THREE.Mesh(geometry, material2);
const planet3 = new THREE.Mesh(geometry, material3);
const planet4 = new THREE.Mesh(geometry, material4);

// Añade los planetas a la escena
scene.add(planet1);
scene.add(planet2);
scene.add(planet3);
scene.add(planet4);

// Parámetros de órbita para cada planeta
const semiMajorAxis1 = 3;
const eccentricity1 = 0.5;
let angle1 = 0;

const semiMajorAxis2 = 4;
const eccentricity2 = 0.3;
let angle2 = 0;

const semiMajorAxis3 = 5;
const eccentricity3 = 0.4;
let angle3 = 0;

const semiMajorAxis4 = 6;
const eccentricity4 = 0.2;
let angle4 = 0;

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Calcula las nuevas posiciones en la órbita
    const newPosition1 = calculatePosition(angle1, semiMajorAxis1, eccentricity1);
    const newPosition2 = calculatePosition(angle2, semiMajorAxis2, eccentricity2);
    const newPosition3 = calculatePosition(angle3, semiMajorAxis3, eccentricity3);
    const newPosition4 = calculatePosition(angle4, semiMajorAxis4, eccentricity4);


    // Actualiza las posiciones de los planetas
    planet1.position.copy(newPosition1);
    planet2.position.copy(newPosition2);
    planet3.position.copy(newPosition3);
    planet4.position.copy(newPosition4);

    // Incrementa los ángulos para la próxima posición en la órbita
    angle1 += 0.01;
    angle2 += 0.015;
    angle3 += 0.02;
    angle4 += 0.025;

    // Actualiza la cámara y renderiza la escena
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

animate();
