import { isNumber } from "./isNumber";

describe("utils.isNumber", () => {
    it("Its a number", () => {
        [0, 1, 2, -1, 1.345e17, "1"].forEach((n) => {
            expect(isNumber(n)).toEqual(true);
        });
    });
});
