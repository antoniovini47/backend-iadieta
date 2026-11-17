import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import PhotoStorage from "../services/photoStorage";

const cronRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/cron/purge-photos", async (request: FastifyRequest, reply: FastifyReply) => {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.authorization !== `Bearer ${secret}`) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const removed = await PhotoStorage.purgeExpired();
    request.log.info({ removed }, "expired photos purged");
    return reply.send({ removed });
  });
};

export default cronRoutes;
