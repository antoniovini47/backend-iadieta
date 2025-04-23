import axios from "axios";
import { GEMINI_API_KEY, BASE_API_URL, GEMINI_MODEL } from "../utils/geminiEnv";

// const promptStandardFreeUser =
//   "This is a picture of a meal. Estimate the amount of kcal on picture and return the result in form of a json in that format: {k: x}, where x is a int for the amount of kcal.";
const promptStandardPremiumUser =
  'This is a picture of a meal. Estimate the amount of kcal and grams of proteins and return the result in form of a json in that EXACT format: {"k": x, "p": y, "m": z} without changes any symbol, where x is a int for the amount of kcal, y is a int for the amount of proteins and z is a boolean that says if the picture is a meal and was sucessful analyzed (true) or is not a picture of a meal (false).';

const promptDefined = promptStandardPremiumUser; // ! TODO: Do Check if the user is premium or not

const urlImageAPI = `${BASE_API_URL}/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const GeminiService = {
  getImageResponse: async (image64Base: string) => {
    try {
      const response = await axios.post(
        urlImageAPI,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: promptDefined,
                },
                {
                  inline_data: {
                    mime_type: "image/jpg",
                    data: image64Base,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );
      console.log(response.data.candidates[0].content.parts[0].text);
      const rawResponse = response.data.candidates[0].content.parts[0].text;
      console.log("rawResponse: ", rawResponse);
      const jsonString = rawResponse.replace(/```json\n|\n```/g, "");
      console.log("jsonString: ", jsonString);
      const jsonReponse = JSON.parse(jsonString);
      console.log("jsonReponse: ", jsonReponse);
      return jsonReponse;
    } catch (error) {
      throw error;
    }
  },
};

export default GeminiService;
