
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
    const key = data

    console.log(key)

    socket.emit('get-data', {
        key,
        id,
    })

});

socket.on(`user-${id}-data`, (data) => {

    let response = null

    if (data.key === 'create_array') {
        response = createArrays(data.key)
        socket.emit('create_array', {
            response,
            id,
        })
    }
    else if (data.key === 'set_planets_positions') {


        const positions = setPlanetsPositions({
            x: data.info.X,
            N: data.info.N,
            m1: data.info.m1,
            m2: data.info.m2,
            p1: data.info.planet1Positions,
            p2: data.info.planet2Positions,
            h: data.info.h
        })

        socket.emit('set_planets_positions', {
            response: {
                planet1Position: positions.planet1Positions,
                planet2Position: positions.planet2Positions,
            },
            id,
        })
        // socket.emit('set_planets_positions', {
        //     response: {
        //         planet1Position: {
        //             secondHalf
        //         }
        //     },
        //     id,
        // })
        // socket.emit('set_planets_positions', {
        //     response: {
        //         planet2Position: {
        //             firstHalf: firstHalf2
        //         }
        //     },
        //     id,
        // })
        // socket.emit('set_planets_positions', {
        //     response: {
        //         planet2Position: {
        //             secondHalf: secondHalf2
        //         }
        //     },
        //     id,
        // })
    }
    else if (data.key === 'filter_planets') {
        console.log(data)
        response = filterArrays(data.info.planet1Positions, data.info.planet2Positions, data.key)
        socket.emit('filter_planets', {
            response,
            id,
        })
    }

})

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