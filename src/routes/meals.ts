import { FastifyInstance } from "fastify";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    return {
      route: "/meals",
      message: "everything fine",
    };
  });
}
