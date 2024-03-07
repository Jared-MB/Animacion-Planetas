import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import animatePlanets from './utils/animation';
import createArrays from './utils/createArrays';
import filterArrays from './utils/filterArrays';
import setPlanetsPositions from './utils/setPlanetsPositions';

const hasId = window.localStorage.getItem('id') ?? null;

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

    if (data.message === 'No more keys available') {
        const { planet1PositionFiltered, planet2PositionFiltered } = data.info
        animatePlanets(planet1PositionFiltered, planet2PositionFiltered)
        return
    }

    const key = data

    socket.emit('get-data', {
        key,
        id,
    })

});

socket.on(`user-${id}-data`, (data) => {

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let response = null as any

    if (data.key === 'create_array') {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        response = createArrays(data.key) as any
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
    }
    else if (data.key === 'filter_planets') {
        console.log(data.info)
        response = filterArrays(data.info.planet1Position, data.info.planet2Position) as {
            planet1PositionFiltered: [number, number][],
            planet2PositionFiltered: [number, number][]
        }
        socket.emit('filter_planets', {
            response,
            id,
        })
    }
    else if (data.key === 'animation') {
        console.log(data.info.planet1PositionFiltered, data.info.planet2PositionFiltered)
        const { planet1PositionFiltered, planet2PositionFiltered } = data.info

        animatePlanets(planet1PositionFiltered, planet2PositionFiltered)

    }

})