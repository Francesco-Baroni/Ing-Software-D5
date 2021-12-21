const request = require("supertest");
const app = require("../server/server");
var test = require("tape");

test("TEST 1 : Users list", (assert) => {
  request(app)
    .get("/api/utentiPremium")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      var NumOfEmployees = res.body.premium_users.length;
      var result = false;
      if (NumOfEmployees == 0) {
        result = true;
      }

      assert.error(err, "No error");
      assert.notEqual(true, result, "Employees retrieved Correctly");
      assert.end();
    });
});

test("TEST2: User correctly added", (assert) => {
  request(app)
    .post("/api/newPremium")
    .send({
      Nome: "test",
      Cognome: "test1",
      Email: "test@gmail.com",
      Password: "testo",
    })
    .end((err, res) => {
      if (err)
        reject(
          new Error("An error occured with the user adding API, err: " + err)
        );
      assert.error(err, "No error");
      assert.isEqual(
        "Utente Aggiunto Correttamente",
        res.body,
        "User Added Correctly"
      );
      assert.end();
    });
});

test("TEST3: User deleted", (assert) => {
  request(app)
    .del("/api/DeletePremium/test@gmail.com")
    .end((err, res) => {
      if (err) {
        reject(
          new Error(
            "An error occured with the employee Adding API, err: " + err
          )
        );
      }

      assert.error(err, "No error");
      assert.isEqual(
        "Utente cancellato Correttamente",
        res.body,
        "Employee deleted correctly"
      );
      assert.end();
    });
});
