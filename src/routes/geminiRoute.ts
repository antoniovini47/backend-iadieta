import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import GeminiService from "../services/geminiService";

const geminiRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/analyze", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { image64Base } = request.body as { image64Base: string };

      if (!image64Base) {
        return reply.status(400).send({ error: "image64Base is required" });
      }

      const response = await GeminiService.getImageResponse(image64Base);
      return reply.send(response);
    } catch (error) {
      console.error("Error processing Gemini API request: ", (error as Error).message);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
};

export default geminiRoutes;
