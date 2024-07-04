import { execSync } from "child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../app";

describe("Meals routes", () => {
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

  it("should be able to create a new meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies = createUserResponse.get("Set-Cookie")!;

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        title: "Burger",
        description: "Smoked BBQ burger with cheese.",
        on_diet: true,
      })
      .expect(201);
  });
});
