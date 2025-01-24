import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import yaml from "js-yaml";

interface Slot {
  item: string;
  name: string;
  lore: string[];
  actions: string[];
}

interface Panel {
  title: string;
  size: number;
  slots: { [key: number]: Slot };
  conditions: string[];
}

interface YamlManagerProps {
  panel: Panel;
  onImport: (panel: Panel) => void;
}

export default function YamlManager({ panel, onImport }: YamlManagerProps) {
  const handleExport = () => {
    const yamlStr = yaml.dump(panel);
    const blob = new Blob([yamlStr], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "panel_config.yml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPanel = yaml.load(e.target?.result as string) as Panel;
          onImport(importedPanel);
        } catch (error) {
          console.error("Error importing YAML file:", error);
          alert("Error importing YAML file. Please check the format.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={handleExport} className="mr-2">
        Export YAML
      </Button>
      <Label
        htmlFor="import-yaml"
        className="inline-flex items-center px-4 py-2 bg-white text-gray-800 rounded-lg shadow cursor-pointer hover:bg-gray-100"
      >
        Import YAML
        <input id="import-yaml" type="file" accept=".yml,.yaml" onChange={handleImport} className="hidden" />
      </Label>
    </div>
  );
}