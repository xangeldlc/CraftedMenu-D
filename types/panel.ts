import { RequirementGroup } from './requirements';

export interface Action {
  type: string;
  value: string;
}

export interface Slot {
  material?: string;
  displayName?: string;
  lore?: string[];
  actions?: Action[];
  priority?: number;
  requirements?: {
    view_requirement?: RequirementGroup;
    left_click_requirement?: RequirementGroup;
    right_click_requirement?: RequirementGroup;
  };
  slots?: number[];
  slotName?: string;
  enchantments?: string[];
  hideEnchantments?: boolean;
}

export interface Panel {
  menuTitle: string;
  openCommand: string;
  registerCommand: boolean;
  openCommands: Action[];
  size: number;
  items: { [key: string]: Slot };
}

