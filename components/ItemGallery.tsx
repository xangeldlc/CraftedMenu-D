"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MinecraftHead3D from "./MinecraftHead3D"
import itemData from "../data/minecraft-items.json"
import { fetchHeads, type MinecraftHead } from "@/lib/minecraftHeads"

interface Item {
  id: string
  name: string
  texture: string
}

interface ItemGalleryProps {
  onSelectItem: (item: Item) => void
}

export default function ItemGallery({ onSelectItem }: ItemGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [heads, setHeads] = useState<MinecraftHead[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("items")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedHead, setSelectedHead] = useState<MinecraftHead | null>(null)

  useEffect(() => {
    if (activeTab === "items") {
      const allItems = Object.values(itemData.categories).flat()
      setFilteredItems(
        allItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } else if (activeTab === "heads" && searchTerm.length > 2) {
      searchHeads(searchTerm)
    }
  }, [searchTerm, activeTab])

  const searchHeads = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = await fetchHeads(query)
      setHeads(results)
      if (results.length > 0) {
        setSelectedHead(results[0])
      } else {
        setError("No results found for the search.")
      }
    } catch (err) {
      console.error("Error searching heads:", err)
      setError("Error searching heads. Please try again.")
      setHeads([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = (item: Item) => {
    onSelectItem(item)
    setIsOpen(false)
  }

  const handleHeadClick = (head: MinecraftHead) => {
    setSelectedHead(head)
    onSelectItem({
      id: `texture-${head.value}`,
      name: head.name,
      material: `texture-${head.value}`,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="minecraft-button w-full">
          Select Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] minecraft-card">
        <DialogHeader>
          <DialogTitle className="font-minecraft text-xl">Item Gallery</DialogTitle>
          <DialogDescription>Select an item to add it to the slot</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items" className="font-minecraft">
              Items
            </TabsTrigger>
            <TabsTrigger value="heads" className="font-minecraft">
              Heads
            </TabsTrigger>
          </TabsList>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={activeTab === "heads" ? "Search or paste texture value..." : "Search item..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 input-enhanced"
            />
          </div>
          <TabsContent value="items">
            <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[60vh] mt-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="minecraft-button flex flex-col items-center p-2 border rounded cursor-pointer hover:bg-accent"
                >
                  <Image
                    src={item.texture || "/placeholder.svg"}
                    alt={item.name}
                    width={32}
                    height={32}
                    className="pixelated w-8 h-8"
                  />
                  <span className="text-xs mt-1 text-center font-minecraft">{item.name}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="heads">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {selectedHead && (
              <div className="mb-4">
                <MinecraftHead3D textureUrl={`https://textures.minecraft.net/texture/${selectedHead.value}`} />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[40vh] mt-4">
              {isLoading ? (
                <div className="col-span-3 text-center py-4">Loading...</div>
              ) : heads.length > 0 ? (
                heads.map((head) => (
                  <div
                    key={head.value}
                    onClick={() => handleHeadClick(head)}
                    className={`minecraft-button flex flex-col items-center p-2 border rounded cursor-pointer hover:bg-accent ${
                      selectedHead?.value === head.value ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={`https://textures.minecraft.net/texture/${head.value}`}
                      alt={head.name}
                      width={32}
                      height={32}
                      className="pixelated w-8 h-8"
                    />
                    <span className="text-xs mt-1 text-center font-minecraft truncate w-full">{head.name}</span>
                  </div>
                ))
              ) : searchTerm.length > 2 ? (
                <div className="col-span-3 text-center py-4">No results found</div>
              ) : (
                <div className="col-span-3 text-center py-4">
                  Enter at least 3 characters to search or paste a texture value. THE PREVIEW WILL ONLY BE SHOWN THROUGH "Minecraft URL" YOU ONLY HAVE TO PUT THE ID EJ; texture-id
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
