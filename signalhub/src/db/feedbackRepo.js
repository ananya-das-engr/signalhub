export async function insertFeedback(env, data) {
  return env.DB.prepare(
    `
    INSERT INTO feedback (source, content, sentiment, theme)
    VALUES (?, ?, ?, ?)
    `
  )
    .bind(
      data.source,
      data.content,
      data.sentiment,
      data.theme
    )
    .run();
}

export async function listFeedback(env) {
  const { results } = await env.DB.prepare(
    `
    SELECT *
    FROM feedback
    ORDER BY created_at DESC
    LIMIT 50
    `
  ).all();

  return results;
}

export async function summarizeNegative(env) {
  const { results } = await env.DB.prepare(
    `
    SELECT theme, COUNT(*) as count
    FROM feedback
    WHERE sentiment = 'Negative'
    GROUP BY theme
    ORDER BY count DESC
    `
  ).all();

  return results;
}
