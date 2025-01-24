"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import yaml from "js-yaml"

interface Action {
  type: string
  value: string
}

interface Requirement {
  type: string
  permission?: string
  amount?: number
  material?: string
  expression?: string
  success_commands?: string[]
  deny_commands?: string[]
  optional?: boolean
}

interface RequirementGroup {
  requirements: Record<string, Requirement>
  deny_commands?: string[]
  minimum_requirements?: number
  stop_at_success?: boolean
}

interface Slot {
  material?: string
  displayName?: string
  lore?: string[]
  actions?: Action[]
  priority?: number
  requirements?: {
    view_requirement?: RequirementGroup
    left_click_requirement?: RequirementGroup
    right_click_requirement?: RequirementGroup
  }
  slots?: number[]
  slotName?: string
  enchantments?: string[]
  hideEnchantments?: boolean
}

interface Panel {
  menuTitle: string
  openCommand: string
  registerCommand: boolean
  openCommands: Action[]
  size: number
  items: { [key: string]: Slot }
}

interface YamlGeneratorProps {
  panel: Panel
}

export default function YamlGenerator({ panel }: YamlGeneratorProps) {
  const formatRequirementGroup = (group?: RequirementGroup) => {
    if (!group) return undefined

    return {
      requirements: Object.entries(group.requirements).reduce(
        (acc, [key, req]) => {
          acc[key] = {
            type: req.type,
            ...(req.permission && { permission: req.permission }),
            ...(req.amount !== undefined && { amount: req.amount }),
            ...(req.material && { material: req.material }),
            ...(req.expression && { expression: req.expression }),
            ...(req.success_commands?.length && { success_commands: req.success_commands }),
            ...(req.deny_commands?.length && { deny_commands: req.deny_commands }),
            ...(req.optional !== undefined && { optional: req.optional }),
          }
          return acc
        },
        {} as Record<string, unknown>,
      ),
      ...(group.deny_commands?.length && { deny_commands: group.deny_commands }),
      ...(group.minimum_requirements !== undefined && { minimum_requirements: group.minimum_requirements }),
      ...(group.stop_at_success !== undefined && { stop_at_success: group.stop_at_success }),
    }
  }

  const generateYaml = () => {
    const yamlObj = {
      menu_title: panel.menuTitle,
      open_command: panel.openCommand,
      register_command: panel.registerCommand,
      open_commands: panel.openCommands.map((action) => `[${action.type}] ${action.value}`),
      size: panel.size,
      items: Object.entries(panel.items).reduce(
        (acc, [key, slot]) => {
          const material = slot.material

          if (slot.slots && slot.slots.length > 0) {
            const slotKey = slot.slotName || `slot_${Math.min(...slot.slots)}`
            acc[slotKey] = {
              slots: slot.slots,
              material: material,
              display_name: slot.displayName,
              lore: slot.lore,
              priority: slot.priority,
              ...(slot.actions?.length && {
                click_commands: slot.actions.map((action) => `[${action.type}] ${action.value}`),
              }),
              ...(slot.requirements?.view_requirement && {
                view_requirement: formatRequirementGroup(slot.requirements.view_requirement),
              }),
              ...(slot.requirements?.left_click_requirement && {
                left_click_requirement: formatRequirementGroup(slot.requirements.left_click_requirement),
              }),
              ...(slot.requirements?.right_click_requirement && {
                right_click_requirement: formatRequirementGroup(slot.requirements.right_click_requirement),
              }),
              ...(slot.enchantments &&
                slot.enchantments.length > 0 && {
                  enchantments: slot.enchantments,
                }),
              ...(slot.hideEnchantments !== undefined && {
                hide_enchantments: slot.hideEnchantments,
              }),
            }
          } else {
            const slotNumber = Number.parseInt(key.split("_")[1])
            acc[key] = {
              slot: slotNumber,
              material: material,
              display_name: slot.displayName,
              lore: slot.lore,
              priority: slot.priority,
              ...(slot.actions?.length && {
                click_commands: slot.actions.map((action) => `[${action.type}] ${action.value}`),
              }),
              ...(slot.requirements?.view_requirement && {
                view_requirement: formatRequirementGroup(slot.requirements.view_requirement),
              }),
              ...(slot.requirements?.left_click_requirement && {
                left_click_requirement: formatRequirementGroup(slot.requirements.left_click_requirement),
              }),
              ...(slot.requirements?.right_click_requirement && {
                right_click_requirement: formatRequirementGroup(slot.requirements.right_click_requirement),
              }),
              ...(slot.enchantments &&
                slot.enchantments.length > 0 && {
                  enchantments: slot.enchantments,
                }),
              ...(slot.hideEnchantments !== undefined && {
                hide_enchantments: slot.hideEnchantments,
              }),
            }
          }
          return acc
        },
        {} as Record<string, unknown>,
      ),
    }

    const yamlStr = yaml.dump(yamlObj, {
      indent: 2,
      lineWidth: -1,
      quotingType: '"',
      forceQuotes: true,
    })

    const blob = new Blob([yamlStr], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "deluxemenus_config.yml"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-4">
      <Button onClick={generateYaml} className="minecraft-button w-full bg-primary hover:bg-primary/90">
        <Download className="mr-2 h-4 w-4" />
        Generar YAML
      </Button>
    </div>
  )
}

