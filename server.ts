import { createServer } from "node:http";
import path from "node:path";
import { getIps } from "@kristall/get-ips";
import express, { Request, Response } from "express";
import { Server } from "socket.io";

// const express = require('express');
// const path = require('node:path');
// const { createServer } = require('node:http');
// const { getIps } = require('@kristall/get-ips')
// const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 1e16,
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

interface User {
    id: string;
    socketId: string;
    key: string;
}

const users: User[] = [];

interface Task {
    id: number;
    name: string;
    response: string;
    prev: number | null;
}

const tasks: Task[] = [
    {
        id: 1,
        name: "create_array",
        response: "create_array",
        prev: null,
    },
    {
        id: 2,
        name: "set_planets_positions",
        response: "set_planets_positions",
        prev: 1,
    },
    {
        id: 3,
        name: "filter_planets",
        response: "filter_planets",
        prev: 2,
    },
];

const keys = [
    "create_array",
    "set_planets_positions",
    "filter_planets",
    "animation",
].reverse();

server.listen(3000, getIps()[0].address, () => {
    console.log(`listening on http://${getIps()[0].address}:3000`);
});

const getUserKey = (userId: string): string | null =>
    users.find((user) => user.id === userId)?.key ?? null;

interface ClientResponse {
    id: string;
    response: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        [key: string]: any;
    };
    key: string
}

const responses: ClientResponse[] = [];

io.on("connection", (socket) => {
    socket.on("userId", (userId) => {
        const isUserOnList = users.some((user) => user.id === userId);
        if (isUserOnList) {
            socket.emit(`user-${userId}`, getUserKey(userId));
            return;
        }

        if (keys.length === 0) {
            socket.emit(`user-${userId}`, "No more keys available");
            return;
        }
        users.push({ id: userId, socketId: socket.id, key: keys.pop() as string });
        socket.emit(`user-${userId}`, getUserKey(userId));
    });

    socket.on("create_array", (data) => {
        const hasAlreadyResponse = responses.some(
            (response) => response.id === data.id,
        );
        if (hasAlreadyResponse) {
            const planetPositionUser = users.find(
                (user) => user.key === "set_planets_positions",
            );
            if (!planetPositionUser) return;
            socket.emit(`user-${planetPositionUser.id}-data`, {
                key: "set_planets_positions",
                info: data,
            });
            return;
        }
        responses.push({
            id: data.id,
            response: data.response,
            key: "create_array",
        });
        const planetPositionUser = users.find(
            (user) => user.key === "set_planets_positions",
        );
        if (!planetPositionUser) return;
        socket.emit(`user-${planetPositionUser.id}-data`, {
            key: "set_planets_positions",
            info: data,
        });
    });

    socket.on("get-data", ({ key, id }) => {
        const prev = tasks.find((task) => task.name === key);

        if (!prev) return

        const isPrevNumber = typeof prev.prev === "number";
        const previousKey = isPrevNumber ? tasks[(prev.prev as number) - 1].name : null;

        const data = responses.find((response) => response.key === previousKey);

        socket.emit(`user-${id}-data`, {
            key,
            info: data ? data.response : null,
        });
    });

    socket.on("set_planets_positions", (data) => {
        console.log(data)
        responses.push({ id: data.id, response: data.response, key: "set_planets_positions" });
        console.log(responses)
        // const positionsIndex = responses.findIndex(
        //     (response) => response.id === data.id,
        // );
        // // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        // if (data.response?.planet1Position?.hasOwnProperty("firstHalf")) {
        //     responses.push({ id: data.id, response: data.response, key: "set_planets_positions" });
        // }
        // // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        // if (data.response?.planet1Position?.hasOwnProperty("secondHalf")) {
        //     const positions = responses.find((response) => response.id === data.id);
        //     if (!positions) throw new Error("No positions found");

        //     responses[positionsIndex].response = {
        //         planet1Position: [
        //             ...positions.response.planet1Position.firstHalf,
        //             ...data.response.planet1Position.secondHalf,
        //         ],
        //         ...responses[positionsIndex].response,
        //     }

        // }

        // // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        // if (data.response?.planet2Position?.hasOwnProperty("firstHalf")) {
        //     console.log('firstHalf')
        //     const positions = responses.findIndex((response) => response.id === data.id);
        //     if (positions === -1) return;
        //     responses[positions].response = {
        //         planet2Position: [
        //             ...data.response.planet2Position.firstHalf,
        //         ],
        //         ...responses[positions].response,
        //     };
        // }
        // // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        // else if (data.response?.planet2Position?.hasOwnProperty("secondHalf")) {
        //     const positions = responses.findIndex((response) => response.id === data.id);
        //     if (positions === -1) return;
        //     responses[positions].response = {
        //         planet2Position: [
        //             ...responses[positions].response.planet2Position.firstHalf,
        //             ...data.response.planet2Position.secondHalf,
        //         ],
        //         ...responses[positions].response,
        //     };
        //     console.log(responses[1])
        //     const filterPlanetsUser = users.find(
        //         (user) => user.key === "filter_planets",
        //     );
        //     if (!filterPlanetsUser) return;
        //     socket.emit(`user-${filterPlanetsUser.id}-data`, {
        //         key: "filter_planets",
        //         info: responses[positionsIndex].response,
        //     });

        // }
        // const hasAlreadyResponse = responses.some(response => response.id === data.id)
        // if (hasAlreadyResponse) return

        // socket.emit("users", 'set_planets_positions')
    });

    socket.on("filter_planets", (data) => {
        const hasAlreadyResponse = responses.some(
            (response) => response.id === data.id,
        );
        if (hasAlreadyResponse) return;
        responses.push({ id: data.id, response: data.response, key: "filter_planets" });
    });

    // socket.on('data', (data) => {
    //     responses.push(data)
    //     if (responses.length === 3) {
    //         const [createArrays, setPlanetsPositions, filterArrays] = responses
    //         socket.emit('animation', { createArrays, setPlanetsPositions, filterArrays })
    //     }
    // })
});
