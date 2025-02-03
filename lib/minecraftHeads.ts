export interface MinecraftHead {
    name: string
    uuid: string
    value: string
    textureUrl: string
  }
  
  export async function fetchHeads(query: string): Promise<MinecraftHead[]> {
    try {
      const isValueQuery = /^[a-zA-Z0-9]{20,}$/.test(query)
      const endpoint = isValueQuery
        ? `/api/minecraft-heads?value=${query}`
        : `/api/minecraft-heads?query=${encodeURIComponent(query)}`
  
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const heads: MinecraftHead[] = await response.json()
      return heads.map((head) => ({
        ...head,
        textureUrl: head.value.includes("textures.minecraft.net")
          ? head.value
          : `https://textures.minecraft.net/texture/${head.value}`,
      }))
    } catch (error) {
      console.error("Error fetching heads:", error)
      throw error
    }
  }
  
  