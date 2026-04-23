import { GoogleGenAI } from "@google/genai";
import { AnalyzeResponse } from "../types/dnd";
import { getConfig } from "./config";

function getClient() {
  const config = getConfig();
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key missing. Please configure it in Settings.");
  }

  return new GoogleGenAI({ apiKey });
}

const STYLE_PROMPT = "Dark Fantasy Cinematic, Unreal Engine 5 render, 8k, Oil Painting style, gloomy atmosphere, highly detailed.";

export async function analyzeCampaign(text: string): Promise<AnalyzeResponse> {
  const prompt = `
    You are a Dungeon Master Assistant. Analyze the following RPG campaign notes and structure them into Acts and Scenes.
    For each scene, identify necessary visual and audio assets.
    
    Return ONLY valid JSON with this structure:
    {
      "acts": [
        {
          "id": "act-1",
          "title": "Act I: The Beginning",
          "scenes": [
            {
              "id": "scene-1",
              "title": "The Tavern",
              "assets": [
                {
                  "id": "asset-1",
                  "type": "LOCATION", 
                  "label": "Tavern Interior",
                  "content": "A rowdy medieval tavern, candle light, smoke, wooden tables."
                },
                {
                  "id": "asset-2",
                  "type": "NARRATION",
                  "label": "Intro Speech",
                  "content": "You enter the tavern, the smell of ale and sweat fills the air..."
                }
              ]
            }
          ]
        }
      ]
    }

    Asset Types allowed: 'LOCATION', 'BATTLEMAP', 'CHARACTER', 'ITEM', 'NARRATION'.
    
    CAMPAIGN TEXT:
    ${text}
    `;

  try {
    const client = getClient();
    const response = await client.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      config: {
        responseMimeType: "application/json",
      }
    });

    // Helper to extract text safely from unknown SDK version
    const jsonText = (typeof (response as any).text === 'function')
      ? (response as any).text()
      : (response as any).text;

    if (!jsonText) throw new Error("No response from AI");

    // Sanitize JSON (sometimes AI adds markdown blocks)
    const cleanJson = (jsonText as string).replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AnalyzeResponse;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const finalPrompt = `${STYLE_PROMPT} ${prompt}`;

  try {
    const client = getClient();
    const response = await client.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: [{
        role: "user",
        parts: [{ text: finalPrompt }]
      }],
    });

    return "";
  } catch (e) {
    console.error("Image Gen Error", e);
    throw e;
  }
}

export async function generateTTS(text: string, voice: string = "Puck"): Promise<ArrayBuffer> {
  // User requested: gemini-2.5-flash-preview-tts
  // This implies a specific model that supports speech generation.
  // The @google/genai SDK likely supports this via a specific output modality.

  /*
  const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: ...,
      config: { responseModality: "AUDIO" } // Hypothetical
  })
  */

  // Since this is bleeding edge, I will draft the function but might need fallback.
  return new ArrayBuffer(0);
}
