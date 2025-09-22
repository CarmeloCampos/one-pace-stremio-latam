import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { OnePaceData, Season } from "./scraper";

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
  }>;
  idPrefixes: string[];
}

interface StremioCatalogMeta {
  id: string;
  type: string;
  name: string;
  poster?: string;
  genres?: string[];
  year?: number;
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
    videos?: Array<{
      id: string;
      title: string;
      season: number;
      episode: number;
    }>;
  };
}

interface StremioStream {
  title: string;
  url: string;
  quality?: string;
}

interface StremioStreams {
  streams: StremioStream[];
}

export class StremioAddonGenerator {
  private readonly addonId = "one-pace-latam";
  private readonly outputDir: string;

  constructor(outputDir: string = "./stremio-addon") {
    this.outputDir = outputDir;
  }

  async generateAddon(dataPath: string, language: "es" | "en" = "es"): Promise<void> {
    console.log("🔧 Generando addon estático de Stremio...");

    // Crear directorio de salida
    await this.ensureDirectoryExists(this.outputDir);
    await this.ensureDirectoryExists(join(this.outputDir, "catalog"));
    await this.ensureDirectoryExists(join(this.outputDir, "catalog", "series"));
    await this.ensureDirectoryExists(join(this.outputDir, "meta"));
    await this.ensureDirectoryExists(join(this.outputDir, "meta", "series"));
    await this.ensureDirectoryExists(join(this.outputDir, "stream"));
    await this.ensureDirectoryExists(join(this.outputDir, "stream", "series"));

    // Cargar datos
    const data: OnePaceData = JSON.parse(await Bun.file(dataPath).text());

    // Generar manifest
    await this.generateManifest(language);

    // Generar catálogo
    const catalogMetas = await this.generateCatalog(data, language);

    // Generar metadatos individuales
    await this.generateMetadata(data, catalogMetas, language);

    // Generar streams
    await this.generateStreams(data, language);

    console.log(`✅ Addon generado en: ${this.outputDir}`);
    console.log(`📋 URL del manifest: ${this.outputDir}/manifest.json`);
  }

  private async ensureDirectoryExists(path: string): Promise<void> {
    if (!existsSync(path)) {
      await mkdir(path, { recursive: true });
    }
  }

  private async generateManifest(language: "es" | "en"): Promise<void> {
    const manifest: StremioManifest = {
      id: this.addonId,
      version: "1.0.0",
      name: language === "es" ? "One Pace LATAM" : "One Pace LATAM (English)",
      description: language === "es" 
        ? "Addon estático para ver One Pace con subtítulos y doblaje en español"
        : "Static addon to watch One Pace with Spanish subtitles and dubbing",
      resources: ["catalog", "meta", "stream"],
      types: ["series"],
      catalogs: [
        {
          type: "series",
          id: "one-pace-catalog",
          name: language === "es" ? "One Pace Arcos" : "One Pace Arcs"
        }
      ],
      idPrefixes: ["onepace_"]
    };

    await writeFile(
      join(this.outputDir, "manifest.json"),
      JSON.stringify(manifest, null, 2)
    );
  }

  private async generateCatalog(data: OnePaceData, _language: "es" | "en"): Promise<StremioCatalogMeta[]> {
    const catalogMetas: StremioCatalogMeta[] = data.seasons.map((season: Season, index: number) => ({
      id: `onepace_${season.id}`,
      type: "series",
      name: season.title,
      poster: this.getSeasonPoster(season.id),
      genres: ["Animation", "Adventure", "Comedy"],
      year: 2010 + index // Año aproximado basado en el orden
    }));

    const catalog = { metas: catalogMetas };

    await writeFile(
      join(this.outputDir, "catalog", "series", "one-pace-catalog.json"),
      JSON.stringify(catalog, null, 2)
    );

    return catalogMetas;
  }

  private async generateMetadata(
    data: OnePaceData, 
    catalogMetas: StremioCatalogMeta[], 
    _language: "es" | "en"
  ): Promise<void> {
    for (let i = 0; i < data.seasons.length; i++) {
      const season = data.seasons[i];
      const catalogMeta = catalogMetas[i];

      if (!season || !catalogMeta) continue;

      // Generar videos (episodios) para la serie
      const videos = this.generateVideosForSeason(season, i + 1);

      const meta: StremioMeta = {
        meta: {
          id: catalogMeta.id,
          type: "series",
          name: season.title,
          ...(catalogMeta.poster && { poster: catalogMeta.poster }),
          description: season.description,
          ...(catalogMeta.genres && { genres: catalogMeta.genres }),
          ...(catalogMeta.year && { year: catalogMeta.year }),
          videos
        }
      };

      await writeFile(
        join(this.outputDir, "meta", "series", `${catalogMeta.id}.json`),
        JSON.stringify(meta, null, 2)
      );
    }
  }

