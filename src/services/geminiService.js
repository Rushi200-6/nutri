export async function callGemini(prompt) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const text = await response.text(); // IMPORTANT: text, not JSON
    return text;
  } catch (error) {
    console.error("Gemini call failed:", error);
    return null;
  }
}
