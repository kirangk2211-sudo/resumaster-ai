
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, TailorResult } from "../types";

// Always initialize the client with the API key from environment variables.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("WARNING: API_KEY is missing. AI features will not work until you add your key to a .env file.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });

// Enhance text for professional resumes
export const enhanceText = async (text: string, context: 'summary' | 'experience' | 'skills' | 'generic') => {
  if (!apiKey) return text;
  if (!text.trim()) return text;

  const prompt = context === 'summary' 
    ? `Enhance this professional summary for a resume. Keep it professional, impactful, and under 50 words: "${text}"`
    : context === 'experience'
    ? `Rewrite this job description into 3-4 impactful bullet points using action verbs and quantifiable achievements: "${text}"`
    : context === 'skills'
    ? `Format these as a list of professional technical skills: "${text}"`
    : `Rewrite this resume text to be more professional: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const resultText = response.text;
    return resultText ? resultText.trim().replace(/^["']|["']$/g, '') : text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
};

// Process conversational commands to update resume data
export const processChatCommand = async (command: string, currentData: ResumeData): Promise<{ updatedData: ResumeData, message: string }> => {
  if (!apiKey) {
    return { updatedData: currentData, message: "AI features are disabled because the API Key is missing." };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional resume co-pilot. The user wants to update their resume. 
      CURRENT DATA: ${JSON.stringify(currentData)}
      USER COMMAND: "${command}"
      
      If the user is providing new information (e.g., "Add a job at Google"), update the JSON. 
      If the user is asking a question, provide a helpful answer in the 'message' field.
      
      Always return JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            updatedData: { type: Type.OBJECT, properties: {
              personalInfo: { type: Type.OBJECT, properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                website: { type: Type.STRING },
                location: { type: Type.STRING },
                summary: { type: Type.STRING }
              }},
              experiences: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                id: { type: Type.STRING },
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.STRING },
                isCurrent: { type: Type.BOOLEAN }
              }}},
              projects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                link: { type: Type.STRING },
                description: { type: Type.STRING }
              }}},
              educations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                id: { type: Type.STRING },
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                grade: { type: Type.STRING }
              }}},
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              hobbies: { type: Type.ARRAY, items: { type: Type.STRING } }
            }},
            message: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      return { updatedData: currentData, message: "I couldn't generate a response. Please try again." };
    }
    
    const output = JSON.parse(resultText);
    return {
      updatedData: output.updatedData || currentData,
      message: output.message || "I've updated your resume details."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { updatedData: currentData, message: "I encountered an error updating your resume." };
  }
};

// Analyze resume against job description
export const tailorResume = async (resume: ResumeData, jobDescription: string): Promise<TailorResult> => {
  if (!apiKey) {
    return { matchScore: 0, suggestions: ["API Key missing. Cannot analyze."], missingKeywords: [] };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Compare this resume against the following job description.
      RESUME: ${JSON.stringify(resume)}
      JOB DESCRIPTION: "${jobDescription}"
      
      Provide a match score (0-100), suggestions for improvement, and missing keywords.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["matchScore", "suggestions", "missingKeywords"]
        }
      }
    });
    
    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }
    
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { matchScore: 0, suggestions: ["Error analyzing job description."], missingKeywords: [] };
  }
};

// Parse uploaded resume files (PDF/Images)
export const parseResumeWithAI = async (base64Data: string, mimeType: string): Promise<ResumeData | null> => {
  if (!apiKey) {
    alert("API Key is missing. Please check your .env file.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: "Extract all professional information from this resume into the structured JSON format provided. Be as detailed as possible, especially with experience bullet points." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: { type: Type.OBJECT, properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              website: { type: Type.STRING },
              location: { type: Type.STRING },
              summary: { type: Type.STRING }
            }},
            experiences: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
              id: { type: Type.STRING },
              company: { type: Type.STRING },
              role: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              description: { type: Type.STRING },
              isCurrent: { type: Type.BOOLEAN }
            }}},
            projects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              link: { type: Type.STRING },
              description: { type: Type.STRING }
            }}},
            educations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
              id: { type: Type.STRING },
              school: { type: Type.STRING },
              degree: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              grade: { type: Type.STRING }
            }}},
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            hobbies: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return null;
    return JSON.parse(resultText.trim()) as ResumeData;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
