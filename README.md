# One Pace Stremio LATAM - Addon Unificado 🏴‍☠️

Addon completo de Stremio para ver One Pace con subtítulos y doblaje en español e inglés. Sistema automatizado con scraper inteligente, API programática completa y addon unificado que organiza todos los arcos como temporadas de una sola serie.

## 🎯 Características Principales

### ✨ Addon Unificado para Stremio

- **Una sola serie**: "One Pace" como serie principal unificada
- **30+ temporadas**: Todos los arcos organizados como temporadas
- **Múltiples formatos por episodio**: Subtítulos y doblaje disponibles
- **Soporte multiidioma**: Español e inglés completamente integrados
- **Versiones extendidas**: Incluye episodios normales y extendidos
- **Integración Pixeldrain**: URLs directas de streaming
- **Despliegue automatizado**: GitHub Actions + Cloudflare Pages

### 🤖 Sistema de Scraping Inteligente

- ✅ **Tipado completo con TypeScript**
- 🌍 **Soporte nativo para español e inglés**
- 🔄 **Detección automática de cambios con hashing MD5**
- 📊 **API programática completa para consultas**
- 🎬 **Soporte automático para versiones Extended**
- 🎙️ **Detección inteligente de subtítulos y doblaje**
- 📁 **Archivos JSON optimizados y versionados**
- 🔗 **Integración completa con Pixeldrain API**
- 📋 **Integración con arcos.json para episodios adicionales**

### 📋 Gestión de Arcos (arcos.json)

- **Arcos estáticos**: Configuración manual de arcos desde `arcos.json`
- **Episodios adicionales**: Soporte para agregar episodios extra a arcos existentes
- **Notas y estados**: Campo opcional para observaciones sobre arcos incompletos
- **API dedicada**: `ArcosAPI` para consultar y buscar arcos
- **Unificación inteligente**: Combina datos del scraper con arcos.json

## ⚡ Instalación y Configuración

### Prerrequisitos

```bash
# Instalar Bun (recomendado)
curl -fsSL https://bun.sh/install | bash

# O usar Node.js v18+ si prefieres
```

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/CarmeloCampos/one-pace-stremio-latam.git
cd one-pace-stremio-latam

# Instalar dependencias
bun install

# Ejecutar demo básico
bun run demo
```

## 🎮 Uso del Sistema

### 1. Usar el Addon en Producción (Recomendado)

**URL del Manifest**: `https://one-pace-latam-stremio.pages.dev/manifest.json`

**Instalación directa**: `stremio://one-pace-latam-stremio.pages.dev/manifest.json`

1. Abre Stremio en cualquier dispositivo
2. Ve a configuración (⚙️) → "Addons"
3. Haz clic en "Add addon"
4. Ingresa la URL: `https://one-pace-latam-stremio.pages.dev/manifest.json`
5. ¡Disfruta de One Pace completo!

**O usa el enlace de instalación directa**: `stremio://one-pace-latam-stremio.pages.dev/manifest.json`

### 2. Desarrollo Local

```bash
# Generar el addon localmente
bun run generate-unified

# El addon se genera en ./stremio-addon/
```

### 3. Extraer Datos (Scraper)

```bash
# Extraer datos en ambos idiomas y unificar con arcos.json
bun run scraper
```

El scraper inteligente:

- ✅ Extrae datos de One Pace en español e inglés
- 🔄 Detecta automáticamente cambios usando hashing MD5
- 📁 Solo sobrescribe archivos cuando detecta cambios reales
- 🌐 Integración completa con Pixeldrain API para carpetas de videos
- 📊 Genera estadísticas completas por idioma
- 🔗 Unifica datos con `arcos.json` para episodios adicionales
- 💾 Guarda en `data/one-pace-data-es.json` y `data/one-pace-data-en.json`

### 4. API Programática

```typescript
import { OnePaceAPI } from "./src/api";
import { ArcosAPI } from "./src/arcos-api";

// API de arcos (datos estáticos desde arcos.json)
const arcosAPI = new ArcosAPI();
arcosAPI.loadArcos();

// Buscar arco por nombre
const arco = arcosAPI.getArcoByName("Arabasta");
console.log(arco?.link);

// Obtener arcos completos
const completos = arcosAPI.getCompleteArcos();

// API del scraper (datos extraídos de onepace.net)
const scraperAPI = new OnePaceAPI();
await scraperAPI.loadData("es");

// Buscar temporada por ID
const season = scraperAPI.getSeasonById("romance-dawn", "es");

// Buscar por título
const results = scraperAPI.searchSeasonsByTitle("arabasta", "es");

// Obtener temporadas con doblaje
const withDub = scraperAPI.getSeasonsWithDub("es");
```

## 📊 Estructura de Datos

### Arco (desde arcos.json)

```typescript
interface Arco {
  name: string;
  link: string;
  additionalEpisodes?: string[];
  notes?: string;
}
```

