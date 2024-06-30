import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    return {
      route: "/user",
      message: "everyfhing fine",
    };
  });
}
