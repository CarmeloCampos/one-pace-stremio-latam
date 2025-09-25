import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { OnePaceData, Season, Quality } from "./scraper";

interface StremioManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  resources: string[];
  types: string[];
  catalogs: Array<{
    type: string;
    id: string;
    name: string;
    extra?: Array<{
      name: string;
      options: string[];
    }>;
  }>;
  idPrefixes: string[];
}

interface StremioMeta {
  meta: {
    id: string;
    type: string;
    name: string;
    poster?: string;
    description?: string;
    genres?: string[];
    year?: number;
    background?: string;
    logo?: string;
    videos: Array<{
      id: string;
      title: string;
      season: number;
      episode: number;
      released?: string;
      thumbnail?: string;
      overview?: string;
    }>;
  };
}

interface StremioStream {
  title: string;
  url: string;
  quality?: string;
  language?: string;
}

interface StremioStreams {
  streams: StremioStream[];
}

interface QualityWithEpisode extends Quality {
  episodeNum: number;
}

export class ImprovedStremioAddonGenerator {
  private readonly addonId = "one-pace-unified";
  private readonly outputDir: string;

  constructor(outputDir: string = "./stremio-addon") {
    this.outputDir = outputDir;
  }

  async generateUnifiedAddon(
    esDataPath: string,
    enDataPath: string
  ): Promise<void> {
    console.log("🔧 Generando addon unificado de Stremio para One Pace...");

    // Crear estructura de directorios
    await this.createDirectoryStructure();

    // Cargar datos de ambos idiomas
    const esData: OnePaceData = JSON.parse(await Bun.file(esDataPath).text());
    const enData: OnePaceData = JSON.parse(await Bun.file(enDataPath).text());

    // Generar manifest
    await this.generateUnifiedManifest();

    // Generar catálogo unificado (una sola serie One Pace)
    await this.generateUnifiedCatalog(esData, enData);

    // Generar metadata de la serie principal
    await this.generateUnifiedMetadata(esData, enData);

    // Generar streams con múltiples idiomas
    await this.generateUnifiedStreams(esData, enData);

    console.log(`✅ Addon unificado generado en: ${this.outputDir}`);
    console.log(`📋 URL del manifest: ${this.outputDir}/manifest.json`);
  }

  private async createDirectoryStructure(): Promise<void> {
    const directories = [
      this.outputDir,
      join(this.outputDir, "catalog"),
      join(this.outputDir, "catalog", "series"),
      join(this.outputDir, "meta"),
      join(this.outputDir, "meta", "series"),
      join(this.outputDir, "stream"),
      join(this.outputDir, "stream", "series"),
    ];

    for (const dir of directories) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
  }

  private async generateUnifiedManifest(): Promise<void> {
    const manifest: StremioManifest = {
      id: this.addonId,
      version: "2.3.0",
      name: "One Pace - Complete Series",
      description:
        "Complete One Pace series with all arcs as seasons. Includes Spanish and English subtitles/dubbing.",
      resources: ["catalog", "meta", "stream"],
      types: ["series"],
      catalogs: [
        {
          type: "series",
          id: "one-pace-complete",
          name: "One Pace Complete",
          extra: [
            {
              name: "genre",
              options: ["Animation", "Adventure", "Comedy", "Drama"],
            },
          ],
        },
      ],
      idPrefixes: ["onepace_"],
    };

    await writeFile(
      join(this.outputDir, "manifest.json"),
      JSON.stringify(manifest, null, 2)
    );
  }

  private async generateUnifiedCatalog(
    _esData: OnePaceData,
    _enData: OnePaceData
  ): Promise<void> {
    // Una sola entrada: One Pace como serie completa
    const catalog = {
      metas: [
        {
          id: "onepace_complete_series",
          type: "series",
          name: "One Pace",
          poster:
            "https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
          background:
            "https://image.tmdb.org/t/p/original/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
          genres: ["Animation", "Adventure", "Comedy", "Drama"],
          year: 2010,
          description:
            "One Pace is a fan project that recuts the One Piece anime in an endeavor to bring it more in line with the pacing of the original manga. The team accomplishes this by removing filler scenes not present in the source material.",
        },
      ],
    };

    await writeFile(
      join(this.outputDir, "catalog", "series", "one-pace-complete.json"),
      JSON.stringify(catalog, null, 2)
    );
  }

