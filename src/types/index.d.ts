export interface PlanetsPositions {
	planetPositions1: [number, number][];
	planetPositions2: [number, number][];
}

export interface User {
	id: string;
	socketId: string;
	key: string;
}

export interface ClientResponse {
	id: string;
	response: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		[key: string]: any;
	};
	key: string;
}

export interface ServerResponse<T> {
	info: T;
	key: string;
}

export type CreateArrayResponse = undefined[][];
