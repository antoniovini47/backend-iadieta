import fastify from "fastify";
import geminiRoutes from "./routes/geminiRoute";

const server = fastify({ logger: true });

server.register(geminiRoutes);

server.get("/", async (request, reply) => {
  return reply.send({ message: "API is running..." });
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log(`Server running...`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
