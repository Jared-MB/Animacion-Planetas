import io from "socket.io-client";
import { v4 as uuid } from "uuid";
import type {
	CreateArrayResponse,
	PlanetsPositions,
	ServerResponse,
} from "./types";

import {
	animation as animatePlanets,
	createPlanetsArrays as createArrays,
	filterArrays,
	setPlanetsPositions,
} from "./utils";

const id = uuid();

const socket = io();
document.addEventListener("DOMContentLoaded", () => {
	window.localStorage.removeItem("key");
	socket.emit("userId", id);
});

socket.on(`user-${id}`, (data) => {
	window.localStorage.setItem("key", data);
});

socket.on(
	`user-${id}-data`,
	(data: ServerResponse<CreateArrayResponse | PlanetsPositions>) => {
		if (data.key === "create_array") {
			const response = createArrays();
			socket.emit("create_array", {
				response,
				id,
			});
		} else if (data.key === "set_planets_positions") {
			const positions = setPlanetsPositions([
				(data.info as CreateArrayResponse)[0],
				(data.info as CreateArrayResponse)[1],
			]);

			socket.emit("set_planets_positions", {
				response: positions,
				id,
			});
		} else if (data.key === "filter_planets") {
			const response = filterArrays({
				planetPositions1: (data.info as PlanetsPositions).planetPositions1,
				planetPositions2: (data.info as PlanetsPositions).planetPositions2,
			});
			socket.emit("filter_planets", {
				response,
				id,
			});
		}
	},
);

const loader = document.querySelector(".loader") as HTMLDivElement;

socket.on("animation", (data) => {
	const { planetPositions1, planetPositions2 } = data.info as PlanetsPositions;
	animatePlanets(planetPositions1, planetPositions2);
	loader.style.display = "none";
});
