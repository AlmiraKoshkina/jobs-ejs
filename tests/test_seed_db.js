const { seed_db } = require("../util/seed_db");
const LearningUnit = require("../models/LearningUnit");

const get_chai = require("../util/get_chai");

describe("database seeding", function () {
  it("should create 20 learning units in database", async () => {
    const { expect } = await get_chai();

    const testUser = await seed_db();

    const units = await LearningUnit.find({ createdBy: testUser._id });

    expect(units.length).to.equal(20);
  });
});
