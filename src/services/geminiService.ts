import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAthleteAnalysis(athleteData: {
  name: string;
  gender: string;
  scores: Array<{ subject: string; score: number; level: string }>;
  overallScore: number;
}) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `אתה מאמן קרוספיט בכיר בקרוספיט קרית גת. נתח את הנתונים הבאים של המתאמן/ת וספק דוח מקצועי, מעודד וממוקד במטרות.
      שם: ${athleteData.name}
      מגדר: ${athleteData.gender === 'male' ? 'גבר' : 'אישה'}
      ציון כללי: ${athleteData.overallScore}/100
      
      ציונים לפי תחומים:
      ${athleteData.scores.map(s => `- ${s.subject}: ${s.score}% (רמה: ${s.level})`).join('\n')}
      
      הוראות:
      1. ספק פסקת סיכום קצרה ומניעה.
      2. ציין 2-3 נקודות חוזק בולטות.
      3. בחר את התחום הכי חלש וספק 3 טיפים פרקטיים לשיפור.
      4. התשובה צריכה להיות בעברית מקצועית ומעודדת.
      5. פלט בפורמט JSON בלבד.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknessArea: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            motivationalQuote: { type: Type.STRING }
          },
          required: ["summary", "strengths", "weaknessArea", "tips", "motivationalQuote"]
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}
