export default async function handler(req,res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "REPLICATE_API_TOKEN is not configured in Vercel." });
  try {
    const { prompt, aspectRatio = "16:9" } = req.body || {};
    if (!prompt || !String(prompt).trim()) return res.status(400).json({ error: "Prompt is required." });
    const response = await fetch("https://api.replicate.com/v1/models/wavespeedai/wan-2.1-t2v-480p/predictions", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ input: { prompt: String(prompt).slice(0, 10000), aspect_ratio: aspectRatio, sample_shift: 5 } })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.detail || data?.error || "Replicate request failed." });
    return res.status(200).json({ id: data.id, status: data.status || "starting" });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Generation request failed." });
  }
}