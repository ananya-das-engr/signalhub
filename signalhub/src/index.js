import { analyzeFeedback } from "./ai/analyzeFeedback";
import {
  insertFeedback,
  listFeedback,
  summarizeNegative
} from "./db/feedbackRepo";
import { todayKey } from "./utils/date";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/feedback") {
      return handleIngest(request, env);
    }

    if (request.method === "GET" && url.pathname === "/feedback") {
      return handleList(env);
    }

    if (request.method === "GET" && url.pathname === "/summary") {
      return handleSummary(env);
    }

    return new Response("SignalHub running", { status: 200 });
  }
};

async function handleIngest(request, env) {
  const { source, content } = await request.json();

  const analysis = await analyzeFeedback(env, content);

  await insertFeedback(env, {
    source,
    content,
    sentiment: analysis.sentiment,
    theme: analysis.theme
  });

  // Invalidate cached daily summary
  await env.SUMMARY_KV.delete(todayKey());

  return Response.json({ success: true });
}

async function handleList(env) {
  const results = await listFeedback(env);
  return Response.json(results);
}

async function handleSummary(env) {
  const key = todayKey();

  const cached = await env.SUMMARY_KV.get(key);
  if (cached) {
    return Response.json(JSON.parse(cached));
  }

  const summary = await summarizeNegative(env);

  const response = {
    date: key.replace("summary-", ""),
    top_negative_themes: summary
  };

  await env.SUMMARY_KV.put(key, JSON.stringify(response), {
    expirationTtl: 86400
  });

  return Response.json(response);
}
