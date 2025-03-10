import fastify from "fastify";
import geminiRoutes from "./routes/geminiRoute";

const server = fastify({ logger: true });

server.register(geminiRoutes);

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
