import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
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

const id = uuidv4();

const socket = io();
document.addEventListener("DOMContentLoaded", () => {
	socket.emit("userId", id);
});

socket.on(`user-${id}`, (data) => {
	window.localStorage.setItem("key", data);

	if (data.message === "No more keys available") {
		const { planet1PositionFiltered, planet2PositionFiltered } = data.info;
		animatePlanets(planet1PositionFiltered, planet2PositionFiltered);
		return;
	}
});

socket.on(
	`user-${id}-data`,
	(data: ServerResponse<CreateArrayResponse | PlanetsPositions>) => {
		if (data.key === "set_planets_positions") {
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
		} else if (data.key === "animation") {
			const { planetPositions1, planetPositions2 } =
				data.info as PlanetsPositions;

			animatePlanets(planetPositions1, planetPositions2);
		}
	},
);

socket.on("animation", (data) => {
	const { planetPositions1, planetPositions2 } = data.info as PlanetsPositions;
	animatePlanets(planetPositions1, planetPositions2);
});

const button = document.getElementById("startAnimation");
if (button) {
	button.addEventListener("click", () => {
		const response = createArrays();
		socket.emit("create_array", {
			response,
			id,
		});
	});
}
