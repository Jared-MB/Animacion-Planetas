import { G, H, M1, M2, N, ZOOM } from "../constants";
import type { PlanetsPositions } from "../types";
import setX from "./setX";

function dos_planetas(X: number[], m1: number, m2: number) {
	const XP = new Array(8).fill(0);

	XP[0] = X[4];
	XP[1] = X[5];
	XP[2] = X[6];
	XP[3] = X[7];

	const L = Math.sqrt((X[2] - X[0]) ** 2 + (X[3] - X[1]) ** 2) + 1e-9;

	XP[4] = (G * m2 * (X[2] - X[0])) / L ** 3;
	XP[5] = (G * m2 * (X[3] - X[1])) / L ** 3;
	XP[6] = (G * m1 * (X[0] - X[2])) / L ** 3;
	XP[7] = (G * m1 * (X[1] - X[3])) / L ** 3;

	return XP;
}

export default function setPlanetsPosition(
	planetsPositions: undefined[][] | null,
): PlanetsPositions {
	if (!planetsPositions) throw new Error("The planets positions array is null");

	const planetPositions1 = planetsPositions[0] as unknown as [number, number][];
	const planetPositions2 = planetsPositions[1] as unknown as [number, number][];

	let X = setX();
	for (let k = 0; k < N; k++) {
		const K1 = dos_planetas(X, M1, M2);
		const K2 = dos_planetas(
			X.map((value, index) => value + 0.5 * H * K1[index]),
			M1,
			M2,
		);
		const K3 = dos_planetas(
			X.map((value, index) => value + 0.5 * H * K2[index]),
			M1,
			M2,
		);
		const K4 = dos_planetas(
			X.map((value, index) => value + 1.0 * H * K3[index]),
			M1,
			M2,
		);

		X = X.map(
			(value, index) =>
				value +
				(1 / 6) * H * (K1[index] + 2 * K2[index] + 2 * K3[index] + K4[index]),
		);

		planetPositions1[k] = [X[0] * ZOOM, X[1] * ZOOM];
		planetPositions2[k] = [X[2] * ZOOM, X[3] * ZOOM];
	}

	return {
		planetPositions1,
		planetPositions2,
	};
}
