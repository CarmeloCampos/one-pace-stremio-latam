# Guía de Hospedaje del Addon de Stremio

Esta guía te muestra cómo hospedar tu addon de Stremio en diferentes plataformas gratuitas.

## 🚀 GitHub Pages (Recomendado)

### Paso 1: Crear repositorio

1. Crea un nuevo repositorio en GitHub
2. Sube la carpeta `stremio-addon` al repositorio
3. Ve a Settings → Pages
4. Selecciona "Deploy from a branch" → main → / (root)
5. Tu addon estará disponible en: `https://tu-usuario.github.io/tu-repo/manifest.json`

### Estructura del repositorio:
```
tu-repo/
├── manifest.json
├── catalog/
├── meta/
├── stream/
└── README.md
```

## 🌐 Vercel

### Paso 1: Configuración

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Importa tu repositorio con el addon
3. No necesitas configuración especial, Vercel automáticamente servirá los archivos JSON
4. Tu addon estará disponible en: `https://tu-proyecto.vercel.app/manifest.json`

## 🚀 Netlify

### Paso 1: Deploy automático

1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Arrastra la carpeta `stremio-addon` a la zona de drop
3. Tu addon estará disponible en: `https://random-name.netlify.app/manifest.json`

### Para actualizar:
- Simplemente arrastra la nueva carpeta para reemplazar

## 📱 Instalar en Stremio

1. **Copia la URL del manifest**: `https://tu-dominio.com/manifest.json`
2. **Abre Stremio** en cualquier dispositivo
3. **Ve a Addons** → "Install addon via URL"
4. **Pega la URL** del manifest
5. **¡Disfruta!** Ahora puedes ver One Pace desde Stremio

## 🔧 Verificar que funciona

Antes de instalar en Stremio, puedes probar las URLs:

- **Manifest**: `https://tu-dominio.com/manifest.json`
- **Catálogo**: `https://tu-dominio.com/catalog/series/one-pace-catalog.json`
- **Meta**: `https://tu-dominio.com/meta/series/onepace_romance-dawn.json`
- **Stream**: `https://tu-dominio.com/stream/series/onepace_romance-dawn_sub_1.json`

## 💡 Consejos

### CORS (Cross-Origin Resource Sharing)
Los servicios mencionados (GitHub Pages, Vercel, Netlify) configuran automáticamente CORS para servir JSON. No necesitas configuración adicional.

### Actualización automática
Configura GitHub Actions para regenerar el addon automáticamente:

```yaml
# .github/workflows/update-addon.yml
name: Update Stremio Addon
on:
  schedule:
    - cron: '0 6 * * *'  # Diario a las 6 AM
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run src/scraper.ts
      - run: bun run generate-stremio.ts -- --lang es --output ./
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Auto-update addon" || exit 0
          git push
```

### Custom Domain
En GitHub Pages puedes configurar un dominio personalizado en Settings → Pages → Custom domain.

## 🎯 URL Final

Tu addon quedará disponible en una URL como:
- `https://tu-usuario.github.io/one-pace-stremio/manifest.json`
- `https://one-pace-addon.vercel.app/manifest.json`
- `https://one-pace-123456.netlify.app/manifest.json`