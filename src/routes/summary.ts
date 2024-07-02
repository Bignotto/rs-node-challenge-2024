import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function summaryRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const meals = await knex("meals").where("user_id", sessionId).select();

      const mealsTotal = meals.length;
      const onDietMealsTotal = meals.filter((m) => !!m.on_diet === true).length;
      const offDietMealsTotal = meals.filter(
        (m) => !!m.on_diet === false,
      ).length;

      let streak = 0;
      let bestStreak = 0;
      for (let i = 0; i < meals.length; i++) {
        console.log({ i, streak, bestStreak });
        if (!!meals[i].on_diet === false) {
          bestStreak = streak > bestStreak ? streak : bestStreak;
          streak = 0;
          continue;
        }
        streak++;
      }

      return {
        mealsTotal,
        onDietMealsTotal,
        offDietMealsTotal,
        bestStreak: streak > bestStreak ? streak : bestStreak,
      };
    },
  );
}
