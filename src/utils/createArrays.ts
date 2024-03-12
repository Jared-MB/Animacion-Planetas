import { N } from "../constants";

export default function createPlanetsArrays() {
	// ? Masa de los planetas / ES NECESARIO?
	// const t = new Array(N);
	// for (let i = 0; i < N; i++) {
	//     t[i] = (i * h);
	// }

	const planet1 = new Array<undefined>(N);
	const planet2 = new Array<undefined>(N);

	const planetsPositions = [planet1, planet2];
	return planetsPositions;
}
