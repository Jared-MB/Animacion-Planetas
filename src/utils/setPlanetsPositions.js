const ZOOM = 1100;

function dos_planetas(X, m1, m2) {
    // ODE dos planetas

    const XP = new Array(8).fill(0);
    const G = 6.672e-11;      // constante gravitacional

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

export default function setPlanetsPosition({ x, N, m1, m2, p1, p2, h }) {

    console.log(x, N, m1, m2, p1, p2, h)

    let X = x
    for (let k = 0; k < N; k++) {
        const K1 = dos_planetas(X, m1, m2);
        const K2 = dos_planetas(X.map((value, index) => value + 0.5 * h * K1[index]), m1, m2);
        const K3 = dos_planetas(X.map((value, index) => value + 0.5 * h * K2[index]), m1, m2);
        const K4 = dos_planetas(X.map((value, index) => value + 1.0 * h * K3[index]), m1, m2);

        X = X.map((value, index) => value + (1 / 6) * h * (K1[index] + 2 * K2[index] + 2 * K3[index] + K4[index]));

        p1[k] = [X[0] * ZOOM, X[1] * ZOOM];
        p2[k] = [X[2] * ZOOM, X[3] * ZOOM];
    }

    return {
        planet1Positions: p1,
        planet2Positions: p2,
        N,
        X,
        m1,
        m2,
        h
    }
}