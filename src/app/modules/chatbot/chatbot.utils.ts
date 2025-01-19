import OpenAI from "openai";
import dotenv from "dotenv";
import { ChatHistory } from "./chatHistory.model";
dotenv.config();

class TextAgent {
  private openai: OpenAI;


  constructor() {
    const apiKey = process.env.OPEN_AI_API_KEY_VDOC;

    if (!apiKey) {
      throw new Error("OpenAI API key is missing. Please check your .env file.");
    }

    this.openai = new OpenAI({ apiKey });
  }


  async getDoctorAssistResponse(prompt: string, context?: string): Promise<string> {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error("Prompt must be a non-empty string.");
    }

    try {
        const systemMessage = `Sei un dottore virtuale. Rispondi sempre in italiano. Assisti gli utenti con le loro domande mediche.${
          context ? ` Ecco un riepilogo della conversazione finora: ${context}` : ""
        }`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt.trim() },
        ],
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Failed to get a valid response from OpenAI.");
      }
      return content.trim();
    } catch (error) {
      console.error("OpenAI API Error:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to get a response from OpenAI.");
      } else {
        throw new Error("Failed to get a response from OpenAI.");
      }
    }
  }


  

  
  async summarizeChatHistory(chatId: string): Promise<string> {
    if (!chatId) {
      throw new Error("Chat ID is required.");
    }

    try {
      // Fetch the chat history from the database
      const chatHistory = await ChatHistory.findById(chatId);
      if (!chatHistory) {
        throw new Error("Chat history not found.");
      }

      // Format chat history for summarization
      const historyText = chatHistory.chat_contents
        .map((msg) => `${msg.sent_by}: ${msg.text_content}`)
        .join("\n");

      const systemMessage = "Riassumi la seguente conversazione in modo conciso in italiano.";

      // Call OpenAI API for summarization
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: historyText },
        ],
      });

      const content = completion.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Failed to get a valid response from OpenAI.");
      }
      return content.trim();
    } catch (error) {
      console.error("Error in summarizeChatHistory:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to summarize chat history.");
      } else {
        throw new Error("Failed to summarize chat history.");
      }
    }
  }
}

export default TextAgent;






// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// class TextAgent {
//   private openai: OpenAI;

//   constructor() {
//     const apiKey = process.env.OPEN_AI_API_KEY_VDOC;

//     if (!apiKey) {
//       throw new Error("OpenAI API key is missing. Please check your .env file.");
//     }

//     this.openai = new OpenAI({ apiKey });
//   }



//   async getDoctorAssistResponse(userInputPrompt: string) {
//     if (!userInputPrompt || typeof userInputPrompt !== "string" || userInputPrompt.trim() === "") {
//       throw new Error("userInputPrompt must be a non-empty string.");
//     }

//     try {
//       const systemMessage = "Sei un dottore virtuale. Rispondi sempre in italiano. Assisti gli utenti con le loro domande mediche.";

//       const completion = await this.openai.chat.completions.create({
//         model: "gpt-4",
//         messages: [
//           { role: "system", content: systemMessage },
//           { role: "user", content: userInputPrompt.trim() },
//         ],
//       });

//       const response = completion.choices?.[0]?.message?.content;
//       if (!response) {
//         throw new Error("Failed to get a valid response from OpenAI.");
//       }
//       return response.trim();
//     } catch (error) {
//       console.error("OpenAI API Error:", error);
//       if (error instanceof Error) {
//         throw new Error(error.message || "Failed to get a response from OpenAI.");
//       } else {
//         throw new Error("Failed to get a response from OpenAI.");
//       }
//     }
//   }
// }

// export default TextAgent;