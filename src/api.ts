import type { OnePaceData, Season } from "./scraper";

/**
 * Utilidades para trabajar con los datos de One Pace
 */
export class OnePaceAPI {
  private dataES: OnePaceData | null = null;
  private dataEN: OnePaceData | null = null;

  /**
   * Cargar datos de un idioma específico
   */
  async loadData(lang: "es" | "en"): Promise<OnePaceData> {
    try {
      const fs = await import("fs");
      const filename = `data/one-pace-data-${lang}.json`;

      if (!fs.existsSync(filename)) {
        throw new Error(
          `Archivo ${filename} no encontrado. Ejecuta el scraper primero.`
        );
      }

      const rawData = fs.readFileSync(filename, "utf8");
      const data = JSON.parse(rawData) as OnePaceData;

      if (lang === "es") {
        this.dataES = data;
      } else {
        this.dataEN = data;
      }

      return data;
    } catch (error) {
      throw new Error(`Error cargando datos en ${lang}: ${error}`);
    }
  }

  /**
   * Obtener todas las temporadas de un idioma
   */
  getSeasons(lang: "es" | "en"): Season[] {
    const data = lang === "es" ? this.dataES : this.dataEN;
    if (!data) {
      throw new Error(`Datos en ${lang} no cargados. Usa loadData() primero.`);
    }
    return data.seasons;
  }

  /**
   * Buscar temporada por ID
   */
  getSeasonById(id: string, lang: "es" | "en"): Season | undefined {
    const seasons = this.getSeasons(lang);
    return seasons.find((season) => season.id === id);
  }

  /**
   * Buscar temporadas por título (búsqueda parcial)
   */
  searchSeasonsByTitle(query: string, lang: "es" | "en"): Season[] {
    const seasons = this.getSeasons(lang);
    return seasons.filter((season) =>
      season.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Obtener temporadas que tienen subtítulos
   */
  getSeasonsWithSubtitles(lang: "es" | "en"): Season[] {
    const seasons = this.getSeasons(lang);
    return seasons.filter((season) => season.subtitle);
  }

  /**
   * Obtener temporadas que tienen doblaje
   */
  getSeasonsWithDub(lang: "es" | "en"): Season[] {
    const seasons = this.getSeasons(lang);
    return seasons.filter((season) => season.dub);
  }

  /**
   * Obtener temporadas que tienen versiones extended
   */
  getSeasonsWithExtended(lang: "es" | "en"): Season[] {
    const seasons = this.getSeasons(lang);
    return seasons.filter((season) => season.extended);
  }

  /**
   * Obtener todas las calidades disponibles para una temporada
   */
  getAvailableQualities(
    seasonId: string,
    lang: "es" | "en"
  ): {
    subtitle?: string[];
    dub?: string[];
    extended?: {
      subtitle?: string[];
      dub?: string[];
    };
  } {
    const season = this.getSeasonById(seasonId, lang);
    if (!season) return {};

    const result: {
      subtitle?: string[];
      dub?: string[];
      extended?: {
        subtitle?: string[];
        dub?: string[];
      };
    } = {};

    if (season.subtitle) {
      result.subtitle = season.subtitle.qualities.map((q) => q.quality);
    }

    if (season.dub) {
      result.dub = season.dub.qualities.map((q) => q.quality);
    }

    if (season.extended) {
      result.extended = {};
      if (season.extended.subtitle) {
        result.extended.subtitle = season.extended.subtitle.qualities.map(
          (q) => q.quality
        );
      }
      if (season.extended.dub) {
        result.extended.dub = season.extended.dub.qualities.map(
          (q) => q.quality
        );
      }
    }

    return result;
  }

  /**
   * Obtener estadísticas de los datos cargados
   */
  getStats(lang: "es" | "en"): {
    total: number;
    withSubtitles: number;
    withDub: number;
    withExtended: number;
  } {
    const data = lang === "es" ? this.dataES : this.dataEN;
    if (!data) {
      throw new Error(`Datos en ${lang} no cargados. Usa loadData() primero.`);
    }

    return {
      total: data.metadata.totalSeasons,
      withSubtitles: data.metadata.seasonsWithSubtitles,
      withDub: data.metadata.seasonsWithDub,
      withExtended: data.metadata.seasonsWithExtended,
    };
  }

  /**
   * Obtener metadatos de los datos cargados
   */
  getMetadata(lang: "es" | "en") {
    const data = lang === "es" ? this.dataES : this.dataEN;
    if (!data) {
      throw new Error(`Datos en ${lang} no cargados. Usa loadData() primero.`);
    }
    return data.metadata;
  }
}
