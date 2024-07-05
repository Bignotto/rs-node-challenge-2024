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

  it("should be able to list a users meals", async () => {
    const createUser1Response = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies1 = createUser1Response.get("Set-Cookie")!;

    await request(app.server).post("/meals").set("Cookie", cookies1).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    await request(app.server).post("/meals").set("Cookie", cookies1).send({
      title: "BBQ",
      description: "Smoked BBQ ribs.",
      on_diet: true,
    });

    const createUser2Response = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies2 = createUser2Response.get("Set-Cookie")!;

    await request(app.server).post("/meals").set("Cookie", cookies2).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    const listUser1MealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies1)
      .expect(200);

    expect(listUser1MealsResponse.body).toHaveLength(2);

    const listUser2MealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies2)
      .expect(200);

    expect(listUser2MealsResponse.body).toHaveLength(1);
  });

  it("should be able to view a single meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies = createUserResponse.get("Set-Cookie")!;

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    const listUserMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies);

    const mealId = listUserMealsResponse.body[0].id;
    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealResponse.body).toEqual({
      id: 1,
      description: "Smoked BBQ burger with cheese.",
      title: "Burger",
      date_time: listUserMealsResponse.body[0].date_time,
      on_diet: 1,
      user_id: listUserMealsResponse.body[0].user_id,
    });
  });

  it("should be able to delete a meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies = createUserResponse.get("Set-Cookie")!;

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    const mealResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = mealResponse.body[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    const postDeleteMealResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    expect(postDeleteMealResponse.body).toHaveLength(0);
  });

  it("should be able to update a meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies = createUserResponse.get("Set-Cookie")!;

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    const mealResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = mealResponse.body[0].id;

    await request(app.server)
      .patch(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .send({
        title: "Salad",
        description: "Girly Green Salad",
        date_time: mealResponse.body[0].date_time,
        on_diet: true,
      })
      .expect(200);

    const postUpdateMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(postUpdateMealResponse.body).toEqual({
      id: 1,
      description: "Girly Green Salad",
      title: "Salad",
      date_time: mealResponse.body[0].date_time,
      on_diet: 1,
      user_id: mealResponse.body[0].user_id,
    });
  });

  it("should be able to view meals summary", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "Zé da Silva", email: "emaildoze@gmail.com" });

    const cookies = createUserResponse.get("Set-Cookie")!;

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: false,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: false,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: false,
    });

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      title: "Burger",
      description: "Smoked BBQ burger with cheese.",
      on_diet: true,
    });

    const summaryResponse = await request(app.server)
      .get("/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body).toEqual({
      mealsTotal: 8,
      onDietMealsTotal: 5,
      offDietMealsTotal: 3,
      bestStreak: 2,
    });
  });
}); //describe
