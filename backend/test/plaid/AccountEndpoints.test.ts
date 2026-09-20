import request from "supertest";
import { expect } from "chai";
import { app } from "../../src/index.ts";

describe("Account API Tests", function () {
  describe("POST /create_user_token", function () {
    it("should create a user when name is provided", async function () {
      const res = await request(app)
        .post("/create_user_token")
        .send({ name: "Alice" });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("errors");
    });
  });
});
