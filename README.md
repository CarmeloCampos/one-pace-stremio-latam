# One Pace Stremio LATAM - Addon Unificado 🏴‍☠️

Addon completo de Stremio para ver One Pace con subtítulos y doblaje en español e inglés. Sistema automatizado con scraper inteligente, API programática completa y addon unificado que organiza todos los arcos como temporadas de una sola serie.

## 🎯 Características Principales

### ✨ Addon Unificado para Stremio

- **Una sola serie**: "One Pace" como serie principal unificada
- **403+ episodios**: Todos los arcos organizados como temporadas  
- **Múltiples formatos por episodio**: Subtítulos y doblaje disponibles
- **Soporte multiidioma**: Español e inglés completamente integrados
- **Versiones extendidas**: Incluye episodios normales y extendidos
- **Calidades múltiples**: 480p, 720p, 1080p para cada formato
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

## 🗂️ Estructura de Temporadas

Cada temporada corresponde a un arco de One Pace con episodios completos:

- **Temporada 1**: Romance Dawn
- **Temporada 2**: Orange Town  
- **Temporada 3**: Syrup Village
- **Temporada 4**: Baratie
- **Temporada 5**: Arlong Park
- **Temporada 6**: Loguetown
- Y así sucesivamente hasta **38 temporadas** (inglés) / **34 temporadas** (español)

### 🎬 Formatos Disponibles por Episodio

Para cada episodio tienes acceso a:

- **Subtítulos en Español** (480p, 720p, 1080p)
- **Doblaje en Español** (480p, 720p, 1080p)
- **Subtítulos en Inglés** (480p, 720p, 1080p)
- **Doblaje en Inglés** (480p, 720p, 1080p) - cuando esté disponible
- **Versiones Extendidas** - para algunos arcos

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

## � Uso del Sistema

### 1. Usar el Addon en Producción (Recomendado)

**URL del Addon**: `https://one-pace-latam-stremio.pages.dev/manifest.json`

1. Abre Stremio en cualquier dispositivo
2. Ve a configuración (⚙️) → "Addons" 
3. Haz clic en "Add addon"
4. Ingresa la URL: `https://one-pace-latam-stremio.pages.dev/manifest.json`
5. ¡Disfruta de One Pace completo!

### 2. Desarrollo Local

```bash
# Generar el addon localmente
bun run generate-unified

# Para servir localmente, necesitarás implementar un servidor
# El addon se genera en ./stremio-addon/
```

### 3. Extraer Datos (Scraper)

```bash
# Extraer datos en ambos idiomas
bun run scraper
```

El scraper inteligente:

- ✅ Extrae datos de One Pace en español (34 temporadas) e inglés (38 temporadas)
- 🔄 Detecta automáticamente cambios usando hashing MD5
- 📁 Solo sobrescribe archivos cuando detecta cambios reales
- 🌐 Integración completa con Pixeldrain API para carpetas de videos
- 📊 Genera estadísticas completas por idioma
- 💾 Guarda en `data/one-pace-data-es.json` y `data/one-pace-data-en.json`

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
bun run demo
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
├── .github/workflows/
│   └── build_deploy.yml               # GitHub Actions para CI/CD
├── src/
│   ├── improved-stremio-generator.ts  # Generador del addon unificado
│   ├── api.ts                         # API programática para consultas
│   ├── scraper.ts                     # Scraper inteligente principal  
│   └── one-cheerio.ts                 # Función base de web scraping
├── data/
│   ├── one-pace-data-es.json          # 34 temporadas en español
│   └── one-pace-data-en.json          # 38 temporadas en inglés
├── stremio-addon/                     # Addon generado (403+ archivos)
│   ├── manifest.json                  # Configuración del addon
│   ├── catalog/series/                # Catálogos de series
│   ├── meta/series/                   # Metadatos de episodios
│   └── stream/series/                 # 403+ archivos de streams
├── generate-improved-stremio.ts       # Script generador principal
├── index.ts                           # Demo y pruebas básicas
├── package.json                       # Dependencias y scripts npm
├── tsconfig.json                      # Configuración TypeScript estricta
├── wrangler.toml                      # Configuración Cloudflare Pages
└── README.md                          # Esta documentación
```

## 🛠️ Scripts Disponibles

```bash
# Scripts principales
bun run demo               # Ejecutar demo con estadísticas
bun run scraper           # Ejecutar scraper inteligente completo
bun run generate-unified  # Generar addon unificado para Stremio

