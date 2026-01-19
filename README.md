# SignalHub

SignalHub is a small prototype built to explore how product teams could make sense of scattered customer feedback.

As a PM, I often see feedback come in from many places (support tickets, GitHub issues, social media), which makes it hard to quickly understand what’s urgent or part of a larger pattern. This project focuses on turning that noisy input into something easier to reason about.

## What the Prototype Does

- Accepts mock feedback from different sources
- Uses AI to tag feedback with sentiment and a rough theme
- Stores structured feedback for simple querying
- Generates a daily summary of negative themes

The prototype intentionally prioritizes insight extraction over UI polish.

## Cloudflare Products Used

- **Workers** – Core runtime and request handling  
- **Workers AI** – Sentiment and theme analysis  
- **D1** – Structured storage for feedback entries  
- **KV** – Caching daily summaries to avoid recomputation  

## Endpoints

- `POST /feedback` – Submit feedback
- `GET /feedback` – View recent feedback
- `GET /summary` – View daily negative-theme summary

## Notes

This project was scoped to fit a short prototyping exercise. Some parts are intentionally simplified, and all feedback sources use mock data.
