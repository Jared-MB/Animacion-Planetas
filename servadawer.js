"use strict";
const express = require('express');
const path = require('node:path');
const { createServer } = require('node:http');
const { getIps } = require('@kristall/get-ips');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
const users = [];
const tasks = [{
        id: 1,
        name: 'create_array',
        response: 'create_array',
        prev: null
    }, {
        id: 2,
        name: 'set_planets_positions',
        response: 'set_planets_positions',
        prev: 1
    }, {
        id: 3,
        name: 'filter_planets',
        response: 'filter_planets',
        prev: 2
    }];
const keys = ['create_array', 'set_planets_positions', 'filter_planets', 'animation'].reverse();
server.listen(3000, getIps()[0].address, () => {
    console.log(`listening on http://${getIps()[0].address}:3000`);
});
const getUserKey = (userId) => users.find(user => user.id === userId).key;
const responses = [];
io.on('connection', (socket) => {
    socket.on('userId', (userId) => {
        const isUserOnList = users.some(user => user.id === userId);
        if (isUserOnList) {
            socket.emit(`user-${userId}`, getUserKey(userId));
            return;
        }
        if (keys.length === 0) {
            socket.emit(`user-${userId}`, 'No more keys available');
            return;
        }
        users.push({ id: userId, socketId: socket.id, key: keys.pop() });
        socket.emit(`user-${userId}`, getUserKey(userId));
    });
    socket.on('create_array', (data) => {
        const hasAlreadyResponse = responses.some(response => response.id === data.id);
        if (hasAlreadyResponse) {
            const planetPositionUser = users.find(user => user.key === 'set_planets_positions');
            if (!planetPositionUser)
                return;
            socket.emit(`user-${planetPositionUser.id}-data`, {
                key: 'set_planets_positions',
                info: data
            });
            return;
        }
        responses.push({ id: data.id, response: data.response, key: 'create_array' });
        const planetPositionUser = users.find(user => user.key === 'set_planets_positions');
        if (!planetPositionUser)
            return;
        socket.emit(`user-${planetPositionUser.id}-data`, {
            key: 'set_planets_positions',
            info: data
        });
    });
    socket.on('get-data', ({ key, id }) => {
        const prev = tasks.find(task => task.name === key);
        const isPrevNumber = typeof prev.prev === 'number';
        const previousKey = isPrevNumber ? tasks[prev.prev - 1].name : null;
        const data = responses.find(response => response.key === previousKey);
        socket.emit(`user-${id}-data`, {
            key,
            info: data ? data.response : null
        });
    });
    socket.on('set_planets_positions', (data) => {
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (data.response.planet1Position.hasOwnProperty('firstHalf')) {
            responses.push({ id: data.id, response: data.response });
        }
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (data.response.planet1Position.hasOwnProperty('secondHalf')) {
            const positions = responses.find(response => response.id === data.id);
            if (!positions)
                throw new Error('No positions found');
            const positionsIndex = responses.findIndex(response => response.id === data.id);
            responses[positionsIndex].response = [
                ...positions.response.planet1Position.firstHalf,
                ...data.response.planet1Position.secondHalf
            ];
            console.log(responses);
            const filterPlanetsUser = users.find(user => user.key === 'filter_planets');
            if (!filterPlanetsUser)
                return;
            socket.emit(`user-${filterPlanetsUser.id}-data`, {
                key: 'filter_planets',
                info: responses[positionsIndex].response
            });
        }
        // const hasAlreadyResponse = responses.some(response => response.id === data.id)
        // if (hasAlreadyResponse) return
        // socket.emit("users", 'set_planets_positions')
    });
    socket.on('filter_planets', (data) => {
        const hasAlreadyResponse = responses.some(response => response.id === data.id);
        if (hasAlreadyResponse)
            return;
        responses.push({ id: data.id, response: data.response });
    });
    // socket.on('data', (data) => {
    //     responses.push(data)
    //     if (responses.length === 3) {
    //         const [createArrays, setPlanetsPositions, filterArrays] = responses
    //         socket.emit('animation', { createArrays, setPlanetsPositions, filterArrays })
    //     }
    // })
});
