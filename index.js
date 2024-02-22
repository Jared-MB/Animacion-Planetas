const express = require('express');
const path = require('node:path');
const { createServer } = require('node:http');
const { getIps } = require('@kristall/get-ips')
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const users = []

const keys = ['create_array', 'set_planets_positions', 'filter_planets', 'animation'].reverse()

server.listen(3000, getIps()[0].address, () => {
    console.log(`listening on http://${getIps()[0].address}:3000`);
});

const getUserKey = (userId) => users.find(user => user.id === userId).key

const responses = []

io.on('connection', (socket) => {

    socket.on('userId', (userId) => {

        const isUserOnList = users.some(user => user.id === userId)
        if (isUserOnList) {
            socket.emit(`user-${userId}`, getUserKey(userId))
            return
        }

        if (keys.length === 0) {
            socket.emit(`user-${userId}`, 'No more keys available')
            return
        }
        users.push({ id: userId, socketId: socket.id, key: keys.pop() })
        socket.emit(`user-${userId}`, getUserKey(userId))
    })

    socket.on('create_array', (data) => {
        const hasAlreadyResponse = responses.some(response => response.id === data.id)
        if (hasAlreadyResponse) return
        responses.push({ id: data.id, response: data.response })
        socket.emit("users", 'create_array')

    })

    socket.on('set_planets_positions', (data) => {
        const hasAlreadyResponse = responses.some(response => response.id === data.id)
        if (hasAlreadyResponse) return
        responses.push({ id: data.id, response: data.response })
        socket.emit("users", 'set_planets_positions')
    })

    socket.on('filter_planets', (data) => {
        const hasAlreadyResponse = responses.some(response => response.id === data.id)
        if (hasAlreadyResponse) return
        responses.push({ id: data.id, response: data.response })
    })



    // socket.on('data', (data) => {
    //     responses.push(data)
    //     if (responses.length === 3) {
    //         const [createArrays, setPlanetsPositions, filterArrays] = responses
    //         socket.emit('animation', { createArrays, setPlanetsPositions, filterArrays })
    //     }
    // })
});