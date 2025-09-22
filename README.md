# One Pace Stremio LATAM - Addon Unificado �‍☠️

Addon completo de Stremio para ver One Pace con subtítulos y doblaje en español e inglés. Incluye scraper avanzado, API para consultas y sistema de addon unificado organizado como una sola serie con temporadas por arcos.

## 🎯 Características Principales

### ✨ Addon Unificado para Stremio

- **Una sola serie**: "One Pace" como serie principal unificada
- **Temporadas organizadas**: Cada arco de One Pace es una temporada
- **Múltiples formatos por episodio**: Subtítulos y doblaje disponibles para cada episodio
- **Soporte multiidioma**: Español e inglés en el mismo proyecto
- **Versiones extendidas**: Incluye episodios normales y extendidos cuando estén disponibles
- **Calidades múltiples**: 480p, 720p, 1080p para cada formato

### � Sistema de Scraping Avanzado

- ✅ **Tipado completo con TypeScript**
- 🌍 **Soporte para español e inglés**
- 🔄 **Sistema inteligente de detección de cambios**
- 📊 **API completa para consultar datos**
- 🎬 **Soporte para versiones Extended**
- 🎙️ **Detección de subtítulos y doblaje**
- 📁 **Archivos JSON optimizados**

## � Estructura de Temporadas

Cada temporada corresponde a un arco de One Pace:

- Temporada 1: Romance Dawn
- Temporada 2: Orange Town
- Temporada 3: Syrup Village
- Temporada 5: Baratie
- Y así sucesivamente...

### 🎬 Formatos Disponibles por Episodio

Para cada episodio tienes acceso a:

- **Subtítulos en Español** (480p, 720p, 1080p)
- **Doblaje en Español** (480p, 720p, 1080p)
- **Subtítulos en Inglés** (480p, 720p, 1080p)
- **Doblaje en Inglés** (480p, 720p, 1080p) - cuando esté disponible
- **Versiones Extendidas** - para algunos arcos

## �📦 Instalación y Configuración

### Prerrequisitos

```bash
# Instalar Bun (recomendado)
curl -fsSL https://bun.sh/install | bash

# O usar Node.js/npm si prefieres
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/CarmeloCampos/one-pace-stremio-latam.git
cd one-pace-stremio-latam

# Instalar dependencias
bun install

# Ejecutar demo básico
bun run index.ts
```

## � Uso del Sistema

### 1. Generar el Addon Unificado (Recomendado)

```bash
# Generar el addon mejorado unificado
bun run generate-unified

# Servir el addon localmente
bun run serve-unified

# Generar y servir en un solo comando
bun run build-and-serve
```

### 2. Agregar a Stremio

1. Ejecuta `bun run serve-unified`
2. Abre Stremio
3. Ve a la configuración (⚙️) → "Addons"
4. Haz clic en "Add addon"
5. Ingresa la URL: `http://localhost:3000/manifest.json`
6. ¡Disfruta de One Pace!

### 3. Extraer Datos (Scraper)

```bash
# Extraer datos en ambos idiomas
bun run src/scraper.ts
```

El scraper:

- Extrae datos de One Pace en español e inglés
- Detecta automáticamente cambios y solo sobrescribe si es necesario
- Genera archivos `data/one-pace-data-es.json` y `data/one-pace-data-en.json`

### 4. Usar la API Programática

```typescript
import { OnePaceAPI } from "./src/api";

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

### 5. Ejecutar Demo

```bash
bun run index.ts
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

## 📁 Estructura del Proyecto

```
one-pace-stremio-latam/
├── src/
│   ├── improved-stremio-generator.ts   # Generador unificado
│   ├── api.ts                         # API para consultar datos
│   ├── scraper.ts                     # Scraper principal
│   └── one-cheerio.ts                 # Función base de scraping
├── data/
│   ├── one-pace-data-es.json          # Datos en español
│   └── one-pace-data-en.json          # Datos en inglés
├── stremio-addon/                     # Addon generado
│   ├── manifest.json
│   ├── catalog/
│   ├── meta/
│   └── stream/
├── generate-improved-stremio.ts       # Script generador unificado
├── serve-unified-addon.ts             # Servidor del addon
├── index.ts                           # Demo simple
├── package.json                       # Dependencias y scripts
├── tsconfig.json                      # Configuración TypeScript
└── README.md                          # Esta documentación
```

## 🛠️ Scripts Disponibles

