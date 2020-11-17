const backend = require("../../index");

const testFunc = jest.fn(x => x == 1);

describe("test()", () => {
    it("should return the value of the inputed function given an input value of 1", async () => {
        const data = await backend.test(testFunc);
	expect(data).toBeTruthy();
    });
    
});

