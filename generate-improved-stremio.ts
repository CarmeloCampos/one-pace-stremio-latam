import { ImprovedStremioAddonGenerator } from "./src/improved-stremio-generator";

async function main() {
  console.log("🚀 Generando addon mejorado de Stremio para One Pace...");

  const generator = new ImprovedStremioAddonGenerator();
  
  try {
    await generator.generateUnifiedAddon(
      "./data/one-pace-data-es.json",
      "./data/one-pace-data-en.json"
    );
    
    console.log("🎉 ¡Addon mejorado generado exitosamente!");
    console.log("📁 Directorio: ./stremio-addon");
    console.log("🔗 Manifest: ./stremio-addon/manifest.json");
    
    console.log("\n✨ Características del nuevo addon:");
    console.log("• Una sola serie: One Pace");
    console.log("• Temporadas organizadas por arcos");
    console.log("• Episodios con múltiples formatos (Sub/Dub)");
    console.log("• Soporte para español e inglés");
    console.log("• Versiones normales y extendidas");
    
  } catch (error) {
    console.error("❌ Error al generar el addon:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}