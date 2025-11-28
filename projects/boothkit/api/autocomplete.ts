const cache = new Map<string, { at: number, tags: string[] }>();

export async function fetchAutocompleteTags(query: string): Promise<string[]> {
  if (cache.has(query)) {
    return cache.get(query)!.tags;
  }

  const response = await fetch(`https://booth.pm/autocomplete/tag.json?term=${encodeURIComponent(query)}`);
  if (!response.ok) {
    console.error("Failed to fetch autocomplete tags:", response.statusText);
    return [];
  }

  const tags: string[] = await response.json();
  cache.set(query, { at: Date.now(), tags });
  return tags;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.at > 10 * 60 * 1000) { // 10 minutes
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000); // Clear cache every 10 minutes