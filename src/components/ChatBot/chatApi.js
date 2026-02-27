import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.0-flash";

export async function askCodeMate(messages) {
  try {
    const systemParts = messages
      .filter((msg) => msg.role === "system")
      .map((msg) => msg.content);
    
    const systemInstruction = systemParts.join("\n\n");

    const conversation = messages.filter((msg) => msg.role !== "system");
    
    const lastMessage = conversation.pop(); 

    const history = conversation.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemInstruction,
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.3,
      },
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    
    return response.text();
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Error connecting to Gemini API.");
  }
}