import { X1, X2, XP1, XP2, Y1, Y2, YP1, YP2 } from "../constants";

export default function setX() {
	const X = new Array(8);
	X[0] = X1;
	X[1] = Y1;
	X[2] = X2;
	X[3] = Y2;
	X[4] = XP1;
	X[5] = YP1;
	X[6] = XP2;
	X[7] = YP2;

	return X;
}
