export default function createArrays(key) {
    if (key !== 'create_array') {
        return
    }
    const x1 = 0.1;
    const y1 = 0.1;
    const xp1 = 5e-06;
    const yp1 = -5e-06;

    const x2 = 0;
    const y2 = 0;
    const xp2 = 5e-06;
    const yp2 = 0;

    const X = new Array(8);
    X[0] = x1;
    X[1] = y1;
    X[2] = x2;
    X[3] = y2;
    X[4] = xp1;
    X[5] = yp1;
    X[6] = xp2;
    X[7] = yp2;

    const h = 1000e-3;   // paso de integración
    const N = 50e3;      // iteraciones
    const m1 = 1;
    const m2 = 1;

    const t = new Array(N);
    for (let i = 0; i < N; i++) {
        t[i] = (i * h);
    }

    const p1 = new Array(N);
    const p2 = new Array(N);

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