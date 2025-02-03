import { NextResponse } from "next/server"
import { decodeMinecraftTexture } from "@/utils/textureUtils"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const value = searchParams.get("value")

  try {
    if (value) {
      const textureUrl = decodeMinecraftTexture(value)
      return NextResponse.json([
        {
          name: "Custom Head",
          uuid: value,
          value: value,
          textureUrl: textureUrl,
        },
      ])
    }

    const response = await fetch(
      `https://minecraft-heads.com/scripts/api.php?cat=search&query=${encodeURIComponent(query || "")}`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const heads = await response.json()
    const limitedHeads = heads.slice(0, 3)

    const processedHeads = limitedHeads.map((head: any) => ({
      ...head,
      textureUrl: decodeMinecraftTexture(head.value),
    }))

    return NextResponse.json(processedHeads)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to fetch heads" }, { status: 500 })
  }
}

