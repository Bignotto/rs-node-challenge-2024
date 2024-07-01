import { FastifyInstance } from "fastify";
import knex from "knex";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function summaryRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const meals = await knex("meals")
        .where({
          user_id: sessionId,
        })
        .select();

      const mealsTotal = meals.length;
      const onDietMealsTotal = meals.filter((m) => m.on_diet === true);
      const offDietMealsTotal = meals.filter((m) => m.on_diet === false);

      return {
        mealsTotal,
        onDietMealsTotal,
        offDietMealsTotal,
      };
    },
  );
}
