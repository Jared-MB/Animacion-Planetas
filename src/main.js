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
// ROJO
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// AZUL
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Crea los planetas
const planet1 = new THREE.Mesh(geometry, material1);
const planet2 = new THREE.Mesh(geometry, material2);

// Añade los planetas a la escena
scene.add(planet1);
scene.add(planet2);

// Parámetros de órbita para cada planeta
// const semiMajorAxis1 = 3;
// const eccentricity1 = 0.5;
let angle1 = 0;

// const semiMajorAxis2 = 4;
// const eccentricity2 = 0.3;
let angle2 = 0;

// Función para calcular la posición en la órbita
// function calculatePosition(angle, semiMajorAxis, eccentricity) {
//     const x = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
//     const y = 0;
//     const z = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(angle);

//     return new THREE.Vector3(x, y, z);
// }

function dos_planetas(X, m1, m2) {
    // ODE dos planetas

    const XP = new Array(8).fill(0);
    const G = 6.672e-11;      // constante gravitacional

    XP[0] = X[4];
    XP[1] = X[5];
    XP[2] = X[6];
    XP[3] = X[7];

    const L = Math.sqrt((X[2] - X[0]) ** 2 + (X[3] - X[1]) ** 2) + 1e-9;

    XP[4] = (G * m2 * (X[2] - X[0])) / L ** 3;
    XP[5] = (G * m2 * (X[3] - X[1])) / L ** 3;
    XP[6] = (G * m1 * (X[0] - X[2])) / L ** 3;
    XP[7] = (G * m1 * (X[1] - X[3])) / L ** 3;

    return XP;
}

const x1 = 0.1;
const y1 = 0.1;
const xp1 = 5e-06;
const yp1 = -5e-06;

const x2 = 0;
const y2 = 0;
const xp2 = 5e-06;
const yp2 = 0;

let X = new Array(8);
X[0] = x1;
X[1] = y1;
X[2] = x2;
X[3] = y2;
X[4] = xp1;
X[5] = yp1;
X[6] = xp2;
X[7] = yp2;

const h = 1000e-3;   // paso de integración
const N = 50e3;      // iteraciones
const m1 = 1;
const m2 = 1;

const t = new Array(N);
for (let i = 0; i < N; i++) {
    t[i] = (i * h);
}

const p1 = new Array(N);
const p2 = new Array(N);

for (let k = 0; k < N; k++) {
    const K1 = dos_planetas(X, m1, m2);
    const K2 = dos_planetas(X.map((value, index) => value + 0.5 * h * K1[index]), m1, m2);
    const K3 = dos_planetas(X.map((value, index) => value + 0.5 * h * K2[index]), m1, m2);
    const K4 = dos_planetas(X.map((value, index) => value + 1.0 * h * K3[index]), m1, m2);

    X = X.map((value, index) => value + (1 / 6) * h * (K1[index] + 2 * K2[index] + 2 * K3[index] + K4[index]));

    p1[k] = [X[0], X[1]];
    p2[k] = [X[2], X[3]];
}

let i = 0

// Animación
function animate() {
    requestAnimationFrame(animate);
    // console.log(p1[i][0] * 1000, p1[i][1] * 1000)
    i++

    // Calcula las nuevas posiciones en la órbita
    const newPosition1 = new THREE.Vector3(p1[i][0], p1[i][1], 0);
    console.log(newPosition1)
    const newPosition2 = new THREE.Vector3(p2[i][0], p2[i][1], 0);
    // console.log(newPosition1, newPosition2)

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