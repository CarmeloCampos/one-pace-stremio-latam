import { load, type CheerioAPI } from "cheerio";

export async function oneCheerio(lang: "en" | "es"): Promise<CheerioAPI> {
  const onePaceURL = `https://onepace.net/${lang}/watch`;

  const getHTML = await fetch(onePaceURL).then((res) => res.text());

  return load(getHTML);
}
