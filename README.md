# One Pace LATAM Scraper 🎬

Un scraper completo para extraer información de episodios de One Pace en español e inglés, con sistema inteligente de detección de cambios y API fácil de usar.

## 🚀 Características

- ✅ **Tipado completo con TypeScript**
- 🌍 **Soporte para español e inglés**
- 🔄 **Sistema inteligente de detección de cambios**
- 📊 **API completa para consultar datos**
- 🎬 **Soporte para versiones Extended**
- 🎙️ **Detección de subtítulos y doblaje**
- 📁 **Archivos JSON optimizados**

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd one-pace-latam

# Instalar dependencias
bun install

# Ejecutar demo básico
bun run index.ts
```

## 🛠️ Uso

### 1. Extraer datos (Scraper)

```bash
# Extraer datos en ambos idiomas
bun run scraper.ts
```

El scraper:

- Extrae datos de One Pace en español e inglés
- Detecta automáticamente cambios y solo sobrescribe si es necesario
- Genera archivos `one-pace-data-es.json` y `one-pace-data-en.json`

### 2. Usar la API

```typescript
import { OnePaceAPI } from "./api";

const api = new OnePaceAPI();

// Cargar datos
await api.loadData("es");

// Obtener estadísticas
const stats = api.getStats("es");
console.log(stats);

// Buscar temporada por ID
const season = api.getSeasonById("romance-dawn", "es");

// Buscar por título
const results = api.searchSeasonsByTitle("arabasta", "es");

// Obtener temporadas con doblaje
const withDub = api.getSeasonsWithDub("es");
```

### 3. Ejecutar pruebas

```bash
bun run test.ts
```

## 📊 Estructura de Datos

```typescript
interface Season {
  id: string;
  title: string;
  description: string;
  subtitle?: {
    qualities: Array<{ quality: string; url: string }>;
  };
  dub?: {
    qualities: Array<{ quality: string; url: string }>;
  };
  extended?: {
    subtitle?: { qualities: Quality[] };
    dub?: { qualities: Quality[] };
  };
}
```

## 📁 Archivos del Proyecto

```
one-pace-latam/
├── scraper.ts          # Scraper principal con tipado completo
├── api.ts              # API para consultar datos extraídos
├── test.ts             # Pruebas y ejemplos de la API
├── index.ts            # Demo simple
├── src/
│   └── one-cheerio.ts  # Función base de scraping
├── one-pace-data-es.json  # Datos en español
├── one-pace-data-en.json  # Datos en inglés
└── README.md           # Esta documentación
```

## 🎯 Funcionalidades de la API

### OnePaceAPI

- `loadData(lang)` - Cargar datos de un idioma
- `getSeasons(lang)` - Obtener todas las temporadas
- `getSeasonById(id, lang)` - Buscar por ID
- `searchSeasonsByTitle(query, lang)` - Buscar por título
- `getSeasonsWithSubtitles(lang)` - Temporadas con subtítulos
- `getSeasonsWithDub(lang)` - Temporadas con doblaje
- `getSeasonsWithExtended(lang)` - Temporadas con versiones extended
- `getAvailableQualities(seasonId, lang)` - Calidades disponibles
- `getStats(lang)` - Estadísticas generales
- `getMetadata(lang)` - Metadatos de extracción

## 📈 Estadísticas Actuales

| Métrica        | Español | Inglés |
| -------------- | ------- | ------ |
| Temporadas     | 34      | 38     |
| Con subtítulos | 33      | 38     |
| Con doblaje    | 12      | 24     |
| Con extended   | 2       | 3      |

## 🔧 Sistema de Detección de Cambios

El scraper utiliza hashes MD5 para detectar cambios en el contenido:

- ✅ **Sin cambios**: No sobrescribe el archivo
- 🔄 **Con cambios**: Sobrescribe automáticamente
- 📝 **Archivo nuevo**: Crea el archivo

## 🌍 Soporte de Idiomas

- 🇪🇸 **Español**: `one-pace-data-es.json`
- 🇬🇧 **Inglés**: `one-pace-data-en.json`

### Diferencias por idioma:

- Algunas temporadas están disponibles solo en inglés
- El doblaje está más disponible en inglés
- Las versiones extended varían entre idiomas

## 🎬 Versiones Extended

Ciertas temporadas tienen versiones extendidas:

- **Arlong Park**: Sub y Dub Extended
- **País de Wa**: Sub Extended
- Y más en inglés...

## 🚦 Comandos Rápidos

```bash
# Demo básico
bun run index.ts

# Scraper completo
bun run scraper.ts

# Pruebas de API
bun run test.ts
```

## 📝 Ejemplo de Uso Completo

```typescript
import { OnePaceAPI } from "./api";

async function example() {
  const api = new OnePaceAPI();

  // Cargar datos en español
  await api.loadData("es");

  // Obtener temporadas con doblaje
  const dubSeasons = api.getSeasonsWithDub("es");
  console.log(`Temporadas con doblaje: ${dubSeasons.length}`);

  // Buscar Arabasta
  const arabasta = api.searchSeasonsByTitle("arabasta", "es")[0];
  if (arabasta) {
    console.log(`${arabasta.title}: ${arabasta.description}`);

    // Ver calidades disponibles
    const qualities = api.getAvailableQualities(arabasta.id, "es");
    console.log("Calidades:", qualities);
  }
}
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## ⚖️ Licencia

Este proyecto es para uso educativo y personal. Respeta los términos de uso de One Pace.

---

**¡Disfruta navegando por el mundo de One Pace! 🏴‍☠️**m

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
