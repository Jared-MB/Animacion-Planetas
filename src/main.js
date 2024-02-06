import * as THREE from 'three';

const scene = new THREE.Scene();

// Crea la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 0); // La cámara se coloca 10 unidades arriba del origen
camera.rotation.x = -Math.PI / 2;

// Crea el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carga de texturas
const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load('/planeta.jpg');
planetTexture.magFilter = THREE.NearestFilter; // Ajusta el tamaño de la textura

// Crea geometría y materiales para los planetas
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Crea los planetas
const planet1 = new THREE.Mesh(geometry, material1);
const planet2 = new THREE.Mesh(geometry, material2);

// Añade los planetas a la escena
scene.add(planet1);
scene.add(planet2);

// Parámetros de órbita para cada planeta
const semiMajorAxis1 = 3;
const eccentricity1 = 0.5;
let angle1 = 0;

const semiMajorAxis2 = 4;
const eccentricity2 = 0.3;
let angle2 = 0;

// Función para calcular la posición en la órbita
function calculatePosition(angle, semiMajorAxis, eccentricity) {
    const x = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
    const y = 0;
    const z = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(angle);

    return new THREE.Vector3(x, y, z);
}

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Calcula las nuevas posiciones en la órbita
    const newPosition1 = calculatePosition(angle1, semiMajorAxis1, eccentricity1);
    const newPosition2 = calculatePosition(angle2, semiMajorAxis2, eccentricity2);

    // Actualiza las posiciones de los planetas
    planet1.position.copy(newPosition1);
    planet2.position.copy(newPosition2);

    // Incrementa los ángulos para la próxima posición en la órbita
    angle1 += 0.01;
    angle2 += 0.015;

    // Agrega rotación a los planetas en los ejes X, Y y Z
    planet1.rotation.x += 0.01;
    planet1.rotation.y += 0.01;
    planet1.rotation.z += 0.01;


    planet2.rotation.x += 0.01;
    planet2.rotation.y += 0.01;
    planet1.rotation.z += 0.01;

    // Actualiza la cámara y renderiza la escena
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

animate();