```bash
# Addon Unificado
bun run generate-unified    # Generar addon unificado
bun run serve-unified       # Servir addon localmente
bun run build-and-serve     # Generar y servir en un comando

# Scraping y Datos
bun run scraper            # Ejecutar scraper completo
bun run index.ts           # Demo básico
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

## 🌐 URLs del Addon

Una vez que el servidor esté corriendo:

- **Manifest**: `http://localhost:3000/manifest.json`
- **Catálogo**: `http://localhost:3000/catalog/series/one-pace-complete.json`
- **Metadata**: `http://localhost:3000/meta/series/onepace_complete_series.json`
- **Stream ejemplo**: `http://localhost:3000/stream/series/onepace_s01e01.json`

## 📈 Estadísticas del Addon Unificado

- **29 temporadas** (arcos de One Pace)
- **Cientos de episodios** organizados correctamente
- **Múltiples calidades**: 480p, 720p, 1080p
- **4 formatos por episodio**: Sub ES, Dub ES, Sub EN, Dub EN
- **12+ streams por episodio** típicamente

### Estadísticas por Idioma

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

## � Cómo Funciona el Sistema Unificado

### Antes vs Después

#### Sistema Anterior (Legacy)

```
🔴 Problema: Cada arco era una "serie" separada
├── Romance Dawn (Serie independiente)
├── Orange Town (Serie independiente)
├── Syrup Village (Serie independiente)
└── ... (35+ series separadas)
```

#### Sistema Nuevo (Unificado)

```
✅ Solución: Una sola serie con temporadas
One Pace (Serie unificada)
├── Temporada 1: Romance Dawn
│   ├── Episodio 1 (Sub ES, Dub ES, Sub EN, Dub EN)
│   ├── Episodio 2 (Sub ES, Dub ES, Sub EN, Dub EN)
│   └── ...
├── Temporada 2: Orange Town
├── Temporada 3: Syrup Village
└── ... (29 temporadas)
```

### Generación del Addon

1. **Carga de datos**: Lee los archivos JSON de español e inglés
2. **Unificación**: Combina ambos idiomas en una sola serie
3. **Organización**: Agrupa por temporadas (arcos) y episodios
4. **Generación de streams**: Crea múltiples opciones por episodio
5. **Exportación**: Genera los archivos JSON para Stremio

### Servidor del Addon

- Sirve los archivos JSON generados
- Maneja CORS para compatibilidad con Stremio
- Proporciona endpoints para manifest, catálogos, metadata y streams

## 🚦 Comandos Rápidos

```bash
# Todo en uno (Recomendado)
bun run build-and-serve

# Por pasos
bun run generate-unified
bun run serve-unified

# Demo y scraping
bun run index.ts
bun run src/scraper.ts
```

## 📝 Ejemplo de Uso Completo

```typescript
import { OnePaceAPI } from "./src/api";

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

## 🎥 Ejemplo de Episodio

Un episodio típico incluye múltiples streams:

```json
{
  "streams": [
    {
      "title": "1080p - Subtítulos Español",
      "url": "https://pixeldrain.net/api/file/...",
      "quality": "1080p",
      "language": "es"
    },
    {
      "title": "1080p - Doblaje Español",
      "url": "https://pixeldrain.net/api/file/...",
      "quality": "1080p",
      "language": "es"
    },
    {
      "title": "1080p - Subtítulos English",
      "url": "https://pixeldrain.net/api/file/...",
      "quality": "1080p",
      "language": "en"
    }
  ]
}
```

## 🚀 Despliegue en Producción

### 🌐 GitHub Pages (Recomendado para Addon Estático)

#### Preparación

```bash
# Generar addon estático
bun run generate-unified
```

#### Configuración

1. Crea un nuevo repositorio en GitHub
2. Sube la carpeta `stremio-addon` al repositorio
3. Ve a Settings → Pages
4. Selecciona "Deploy from a branch" → main → / (root)
5. Tu addon estará disponible en: `https://tu-usuario.github.io/tu-repo/manifest.json`

#### Estructura del repositorio:

```
tu-repo/
├── manifest.json
├── catalog/
├── meta/
├── stream/
└── README.md
```

### ⚡ Vercel (Recomendado para Servidor Dinámico)

#### Para Addon Estático

```bash
npm i -g vercel
cd stremio-addon
vercel
```

#### Para Servidor Dinámico

```bash
# Usar el servidor completo
vercel
```

Tu addon estará disponible en: `https://tu-proyecto.vercel.app/manifest.json`

