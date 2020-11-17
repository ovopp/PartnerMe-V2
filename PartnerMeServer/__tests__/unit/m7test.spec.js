const { test } = require("../../index");
const backend = require("../../index");
const testFunc = jest.fn(x => x === 1);
jest.mock('express');

describe("test()", () => {
    it("should return the value of the inputed function given an input value of 1", done => {
	try {
            expect(backend.test(testFunc)).toBeTruthy();
	    done();
	} catch (error) {
	    done(error);
	}
    });
    
});

