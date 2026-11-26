# Memoria · portfolio-keeper

## Ana
- Trabaja con Laravel + PHP. Busca puestos con TypeScript, React y Python, y quiere programar "muy integrado con la IA, creando agentes".
- GitHub: `anarquelladas`. Repo de la web: `anarquelladas/arcanasacra`.

## Dominio y despliegue
- `arcanasacra.net` comprado en Cloudflare Registrar (nov 2026, renovación automática ~11,86 $/año, nameservers de Cloudflare).
- `.com` estaba cogido. Correo previsto: `hello@arcanasacra.net` vía Email Routing (aún por crear).
- Cloudflare: Workers & Pages → conectar repo → preset Astro, `npm run build`, `dist`, `NODE_VERSION=22` → Custom domain.

## Proyectos sugeridos para el portfolio (aún no existen)
1. Agente en Python con herramientas (SDK de Anthropic) con demo y README.
2. App TypeScript + React que consuma una API, con un agente o chat integrado.
3. Proyecto Laravel (p. ej. gestor de citas para estudio de tatuaje).
Las cartas de ejemplo de Code (`sampleRepos` en `src/lib/github.ts`) desaparecen en cuanto haya repos con el topic `portfolio`.

## Subida a GitHub
- GitHub Desktop en su ordenador está con una cuenta corporativa → sube desde el navegador en ventana privada con su cuenta `anarquelladas`
  (*Add file → Upload files*, arrastrando el contenido de `Downloads\arcanasacra`; máx. 100 archivos por subida).

## Pendiente
- Primer push del repo, conectar Cloudflare, crear correo, añadir LinkedIn/Instagram en `site.ts`.
- Licencia comercial de Billa Mount antes de usarla en producción.
