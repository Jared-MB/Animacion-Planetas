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
 
//----------------------------------------------------- AGREGADO DOS FUNCIONES MAS ---------------------------------------------------

const loader = document.getElementById("loader");

// Mostrar el loader al hacer clic en el botón
if (button) {
    button.addEventListener("click", () => {
        loader.style.display = "block"; // Mostrar el loader
        const response = createArrays();
        socket.emit("create_array", {
            response,
            id,
        });
    });
}

// Ocultar el loader cuando la animación esté lista
socket.on("animation", (data) => {
    const { planetPositions1, planetPositions2 } = data.info as PlanetsPositions;
    console.log(data);
    animatePlanets(planetPositions1, planetPositions2);
    loader.style.display = "none"; // Ocultar el loader
});
