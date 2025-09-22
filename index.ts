// Archivo de demostración simple
import { OnePaceAPI } from "./src/api";

async function demo() {
  console.log("🎬 Demo de One Pace LATAM\n");

  const api = new OnePaceAPI();

  try {
    // Cargar datos en español
    await api.loadData("es");

    // Mostrar estadísticas básicas
    const stats = api.getStats("es");
    console.log("📊 Estadísticas en español:");
    console.log(`   - Temporadas totales: ${stats.total}`);
    console.log(`   - Con subtítulos: ${stats.withSubtitles}`);
    console.log(`   - Con doblaje: ${stats.withDub}`);
    console.log(`   - Con extended: ${stats.withExtended}`);

    // Mostrar algunas temporadas populares
    console.log("\n🔥 Temporadas populares:");
    const popularSeasons = ["romance-dawn", "alabasta", "marineford", "wano"];

    for (const id of popularSeasons) {
      const season = api.getSeasonById(id, "es");
      if (season) {
        console.log(
          `   - ${season.title}: ${season.subtitle ? "✅ Sub" : "❌"} ${
            season.dub ? "✅ Dub" : "❌"
          }`
        );
      }
    }

    console.log("\n💡 Para usar el scraper completo: bun run scraper.ts");
    console.log("💡 Para ejecutar pruebas: bun run test.ts");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("\n💡 Ejecutar primero: bun run scraper.ts");
  }
}

demo();
