import { readFileSync } from "fs";

export interface Arco {
  name: string;
  link: string;
  notes?: string;
}

export class ArcosAPI {
  private arcos: Arco[] = [];
  private loaded: boolean = false;

  /**
   * Cargar los arcos desde el archivo JSON
   */
  loadArcos(): void {
    try {
      const data = readFileSync("./arcos.json", "utf-8");
      this.arcos = JSON.parse(data);
      this.loaded = true;
    } catch (error) {
      throw new Error(`Error cargando arcos: ${error}`);
    }
  }

  /**
   * Obtener todos los arcos
   */
  getAllArcos(): Arco[] {
    this.ensureLoaded();
    return this.arcos;
  }

  /**
   * Buscar un arco por nombre (búsqueda parcial insensible a mayúsculas)
   */
  searchArco(query: string): Arco[] {
    this.ensureLoaded();
    const normalizedQuery = query.toLowerCase().trim();

    return this.arcos.filter((arco) =>
      arco.name.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Obtener un arco específico por nombre exacto
   */
  getArcoByName(name: string): Arco | null {
    this.ensureLoaded();
    return (
      this.arcos.find(
        (arco) => arco.name.toLowerCase() === name.toLowerCase()
      ) || null
    );
  }

  /**
   * Obtener arcos sin notas (completos)
   */
  getCompleteArcos(): Arco[] {
    this.ensureLoaded();
    return this.arcos.filter((arco) => !arco.notes);
  }

  /**
   * Obtener arcos con notas (incompletos o con observaciones)
   */
  getArcosWithNotes(): Arco[] {
    this.ensureLoaded();
    return this.arcos.filter((arco) => arco.notes);
  }

  /**
   * Obtener estadísticas básicas
   */
  getStats(): {
    total: number;
    complete: number;
    withNotes: number;
  } {
    this.ensureLoaded();

    return {
      total: this.arcos.length,
      complete: this.arcos.filter((arco) => !arco.notes).length,
      withNotes: this.arcos.filter((arco) => arco.notes).length,
    };
  }

  /**
   * Obtener solo los enlaces (para uso directo)
   */
  getAllLinks(): Array<{ name: string; link: string }> {
    this.ensureLoaded();
    return this.arcos.map((arco) => ({
      name: arco.name,
      link: arco.link,
    }));
  }

  /**
   * Obtener IDs de pixeldrain
   */
  getPixeldrainIds(): Array<{ name: string; id: string }> {
    this.ensureLoaded();
    return this.arcos.map((arco) => ({
      name: arco.name,
      id: arco.link.split("/").pop() || "",
    }));
  }

  /**
   * Asegurar que los datos estén cargados
   */
  private ensureLoaded(): void {
    if (!this.loaded) {
      this.loadArcos();
    }
  }
}
