import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import type {
	CreateArrayResponse,
	PlanetsPositions,
	ServerResponse,
} from "./types";
import animatePlanets from "./utils/animation";
import createArrays from "./utils/createArrays";
import filterArrays from "./utils/filterArrays";
import setPlanetsPositions from "./utils/setPlanetsPositions";

const hasId = window.localStorage.getItem("id") ?? null;

const id = hasId ? hasId : uuidv4();

const socket = io();
document.addEventListener("DOMContentLoaded", () => {
	if (!hasId) {
		window.localStorage.setItem("id", id);
	}
	socket.emit("userId", id);
});

socket.on(`user-${id}`, (data) => {
	window.localStorage.setItem("key", data);

	if (data.message === "No more keys available") {
		const { planet1PositionFiltered, planet2PositionFiltered } = data.info;
		animatePlanets(planet1PositionFiltered, planet2PositionFiltered);
		return;
	}

	const key = data;

	socket.emit("get-data", {
		key,
		id,
	});
});

socket.on(
	`user-${id}-data`,
	(data: ServerResponse<CreateArrayResponse | PlanetsPositions>) => {
		if (data.key === "create_array") {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const response = createArrays() as any;
			socket.emit("create_array", {
				response,
				id,
			});
		} else if (data.key === "set_planets_positions") {
			const positions = setPlanetsPositions([data.info[0], data.info[1]]);

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

const button = document.querySelector("button") as HTMLButtonElement;
button.addEventListener("click", () => {
	socket.emit("get-animation");
});
