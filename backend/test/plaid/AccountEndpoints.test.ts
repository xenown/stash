import { request } from "supertest";
import { expect } from "chai";
import { app } from "../../src/index.ts";

describe("API Tests", function () {
  describe("GET /health", function () {
    it("should return 200 and status ok", async function () {
      const res = await request(app).get("/health");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ status: "ok" });
    });
  });

  describe("POST /users", function () {
    it("should create a user when name is provided", async function () {
      const res = await request(app).post("/users").send({ name: "Alice" });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("id");
      expect(res.body.name).to.equal("Alice");
    });

    it("should return 400 when name is missing", async function () {
      const res = await request(app).post("/users").send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Name is required");
    });
  });
});