  private async generateUnifiedMetadata(
    esData: OnePaceData,
    enData: OnePaceData
  ): Promise<void> {
    const videos = this.generateUnifiedVideoList(esData, enData);

    const meta: StremioMeta = {
      meta: {
        id: "onepace_complete_series",
        type: "series",
        name: "One Pace",
        poster:
          "https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
        background:
          "https://image.tmdb.org/t/p/original/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
        description:
          "One Pace is a fan project that recuts the One Piece anime in an endeavor to bring it more in line with the pacing of the original manga. The team accomplishes this by removing filler scenes not present in the source material.",
        genres: ["Animation", "Adventure", "Comedy", "Drama"],
        year: 2010,
        videos,
      },
    };

    await writeFile(
      join(this.outputDir, "meta", "series", "onepace_complete_series.json"),
      JSON.stringify(meta, null, 2)
    );
  }

  private generateUnifiedVideoList(
    esData: OnePaceData,
    _enData: OnePaceData
  ): Array<{
    id: string;
    title: string;
    season: number;
    episode: number;
    released?: string;
    thumbnail?: string;
    overview?: string;
  }> {
    const videos: Array<{
      id: string;
      title: string;
      season: number;
      episode: number;
      released?: string;
      thumbnail?: string;
      overview?: string;
    }> = [];

    // Usar datos en español como referencia principal, complementar con inglés
    esData.seasons.forEach((season, seasonIndex) => {
      const seasonNumber = seasonIndex + 1;

      // Obtener episodios únicos para esta temporada
      const episodeNumbers = this.getUniqueEpisodesFromSeason(season);

      episodeNumbers.forEach((_episodeNum, episodeIndex) => {
        const episodeNumber = episodeIndex + 1;

        videos.push({
          id: `onepace_s${seasonNumber
            .toString()
            .padStart(2, "0")}e${episodeNumber.toString().padStart(2, "0")}`,
          title: `${season.title} - Episodio ${episodeNumber}`,
          season: seasonNumber,
          episode: episodeNumber,
          overview: season.description,
          thumbnail:
            "https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
        });
      });
    });

    return videos;
  }

  private getUniqueEpisodesFromSeason(season: Season): number[] {
    const episodeSet = new Set<number>();

    // Primero, recopilar todos los episodios que siguen el patrón "Video X"
    const processQualitiesForPattern = (qualities: Quality[]) => {
      qualities.forEach((quality) => {
        const match = quality.quality.match(/Video (\d+)/);
        if (match && match[1]) {
          episodeSet.add(parseInt(match[1]));
        }
      });
    };

    // Procesar todas las qualities para encontrar patrones "Video X"
    if (season.subtitle?.qualities) {
      processQualitiesForPattern(season.subtitle.qualities);
    }
    if (season.dub?.qualities) {
      processQualitiesForPattern(season.dub.qualities);
    }
    if (season.extended?.subtitle?.qualities) {
      processQualitiesForPattern(season.extended.subtitle.qualities);
    }
    if (season.extended?.dub?.qualities) {
      processQualitiesForPattern(season.extended.dub.qualities);
    }

    // Luego, contar episodios adicionales únicos que no siguen el patrón
    const additionalUrls = new Set<string>();
    const countAdditionalEpisodes = (qualities: Quality[]) => {
      qualities.forEach((quality) => {
        const match = quality.quality.match(/Video (\d+)/);
        if (!match) {
          additionalUrls.add(quality.url);
        }
      });
    };

    if (season.subtitle?.qualities) {
      countAdditionalEpisodes(season.subtitle.qualities);
    }

    // Agregar episodios adicionales secuencialmente después de los episodios con patrón
    const maxPatternEpisode =
      episodeSet.size > 0 ? Math.max(...Array.from(episodeSet)) : 0;
    for (let i = 1; i <= additionalUrls.size; i++) {
      episodeSet.add(maxPatternEpisode + i);
    }

    // Si no se encontraron episodios con el patrón "Video X",
    // asumir que es una temporada de un solo episodio
    if (episodeSet.size === 0) {
      // Verificar si la temporada tiene al menos una quality disponible
      const hasSubtitle =
        season.subtitle?.qualities && season.subtitle.qualities.length > 0;
      const hasDub = season.dub?.qualities && season.dub.qualities.length > 0;
      const hasExtendedSubtitle =
        season.extended?.subtitle?.qualities &&
        season.extended.subtitle.qualities.length > 0;
      const hasExtendedDub =
        season.extended?.dub?.qualities &&
        season.extended.dub.qualities.length > 0;

      if (hasSubtitle || hasDub || hasExtendedSubtitle || hasExtendedDub) {
        episodeSet.add(1); // Asumir episodio 1 para temporadas sin numeración
      }
    }

    return Array.from(episodeSet).sort((a, b) => a - b);
  }

