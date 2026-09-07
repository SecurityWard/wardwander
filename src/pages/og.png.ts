import type { APIRoute } from "astro";
import { renderOgCard } from "@/utils/ogCard";
import config from "@/config";

export const GET: APIRoute = async ({ url }) => {
  const png = await renderOgCard({
    title: "Ward & Wander",
    subtitle: config.site.description,
    footerLeft: config.site.author,
    footerRight: new URL(config.site.url).hostname,
    url,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
