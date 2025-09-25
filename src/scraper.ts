import { oneCheerio } from "./one-cheerio";
import * as fs from "fs";
import * as crypto from "crypto";

// Interface para el archivo arcos.json
interface ArcoJson {
  name: string;
  link: string;
  additionalEpisodes?: string[];
  notes?: string;
}

// Interfaces para Pixeldrain API
interface PixeldrainFile {
  id: string;
  name: string;
  size: number;
  date_upload: string;
  mime_type: string;
}

interface PixeldrainListResponse {
  success: boolean;
  id: string;
  title: string;
  file_count: number;
  size: number;
  date_created: string;
  date_last_view: string;
  files: PixeldrainFile[];
}

const textIndexOnePace = {
  es: {
    sub: "Subtitulos en español",
    dub: "Doblaje en español",
  },
  en: {
    sub: "English Subtitles",
    dub: "English Dub",
  },
};

// Interfaces de tipado
export interface Quality {
  quality: string;
  url: string;
}

interface MediaType {
  qualities: Quality[];
}

interface ExtendedVersions {
  subtitle?: MediaType;
  dub?: MediaType;
}

interface Season {
  id: string;
  title: string;
  description: string;
  subtitle?: MediaType;
  dub?: MediaType;
  extended?: ExtendedVersions;
}

interface OnePaceData {
  textIndex: typeof textIndexOnePace;
  seasons: Season[];
  metadata: {
    totalSeasons: number;
    seasonsWithSubtitles: number;
    seasonsWithDub: number;
    seasonsWithExtended: number;
    extractedAt: string;
    language: "es" | "en";
  };
}

interface UnifiedOnePaceMetadata {
  totalSeasons: number;
  seasonsWithSubtitles: number;
  seasonsWithDub: number;
  seasonsWithExtended: number;
  extractedAt: string;
  language: "es" | "en";
  unifiedWithArcos: boolean;
  arcosFromJson: number;
  arcosFromScraper: number;
  arcosTotal: number;
  orderSource: string;
}

interface UnifiedOnePaceData {
  textIndex: typeof textIndexOnePace;
  seasons: Season[];
  metadata: UnifiedOnePaceMetadata;
}

// Funciones para cargar arcos del JSON
function loadArcosJson(): ArcoJson[] {
  try {
    const arcosPath = "./arcos.json";
    if (!fs.existsSync(arcosPath)) {
      console.warn("⚠️ Archivo arcos.json no encontrado");
      return [];
    }

    const content = fs.readFileSync(arcosPath, "utf-8");
    const arcos = JSON.parse(content) as ArcoJson[];
    console.log(`📋 Cargados ${arcos.length} arcos desde arcos.json`);
    return arcos;
  } catch (error) {
    console.error("❌ Error cargando arcos.json:", error);
    return [];
  }
}

// Mapeo de nombres para evitar duplicaciones
const NAME_MAPPING: Record<string, string> = {
  // Versiones alternativas que deben mapearse a la misma ID canónica
  "las-aventuras-de-los-piratas-de-buggy": "mini-historia-de-buggy",
  "el-diario-de-la-lucha-de-koby-meppo": "mini-historia-de-koby-y-meppo",
  "archipilago-sabaody": "sabaody", // Sin acento normalizado
  "si-fueras-a-salir-de-viaje-las-aventuras-de-los-sombrero-de-paja":
    "mini-historia-de-los-mugiwara",
  "whole-cake-island": "whole-cake",
  "pas-de-wa": "wano", // Sin acento normalizado
  "special-warship-island-01-april-fools-2025":
    "warship-island-01-april-fools-2025",
};
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[-\s]+/g, "-")
    .replace(/[^\w-]/g, "");
}

function getCanonicalId(title: string): string {
  const normalized = normalizeTitle(title);
  return NAME_MAPPING[normalized] || normalized;
}

