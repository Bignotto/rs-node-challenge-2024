import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const meals = await knex("meals").where("user_id", sessionId).select();
      return meals;
    },
  );

  app.get(
    "/:meal_id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealParamSchema = z.object({
        meal_id: z.coerce.number(),
      });

      const { meal_id } = getMealParamSchema.parse(request.params);
      const { sessionId } = request.cookies;

      const meal = await knex("meals")
        .where({
          user_id: sessionId,
          id: meal_id,
        })
        .first();

      return meal;
    },
  );

  app.post(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        date_time: z.coerce.date().default(new Date()),
        on_diet: z.boolean(),
        user_id: z.string().optional(),
      });

      const { title, description, date_time, on_diet, user_id } =
        createMealBodySchema.parse(request.body);

      const { sessionId } = request.cookies;

      await knex("meals").insert({
        title,
        description,
        date_time,
        on_diet,
        user_id: sessionId,
      });

      return reply.status(201).send();
    },
  );

  app.patch(
    "/:meal_id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealParamSchema = z.object({
        meal_id: z.coerce.number(),
      });
      const { meal_id } = getMealParamSchema.parse(request.params);

      const createMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        date_time: z.coerce.date().default(new Date()),
        on_diet: z.boolean(),
      });

      const { title, description, date_time, on_diet } =
        createMealBodySchema.parse(request.body);

      await knex("meals")
        .where({
          id: meal_id,
        })
        .update({
          title,
          description,
          date_time,
          on_diet,
        });
    },
  );

  app.delete(
    "/:meal_id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealParamSchema = z.object({
        meal_id: z.coerce.number(),
      });
      const { meal_id } = getMealParamSchema.parse(request.params);

      await knex("meals")
        .where({
          id: meal_id,
        })
        .delete();
    },
  );
}
