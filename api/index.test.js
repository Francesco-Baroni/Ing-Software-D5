const request = require("supertest");
const app = require("./index.js");

describe("GET /Utenti Premium", () => {
  it("Empty JSON", () => {
    request(app)
      .get("/api/utentiPremium")
      .expect("Content-Type", /json/)
      .end((err, res) => {
        expect(res.body.premium_users.length).not.toBe(0);
      });
  });
});

describe("POST /New Premium", () => {
  it("Create a user", async () => {
    request(app)
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
  it("Delete a user", () => {
    const url = "/api/DeletePremium/test@gmail.com";
    request(app).delete(url).expect("Content-Type", /json/).expect(200);
  });
  it("Element not found", () => {
    const url = "/api/DeletePremium/elementthatsnotsupposedtobeinthejson";
    request(app)
      .delete(url)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        expect(res.premium_users.Email).not.toBe(
          "elementthatsnotsupposedtobeinthejson"
        );
      });
  });
});
