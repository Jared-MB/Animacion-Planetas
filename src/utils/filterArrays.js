export default function filterArrays(planet1Positions, planet2Positions, key) {
    if (key !== 'filter_planets') {
        return
    }
    const planet1PositionFiltered = planet1Positions.filter((_, index) => index % 10 === 0);
    const planet2PositionFiltered = planet2Positions.filter((_, index) => index % 10 === 0);

    return {
        planet1PositionFiltered,
        planet2PositionFiltered
    }
}