// Archivo de demostración principal
import { OnePaceAPI } from "./src/api";
import { ArcosAPI } from "./src/arcos-api";

async function demo() {
  console.log("🎬 Demo de One Pace LATAM\n");

  // API de arcos (siempre disponible)
  console.log("📄 Cargando arcos...");
  const arcosAPI = new ArcosAPI();
  arcosAPI.loadArcos();

  const arcosStats = arcosAPI.getStats();
  console.log("✅ Arcos disponibles");
  console.log(`   - Total de arcos: ${arcosStats.total}`);
  console.log(`   - Enlaces completos: ${arcosStats.complete}`);
  console.log(`   - Con notas: ${arcosStats.withNotes}`);

  // Mostrar arcos populares
  console.log("\n🔥 Arcos populares:");
  const popularArcs = [
    "Romance Dawn",
    "Arabasta",
    "Marineford",
    "Wano",
    "Skypiea",
  ];

  for (const arcName of popularArcs) {
    const arco = arcosAPI.getArcoByName(arcName);
    if (arco) {
      console.log(`   ✅ ${arco.name}: ${arco.link}`);
    } else {
      console.log(`   ❌ ${arcName}: No encontrado`);
    }
  }

  // Intentar cargar datos del scraper (opcional)
  try {
    console.log("\n📊 Cargando datos del scraper...");
    const scraperAPI = new OnePaceAPI();
    await scraperAPI.loadData("es");

    const scraperStats = scraperAPI.getStats("es");
    console.log("✅ Datos del scraper disponibles");
    console.log(`   - Temporadas totales: ${scraperStats.total}`);
    console.log(`   - Con subtítulos: ${scraperStats.withSubtitles}`);
    console.log(`   - Con doblaje: ${scraperStats.withDub}`);
    console.log(`   - Con extended: ${scraperStats.withExtended}`);
  } catch {
    console.log(
      "⚠️  Datos del scraper no disponibles (ejecuta: bun run scraper.ts)"
    );
  }

  console.log("\n💡 Comandos disponibles:");
  console.log("   - bun run scraper.ts (scraper de la web oficial)");
  console.log("   - bun run demo-arcos.ts (demo de arcos)");
}

demo();

demo();
