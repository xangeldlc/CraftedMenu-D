export interface MinecraftHead {
  name: string;
  uuid: string;
  value: string;
  textureUrl: string;
}

export async function fetchHeads(query: string): Promise<MinecraftHead[]> {
  try {
    // Check if the query looks like a texture value (long alphanumeric string)
    const isValueQuery = /^[a-zA-Z0-9]{20,}$/.test(query);
    const endpoint = isValueQuery 
      ? `/api/minecraft-heads?value=${query}`
      : `/api/minecraft-heads?query=${encodeURIComponent(query)}`;

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const heads: MinecraftHead[] = await response.json();
    return heads;
  } catch (error) {
    console.error('Error fetching heads:', error);
    return [];
  }
}

