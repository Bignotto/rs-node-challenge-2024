import cookie from "@fastify/cookie";
import fastify from "fastify";

import { env } from "./env";
import { mealsRoutes } from "./routes/meals";
import { transactionsRoutes } from "./routes/transactions";
import { usersRoutes } from "./routes/users";

export const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "transactions",
});

app.register(usersRoutes, {
  prefix: "users",
});

app.register(mealsRoutes, {
  prefix: "meals",
});

app.get("/", async (request, reply) => {
  return reply.status(200).send({
    app: env.THE_APP_NAME,
    ver: "0.0.1",
  });
});
