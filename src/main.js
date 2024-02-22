
import animatePlanets from './utils/animation';
import createArrays from './utils/createArrays';
import filterArrays from './utils/filterArrays';
import setPlanetsPositions from './utils/setPlanetsPositions';

// Socket.io
const hasId = window.localStorage.getItem('id') ?? null;

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const id = hasId ? hasId : uuidv4();
const socket = io();
document.addEventListener('DOMContentLoaded', () => {
    if (!hasId) {
        window.localStorage.setItem('id', id);
    }
    socket.emit('userId', id);


});

socket.on(`user-${id}`, (data) => {
    window.localStorage.setItem('key', data);

    if (data === 'No more keys available') {
        alert('No more keys available');
    }

    let response = null
    const key = data
    if (data === 'create_array') {
        response = createArrays(data)
    }
    else if (data === 'set_planets_positions') {
        response = setPlanetsPositions(data)
    }
    else if (data === 'filter_planets') {
        response = filterArrays(data)
    }

    console.log(response)

    socket.emit(key, {
        response,
        id,
    })
});

socket.on('users', (data) => {
    // set when a user is connected
    console.log(data)
    document.getElementById('users').innerHTML += data
})

socket.on('animation', (data) => {
    const { planet1PositionFiltered, planet2PositionFiltered } = data
    const { animate } = animatePlanets(planet1PositionFiltered, planet2PositionFiltered, data)
    animate()
})