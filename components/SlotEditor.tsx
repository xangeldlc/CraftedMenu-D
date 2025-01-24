'use client'

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ItemGallery from "./ItemGallery"
import ActionEditor from "./ActionEditor"
import type { Slot } from "../types/panel"
import type {
  RequirementGroup,
  Requirement,
  HasPermissionRequirement,
  HasMoneyRequirement,
  HasItemRequirement,
  JavaScriptRequirement,
} from "../types/requirements"

interface SlotEditorProps {
  slotKey: string
  slotData: Slot
  onUpdate: (slotData: Slot) => void
  onClose: () => void
}

export default function SlotEditor({ slotKey, slotData, onUpdate, onClose }: SlotEditorProps) {
  const handleChange = (field: keyof Slot, value: unknown) => {
    if (field === "lore" && typeof value === "string") {
      onUpdate({ ...slotData, [field]: value.split("\n").filter((line) => line.trim() !== "") })
    } else {
      onUpdate({ ...slotData, [field]: value })
    }
  }

  const handleItemSelect = (item: { id: string; name: string }) => {
    onUpdate({ ...slotData, material: item.id })
  }

  const handleRequirementUpdate = (
    requirementType: "view_requirement" | "left_click_requirement" | "right_click_requirement",
    updatedRequirement: RequirementGroup,
  ) => {
    const updatedRequirements = {
      ...slotData.requirements,
      [requirementType]: updatedRequirement,
    }
    handleChange("requirements", updatedRequirements)
  }

  const addRequirement = (
    requirementType: "view_requirement" | "left_click_requirement" | "right_click_requirement",
  ) => {
    const newRequirement: Requirement = {
      type: "has permission",
      permission: "",
      success_commands: [],
      deny_commands: [],
    }
    const updatedRequirementGroup: RequirementGroup = {
      requirements: {
        ...(slotData.requirements?.[requirementType]?.requirements || {}),
        [`requirement_${Date.now()}`]: newRequirement,
      },
      deny_commands: slotData.requirements?.[requirementType]?.deny_commands || [],
    }
    handleRequirementUpdate(requirementType, updatedRequirementGroup)
  }

  const updateRequirement = (
    requirementType: "view_requirement" | "left_click_requirement" | "right_click_requirement",
    requirementKey: string,
    updatedRequirement: Requirement,
  ) => {
    const updatedRequirementGroup: RequirementGroup = {
      ...slotData.requirements?.[requirementType],
      requirements: {
        ...slotData.requirements?.[requirementType]?.requirements,
        [requirementKey]: updatedRequirement,
      },
    }
    handleRequirementUpdate(requirementType, updatedRequirementGroup)
  }

  const deleteRequirement = (
    requirementType: "view_requirement" | "left_click_requirement" | "right_click_requirement",
    requirementKey: string,
  ) => {
    const remainingRequirements = Object.fromEntries(
      Object.entries(slotData.requirements?.[requirementType]?.requirements || {}).filter(
        ([key]) => key !== requirementKey,
      ),
    )

    const updatedRequirementGroup: RequirementGroup = {
      ...slotData.requirements?.[requirementType],
      requirements: remainingRequirements,
    }

    handleRequirementUpdate(requirementType, updatedRequirementGroup)
  }

  const updateGroupDenyCommands = (
    requirementType: "view_requirement" | "left_click_requirement" | "right_click_requirement",
    denyCommands: string[],
  ) => {
    const updatedRequirementGroup: RequirementGroup = {
      requirements: slotData.requirements?.[requirementType]?.requirements || {},
      deny_commands: denyCommands,
    }
    handleRequirementUpdate(requirementType, updatedRequirementGroup)
  }

  const renderCommandInput = (commands: string[], onChange: (commands: string[]) => void, label: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={commands.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").filter((cmd) => cmd.trim() !== ""))}
        placeholder="[player] command
[console] command
[message] text
..."
      />
    </div>
  )

  const renderRequirementEditor = (
    requirementType: "view_requirement" | "left_click_requirement" | "right_click_requirement",
  ) => {
    const requirementGroup = slotData.requirements?.[requirementType] || { requirements: {}, deny_commands: [] }
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {requirementType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h3>
        {renderCommandInput(
          requirementGroup.deny_commands || [],
          (commands) => updateGroupDenyCommands(requirementType, commands),
          "Deny Commands (Group Level)",
        )}
        {Object.entries(requirementGroup.requirements).map(([key, requirement]) => (
          <div key={key} className="border p-4 rounded-md space-y-4">
            <Select
              value={requirement.type}
              onValueChange={(value) => {
                const updatedRequirement = { ...requirement, type: value } as Requirement
                updateRequirement(requirementType, key, updatedRequirement)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select requirement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="has permission">Has Permission</SelectItem>
                <SelectItem value="has money">Has Money</SelectItem>
                <SelectItem value="has item">Has Item</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="string equals">String Equals</SelectItem>
                <SelectItem value="string equals ignorecase">String Equals (Ignore Case)</SelectItem>
                <SelectItem value="string contains">String Contains</SelectItem>
                <SelectItem value="regex matches">Regex Matches</SelectItem>
                <SelectItem value="==">==</SelectItem>
                <SelectItem value=">=">{">="}</SelectItem>
                <SelectItem value="<=">{"<="}</SelectItem>
                <SelectItem value="!=">!=</SelectItem>
                <SelectItem value=">">{">"}</SelectItem>
                <SelectItem value="<">{"<"}</SelectItem>
              </SelectContent>
            </Select>
            {requirement.type === "has permission" && (
              <Input
                placeholder="Permission"
                value={(requirement as HasPermissionRequirement).permission || ""}
                onChange={(e) =>
                  updateRequirement(requirementType, key, { ...requirement, permission: e.target.value })
                }
              />
            )}
            {requirement.type === "has money" && (
              <Input
                type="number"
                placeholder="Amount"
                value={(requirement as HasMoneyRequirement).amount?.toString() || ""}
                onChange={(e) =>
                  updateRequirement(requirementType, key, { ...requirement, amount: Number.parseFloat(e.target.value) })
                }
              />
            )}
            {requirement.type === "has item" && (
              <div className="space-y-2">
                <Input
                  placeholder="Material"
                  value={(requirement as HasItemRequirement).material || ""}
                  onChange={(e) =>
                    updateRequirement(requirementType, key, { ...requirement, material: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={(requirement as HasItemRequirement).amount?.toString() || ""}
                  onChange={(e) =>
                    updateRequirement(requirementType, key, { ...requirement, amount: Number.parseInt(e.target.value) })
                  }
                />
              </div>
            )}
            {requirement.type === "javascript" && (
              <Input
                placeholder="JavaScript Expression"
                value={(requirement as JavaScriptRequirement).expression || ""}
                onChange={(e) =>
                  updateRequirement(requirementType, key, { ...requirement, expression: e.target.value })
                }
              />
            )}
            {renderCommandInput(
              requirement.success_commands || [],
              (commands) => updateRequirement(requirementType, key, { ...requirement, success_commands: commands }),
              "Success Commands",
            )}
            {renderCommandInput(
              requirement.deny_commands || [],
              (commands) => updateRequirement(requirementType, key, { ...requirement, deny_commands: commands }),
              "Deny Commands",
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`optional-${key}`}
                checked={requirement.optional || false}
                onCheckedChange={(checked) =>
                  updateRequirement(requirementType, key, { ...requirement, optional: checked as boolean })
                }
              />
              <Label htmlFor={`optional-${key}`}>Optional</Label>
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteRequirement(requirementType, key)}>
              Delete Requirement
            </Button>
          </div>
        ))}
        <Button onClick={() => addRequirement(requirementType)}>Add Requirement</Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg p-4 w-full"
    style={{ backgroundColor: 'var(--bg-color)' }}
  >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Edit Slot {slotKey}</h2>
        <Button onClick={onClose} variant="ghost">
          X
        </Button>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="enchantments">Enchantments</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="space-y-4">
            <div className="mb-4">
              <ItemGallery onSelectItem={handleItemSelect} />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={slotData.material || ""}
                onChange={(e) => handleChange("material", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                value={slotData.displayName || ""}
                onChange={(e) => handleChange("displayName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lore">Lore</Label>
              <Textarea
                id="lore"
                value={slotData.lore?.join("\n") || ""}
                onChange={(e) =>
                  handleChange(
                    "lore",
                    e.target.value.split("\n").filter((line) => line.trim() !== ""),
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={slotData.priority || 0}
                onChange={(e) => handleChange("priority", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="actions">
          <ActionEditor
            actions={slotData.actions || []}
            onUpdate={(actions) => handleChange("actions", actions)}
            label="Slot Actions"
          />
        </TabsContent>
        <TabsContent value="requirements">
          <div className="space-y-8">
            {renderRequirementEditor("view_requirement")}
            {renderRequirementEditor("left_click_requirement")}
            {renderRequirementEditor("right_click_requirement")}
          </div>
        </TabsContent>
        <TabsContent value="enchantments">
          <div className="space-y-4">
            <div>
              <Label htmlFor="enchantments">Enchantments (format: ENCHANTMENT_ID;LEVEL)</Label>
              <Textarea
                id="enchantments"
                value={slotData.enchantments?.join("\n") || ""}
                onChange={(e) =>
                  handleChange(
                    "enchantments",
                    e.target.value.split("\n").filter((line) => line.trim() !== ""),
                  )
                }
                placeholder="FORTUNE;1
UNBREAKING;3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hideEnchantments"
                checked={slotData.hideEnchantments || false}
                onCheckedChange={(checked) => handleChange("hideEnchantments", checked)}
              />
              <Label htmlFor="hideEnchantments">Hide Enchantments</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}