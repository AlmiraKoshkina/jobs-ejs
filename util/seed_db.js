const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");

const LearningUnit = require("../models/LearningUnit");
const User = require("../models/User");

const testUserPassword = faker.internet.password();

const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();

factory.setAdapter(factoryAdapter);

factory.define("learningUnit", LearningUnit, {
  title: () => faker.lorem.words(3),
  description: () => faker.lorem.sentence(),

  category: () =>
    ["programming", "design", "language", "business", "other"][
      Math.floor(Math.random() * 5)
    ],

  progress: () =>
    ["planned", "in-progress", "completed"][Math.floor(Math.random() * 3)],
});

factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;

  try {
    await LearningUnit.deleteMany({});
    await User.deleteMany({});

    testUser = await factory.create("user", {
      password: testUserPassword,
    });

    await factory.createMany("learningUnit", 20, {
      createdBy: testUser._id,
    });
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }

  return testUser;
};

module.exports = {
  seed_db,
  factory,
  testUserPassword,
};
