import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";

const BG = "#100f0d";
const INK = "#d8ccb0";
const DIM = "#8d8168";
const AMBER = "#d9953c";

type CardOptions = {
  title: string;
  subtitle?: string;
  footerLeft: string;
  footerRight: string;
  url: URL;
};

async function loadFonts(url: URL) {
  const display = fontData["--font-display"];
  const body = fontData["--font-body"];
  const displayPath = getFontPathByWeight(display, 400, { format: "woff" });
  const displayItalicPath = getFontPathByWeight(display, 400, {
    format: "woff",
    style: "italic",
  });
  const bodyPath = getFontPathByWeight(body, 400, { format: "woff" });
  if (!displayPath || !displayItalicPath || !bodyPath) {
    throw new Error("Cannot find the font path.");
  }
  const load = (p: string) =>
    fetch(experimental_getFontFileURL(p, url)).then(r => r.arrayBuffer());
  const [displayData, displayItalicData, bodyData] = await Promise.all([
    load(displayPath),
    load(displayItalicPath),
    load(bodyPath),
  ]);
  return [
    {
      name: "IM Fell English",
      data: displayData,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "IM Fell English",
      data: displayItalicData,
      weight: 400 as const,
      style: "italic" as const,
    },
    {
      name: "EB Garamond",
      data: bodyData,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

export async function renderOgCard(opts: CardOptions): Promise<Buffer> {
  const fonts = await loadFonts(opts.url);
  const titleSize =
    opts.title.length > 48 ? 56 : opts.title.length > 28 ? 68 : 84;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          background: BG,
          padding: "44px",
          fontFamily: "EB Garamond",
          color: INK,
        },
        children: {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              border: `2px solid ${AMBER}`,
              padding: "56px 64px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "IM Fell English",
                          fontSize: titleSize,
                          lineHeight: 1.05,
                          color: INK,
                          maxHeight: "300px",
                          overflow: "hidden",
                        },
                        children: opts.title,
                      },
                    },
                    opts.subtitle
                      ? {
                          type: "div",
                          props: {
                            style: {
                              fontFamily: "IM Fell English",
                              fontStyle: "italic",
                              fontSize: 34,
                              marginTop: 24,
                              color: DIM,
                            },
                            children: opts.subtitle,
                          },
                        }
                      : null,
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 28,
                    color: DIM,
                  },
                  children: [
                    { type: "span", props: { children: opts.footerLeft } },
                    {
                      type: "span",
                      props: {
                        style: { fontFamily: "IM Fell English", color: AMBER },
                        children: opts.footerRight,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    { width: 1200, height: 630, embedFont: true, fonts }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
