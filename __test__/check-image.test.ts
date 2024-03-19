import fs from "node:fs";
import { expect, test } from "vitest";

test("The images of the e2e test are correct", async () => {
	const image1 = fs.existsSync("test-results/screenshot.png");
	const image2 = fs.existsSync("test-results/screenshot2.png");

	expect(image1).toBe(true);
	expect(image2).toBe(true);
});
