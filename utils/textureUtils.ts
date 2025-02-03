export function decodeMinecraftTexture(value: string): string | null {
    try {
      if (value.startsWith("http")) {
        return value
      }
  
      const decoded = Buffer.from(value, "base64").toString()
      try {
        const jsonDecoded = JSON.parse(decoded)
        return jsonDecoded?.textures?.SKIN?.url || null
      } catch {
        return value
      }
    } catch (error) {
      console.error("Error decoding texture:", error)
      return null
    }
  }
  
  export function isValidTextureId(id: string): boolean {
    return /^[a-zA-Z0-9]{20,}$/.test(id)
  }
  
  