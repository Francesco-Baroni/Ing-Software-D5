const request = require("supertest");
const app = require("./index.js");

describe("GET /Utenti Premium", () => {
  it("test", async () => {
    const res = await request(app)
      .get("/api/utentiPremium")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.premium_users).toHaveLength(res.body.premium_users.length);
  });
  it("Empty JSON", async () => {
    const res = await request(app)
      .get("/api/utentiPremium")
      .expect("Content-Type", /json/);
    if (res.body.premium_users.length === 0) expect(200);
  });
});

describe("POST /New Premium", () => {
  it("test", async () => {
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

describe("DELETE /Delete Premium", () => {
  it("test", async () => {
    const url = "/api/DeletePremium/test@gmail.com";
    const res = await request(app)
      .delete(url)
      .expect("Content-Type", /json/)
      .expect(200);
  });
  it("Element not found", async () => {
    const url = "/api/DeletePremium/elementthatsnotsupposedtobeinthejson";
    const res = await request(app)
      .delete(url)
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