// Funciones para manejar Pixeldrain
function extractPixeldrainId(url: string): string | null {
  // Admite tanto /u/ como /l/ para carpetas de Pixeldrain
  const match = url.match(/pixeldrain\.net\/[ul]\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

async function getPixeldrainFiles(folderId: string): Promise<string[]> {
  try {
    console.log(`🔍 Obteniendo archivos de carpeta Pixeldrain: ${folderId}`);

    const response = await fetch(`https://pixeldrain.net/api/list/${folderId}`);

    if (!response.ok) {
      console.error(
        `❌ Error al obtener lista de Pixeldrain: ${response.status}`
      );
      return [];
    }

    const data = (await response.json()) as PixeldrainListResponse;

    if (!data.success || !data.files) {
      console.error(`❌ Carpeta Pixeldrain no válida: ${folderId}`);
      return [];
    }

    // Filtrar solo archivos de video
    const videoFiles = data.files.filter(
      (file) =>
        file.mime_type.startsWith("video/") ||
        file.name.match(/\.(mp4|mkv|avi|mov|wmv|flv|webm)$/i)
    );

    console.log(
      `✅ Encontrados ${videoFiles.length} archivos de video en carpeta ${folderId}`
    );

    // Crear URLs de descarga directa
    return videoFiles.map(
      (file) => `https://pixeldrain.net/api/file/${file.id}`
    );
  } catch (error) {
    console.error(
      `❌ Error al procesar carpeta Pixeldrain ${folderId}:`,
      error
    );
    return [];
  }
}

async function processPixeldrainUrl(url: string): Promise<string[]> {
  // Si es una URL de archivo directo (pixeldrain.net/u/ o /api/file/), devolverla tal como está
  if (
    url.includes("pixeldrain.net/u/") ||
    url.includes("pixeldrain.net/api/file/")
  ) {
    return [url];
  }

  const folderId = extractPixeldrainId(url);

  if (!folderId) {
    console.warn(`⚠️ No se pudo extraer ID de Pixeldrain de: ${url}`);
    return [url]; // Retornar URL original si no se puede procesar
  }

  return await getPixeldrainFiles(folderId);
}

// Función para crear temporada desde arco JSON
async function createSeasonFromArco(arco: ArcoJson): Promise<Season> {
  console.log(`🔄 Procesando arco desde JSON: ${arco.name}`);

  // Procesar URL principal
  const mainVideoUrls = await processPixeldrainUrl(arco.link);

  // Procesar episodios adicionales si existen
  const additionalVideoUrls: string[] = [];

  if (arco.additionalEpisodes && arco.additionalEpisodes.length > 0) {
    console.log(
      `🔍 Procesando ${arco.additionalEpisodes.length} episodios adicionales para ${arco.name}`
    );

    for (const url of arco.additionalEpisodes) {
      const videos = await processPixeldrainUrl(url);
      additionalVideoUrls.push(...videos);
    }
  }

  // Combinar todas las URLs de video en orden
  const allVideoUrls = [...mainVideoUrls, ...additionalVideoUrls];

  const qualities: Quality[] = allVideoUrls.map((url) => ({
    quality: "480p",
    url: url,
    isDubbed: false,
    isExtended: false,
  }));

  console.log(
    `✅ ${arco.name}: ${mainVideoUrls.length} episodios principales + ${additionalVideoUrls.length} adicionales = ${allVideoUrls.length} total`
  );

  return {
    id: getCanonicalId(arco.name),
    title: arco.name,
    description: `One Pace - ${arco.name}`,
    subtitle: { qualities: qualities },
  };
}

// Función para combinar datos del scraper con episodios adicionales
async function enhanceSeasonWithAdditionalEpisodes(
  scraperSeason: Season,
  arco: ArcoJson
): Promise<Season> {
  console.log(`🔄 Mejorando temporada del scraper: ${arco.name}`);

  // Procesar episodios adicionales
  const additionalVideoUrls: string[] = [];

  if (arco.additionalEpisodes && arco.additionalEpisodes.length > 0) {
    console.log(
      `🔍 Procesando ${arco.additionalEpisodes.length} episodios adicionales para ${arco.name}`
    );

    for (const url of arco.additionalEpisodes) {
      const videos = await processPixeldrainUrl(url);
      additionalVideoUrls.push(...videos);
    }
  }

  // Crear las nuevas qualities con los episodios adicionales
  const additionalQualities: Quality[] = additionalVideoUrls.map((url) => ({
    quality: "480p",
    url: url,
    isDubbed: false,
    isExtended: false,
  }));

  // Combinar las qualities existentes con las adicionales
  const enhancedSeason: Season = {
    ...scraperSeason,
  };

  // Agregar episodios adicionales a todas las calidades disponibles
  if (enhancedSeason.subtitle) {
    enhancedSeason.subtitle.qualities.push(...additionalQualities);
  }

  if (enhancedSeason.dub) {
    // Para doblaje, usar las mismas URLs pero marcadas como dub
    const dubbedAdditionalQualities = additionalQualities.map((q) => ({
      ...q,
      isDubbed: true,
    }));
    enhancedSeason.dub.qualities.push(...dubbedAdditionalQualities);
  }

  if (enhancedSeason.extended?.subtitle) {
    enhancedSeason.extended.subtitle.qualities.push(...additionalQualities);
  }

  if (enhancedSeason.extended?.dub) {
    const dubbedAdditionalQualities = additionalQualities.map((q) => ({
      ...q,
      isDubbed: true,
    }));
    enhancedSeason.extended.dub.qualities.push(...dubbedAdditionalQualities);
  }

  const originalCount = scraperSeason.subtitle?.qualities.length || 0;
  const totalCount = enhancedSeason.subtitle?.qualities.length || 0;
  console.log(
    `✅ ${arco.name}: ${originalCount} episodios originales + ${additionalVideoUrls.length} adicionales = ${totalCount} total`
  );

  return enhancedSeason;
}

// Función para extraer datos de un idioma específico
async function extractOnePaceData(lang: "es" | "en"): Promise<OnePaceData> {
  console.log(`\n🌍 Extrayendo datos en ${lang.toUpperCase()}...`);

  const onePace = await oneCheerio(lang);
  const listItems = onePace("main ol li[id]");

  console.log(`Encontrados ${listItems.length} elementos en ${lang}`);

  const seasons: Season[] = [];

  // Iterar sobre los elementos encontrados usando for loop para permitir async
  for (let index = 0; index < listItems.length; index++) {
    const element = listItems[index];
    const $element = onePace(element);

    // Obtener ID y título
    const id = $element.attr("id") || `season-${index}`;
    const titleElement = $element.find("h2").first();
    const title = titleElement.text().trim();

    // Buscar descripción (párrafo después del h2)
    const description = $element.find("p").first().text().trim();

    // Buscar UL elementos
    const ulElements = $element.find("ul");

    if (ulElements.length === 0) {
      console.log(`❌ ${title}: Not yet available in your language`);
      continue; // Continúa con el siguiente elemento
    }

    const seasonData: Season = {
      id,
      title,
      description,
    };

    // Examinar cada UL
    for (let ulIndex = 0; ulIndex < ulElements.length; ulIndex++) {
      const ulElement = ulElements[ulIndex];
      const $ul = onePace(ulElement);

      // Buscar el span que indica si es subtítulo o doblaje
      // El span está antes del UL como hermano anterior
      const typeSpan = $ul.prevAll("span:first").find("span").text().trim();

      if (!typeSpan) continue; // Si no hay tipo, saltar

      // Determinar si es subtítulo o doblaje, y si es extended
      const isSubtitle =
        typeSpan.toLowerCase().includes("subtitulo") ||
        typeSpan.toLowerCase().includes("subtitle");
      const isDub =
        typeSpan.toLowerCase().includes("doblaje") ||
        typeSpan.toLowerCase().includes("dub");
      const isExtended = typeSpan.toLowerCase().includes("extended");

      // Extraer calidades y URLs
      const qualities: Quality[] = [];

      const liElements = $ul.find("li");

      // Procesar cada elemento li de forma asíncrona
      for (let i = 0; i < liElements.length; i++) {
        const liElement = liElements[i];
        const $li = onePace(liElement);
        const linkElement = $li.find("a");

        if (linkElement.length > 0) {
          const quality = linkElement.text().trim();
          const originalUrl = linkElement.attr("href") || "";

          // Si es una URL de Pixeldrain, procesarla para obtener los archivos
          if (
            originalUrl.includes("pixeldrain.net/u/") ||
            originalUrl.includes("pixeldrain.net/l/")
          ) {
            console.log(`🎬 Procesando carpeta Pixeldrain para ${quality}...`);
            const videoUrls = await processPixeldrainUrl(originalUrl);

            // Agregar cada video encontrado con su calidad
            videoUrls.forEach((videoUrl, index) => {
              const qualityLabel =
                videoUrls.length > 1
                  ? `${quality} - Video ${index + 1}`
                  : quality;
              qualities.push({ quality: qualityLabel, url: videoUrl });
            });
          } else {
            // Si no es Pixeldrain, usar la URL original
            qualities.push({ quality, url: originalUrl });
          }
        }
      }

      // Asignar al objeto según el tipo
      if (isExtended) {
        if (!seasonData.extended) seasonData.extended = {};
        if (isSubtitle) {
          seasonData.extended.subtitle = { qualities };
        } else if (isDub) {
          seasonData.extended.dub = { qualities };
        }
      } else {
        if (isSubtitle) {
          seasonData.subtitle = { qualities };
        } else if (isDub) {
          seasonData.dub = { qualities };
        }
      }
    }

    seasons.push(seasonData);
  }

  return {
    textIndex: textIndexOnePace,
    seasons,
    metadata: {
      totalSeasons: seasons.length,
      seasonsWithSubtitles: seasons.filter((s) => s.subtitle).length,
      seasonsWithDub: seasons.filter((s) => s.dub).length,
      seasonsWithExtended: seasons.filter((s) => s.extended).length,
      extractedAt: new Date().toISOString(),
      language: lang,
    },
  };
}

// Función para generar hash del contenido
function generateContentHash(data: OnePaceData): string {
  const contentToHash = JSON.stringify({
    seasons: data.seasons,
    metadata: { ...data.metadata, extractedAt: undefined }, // Excluir fecha para comparación
  });
  return crypto.createHash("md5").update(contentToHash).digest("hex");
}

// Función para guardar datos con sistema inteligente
async function saveDataWithSmartSystem(
  data: OnePaceData,
  filename: string
): Promise<void> {
  const newHash = generateContentHash(data);

  try {
    // Verificar si el archivo existe
    if (fs.existsSync(filename)) {
      const existingData = JSON.parse(
        fs.readFileSync(filename, "utf8")
      ) as OnePaceData;
      const existingHash = generateContentHash(existingData);

      if (existingHash === newHash) {
        console.log(
          `✅ ${filename}: Sin cambios detectados, no se sobrescribe`
        );
        return;
      } else {
        console.log(`🔄 ${filename}: Cambios detectados, sobrescribiendo...`);
      }
    } else {
      console.log(`📝 ${filename}: Archivo nuevo, creando...`);
    }

    // Guardar archivo
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`✅ ${filename}: Guardado exitosamente`);
  } catch (error) {
    console.error(`❌ Error al guardar ${filename}:`, error);
  }
}

// Función para unificar datos del scraper con arcos.json respetando el orden correcto
async function unifyWithArcosJson(
  scraperData: OnePaceData
): Promise<UnifiedOnePaceData> {
  const arcosJson = loadArcosJson();
  if (arcosJson.length === 0) {
    // Si no hay arcos JSON, devolver datos con metadata extendida
    return {
      ...scraperData,
      metadata: {
        ...scraperData.metadata,
        unifiedWithArcos: false,
        arcosFromJson: 0,
        arcosFromScraper: scraperData.seasons.length,
        arcosTotal: scraperData.seasons.length,
        orderSource: "scraper (original)",
      },
    };
  }

  console.log(
    `\n🔄 Unificando datos con arcos.json respetando orden lógico...`
  );

  // Crear un mapa de temporadas del scraper por ID canónico
  const scraperMap = new Map<string, Season>();
  for (const season of scraperData.seasons) {
    const canonicalId = getCanonicalId(season.title);
    scraperMap.set(canonicalId, season);
  }

  // Crear lista final respetando el orden de arcos.json
  const finalSeasons: Season[] = [];
  const processedArcos: string[] = [];
  const missingArcos: ArcoJson[] = [];

  console.log(`📊 Arcos en JSON (orden canónico): ${arcosJson.length}`);
  console.log(`📊 Arcos en scraper: ${scraperData.seasons.length}`);

  // Procesar cada arco en el orden de arcos.json
  for (const arco of arcosJson) {
    const canonicalId = getCanonicalId(arco.name);
    processedArcos.push(canonicalId);

    if (scraperMap.has(canonicalId)) {
      // El arco existe en el scraper, usar esa versión
      const existingSeason = scraperMap.get(canonicalId)!;
      finalSeasons.push(existingSeason);
      console.log(`✅ ${arco.name} (desde scraper)`);
    } else {
      // El arco no existe en el scraper, marcarlo como faltante para procesarlo
      missingArcos.push(arco);
      console.log(`⏳ ${arco.name} (faltante, se procesará)`);
    }
  }

  // Crear mapa para todos los arcos procesados (faltantes + mejorados)
  const processedArcosMap = new Map<string, Season>();

  console.log(`\n🔄 Procesando arcos desde JSON...`);

  for (const arco of arcosJson) {
    const canonicalId = getCanonicalId(arco.name);

    // Verificar si este arco tiene episodios adicionales o no está en el scraper
    const hasAdditionalEpisodes =
      arco.additionalEpisodes && arco.additionalEpisodes.length > 0;
    const existsInScraper = scraperMap.has(canonicalId);

    if (!existsInScraper) {
      // Arco faltante - crear desde JSON
      try {
        const season = await createSeasonFromArco(arco);
        processedArcosMap.set(canonicalId, season);
        console.log(`✅ Arco faltante procesado: ${arco.name}`);
      } catch (error) {
        console.error(`❌ Error procesando arco faltante ${arco.name}:`, error);
      }
    } else if (hasAdditionalEpisodes) {
      // Arco existe pero tiene episodios adicionales - mejorarlo
      try {
        const scraperSeason = scraperMap.get(canonicalId)!;
        const enhancedSeason = await enhanceSeasonWithAdditionalEpisodes(
          scraperSeason,
          arco
        );
        processedArcosMap.set(canonicalId, enhancedSeason);
        console.log(`🔄 Arco mejorado con episodios adicionales: ${arco.name}`);
      } catch (error) {
        console.error(`❌ Error mejorando ${arco.name}:`, error);
      }
    }
  }

  // Reconstruir la lista final respetando el orden de arcos.json
  const orderedSeasons: Season[] = [];

  for (const arco of arcosJson) {
    const canonicalId = getCanonicalId(arco.name);

    if (processedArcosMap.has(canonicalId)) {
      // Usar versión procesada desde JSON (faltante o mejorada)
      orderedSeasons.push(processedArcosMap.get(canonicalId)!);
    } else if (scraperMap.has(canonicalId)) {
      // Usar versión del scraper
      orderedSeasons.push(scraperMap.get(canonicalId)!);
    }
  }

  // Reemplazar finalSeasons con la lista ordenada
  finalSeasons.length = 0;
  finalSeasons.push(...orderedSeasons);

  // Identificar temporadas del scraper que no están en arcos.json para agregarlas al final
  const arcosJsonIds = new Set(
    arcosJson.map((arco) => getCanonicalId(arco.name))
  );
  const unusedScraperSeasons: Season[] = [];

  for (const season of scraperData.seasons) {
    const canonicalId = getCanonicalId(season.title);
    if (!arcosJsonIds.has(canonicalId)) {
      unusedScraperSeasons.push(season);
    }
  }

  if (unusedScraperSeasons.length > 0) {
    console.log(
      `\n➕ Agregando ${unusedScraperSeasons.length} temporadas adicionales del scraper:`
    );
    for (const season of unusedScraperSeasons) {
      finalSeasons.push(season);
      console.log(`📝 Agregado al final: ${season.title}`);
    }
  }

  console.log(`\n📊 Resultado final:`);
  console.log(`� Arcos procesados en orden: ${processedArcos.length}`);
  console.log(`📊 Arcos faltantes agregados: ${missingArcos.length}`);
  console.log(
    `📊 Temporadas adicionales del scraper: ${unusedScraperSeasons.length}`
  );
  console.log(`📊 Total final: ${finalSeasons.length}`);

  const unifiedData: UnifiedOnePaceData = {
    ...scraperData,
    seasons: finalSeasons,
    metadata: {
      ...scraperData.metadata,
      totalSeasons: finalSeasons.length,
      seasonsWithSubtitles: finalSeasons.filter((s) => s.subtitle).length,
      seasonsWithDub: finalSeasons.filter((s) => s.dub).length,
      seasonsWithExtended: finalSeasons.filter((s) => s.extended).length,
      // Agregar metadatos sobre la unificación
      unifiedWithArcos: true,
      arcosFromJson: missingArcos.length,
      arcosFromScraper: scraperData.seasons.length,
      arcosTotal: finalSeasons.length,
      orderSource: "arcos.json (canonical)",
    },
  };

  console.log(
    `✅ Unificación completada respetando orden lógico de arcos.json`
  );
  return unifiedData;
}

// Función principal
async function main() {
  try {
    console.log("🚀 Iniciando extracción de datos de One Pace...");

    // Extraer datos en ambos idiomas
    const [scraperES, scraperEN] = await Promise.all([
      extractOnePaceData("es"),
      extractOnePaceData("en"),
    ]);

    // Unificar con arcos.json (solo en español por ahora)
    console.log("\n🔗 Unificando datos con arcos.json...");
    const onePaceES = await unifyWithArcosJson(scraperES);
    const onePaceEN = scraperEN; // Inglés sin modificar por ahora

    // Mostrar estadísticas
    console.log(`\n📊 ESTADÍSTICAS ESPAÑOL:`);
    console.log(`📊 Total de temporadas: ${onePaceES.metadata.totalSeasons}`);
    console.log(
      `📊 Con subtítulos: ${onePaceES.metadata.seasonsWithSubtitles}`
    );
    console.log(`📊 Con doblaje: ${onePaceES.metadata.seasonsWithDub}`);
    console.log(
      `📊 Con versiones extended: ${onePaceES.metadata.seasonsWithExtended}`
    );

    console.log(`\n📊 ESTADÍSTICAS INGLÉS:`);
    console.log(`📊 Total de temporadas: ${onePaceEN.metadata.totalSeasons}`);
    console.log(
      `📊 Con subtítulos: ${onePaceEN.metadata.seasonsWithSubtitles}`
    );
    console.log(`📊 Con doblaje: ${onePaceEN.metadata.seasonsWithDub}`);
    console.log(
      `📊 Con versiones extended: ${onePaceEN.metadata.seasonsWithExtended}`
    );

    // Guardar archivos con sistema inteligente
    console.log(`\n💾 Guardando archivos...`);
    await Promise.all([
      saveDataWithSmartSystem(onePaceES, "data/one-pace-data-es.json"),
      saveDataWithSmartSystem(onePaceEN, "data/one-pace-data-en.json"),
    ]);

    console.log(`\n🎉 ¡Proceso completado exitosamente!`);
  } catch (error) {
    console.error("❌ Error en el proceso principal:", error);
  }
}

// Ejecutar función principal
main();

export type { OnePaceData, Season, MediaType, ExtendedVersions };