# El proyecto se despliega automáticamente con GitHub Actions
# Cada push a main actualiza https://one-pace-latam-stremio.pages.dev/
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
2. Pixeldrain API → Extracción de carpetas de videos  
3. Datos procesados → JSON tipado (ES/EN)
4. Generador → 403+ archivos de addon Stremio
5. GitHub Actions → Despliegue automático
6. Cloudflare Pages → Distribución global
```

## 📈 Estadísticas Actuales del Addon

- **403+ episodios** individuales disponibles
- **38 temporadas** máximo (inglés) / **34 temporadas** (español)  
- **Múltiples calidades**: 480p, 720p, 1080p por episodio
- **4 formatos por episodio**: Sub ES, Dub ES, Sub EN, Dub EN
- **Actualización automática** cada push a repositorio
- **Despliegue global** vía Cloudflare Pages

### Estadísticas Detalladas por Idioma

| Métrica              | Español | Inglés |
| -------------------- | ------- | ------ |
| Temporadas totales   | 34      | 38     |
| Con subtítulos       | 33      | 38     |
| Con doblaje          | 12      | 24     |
| Con versiones extended | 2     | 3      |
| Última actualización | Automática con GitHub Actions |

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
# Usar addon en producción (Recomendado)
# URL: https://one-pace-latam-stremio.pages.dev/manifest.json

# Desarrollo local
bun run scraper           # Actualizar datos
bun run generate-unified  # Generar addon
bun run demo             # Ver estadísticas y ejemplos
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

### �️ Configuración del Pipeline

El workflow automático incluye:

- ✅ **Cache de dependencias** para builds rápidos
- 🔄 **Scraping automático** de datos actualizados  
- 🏗️ **Generación del addon** completo
- 🚀 **Despliegue a Cloudflare Pages**
- 📊 **403+ archivos** de streams generados automáticamente

### 📱 Instalar el Addon en Stremio

1. **Abre Stremio** en cualquier dispositivo
2. **Ve a configuración** (⚙️) → "Addons"
3. **Haz clic en** "Add addon" 
4. **Pega esta URL**: `https://one-pace-latam-stremio.pages.dev/manifest.json`
5. **¡Listo!** Ya puedes ver One Pace completo

### 🔧 URLs del Addon en Producción

- **Manifest**: `https://one-pace-latam-stremio.pages.dev/manifest.json`
- **Catálogo**: `https://one-pace-latam-stremio.pages.dev/catalog/series/one-pace-complete.json`
- **Metadata**: `https://one-pace-latam-stremio.pages.dev/meta/series/onepace_complete_series.json`
- **Stream ejemplo**: `https://one-pace-latam-stremio.pages.dev/stream/series/onepace_s01e01.json`

### 💡 Ventajas del Sistema Actual

- 🚀 **Cero configuración**: Todo automatizado end-to-end
- 🔄 **Siempre actualizado**: Se actualiza automáticamente con cada push
- 🌐 **CDN Global**: Cloudflare Pages con distribución mundial
- 📱 **Universal**: Compatible con todos los dispositivos Stremio
- 🔧 **Mantenimiento cero**: Sistema completamente autónomo
- ⚡ **Ultra rápido**: Bun + TypeScript + optimizaciones inteligentes
- 🛡️ **Confiable**: 403+ archivos generados y verificados automáticamente

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

El proyecto está completamente automatizado, pero siempre se aceptan contribuciones:

### 🔧 Áreas de Contribución

- **Mejoras del scraper**: Optimizaciones o nuevas funcionalidades
- **API enhancements**: Nuevos métodos o utilidades
- **Documentación**: Mejoras o traducciones
- **Bug fixes**: Cualquier problema encontrado
- **Features**: Nuevas características para el addon

### 📋 Proceso

1. **Fork** del repositorio
2. **Crear rama** feature (`git checkout -b feature/MejoraIncreible`)
3. **Commit** cambios (`git commit -m 'Add: nueva funcionalidad increíble'`)
4. **Push** a la rama (`git push origin feature/MejoraIncreible`)
5. **Pull Request** con descripción detallada

### 🧪 Testing Local

