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
import { Search } from "lucide-react"
import itemData from "../data/minecraft-items.json"

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
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("items")

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
    }
  }, [searchTerm, activeTab])

  const handleItemClick = (item: Item) => {
    onSelectItem(item)
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
          <DialogDescription>Select an item to add to the slot</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="items" className="font-minecraft">
              Items
            </TabsTrigger>
          </TabsList>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search item..."
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
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}