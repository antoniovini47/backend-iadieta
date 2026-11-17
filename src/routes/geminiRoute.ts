import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import GeminiService from "../services/geminiService";
import PhotoStorage from "../services/photoStorage";

const geminiRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/analyze", async (request: FastifyRequest, reply: FastifyReply) => {
    const { image64Base } = request.body as { image64Base: string };

    if (!image64Base) {
      return reply.status(400).send({ error: "image64Base is required" });
    }

    const [photo, analysis] = await Promise.allSettled([
      PhotoStorage.save(image64Base),
      GeminiService.getImageResponse(image64Base),
    ]);

    const photoPath = photo.status === "fulfilled" ? photo.value : null;
    if (photo.status === "rejected") {
      request.log.warn({ err: (photo.reason as Error).message }, "photo not stored");
    }

    if (analysis.status === "rejected") {
      request.log.error({ photo: photoPath, err: (analysis.reason as Error).message }, "gemini request failed");
      return reply.status(500).send({ error: "Internal Server Error" });
    }

    request.log.info({ photo: photoPath, result: analysis.value }, "image analyzed");
    return reply.send(analysis.value);
  });
};

export default geminiRoutes;
