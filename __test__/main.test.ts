import { describe, expect, test } from "vitest";

import { PlanetsPositions } from "../src/types";
import {
	createPlanetsArrays,
	filterArrays,
	setPlanetsPositions,
} from "../src/utils/";

describe("Main functions of the app", () => {
	let planetsPositions: undefined[][] | null = null;
	let planetsPositionsSet: PlanetsPositions = {
		planetPositions1: [],
		planetPositions2: [],
	};
	let planetsPositionsFiltered: PlanetsPositions = {
		planetPositions1: [],
		planetPositions2: [],
	};

	test("The function createArray must return only a array of two arrays", () => {
		planetsPositions = createPlanetsArrays();
		expect(planetsPositions).toBeInstanceOf(Array);
		expect(planetsPositions.length).toBe(2);
		for (const planetPositions of planetsPositions) {
			expect(planetPositions).toBeInstanceOf(Array);
			expect(planetPositions.length).not.toBe(0);
			expect(planetPositions[0]).toBeUndefined();
			expect(planetPositions[1]).toBeUndefined();
		}
	});

	test("The function setPlanetsPositions must return a array of two arrays with the planets positions", () => {
		planetsPositionsSet = setPlanetsPositions(planetsPositions);

		expect(planetsPositionsSet).toBeInstanceOf(Object);

		expect(planetsPositionsSet).haveOwnPropertyDescriptor("planetPositions1");
		expect(planetsPositionsSet).haveOwnPropertyDescriptor("planetPositions2");

		expect(planetsPositionsSet.planetPositions1).toBeInstanceOf(Array);
		expect(planetsPositionsSet.planetPositions1).toHaveLength(50e3);
		expect(planetsPositionsSet.planetPositions2).toBeInstanceOf(Array);
		expect(planetsPositionsSet.planetPositions2).toHaveLength(50e3);

		expect(planetsPositionsSet.planetPositions1[0][0]).toBeTypeOf("number");
		expect(planetsPositionsSet.planetPositions1[0][0]).not.toBeNaN();
		expect(planetsPositionsSet.planetPositions1[0][1]).toBeTypeOf("number");
		expect(planetsPositionsSet.planetPositions1[0][1]).not.toBeNaN();
		expect(planetsPositionsSet.planetPositions1[0][0]).not.toBe(
			planetsPositionsSet.planetPositions1[0][1],
		);

		expect(planetsPositionsSet.planetPositions2[0][0]).toBeTypeOf("number");
		expect(planetsPositionsSet.planetPositions2[0][0]).not.toBeNaN();
		expect(planetsPositionsSet.planetPositions2[0][1]).toBeTypeOf("number");
		expect(planetsPositionsSet.planetPositions2[0][1]).not.toBeNaN();
		expect(planetsPositionsSet.planetPositions2[0][0]).not.toBe(
			planetsPositionsSet.planetPositions2[0][1],
		);
	});

	test("The function filterPositions must return a reduced array of positions", () => {
		planetsPositionsFiltered = filterArrays({ ...planetsPositionsSet });

		expect(planetsPositionsFiltered).toBeInstanceOf(Object);

		expect(planetsPositionsFiltered).haveOwnPropertyDescriptor(
			"planetPositions1",
		);
		expect(planetsPositionsFiltered).haveOwnPropertyDescriptor(
			"planetPositions2",
		);

		expect(planetsPositionsFiltered.planetPositions1).toBeInstanceOf(Array);
		expect(planetsPositionsFiltered.planetPositions1).toHaveLength(5e3);

		expect(planetsPositionsFiltered.planetPositions2).toBeInstanceOf(Array);
		expect(planetsPositionsFiltered.planetPositions2).toHaveLength(5e3);

		expect(planetsPositionsFiltered.planetPositions1[0][0]).toBeTypeOf(
			"number",
		);
		expect(planetsPositionsFiltered.planetPositions1[0][1]).not.toBeNaN();
		expect(planetsPositionsFiltered.planetPositions1[0][1]).toBeTypeOf(
			"number",
		);
		expect(planetsPositionsFiltered.planetPositions1[0][1]).not.toBeNaN();
		expect(planetsPositionsFiltered.planetPositions1[0][0]).not.toBe(
			planetsPositionsFiltered.planetPositions1[0][1],
		);

		expect(planetsPositionsFiltered.planetPositions2[0][0]).toBeTypeOf(
			"number",
		);
		expect(planetsPositionsFiltered.planetPositions2[0][0]).not.toBeNaN();
		expect(planetsPositionsFiltered.planetPositions2[0][1]).toBeTypeOf(
			"number",
		);
		expect(planetsPositionsFiltered.planetPositions2[0][1]).not.toBeNaN();
		expect(planetsPositionsFiltered.planetPositions2[0][0]).not.toBe(
			planetsPositionsFiltered.planetPositions2[0][1],
		);
	});
});