### Season (desde scraper)

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

## 📁 Estructura del Proyecto

```
one-pace-stremio-latam/
├── .github/workflows/
│   └── build_deploy.yml               # GitHub Actions para CI/CD
├── src/
│   ├── improved-stremio-generator.ts  # Generador del addon unificado
│   ├── api.ts                         # API para datos del scraper
│   ├── arcos-api.ts                   # API para arcos desde arcos.json
│   ├── scraper.ts                     # Scraper inteligente principal
│   └── one-cheerio.ts                 # Función base de web scraping
├── data/
│   ├── one-pace-data-es.json          # Datos extraídos (español)
│   ├── one-pace-data-en.json          # Datos extraídos (inglés)
│   └── .gitkeep
├── stremio-addon/                     # Addon generado
│   ├── manifest.json                  # Configuración del addon
│   ├── catalog/series/                # Catálogos de series
│   ├── meta/series/                   # Metadatos de episodios
│   └── stream/series/                 # Archivos de streams
├── arcos.json                         # Configuración de arcos estáticos
├── generate-improved-stremio.ts       # Script generador principal
├── index.ts                           # Demo y pruebas básicas
├── package.json                       # Dependencias y scripts
├── tsconfig.json                      # Configuración TypeScript estricta
├── wrangler.toml                      # Configuración Cloudflare Pages
└── README.md                          # Esta documentación
```

## 🛠️ Scripts Disponibles

```bash
bun run demo              # Ejecutar demo de estadísticas
bun run scraper           # Ejecutar scraper inteligente completo
bun run generate-unified  # Generar addon unificado de Stremio
```

## 🎯 Funcionalidades de la API

### ArcosAPI

- `loadArcos()` - Cargar arcos desde arcos.json
- `getAllArcos()` - Obtener todos los arcos
- `searchArco(query)` - Buscar por nombre (parcial)
- `getArcoByName(name)` - Obtener por nombre exacto
- `getCompleteArcos()` - Arcos sin notas (completos)
- `getArcosWithNotes()` - Arcos con observaciones
- `getAllLinks()` - Obtener solo enlaces
- `getPixeldrainIds()` - Obtener IDs de Pixeldrain
- `getStats()` - Estadísticas básicas

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

## 🔧 Arquitectura Técnica

### Stack Tecnológico

- **Runtime**: Bun (JavaScript/TypeScript ultrarrápido)
- **Lenguaje**: TypeScript con configuración estricta
- **Web Scraping**: Cheerio para parsing HTML
- **APIs**: Integración nativa con Pixeldrain API
- **CI/CD**: GitHub Actions
- **Hosting**: Cloudflare Pages con CDN global
- **Versionado**: Sistema inteligente de hashing MD5

### Flujo de Datos

```
1. onepace.net → Scraper (Cheerio)
2. arcos.json → Integración de episodios adicionales
3. Pixeldrain API → Extracción de carpetas de videos
4. Datos procesados → JSON tipado (ES/EN)
5. Generador → Archivos de addon Stremio
6. GitHub Actions → Despliegue automático
7. Cloudflare Pages → Distribución global
```

## 📈 Estadísticas del Addon

El addon se genera dinámicamente con los datos extraídos del scraper y arcos.json. Las estadísticas exactas varían según las actualizaciones de One Pace.

### Fuentes de Datos

| Fuente | Tipo | Descripción |
|--------|------|-------------|
| onepace.net (ES) | Scraping | Arcos con subtítulos y doblaje en español |
| onepace.net (EN) | Scraping | Arcos con subtítulos y doblaje en inglés |
| arcos.json | Manual | Arcos con enlaces directos a Pixeldrain y episodios adicionales |

### Características

- **30+ temporadas** organizadas por arcos
- **Múltiples calidades** por episodio (480p, 720p, 1080p)
- **4 formatos por episodio**: Sub ES, Dub ES, Sub EN, Dub EN
- **Versiones extendidas** para algunos arcos
- **Actualización automática** cada push a repositorio
- **Despliegue global** vía Cloudflare Pages

## 🔧 Sistema Inteligente de Detección de Cambios

El scraper implementa un sistema avanzado de hashing MD5:

- ✅ **Sin cambios detectados**: No sobrescribe, mantiene archivo existente
- 🔄 **Cambios detectados**: Sobrescribe automáticamente con nueva data
- 📝 **Archivo nuevo**: Crea el archivo automáticamente
- 🚀 **Optimización**: Solo procesa cuando hay cambios reales
- 📊 **Logging inteligente**: Reporta exactamente qué cambió y cuándo

## 🌍 Soporte de Idiomas

- 🇪🇸 **Español**: `data/one-pace-data-es.json`
- 🇬🇧 **Inglés**: `data/one-pace-data-en.json`

### Diferencias por idioma:

