#!/usr/bin/env bun

import { StremioAddonGenerator } from "./src/stremio-generator";

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Uso: bun generate-stremio.ts [opciones]");
    console.log("\nOpciones:");
    console.log("  --lang <es|en>     Idioma de los datos (por defecto: es)");
    console.log("  --input <path>     Ruta al archivo JSON de datos (por defecto: data/one-pace-data-{lang}.json)");
    console.log("  --output <path>    Directorio de salida (por defecto: ./stremio-addon)");
    console.log("\nEjemplos:");
    console.log("  bun generate-stremio.ts");
    console.log("  bun generate-stremio.ts --lang en --output ./my-addon");
    console.log("  bun generate-stremio.ts --input ./custom-data.json --output ./custom-addon");
    process.exit(0);
  }

  // Parsear argumentos
  let language: "es" | "en" = "es";
  let inputPath = "";
  let outputPath = "./stremio-addon";

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    if (!value && flag !== "--help" && flag !== "-h") {
      console.error(`❌ Error: Falta valor para ${flag}`);
      process.exit(1);
    }

    switch (flag) {
      case "--lang":
        if (value === "es" || value === "en") {
          language = value;
        } else {
          console.error("❌ Error: --lang debe ser 'es' o 'en'");
          process.exit(1);
        }
        break;
      case "--input":
        inputPath = value!;
        break;
      case "--output":
        outputPath = value!;
        break;
      case "--help":
      case "-h":
        console.log("Uso: bun generate-stremio.ts [opciones]");
        console.log("\nOpciones:");
        console.log("  --lang <es|en>     Idioma de los datos (por defecto: es)");
        console.log("  --input <path>     Ruta al archivo JSON de datos (por defecto: data/one-pace-data-{lang}.json)");
        console.log("  --output <path>    Directorio de salida (por defecto: ./stremio-addon)");
        process.exit(0);
      default:
        console.error(`❌ Error: Opción desconocida ${flag}`);
        process.exit(1);
    }
  }

  // Establecer ruta de entrada por defecto si no se especifica
  if (!inputPath) {
    inputPath = `data/one-pace-data-${language}.json`;
  }

  console.log("🎬 Generador de Addon Estático de Stremio - One Pace LATAM");
  console.log("=" .repeat(60));
  console.log(`📝 Idioma: ${language}`);
  console.log(`📂 Entrada: ${inputPath}`);
  console.log(`📁 Salida: ${outputPath}`);
  console.log("");

  try {
    // Verificar que existe el archivo de entrada
    const file = Bun.file(inputPath);
    if (!(await file.exists())) {
      console.error(`❌ Error: Archivo ${inputPath} no encontrado.`);
      console.log("💡 Ejecuta primero el scraper para generar los datos:");
      console.log(`   bun scraper.ts --lang ${language}`);
      process.exit(1);
    }

    // Generar addon
    const generator = new StremioAddonGenerator(outputPath);
    await generator.generateAddon(inputPath, language);

    console.log("");
    console.log("🎉 ¡Addon generado exitosamente!");
    console.log("");
    console.log("📋 Instrucciones de uso:");
    console.log("  1. Sube la carpeta a un hosting estático (GitHub Pages, Vercel, Netlify)");
    console.log("  2. En Stremio, ve a 'Addons' > 'Install addon via URL'");
    console.log("  3. Ingresa la URL: https://tu-dominio.com/manifest.json");
    console.log("");
    console.log("🔗 Estructura generada:");
    console.log(`  ${outputPath}/manifest.json`);
    console.log(`  ${outputPath}/catalog/series/one-pace-catalog.json`);
    console.log(`  ${outputPath}/meta/series/*.json`);
    console.log(`  ${outputPath}/stream/series/*.json`);

  } catch (error) {
    console.error("❌ Error generando addon:", error);
    process.exit(1);
  }
}

main();