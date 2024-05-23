import { createServer } from "node:http";
import { join } from "node:path";
import { getIps } from "@kristall/get-ips";
import express from "express";
import type { Request, Response } from "express";
import { Server } from "socket.io";

import type { ClientResponse, User } from "./src/types";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	maxHttpBufferSize: 1e16,
});

app.use(express.static(join(__dirname, "client")));

app.get("/", (_req: Request, res: Response) => {
	res.sendFile(join(__dirname, "dist/client", "index.html"));
});

const users: User[] = [];

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
			socket.emit("animation", {
				message: "No more keys available",
				info: responses[responses.length - 1].response,
			});
			return;
		}

		const user = {
			id: userId,
			socketId: socket.id,
			key: keys.pop() as string,
		};

		users.push(user);
		io.emit(`user-${userId}`, getUserKey(userId));
		if (user.key === "filter_planets") {
			keys.pop();
			const createArrayUser = users.find((user) => user.key === "create_array");
			if (!createArrayUser) return;
			console.log("create_array", createArrayUser.id);
			io.emit(`user-${createArrayUser.id}-data`, {
				key: "create_array",
				info: "",
			});
		}
	});

	socket.on("create_array", (data) => {
		console.log(data);
		const hasAlreadyResponse = responses.some(
			(response) => response.id === data.id,
		);
		if (hasAlreadyResponse) {
			const planetPositionUser = users.find(
				(user) => user.key === "set_planets_positions",
			);
			if (!planetPositionUser) return;
			io.emit(`user-${planetPositionUser.id}-data`, {
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
		io.emit(`user-${planetPositionUser.id}-data`, {
			key: "set_planets_positions",
			info: data.response,
		});
	});

	socket.on("set_planets_positions", (data) => {
		responses.push({
			id: data.id,
			response: data.response,
			key: "set_planets_positions",
		});
		const filterPlanetsUser = users.find(
			(user) => user.key === "filter_planets",
		);
		if (!filterPlanetsUser) return;
		io.emit(`user-${filterPlanetsUser.id}-data`, {
			key: "filter_planets",
			info: data.response,
		});
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
		io.emit("animation", {
			info: data.response,
		});
	});
});