- Algunas temporadas están disponibles solo en inglés
- El doblaje está más disponible en inglés
- Las versiones extended varían entre idiomas

## 🎬 Versiones Extended

Ciertas temporadas tienen versiones extendidas:

- **Arlong Park**: Sub y Dub Extended
- **País de Wa**: Sub Extended
- Y más en inglés...

## 🚀 Despliegue Automatizado

### 🌐 Producción Actual

**El addon está desplegado automáticamente en:**
- **URL**: `https://one-pace-latam-stremio.pages.dev/manifest.json`
- **Plataforma**: Cloudflare Pages
- **Actualización**: Automática con cada push a `main`
- **CI/CD**: GitHub Actions integrado

### 🔄 Flujo de Despliegue Automático

El proyecto tiene configurado un pipeline completo:

```yaml
# .github/workflows/build_deploy.yml
1. Push a main branch
2. GitHub Actions se ejecuta automáticamente
3. Instala dependencias con Bun
4. Ejecuta scraper para actualizar datos
5. Genera addon unificado
6. Despliega a Cloudflare Pages
```

### 📱 Instalar el Addon en Stremio

1. **Abre Stremio** en cualquier dispositivo
2. **Ve a configuración** (⚙️) → "Addons"
3. **Haz clic en** "Add addon"
4. **Pega esta URL**: `https://one-pace-latam-stremio.pages.dev/manifest.json`
5. **¡Listo!** Ya puedes ver One Pace completo

**Instalación directa**: `stremio://one-pace-latam-stremio.pages.dev/manifest.json`

### 🔧 URLs del Addon en Producción

- **Manifest**: `https://one-pace-latam-stremio.pages.dev/manifest.json`
- **Catálogo**: `https://one-pace-latam-stremio.pages.dev/catalog/series/one-pace-complete.json`
- **Metadata**: `https://one-pace-latam-stremio.pages.dev/meta/series/onepace_complete_series.json`
- **Stream ejemplo**: `https://one-pace-latam-stremio.pages.dev/stream/series/onepace_s01e01.json`

## 🤝 Contribuir

El proyecto está completamente automatizado, pero siempre se aceptan contribuciones:

### 🔧 Áreas de Contribución

- **Mejoras del scraper**: Optimizaciones o nuevas funcionalidades
- **API enhancements**: Nuevos métodos o utilidades
- **Documentación**: Mejoras o traducciones
- **Bug fixes**: Cualquier problema encontrado
- **Features**: Nuevas características para el addon
- **arcos.json**: Agregar o actualizar arcos faltantes

### 📋 Proceso

1. **Fork** del repositorio
2. **Crear rama** feature (`git checkout -b feature/MejoraIncreible`)
3. **Commit** cambios (`git commit -m 'Add: nueva funcionalidad increíble'`)
4. **Push** a la rama (`git push origin feature/MejoraIncreible`)
5. **Pull Request** con descripción detallada

### 🧪 Testing Local

```bash
bun run demo              # Verificar que las APIs funcionan
bun run scraper           # Probar el scraper
bun run generate-unified  # Generar addon localmente
```

## ⚡ Rendimiento y Optimizaciones

### 📊 Métricas del Sistema

- **Tiempo de build**: ~30-60 segundos (CI/CD completo)
- **Cache inteligente**: Solo actualiza archivos cuando hay cambios reales
- **Procesamiento paralelo**: Scraping ES/EN simultáneo
- **Cache de dependencias**: GitHub Actions optimizado
- **TypeScript estricto**: Detección temprana de errores

### 🌐 Distribución Global

- **CDN**: Cloudflare con 200+ ubicaciones mundiales
- **Latencia**: <100ms desde cualquier ubicación
- **Uptime**: 99.9% garantizado por Cloudflare
- **Escalabilidad**: Automática sin límites de usuarios

## ⚖️ Licencia y Disclaimer

- 📚 **Fan Project**: Sin afiliación oficial con One Piece o Toei Animation
- 🎓 **Uso educativo**: Para aprendizaje y demostración técnica
- 🤝 **Open Source**: Código completamente abierto y libre
- 🔗 **Enlaces**: Solo enlaza a contenido ya público en One Pace oficial
- 🚫 **No hosting**: No aloja contenido, solo metadatos y enlaces

---

## 🏴‍☠️ ¡Disfruta One Pace!

**El addon está listo para usar ahora mismo:**

```
stremio://one-pace-latam-stremio.pages.dev/manifest.json
```

**O añade manualmente en Stremio:**
```
https://one-pace-latam-stremio.pages.dev/manifest.json
```

### ¿Problemas o sugerencias?

- 📝 **Issues**: [GitHub Issues](https://github.com/CarmeloCampos/one-pace-stremio-latam/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/CarmeloCampos/one-pace-stremio-latam/discussions)
- 📧 **Contacto**: Via GitHub o issues

**¡Que disfrutes navegando por el Grand Line con One Pace! ⚓**
