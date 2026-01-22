export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const apiKey = process.env.nutriapi; // your Vercel variable name

    if (!apiKey) {
      return res.status(500).send("API Key missing in Vercel");
    }

    const { prompt } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).send("No response from Gemini");
    }

    // IMPORTANT: send plain text (not JSON) to avoid mobile black screen
    res.status(200).send(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).send("AI Service Failed");
  }
}
