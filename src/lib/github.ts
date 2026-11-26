// Lee tus repos públicos de GitHub al compilar la web.
// Sólo aparecen los que tengan el topic configurado en site.portfolioTopic.
// Si defines GITHUB_TOKEN (en Cloudflare o en la Action) el límite de la API sube.

import { site } from '../data/site';

export interface Repo {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  updated: string;
  sample?: boolean;
}

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export async function getRepos(): Promise<{ repos: Repo[]; error?: string }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'arcanasacra-web',
  };
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const url = `https://api.github.com/users/${site.github}/repos?per_page=100&sort=pushed`;
    let res = await fetch(url, { headers });
    // si el token no vale, se reintenta sin él (la API pública basta para repos públicos)
    if (res.status === 401 && headers.Authorization) {
      delete headers.Authorization;
      res = await fetch(url, { headers });
    }
    if (!res.ok) throw new Error(`GitHub respondió ${res.status}`);
    const data = (await res.json()) as ApiRepo[];
    const repos = data
      .filter((r) => !r.fork && !r.archived && r.topics?.includes(site.portfolioTopic))
      .map((r) => ({
        name: r.name,
        description: r.description ?? '',
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        topics: (r.topics ?? []).filter((t) => t !== site.portfolioTopic),
        updated: r.pushed_at,
      }));
    return { repos };
  } catch (e) {
    return { repos: [], error: e instanceof Error ? e.message : String(e) };
  }
}

/** Cartas de muestra mientras aún no hay repos con el topic. */
export const sampleRepos: Repo[] = [
  {
    name: 'grimoire-agent',
    description: 'Python agent that reads your notes, searches the web and writes summaries using tools.',
    url: `https://github.com/${site.github}`,
    homepage: null,
    language: 'Python',
    stars: 0,
    topics: ['ai', 'agents'],
    updated: '2026-11-01',
    sample: true,
  },
  {
    name: 'arcanasacra',
    description: 'This very site: Astro, TypeScript and React, deployed to Cloudflare from GitHub.',
    url: `https://github.com/${site.github}/arcanasacra`,
    homepage: 'https://arcanasacra.net',
    language: 'TypeScript',
    stars: 0,
    topics: ['astro', 'react'],
    updated: '2026-11-25',
    sample: true,
  },
  {
    name: 'tattoo-bookings',
    description: 'Booking and deposit manager for a tattoo studio, built with Laravel.',
    url: `https://github.com/${site.github}`,
    homepage: null,
    language: 'PHP',
    stars: 0,
    topics: ['laravel'],
    updated: '2026-10-10',
    sample: true,
  },
];
