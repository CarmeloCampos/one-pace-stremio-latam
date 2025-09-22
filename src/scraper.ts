import { oneCheerio } from "./one-cheerio";
import * as fs from "fs";
import * as crypto from "crypto";

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
interface Quality {
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

// Función para extraer datos de un idioma específico
async function extractOnePaceData(lang: "es" | "en"): Promise<OnePaceData> {
  console.log(`\n🌍 Extrayendo datos en ${lang.toUpperCase()}...`);

  const onePace = await oneCheerio(lang);
  const listItems = onePace("main ol li[id]");

  console.log(`Encontrados ${listItems.length} elementos en ${lang}`);

  const seasons: Season[] = [];

  // Iterar sobre los elementos encontrados
  listItems.each((index: number, element: any) => {
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
      return; // Continúa con el siguiente elemento
    }

    const seasonData: Season = {
      id,
      title,
      description,
    };

    // Examinar cada UL
    ulElements.each((_ulIndex: number, ulElement: any) => {
      const $ul = onePace(ulElement);

      // Buscar el span que indica si es subtítulo o doblaje
      // El span está antes del UL como hermano anterior
      const typeSpan = $ul.prevAll("span:first").find("span").text().trim();

      if (!typeSpan) return; // Si no hay tipo, saltar

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
      liElements.each((_liIndex: number, liElement: any) => {
        const $li = onePace(liElement);
        const linkElement = $li.find("a");
        if (linkElement.length > 0) {
          const quality = linkElement.text().trim();
          const url = linkElement.attr("href") || "";
          qualities.push({ quality, url });
        }
      });

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
    });

    seasons.push(seasonData);
  });

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

// Función principal
async function main() {
  try {
    console.log("🚀 Iniciando extracción de datos de One Pace...");

    // Extraer datos en ambos idiomas
    const [onePaceES, onePaceEN] = await Promise.all([
      extractOnePaceData("es"),
      extractOnePaceData("en"),
    ]);

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

export type { OnePaceData, Season, Quality, MediaType, ExtendedVersions };