  private async generateUnifiedStreams(
    esData: OnePaceData,
    enData: OnePaceData
  ): Promise<void> {
    // Generar streams para cada episodio con múltiples opciones de idioma/formato
    for (
      let seasonIndex = 0;
      seasonIndex < esData.seasons.length;
      seasonIndex++
    ) {
      const season = esData.seasons[seasonIndex];
      if (!season) continue;

      const seasonNumber = seasonIndex + 1;
      const episodeNumbers = this.getUniqueEpisodesFromSeason(season);

      for (
        let episodeIndex = 0;
        episodeIndex < episodeNumbers.length;
        episodeIndex++
      ) {
        const episodeNumber = episodeIndex + 1;
        const episodeVideoNum = episodeNumbers[episodeIndex];
        if (episodeVideoNum === undefined) continue;

        const videoId = `onepace_s${seasonNumber
          .toString()
          .padStart(2, "0")}e${episodeNumber.toString().padStart(2, "0")}`;

        const streams: StremioStream[] = [];

        // Agregar streams en español
        this.addStreamsForEpisode(streams, season, episodeVideoNum, "es");

        // Agregar streams en inglés si existe la temporada correspondiente
        const enSeason = enData.seasons[seasonIndex];
        if (enSeason) {
          this.addStreamsForEpisode(streams, enSeason, episodeVideoNum, "en");
        }

        // Ordenar streams por prioridad: Español primero, luego English
        // Dentro de cada idioma: Doblaje primero, luego subtítulos
        // Dentro de cada tipo: 1080p primero, luego otras calidades
        streams.sort((a, b) => this.compareStreamPriority(a, b));

        if (streams.length > 0) {
          const streamData: StremioStreams = { streams };

          await writeFile(
            join(this.outputDir, "stream", "series", `${videoId}.json`),
            JSON.stringify(streamData, null, 2)
          );
        }
      }
    }
  }

