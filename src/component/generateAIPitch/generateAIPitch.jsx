export const generateAIPitch = async (idea) => {
    try {
        const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!API_KEY) throw new Error("API key not found");

        const prompt = `
        Startup idea: "${idea}"
        
        Generate valid JSON like this:
        {
          "name": "",
          "tagline": "",
          "pitch": "",
          "audience": "",
          "landingPage": ""
        }
        
        Rules:
        - Respond ONLY in valid JSON format.
        - "landingPage" must include a full responsive HTML + CSS landing page inside a <style> tag.
        - No Markdown, no explanation, just JSON.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "mistralai/mixtral-8x7b-instruct",
                messages: [
                    { role: "system", content: "You are a JSON-only startup pitch generator." },
                    { role: "user", content: prompt },
                ],
            }),
        });

        const data = await response.json();
        const aiText = data?.choices?.[0]?.message?.content || "";

        const cleanText = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let json;
        try {
            json = JSON.parse(cleanText);
        } catch (e) {
            console.error("JSON parse failed:", e);
            json = {};
        }

        return {
            name: json.name || idea,
            tagline: json.tagline || "Generated tagline",
            pitch: json.pitch || "Generated pitch description",
            audience: json.audience || "General audience",
            landingPage: json.landingPage || "<p>Landing page content not generated</p>",
        };
    } catch (err) {
        console.error("AI generation error:", err);
        return {
            name: idea,
            tagline: "Generated tagline",
            pitch: "Generated pitch description",
            audience: "General audience",
            landingPage: "<p>Landing page content not generated</p>",
        };
    }
};
