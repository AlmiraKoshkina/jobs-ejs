const multiply = require("../util/multiply");
const { expect } = require("chai");

describe("multiply function", () => {
  it("should return 42 when multiplying 7 and 6", () => {
    const result = multiply(7, 6);
    expect(result).to.equal(42);
  });

  it("should return 15 when multiplying 5 and 3", () => {
    const result = multiply(5, 3);
    expect(result).to.equal(15);
  });
});
