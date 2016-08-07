var expect = require("chai").expect;
var stringify = require("../lib/json-stringify-debug");

describe("Primitive type ", function () {
	it("null to 'null'.", function () { expect(stringify(null)).to.be.equal(JSON.stringify(null)); });
	it("number to 'number'.", function () { expect(stringify(12)).to.be.equal(JSON.stringify(12)); });
	it("boolean to 'boolean'.", function () { expect(stringify(true)).to.be.equal(JSON.stringify(true));});
	it("string to 'string'.", function () { expect(stringify("abc")).to.be.equal(JSON.stringify("abc")); });
	it("undefined to undefined.", function () { expect(stringify(undefined)).to.equal(JSON.stringify(undefined)); });
	it("function to undefined.", function () { expect(stringify(function () { })).to.equal(JSON.stringify(undefined)); });
});

describe("If toJSON is defined ", function () {
	it("it shoud be used", function () { expect(stringify(new Date(2006, 0, 2, 15, 4, 5))).to.be.equal('"2006-01-02T14:04:05.000Z"'); });
});