### 🚀 Netlify

#### Addon Estático

1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Arrastra la carpeta `stremio-addon` a la zona de drop
3. Tu addon estará disponible en: `https://random-name.netlify.app/manifest.json`

#### Netlify Functions

Configura como función serverless usando el servidor Bun.

### ☁️ Railway

```bash
railway login
railway init
railway up
```

### 🔗 Cloudflare Workers

Usa el archivo `cloudflare-worker.js` incluido para deployment en Cloudflare.

### 🔄 Actualización Automática con GitHub Actions

Configura actualización automática del addon:

```yaml
# .github/workflows/update-addon.yml
name: Update Stremio Addon
on:
  schedule:
    - cron: "0 6 * * *" # Diario a las 6 AM
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run src/scraper.ts
      - run: bun run generate-unified
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Auto-update addon" || exit 0
          git push
```

### 🎯 URLs Finales

Tu addon quedará disponible en una URL como:

- `https://tu-usuario.github.io/one-pace-stremio/manifest.json`
- `https://one-pace-addon.vercel.app/manifest.json`
- `https://one-pace-123456.netlify.app/manifest.json`

### 📱 Instalar en Stremio

1. **Copia la URL del manifest**: `https://tu-dominio.com/manifest.json`
2. **Abre Stremio** en cualquier dispositivo
3. **Ve a Addons** → "Install addon via URL"
4. **Pega la URL** del manifest
5. **¡Disfruta!** Ahora puedes ver One Pace desde Stremio

### 🔧 Verificar que Funciona

Antes de instalar en Stremio, puedes probar las URLs:

- **Manifest**: `https://tu-dominio.com/manifest.json`
- **Catálogo**: `https://tu-dominio.com/catalog/series/one-pace-complete.json`
- **Meta**: `https://tu-dominio.com/meta/series/onepace_complete_series.json`
- **Stream**: `https://tu-dominio.com/stream/series/onepace_s01e01.json`

### 💡 Consejos para Hosting

#### CORS (Cross-Origin Resource Sharing)

Los servicios mencionados (GitHub Pages, Vercel, Netlify) configuran automáticamente CORS para servir JSON. No necesitas configuración adicional.

#### Custom Domain

En GitHub Pages puedes configurar un dominio personalizado en Settings → Pages → Custom domain.

## 🎯 Beneficios del Sistema Unificado

### Para el Usuario

- ✅ **Más fácil de navegar**: Una sola serie vs 35+ series
- ✅ **Mejor organización**: Temporadas lógicas por arcos
- ✅ **Múltiples opciones**: Sub/Dub/Calidades en cada episodio
- ✅ **Experiencia nativa**: Como ver cualquier serie en Stremio

### Para el Desarrollador

- ✅ **Código más limpio**: Un solo generador especializado
- ✅ **Mantenimiento simplificado**: Una sola estructura unificada
- ✅ **Sin legacy**: Sistema completamente modernizado
- ✅ **Escalabilidad**: Fácil agregar nuevos arcos
- ✅ **Multiidioma nativo**: Soporte built-in para múltiples idiomas

## 🔄 Migración del Sistema Legacy

- ✅ **Sistema unificado único**: Ya no se mantiene el sistema legacy
- ✅ **Experiencia mejorada**: Una sola serie organizada por temporadas
- ✅ **Datos existentes**: Usa los mismos archivos de datos del scraper
- ✅ **Hosting flexible**: Funciona en cualquier servidor

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Changelog

### v2.0.0 - Addon Unificado ✨

- ✨ Una sola serie "One Pace" con temporadas por arcos
- 🌍 Soporte multiidioma (español/inglés)
- 🎬 Múltiples formatos por episodio
- 📱 Interfaz mejorada en Stremio
- 🚀 Servidor optimizado
- 🗑️ Sistema legacy eliminado - solo addon unificado

## 🙏 Créditos

- **One Pace Team**: Por el increíble trabajo de re-edición
- **Eiichiro Oda**: Creador de One Piece
- **Stremio**: Por la plataforma de streaming

## ⚖️ Licencia

Este proyecto es un fan project y no tiene afiliación oficial con One Piece o Toei Animation. Es para uso educativo y personal.

---

**¡Disfruta navegando por el mundo de One Pace! 🏴‍☠️**

### Quick Start

```bash
bun install
bun run build-and-serve
# Agrega http://localhost:3000/manifest.json a Stremio
```
