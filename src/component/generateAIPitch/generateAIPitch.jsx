export const generateAIPitch = async (idea) => {
    try {
        const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!API_KEY) throw new Error("API key not found");

        const prompt = `Startup idea: "${idea}"
        Generate JSON:
        {
          "name": "",
          "tagline": "",
          "pitch": "",
          "audience": "",
          "landingPage": ""
        }
        Respond ONLY in valid JSON.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "user", content: prompt },
                ],
            }),
        });

        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content || "";

        // Try to extract JSON from the response text
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        let json = {};

        if (jsonMatch) {
            try {
                json = JSON.parse(jsonMatch[0]);
            } catch (err) {
                console.warn("Failed to parse JSON from AI response");
            }
        }

        return {
            name: json.name || idea,
            tagline: json.tagline || "Generated tagline",
            pitch: json.pitch || "Generated pitch description",
            audience: json.audience || "General audience",
            landingPage: json.landingPage || "Landing page content not generated",
        };
    } catch (err) {
        console.error("AI generation error:", err);
        return {
            name: idea,
            tagline: "Generated tagline",
            pitch: "Generated pitch description",
            audience: "General audience",
            landingPage: "Landing page content not generated",
        };
    }
};
