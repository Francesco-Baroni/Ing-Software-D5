const request = require("supertest");
const app = require("./index.js");

describe.skip("GET /blabla", () => {
  it("does something", async () => {
    const res = await request(app)
      .get("/api/utentiPremium")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.premium_users).toHaveLength(5);
  });
});

describe("POST /blabla", () => {
  it("does something", async () => {
    const res = await request(app)
      .post("/api/newPremium")
      .expect("Content-Type", /json/)
      .send({
        Nome: "test",
        Cognome: "test1",
        Email: "test@gmail.com",
        Password: "testo",
      })
      .expect(200);
  });
});

describe("DELETE /blabla", () => {
  it("does something", async () => {
    const url = "/api/DeletePremium/test@gmail.com";
    const res = await request(app)
      .delete(url)
      .expect("Content-Type", /json/)
      .expect(200);
    console.log(res);
  });
});
