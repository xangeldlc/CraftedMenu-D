export type RequirementType = 
  | 'has permission'
  | 'has money'
  | 'has item'
  | 'javascript'
  | 'string equals'
  | 'string equals ignorecase'
  | 'string contains'
  | 'regex matches'
  | '==' | '>=' | '<=' | '!=' | '>' | '<';

export interface BaseRequirement {
  type: RequirementType;
  success_commands?: string[];
  deny_commands?: string[];
  optional?: boolean;
}

export interface HasPermissionRequirement extends BaseRequirement {
  type: 'has permission';
  permission: string;
}

export interface HasMoneyRequirement extends BaseRequirement {
  type: 'has money';
  amount: number;
}

export interface HasItemRequirement extends BaseRequirement {
  type: 'has item';
  material: string;
  amount?: number;
  name?: string;
  lore?: string | string[];
  name_contains?: boolean;
  name_ignorecase?: boolean;
  lore_contains?: boolean;
  lore_ignorecase?: boolean;
  strict?: boolean;
  armor?: boolean;
  offhand?: boolean;
}

export interface JavaScriptRequirement extends BaseRequirement {
  type: 'javascript';
  expression: string;
}

export interface ComparatorRequirement extends BaseRequirement {
  type: '==' | '>=' | '<=' | '!=' | '>' | '<';
  input: string | number;
  output: string | number;
}

export type Requirement = 
  | HasPermissionRequirement
  | HasMoneyRequirement
  | HasItemRequirement
  | JavaScriptRequirement
  | ComparatorRequirement;

export interface RequirementGroup {
  minimum_requirements?: number;
  stop_at_success?: boolean;
  requirements: Record<string, Requirement>;
  deny_commands?: string[];
}

