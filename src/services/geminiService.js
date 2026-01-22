export async function callGemini(prompt) {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      console.error("HTTP Error:", res.status);
      return null;
    }

    const data = await res.json();   // IMPORTANT: parse JSON
    return data.result;              // backend sends { result: "..." }

  } catch (e) {
    console.error("Gemini call failed:", e);
    return null;
  }
}
