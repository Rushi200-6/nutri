export const callGemini = async (prompt) => {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Analysis failed");

  return data.result;
};