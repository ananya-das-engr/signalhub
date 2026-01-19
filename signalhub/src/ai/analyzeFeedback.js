export async function analyzeFeedback(env, content) {
  const result = await env.AI.run(
    "@cf/meta/llama-3-8b-instruct",
    {
      messages: [
        {
          role: "system",
          content:
            "Analyze the feedback and return JSON with fields: sentiment (Positive|Neutral|Negative) and theme (Performance|Pricing|Docs|Reliability|Other)."
        },
        {
          role: "user",
          content
        }
      ]
    }
  );

  try {
    return JSON.parse(result.response);
  } catch {
    return {
      sentiment: "Neutral",
      theme: "Other"
    };
  }
}
