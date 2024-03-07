// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function filterArrays(planet1Positions: any[], planet2Positions: any[]) {

    console.log(planet1Positions, planet2Positions)
    const planet1PositionFiltered = planet1Positions.filter((_, index) => index % 10 === 0);
    const planet2PositionFiltered = planet2Positions.filter((_, index) => index % 10 === 0);

    return {
        planet1PositionFiltered,
        planet2PositionFiltered
    }
}