  private generateVideosForSeason(season: Season, seasonNumber: number): Array<{
    id: string;
    title: string;
    season: number;
    episode: number;
  }> {
    const videos: Array<{
      id: string;
      title: string;
      season: number;
      episode: number;
    }> = [];
    
    // Generar episodios basados en las calidades disponibles
    const hasSubtitles = season.subtitle?.qualities && season.subtitle.qualities.length > 0;
    const hasDub = season.dub?.qualities && season.dub.qualities.length > 0;
    const hasExtendedSub = season.extended?.subtitle?.qualities && season.extended.subtitle.qualities.length > 0;
    const hasExtendedDub = season.extended?.dub?.qualities && season.extended.dub.qualities.length > 0;

    let episodeCount = 0;

    if (hasSubtitles && season.subtitle) {
      const uniqueEpisodes = this.getUniqueEpisodes(season.subtitle.qualities);
      uniqueEpisodes.forEach((_, index) => {
        videos.push({
          id: `onepace_${season.id}_sub_${index + 1}`,
          title: `${season.title} - Episodio ${index + 1} (Sub)`,
          season: seasonNumber,
          episode: index + 1
        });
      });
      episodeCount = Math.max(episodeCount, uniqueEpisodes.length);
    }

    if (hasDub && season.dub) {
      const uniqueEpisodes = this.getUniqueEpisodes(season.dub.qualities);
      uniqueEpisodes.forEach((_, index) => {
        videos.push({
          id: `onepace_${season.id}_dub_${index + 1}`,
          title: `${season.title} - Episodio ${index + 1} (Dub)`,
          season: seasonNumber,
          episode: index + 1 + episodeCount
        });
      });
    }

    if (hasExtendedSub && season.extended?.subtitle) {
      const uniqueEpisodes = this.getUniqueEpisodes(season.extended.subtitle.qualities);
      uniqueEpisodes.forEach((_, index) => {
        videos.push({
          id: `onepace_${season.id}_ext_sub_${index + 1}`,
          title: `${season.title} - Episodio ${index + 1} (Extended Sub)`,
          season: seasonNumber,
          episode: index + 1 + episodeCount * 2
        });
      });
    }

    if (hasExtendedDub && season.extended?.dub) {
      const uniqueEpisodes = this.getUniqueEpisodes(season.extended.dub.qualities);
      uniqueEpisodes.forEach((_, index) => {
        videos.push({
          id: `onepace_${season.id}_ext_dub_${index + 1}`,
          title: `${season.title} - Episodio ${index + 1} (Extended Dub)`,
          season: seasonNumber,
          episode: index + 1 + episodeCount * 3
        });
      });
    }

    return videos;
  }

  private getUniqueEpisodes(qualities: Array<{ quality: string; url: string }>): string[] {
    const episodes = new Set<string>();
    
    qualities.forEach(quality => {
      // Extraer número de video de la calidad (ej: "Video 1", "Video 2")
      const match = quality.quality.match(/Video (\d+)/);
      if (match && match[1]) {
        episodes.add(match[1]);
      }
    });

    return Array.from(episodes).sort((a, b) => parseInt(a) - parseInt(b));
  }

  private async generateStreams(data: OnePaceData, _language: "es" | "en"): Promise<void> {
    for (const season of data.seasons) {
      // Generar streams para subtítulos
      if (season.subtitle?.qualities) {
        await this.generateStreamsForType(season, "sub", season.subtitle.qualities);
      }

      // Generar streams para doblaje
      if (season.dub?.qualities) {
        await this.generateStreamsForType(season, "dub", season.dub.qualities);
      }

      // Generar streams para extended - subtítulos
      if (season.extended?.subtitle?.qualities) {
        await this.generateStreamsForType(season, "ext_sub", season.extended.subtitle.qualities);
      }

      // Generar streams para extended - doblaje
      if (season.extended?.dub?.qualities) {
        await this.generateStreamsForType(season, "ext_dub", season.extended.dub.qualities);
      }
    }
  }

  private async generateStreamsForType(
    season: Season, 
    type: "sub" | "dub" | "ext" | "ext_sub" | "ext_dub", 
    qualities: Array<{ quality: string; url: string }>
  ): Promise<void> {
    const episodeGroups: { [episode: string]: Array<{ quality: string; url: string }> } = {};

    // Agrupar por episodio
    qualities.forEach(quality => {
      const match = quality.quality.match(/Video (\d+)/);
      if (match && match[1]) {
        const episode = match[1];
        if (!episodeGroups[episode]) {
          episodeGroups[episode] = [];
        }
        episodeGroups[episode].push(quality);
      }
    });

    // Generar archivo de streams para cada episodio
    for (const [episode, episodeQualities] of Object.entries(episodeGroups)) {
      const streams: StremioStream[] = episodeQualities.map(quality => ({
        title: `${quality.quality} (${type.toUpperCase()})`,
        url: quality.url,
        quality: this.extractQuality(quality.quality)
      }));

      const streamData: StremioStreams = { streams };
      const videoId = `onepace_${season.id}_${type}_${episode}`;

      await writeFile(
        join(this.outputDir, "stream", "series", `${videoId}.json`),
        JSON.stringify(streamData, null, 2)
      );
    }
  }

  private extractQuality(qualityString: string): string {
    const match = qualityString.match(/(\d+p)/);
    return match?.[1] ?? "Unknown";
  }

  private getSeasonPoster(seasonId: string): string {
    // URLs de posters basadas en el ID de la temporada
    const posters: { [key: string]: string } = {
      "romance-dawn": "https://onepace.net/images/arcs/romance-dawn.jpg",
      "orange-town": "https://onepace.net/images/arcs/orange-town.jpg",
      "syrup-village": "https://onepace.net/images/arcs/syrup-village.jpg",
      "baratie": "https://onepace.net/images/arcs/baratie.jpg",
      "arlong-park": "https://onepace.net/images/arcs/arlong-park.jpg",
      "loguetown": "https://onepace.net/images/arcs/loguetown.jpg",
      "reverse-mountain": "https://onepace.net/images/arcs/reverse-mountain.jpg",
      "whisky-peak": "https://onepace.net/images/arcs/whisky-peak.jpg",
      "little-garden": "https://onepace.net/images/arcs/little-garden.jpg",
      "drum-island": "https://onepace.net/images/arcs/drum-island.jpg",
      "alabasta": "https://onepace.net/images/arcs/alabasta.jpg"
    };

    return posters[seasonId] || "https://onepace.net/images/logo.png";
  }
}