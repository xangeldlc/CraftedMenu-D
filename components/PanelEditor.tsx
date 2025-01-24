"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Gamepad2 } from "lucide-react"
import SlotEditor from "./SlotEditor"
import PanelPreview from "./PanelPreview"
import YamlGenerator from "./YamlGenerator"
import ActionEditor from "./ActionEditor"
import ItemGallery from "./ItemGallery"
import { useTheme } from "next-themes"

interface Action {
  type: string
  value: string
}

interface Slot {
  material?: string
  displayName?: string
  lore?: string[]
  actions?: Action[]
  priority?: number
  viewRequirement?: Record<string, unknown>
  clickRequirement?: Record<string, unknown>
  slots?: number[]
}

interface Panel {
  menuTitle: string
  openCommand: string
  registerCommand: boolean
  openCommands: Action[]
  size: number
  items: { [key: string]: Slot }
}

const LOCAL_STORAGE_KEY = "deluxepanels_editor_state"

export default function PanelEditor() {
  const [panel, setPanel] = useState<Panel>(() => {
    if (typeof window !== "undefined") {
      const savedPanel = localStorage.getItem(LOCAL_STORAGE_KEY)
      return savedPanel
        ? JSON.parse(savedPanel)
        : {
            menuTitle: "&8Rank Store!",
            openCommand: "ranks",
            registerCommand: true,
            openCommands: [],
            size: 27,
            items: {},
          }
    }
    return {
      menuTitle: "&8Rank Store!",
      openCommand: "ranks",
      registerCommand: true,
      openCommands: [],
      size: 27,
      items: {},
    }
  })
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [multipleSlotSelection, setMultipleSlotSelection] = useState<number[]>([])
  const [isSelectingMultipleSlots, setIsSelectingMultipleSlots] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(panel))
  }, [panel])

  const handleSlotClick = (index: number) => {
    if (isSelectingMultipleSlots) {
      setMultipleSlotSelection((prev) =>
        prev.includes(index) ? prev.filter((slot) => slot !== index) : [...prev, index],
      )
    } else {
      const slotKey = `slot_${index}`
      setSelectedSlot(slotKey)
      if (!panel.items[slotKey]) {
        setPanel((prevPanel) => ({
          ...prevPanel,
          items: {
            ...prevPanel.items,
            [slotKey]: { material: "STONE", displayName: "New Item", lore: [], actions: [] },
          },
        }))
      }
    }
  }

  const handleSlotUpdate = (slotKey: string, slotData: Slot) => {
    setPanel((prevPanel) => ({
      ...prevPanel,
      items: {
        ...prevPanel.items,
        [slotKey]: slotData,
      },
    }))
  }

  const handlePanelUpdate = (field: keyof Panel, value: unknown) => {
    setPanel((prevPanel) => ({ ...prevPanel, [field]: value }))
  }

  const handleMultipleSlotAssignment = (item: { id: string; name: string }) => {
    const newSlots = multipleSlotSelection.map((index) => `slot_${index}`)
    const updatedItems = { ...panel.items }

    newSlots.forEach((slotKey) => {
      updatedItems[slotKey] = {
        ...updatedItems[slotKey],
        material: item.id,
        displayName: item.name,
        slots: multipleSlotSelection,
      }
    })

    setPanel((prevPanel) => ({
      ...prevPanel,
      items: updatedItems,
    }))

    setMultipleSlotSelection([])
    setIsSelectingMultipleSlots(false)
  }

  const handleClearAllSlots = () => {
    setPanel((prevPanel) => ({
      ...prevPanel,
      items: {},
    }))
    setSelectedSlot(null)
    setMultipleSlotSelection([])
    setIsSelectingMultipleSlots(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const renderParticles = () => {
    const particles = []
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 5 + 2
      const left = Math.random() * 100
      const top = Math.random() * 100
      const delay = Math.random() * 15
      const duration = Math.random() * 5 + 10
      const color = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            backgroundColor: color,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />,
      )
    }
    return particles
  }

  return (
    <>
      <div className="animation-background">{renderParticles()}</div>
      <div className="min-h-screen">
        <header className="minecraft-header py-4 px-6 mb-8">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-minecraft bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CraftedMenus-D
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 transition-all duration-300 hover:bg-primary/10"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="minecraft-grid">
            <div className="space-y-6">
              <div className="minecraft-card fade-in">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="menuTitle" className="text-lg font-minecraft">
                      Menu Title
                    </Label>
                    <Input
                      id="menuTitle"
                      value={panel.menuTitle}
                      onChange={(e) => handlePanelUpdate("menuTitle", e.target.value)}
                      className="input-enhanced mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="openCommand" className="text-lg font-minecraft">
                      Open Command
                    </Label>
                    <Input
                      id="openCommand"
                      value={panel.openCommand}
                      onChange={(e) => handlePanelUpdate("openCommand", e.target.value)}
                      className="input-enhanced mt-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="registerCommand"
                      checked={panel.registerCommand}
                      onCheckedChange={(checked) => handlePanelUpdate("registerCommand", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="registerCommand" className="font-minecraft">
                      Register Command
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="size" className="text-lg font-minecraft">
                      Panel Size
                    </Label>
                    <Input
                      id="size"
                      type="number"
                      min="9"
                      max="54"
                      step="9"
                      value={panel.size}
                      onChange={(e) => handlePanelUpdate("size", Number.parseInt(e.target.value))}
                      className="input-enhanced mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="minecraft-card slide-in">
                <ActionEditor
                  actions={panel.openCommands}
                  onUpdate={(actions) => handlePanelUpdate("openCommands", actions)}
                  label="Open Commands"
                />
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setIsSelectingMultipleSlots(!isSelectingMultipleSlots)}
                  variant={isSelectingMultipleSlots ? "secondary" : "default"}
                  className="minecraft-button w-full"
                >
                  {isSelectingMultipleSlots ? "Cancel Multiple Selection" : "Select Multiple Slots"}
                </Button>

                {isSelectingMultipleSlots && (
                  <div className="minecraft-card fade-in">
                    <p className="font-minecraft mb-2">Selected Slots: {multipleSlotSelection.join(", ")}</p>
                    <ItemGallery onSelectItem={handleMultipleSlotAssignment} />
                  </div>
                )}
              </div>

              <Button onClick={handleClearAllSlots} variant="destructive" className="minecraft-button w-full">
                Clear All Slots
              </Button>

              <div className="minecraft-card">
                <PanelPreview
                  panel={panel}
                  onSlotClick={handleSlotClick}
                  selectedSlot={selectedSlot}
                  multipleSlotSelection={multipleSlotSelection}
                />
              </div>

              <YamlGenerator panel={panel} />
            </div>

            <div>
              {selectedSlot && !isSelectingMultipleSlots && (
                <div className="minecraft-card fade-in">
                  <SlotEditor
                    slotKey={selectedSlot}
                    slotData={panel.items[selectedSlot] || {}}
                    onUpdate={(slotData) => handleSlotUpdate(selectedSlot, slotData)}
                    onClose={() => setSelectedSlot(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}