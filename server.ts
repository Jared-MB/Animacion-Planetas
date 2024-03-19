import { createServer } from "node:http";
import { join } from "node:path";
import { getIps } from "@kristall/get-ips";
import express from "express";
import type { Request, Response } from "express";
import { Server } from "socket.io";

import type { ClientResponse, Task, User } from "./src/types";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	maxHttpBufferSize: 1e16,
});

app.use(express.static(join(__dirname, "client")));

app.get("/", (req: Request, res: Response) => {
	res.sendFile(join(__dirname, "dist/client", "index.html"));
});

const users: User[] = [];

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
	{
		id: 4,
		name: "animation",
		response: "animation",
		prev: 3,
	},
];

const keys = [
	"create_array",
	"set_planets_positions",
	"filter_planets",
	"animation",
].reverse();

const ip = process.argv[2] === "--local" ? "localhost" : getIps()[0].address;

server.listen(3000, ip, () => {
	console.log(`listening on http://${ip}:3000`);
});

const getUserKey = (userId: string): string | null =>
	users.find((user) => user.id === userId)?.key ?? null;

const responses: ClientResponse[] = [];

io.on("connection", (socket) => {
	socket.on("userId", (userId) => {
		const isUserOnList = users.some((user) => user.id === userId);
		if (isUserOnList) {
			socket.emit(`user-${userId}`, getUserKey(userId));
			return;
		}

		if (keys.length === 0) {
			socket.emit(`user-${userId}`, {
				message: "No more keys available",
				info: responses[responses.length - 1].response,
			});
			return;
		}
		users.push({ id: userId, socketId: socket.id, key: keys.pop() as string });
		socket.emit(`user-${userId}`, getUserKey(userId));
	});

	socket.on("create_array", (data) => {
		console.log("createArray");
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

		if (!prev) return;

		const isPrevNumber = typeof prev.prev === "number";
		const previousKey = isPrevNumber
			? tasks[(prev.prev as number) - 1].name
			: null;

		const data = responses.find((response) => response.key === previousKey);

		socket.emit(`user-${id}-data`, {
			key,
			info: data ? data.response : null,
		});
	});

	socket.on("set_planets_positions", (data) => {
		console.log("setPlanetsPositions");
		responses.push({
			id: data.id,
			response: data.response,
			key: "set_planets_positions",
		});
		console.log(responses[1]);
	});

	socket.on("filter_planets", (data) => {
		const hasAlreadyResponse = responses.some(
			(response) => response.id === data.id,
		);
		if (hasAlreadyResponse) return;
		responses.push({
			id: data.id,
			response: data.response,
			key: "filter_planets",
		});
		socket.emit("animation", {
			info: data.response,
		});
	});

	socket.on("get-animation", (data) => {
		socket.emit("animation", {
			info: responses[2].response,
		});
	});
});
