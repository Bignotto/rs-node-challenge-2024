import cookie from "@fastify/cookie";
import fastify from "fastify";

import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "transactions",
});

app.get("/", async (request, reply) => {
  return reply.status(200).send({
    app: env.THE_APP_NAME,
    ver: "0.0.1",
  });
});