```bash
bun run demo      # Verificar que la API funciona
bun run scraper   # Probar el scraper
bun run generate-unified  # Generar addon localmente
```

## ⚡ Rendimiento y Optimizaciones

### 📊 Métricas del Sistema

- **Archivos generados**: 403+ streams individuales
- **Tiempo de build**: ~30-45 segundos (CI/CD completo)
- **Tamaño total**: ~2MB de archivos JSON optimizados
- **Velocidad scraping**: Procesamiento paralelo de ambos idiomas
- **Cache inteligente**: Solo actualiza archivos cuando hay cambios reales

### 🔧 Optimizaciones Implementadas

- ✅ **Hashing MD5**: Evita regeneración innecesaria de archivos
- ✅ **Procesamiento paralelo**: Scraping ES/EN simultáneo
- ✅ **Cache de dependencias**: GitHub Actions optimizado
- ✅ **TypeScript estricto**: Detección temprana de errores
- ✅ **Pixeldrain API**: Integración eficiente para carpetas
- ✅ **JSON minificado**: Archivos optimizados para producción

### 🌐 Distribución Global

- **CDN**: Cloudflare con 200+ ubicaciones mundiales
- **Latencia**: <100ms desde cualquier ubicación
- **Uptime**: 99.9% garantizado por Cloudflare
- **Escalabilidad**: Automática sin límites de usuarios

## 📝 Changelog

### v2.2.0 - Sistema Automatizado Completo ✨

- 🤖 **Despliegue automático** con GitHub Actions + Cloudflare Pages
- 🔄 **Scraper inteligente** con detección de cambios MD5
- 🌐 **Integración Pixeldrain API** para carpetas de videos
- ✨ **403+ episodios** generados automáticamente
- 📊 **38 temporadas** (inglés) / **34 temporadas** (español)
- �‍☠️ **Una sola serie** unificada con temporadas por arcos
- 🎬 **Múltiples formatos** por episodio (Sub/Dub ES/EN)
- � **Pipeline CI/CD** completamente automatizado
- � **Sistema de archivos optimizado** con versionado inteligente

## � Estado del Proyecto

### ✅ Completamente Funcional

- 🚀 **Addon en producción**: Funcionando 24/7
- 🔄 **Actualizaciones automáticas**: Sistema autónomo
- 📱 **Compatible**: Todos los dispositivos Stremio
- 🌍 **Multiidioma**: Español e inglés completamente integrados
- 🎬 **403+ episodios**: Disponibles inmediatamente

### 📈 Próximas Mejoras

- 🔍 **Búsqueda mejorada**: Filtros adicionales en la API
- 🎨 **Posters personalizados**: Imágenes para cada temporada  
- 📊 **Dashboard web**: Interfaz web para estadísticas
- 🌐 **Más idiomas**: Potencial expansión multiidioma

## �🙏 Créditos y Reconocimientos

- **One Pace Team**: Por el increíble trabajo de re-edición de One Piece
- **Eiichiro Oda**: Creador original de One Piece
- **Stremio**: Por la excelente plataforma de streaming
- **Pixeldrain**: Por el hosting confiable de archivos
- **Cloudflare**: Por la infraestructura global gratuita
- **GitHub**: Por las Actions y hosting del código
- **Bun Team**: Por el runtime ultrarrápido

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
https://one-pace-latam-stremio.pages.dev/manifest.json
```

### ¿Problemas o sugerencias?

- 📝 **Issues**: [GitHub Issues](https://github.com/CarmeloCampos/one-pace-stremio-latam/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/CarmeloCampos/one-pace-stremio-latam/discussions)
- 📧 **Contacto**: Via GitHub o issues

**¡Que disfrutes navegando por el Grand Line con One Pace! ⚓**

## 🚀 Quick Start

### Para Usuarios (Recomendado)
```
1. Abre Stremio
2. Addons → Add addon  
3. Pega: https://one-pace-latam-stremio.pages.dev/manifest.json
4. ¡Disfruta One Pace completo!
```

### Para Desarrolladores
```bash
git clone https://github.com/CarmeloCampos/one-pace-stremio-latam.git
cd one-pace-stremio-latam
bun install
bun run demo  # Ver estadísticas
bun run scraper  # Actualizar datos
bun run generate-unified  # Generar addon
```
