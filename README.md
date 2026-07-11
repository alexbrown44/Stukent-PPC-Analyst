<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/45c31138-a8d3-497c-9154-b1987632ed21

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Render

This repo includes a [render.yaml](render.yaml) Blueprint and a working `Dockerfile`, so deployment is:

1. In the Render dashboard, click **New > Blueprint** and select this repo.
2. Render will detect `render.yaml` and provision a Docker-based web service automatically.
3. When prompted (or afterward, under the service's **Environment** tab), set `GEMINI_API_KEY` to your Gemini API key. This is a real secret — Render has no equivalent to GCP's workload identity auto-injection, so it must be set explicitly.
4. Deploy. The service listens on `PORT` (defaults to `8080`, already set in `render.yaml`) and serves the built app from `dist/`.
