import type { PlanetsPositions } from "../types";

export default function filterArrays({
	planetPositions1,
	planetPositions2,
}: PlanetsPositions): PlanetsPositions {
	const planetPositionFiltered1 = planetPositions1.filter(
		(_, index) => index % 10 === 0,
	);
	const planetPositionFiltered2 = planetPositions2.filter(
		(_, index) => index % 10 === 0,
	);

	return {
		planetPositions1: planetPositionFiltered1,
		planetPositions2: planetPositionFiltered2,
	};
}
