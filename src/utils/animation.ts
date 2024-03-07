import * as THREE from 'three';

export default function animatePlanets(planet1PositionFiltered, planet2PositionFiltered) {
    const scene = new THREE.Scene();

    // Crea la cámara
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.x = 300;
    camera.position.y = 400;
    camera.position.z = 300;

    // La cámara se coloca 10 unidades arriba del origen
    camera.rotation.x = -Math.PI / 2;

    // Crea el renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Carga de texturas
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load('/planeta.jpg');
    planetTexture.magFilter = THREE.NearestFilter; // Ajusta el tamaño de la textura

    const planetTexture2 = textureLoader.load('/planeta2.jpg');
    planetTexture2.magFilter = THREE.NearestFilter; // Ajusta el tamaño de la textura

    // Crea geometría y materiales para los planetas
    const geometry = new THREE.SphereGeometry(6, 256, 256);
    // ROJO
    const material1 = new THREE.MeshBasicMaterial({ map: planetTexture });
    // AZUL
    const material2 = new THREE.MeshBasicMaterial({ map: planetTexture2 });

    // Crea los planetas
    const planet1 = new THREE.Mesh(geometry, material1);
    const planet2 = new THREE.Mesh(geometry, material2);

    // Añade los planetas a la escena
    scene.add(planet1);
    scene.add(planet2);
    let angle1 = 0;
    let angle2 = 0;

    // const { planet1Positions: p1, planet2Positions: p2, N, X, m1, m2, h } = createArrays(key);
    // const { planet1Positions, planet2Positions } = setPlanetsPositions(X, N, m1, m2, p1, p2, h, key);
    // const { planet1PositionFiltered, planet2PositionFiltered } = filterArrays(planet1Positions, planet2Positions, key);


    // ----- MAIN FUNCTION -> TO THE MAIN COMPUTER/SERVER
    // Animación
    let i = 0
    function animate() {
        requestAnimationFrame(animate);
        i++

        // Calcula las nuevas posiciones en la órbita
        const newPosition1 = new THREE.Vector3(planet1PositionFiltered[i][0], planet1PositionFiltered[i][1], 0);
        // console.log(newPosition1)
        const newPosition2 = new THREE.Vector3(planet2PositionFiltered[i][0], planet2PositionFiltered[i][1], 0);
        // console.log(newPosition1, newPosition2)

        // Actualiza las posiciones de los planetas
        planet1.position.copy(newPosition1);
        planet2.position.copy(newPosition2);

        // Incrementa los ángulos para la próxima posición en la órbita
        angle1 += 0.01;
        angle2 += 0.015;

        // // Agrega rotación a los planetas en los ejes X, Y y Z
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

    animate()
}