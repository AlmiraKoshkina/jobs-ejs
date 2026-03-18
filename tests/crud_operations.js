const { app } = require("../app");
const get_chai = require("../util/get_chai");

const LearningUnit = require("../models/LearningUnit");
const { seed_db, testUserPassword } = require("../util/seed_db");

describe("CRUD operations for Learning Units", function () {
  before(async () => {
    const { request } = await get_chai();

    this.test_user = await seed_db();

    // --------------------
    // GET REGISTER PAGE
    // --------------------

    let req = request.execute(app).get("/sessions/register");
    let res = await req;

    const textNoLineEnd = res.text.replaceAll("\n", "");

    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];

    let cookies = res.headers["set-cookie"];

    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken")
    );

    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid")
    );

    // --------------------
    // LOGIN USER
    // --------------------

    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };

    req = request
      .execute(app)
      .post("/sessions/logon")
      .set("Cookie", [this.csrfCookie, this.sessionCookie])
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);

    res = await req;

    cookies = res.headers["set-cookie"];

    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid")
    );
  });

  it("should get learning units list", async function () {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/learningUnits")
      .set("Cookie", [this.sessionCookie]);

    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
  });

  it("should display 20 learning units", async function () {
    const { expect } = await get_chai();

    const units = await LearningUnit.find({});

    expect(units.length).to.equal(20);
  });

  it("should get new learning unit form", async function () {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/learningUnits")
      .set("Cookie", [this.sessionCookie]);

    const res = await req;

    expect(res).to.have.status(200);
  });

  it("should create a new learning unit", async function () {
    const { expect, request } = await get_chai();

    // --------------------
    // GET CSRF TOKEN
    // --------------------

    let req = request.execute(app).get("/sessions/register");
    let res = await req;

    // const textNoLineEnd = res.text.replaceAll("\n", "");

    // const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];

    const cookies = res.headers["set-cookie"];

    const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrfToken"));

    // --------------------
    // POST NEW UNIT
    // --------------------

    const dataToPost = {
      title: "Test Learning Unit",
      description: "Test description",
      category: "programming",
      progress: "planned",
      //   _csrf: csrfToken,
    };

    req = request
      .execute(app)
      .post("/learningUnits")
      .set("Cookie", [this.sessionCookie, csrfCookie])
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);

    res = await req;

    expect(res).to.have.status(302);

    const unit = await LearningUnit.findOne({
      title: "Test Learning Unit",
    });

    expect(unit).to.not.be.null;
  });
});