  private addStreamsForEpisode(
    streams: StremioStream[],
    season: Season,
    episodeVideoNum: number,
    language: "es" | "en"
  ): void {
    const langLabel = language === "es" ? "Español" : "English";

    // Función para mapear qualities a episodios secuenciales
    const mapQualitiesToEpisodes = (
      qualities: Quality[],
      isDub: boolean = false,
      customType?: string
    ) => {
      // Separar qualities con patrón "Video X" y sin patrón
      const patterned: QualityWithEpisode[] = [];
      const nonPatterned: Quality[] = [];

      qualities.forEach((quality) => {
        const match = quality.quality.match(/Video (\d+)/);
        if (match && match[1]) {
          patterned.push({ ...quality, episodeNum: parseInt(match[1]) });
        } else {
          nonPatterned.push(quality);
        }
      });

      // Procesar qualities con patrón "Video X"
      patterned.forEach((quality) => {
        if (quality.episodeNum === episodeVideoNum) {
          const streamType = customType || (isDub ? "Doblaje" : "Subtítulos");
          streams.push({
            title: `${this.extractQuality(
              quality.quality
            )} - ${streamType} ${langLabel}`,
            url: quality.url,
            quality: this.extractQuality(quality.quality),
            language: language,
          });
        }
      });

      // Procesar qualities sin patrón (episodios adicionales)
      // Agrupar por URL para identificar episodios únicos
      const uniqueUrls = [...new Set(nonPatterned.map((q) => q.url))];
      const maxPatternEpisode =
        patterned.length > 0
          ? Math.max(...patterned.map((q) => q.episodeNum))
          : 0;

      uniqueUrls.forEach((url, index) => {
        const additionalEpisodeNum = maxPatternEpisode + index + 1;
        if (additionalEpisodeNum === episodeVideoNum) {
          // Encontrar la quality correspondiente a esta URL
          const quality = nonPatterned.find((q) => q.url === url);
          if (quality) {
            const streamType = customType || (isDub ? "Doblaje" : "Subtítulos");
            streams.push({
              title: `${this.extractQuality(
                quality.quality
              )} - ${streamType} ${langLabel}`,
              url: quality.url,
              quality: this.extractQuality(quality.quality),
              language: language,
            });
          }
        }
      });
    };

    // Subtítulos normales
    if (season.subtitle?.qualities) {
      mapQualitiesToEpisodes(season.subtitle.qualities, false);
    }

    // Doblaje normal
    if (season.dub?.qualities) {
      mapQualitiesToEpisodes(season.dub.qualities, true);
    }

    // Subtítulos extendidos
    // Subtítulos extendidos
    if (season.extended?.subtitle?.qualities) {
      mapQualitiesToEpisodes(
        season.extended.subtitle.qualities,
        false,
        "Extendido Sub"
      );
    }

    // Doblaje extendido
    if (season.extended?.dub?.qualities) {
      mapQualitiesToEpisodes(
        season.extended.dub.qualities,
        true,
        "Extendido Dub"
      );
    }
  }

  private extractQuality(qualityString: string): string {
    const match = qualityString.match(/(\d+p)/);
    return match?.[1] ?? "HD";
  }

  private compareStreamPriority(a: StremioStream, b: StremioStream): number {
    // Prioridad de idioma: Español (es) primero, luego English (en)
    const langPriorityA = a.language === "es" ? 0 : 1;
    const langPriorityB = b.language === "es" ? 0 : 1;

    if (langPriorityA !== langPriorityB) {
      return langPriorityA - langPriorityB;
    }

    // Dentro del mismo idioma, prioridad por tipo: Doblaje primero, luego subtítulos
    const getTypePriority = (title: string): number => {
      if (title.includes("Doblaje") || title.includes("Dub")) return 0;
      if (title.includes("Subtítulos") || title.includes("Sub")) return 1;
      return 2; // Otros tipos
    };

    const typePriorityA = getTypePriority(a.title);
    const typePriorityB = getTypePriority(b.title);

    if (typePriorityA !== typePriorityB) {
      return typePriorityA - typePriorityB;
    }

    // Dentro del mismo tipo, prioridad por calidad: 1080p primero
    const getQualityPriority = (quality?: string): number => {
      if (!quality) return 999;

      if (quality.includes("1080p")) return 0;
      if (quality.includes("720p")) return 1;
      if (quality.includes("480p")) return 2;
      if (quality.includes("360p")) return 3;

      // Para calidades no reconocidas, extraer número y ordenar descendente
      const match = quality.match(/(\d+)p/);
      if (match && match[1]) {
        const qualityNum = parseInt(match[1]);
        return 1000 - qualityNum; // Mayor calidad = menor número de prioridad
      }

      return 999;
    };

    const qualityPriorityA = getQualityPriority(a.quality);
    const qualityPriorityB = getQualityPriority(b.quality);

    return qualityPriorityA - qualityPriorityB;
  }
}
