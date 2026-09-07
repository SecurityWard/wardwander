# WardWander

Source for [wardwander.com](https://wardwander.com). Built with [Astro](https://astro.build) and the [AstroPaper](https://github.com/satnaing/astro-paper) theme, deployed to Cloudflare Workers as static assets.

## Writing a post

Add a Markdown file to `src/content/posts/`. Frontmatter:

```yaml
---
title: "Post title"
description: "One or two sentences. Used for SEO and the post card."
pubDatetime: 2026-09-07T12:00:00-04:00
tags: ["security", "deception"]
draft: false
---
```

Set `draft: true` to keep a post out of the build. Set `featured: true` to pin it to the home page. Images go in `src/assets/images/` and are referenced as `![alt](@/assets/images/name.png)`.

Push to `main` and Cloudflare rebuilds the site.

## Local

```
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Deploy

Cloudflare Workers, connected to this repo. Build command `npm run build`, deploy command `npx wrangler deploy`. Config lives in `wrangler.jsonc`.
