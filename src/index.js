import { analyzeFeedback } from "./ai/analyzeFeedback.js";
import {
  insertFeedback,
  listFeedback,
  summarizeNegative
} from "./db/feedbackRepo.js";
import { todayKey } from "./utils/date.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/feedback") {
      return ingest(request, env);
    }

    if (request.method === "GET" && url.pathname === "/feedback") {
      return Response.json(await listFeedback(env));
    }

    if (request.method === "GET" && url.pathname === "/summary") {
      return getSummary(env);
    }

    return new Response("SignalHub running", { status: 200 });
  }
};

async function ingest(request, env) {
  const { source, content } = await request.json();

  const analysis = await analyzeFeedback(env, content);

  await insertFeedback(env, {
    source,
    content,
    sentiment: analysis.sentiment,
    theme: analysis.theme
  });

  await env.SUMMARY_KV.delete(todayKey());

  return Response.json({ ok: true });
}

async function getSummary(env) {
  const key = todayKey();

  const cached = await env.SUMMARY_KV.get(key);
  if (cached) {
    return Response.json(JSON.parse(cached));
  }

  const data = await summarizeNegative(env);

  const summary = {
    date: key.replace("summary-", ""),
    top_negative_themes: data
  };

  await env.SUMMARY_KV.put(key, JSON.stringify(summary), {
    expirationTtl: 86400
  });

  return Response.json(summary);
}
