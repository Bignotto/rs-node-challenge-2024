import { execSync } from "child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../app";

describe("Users routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new user", async () => {
    const response = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" })
      .expect(201);

    const cookies = response.get("Set-Cookie");
    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining("sessionId")]),
    );
  });
});
