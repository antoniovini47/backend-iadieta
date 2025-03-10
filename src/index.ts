import fastify from "fastify";

const server = fastify();

server.get("/", async (request, reply) => {
  return { message: "Hello, Fastify!" };
});

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
