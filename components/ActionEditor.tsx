import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Action {
  type: string;
  value: string;
}

interface ActionEditorProps {
  actions: Action[];
  onUpdate: (actions: Action[]) => void;
  label: string;
}

const predefinedActions = ['close', 'sound', 'message', 'takemoney', 'console'];

export default function ActionEditor({ actions, onUpdate, label }: ActionEditorProps) {
  const [customAction, setCustomAction] = useState({ type: '', value: '' });

  const addAction = (type: string) => {
    if (type === 'sound') {
      onUpdate([...actions, { type, value: 'ENTITY_PLAYER_LEVELUP' }]);
    } else {
      onUpdate([...actions, { type, value: '' }]);
    }
  };

  const updateAction = (index: number, field: keyof Action, value: string) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], [field]: value };
    onUpdate(newActions);
  };

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    onUpdate(newActions);
  };

  const addCustomAction = () => {
    if (customAction.type && customAction.value) {
      onUpdate([...actions, customAction]);
      setCustomAction({ type: '', value: '' });
    }
  };

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {predefinedActions.map((action) => (
          <Button key={action} onClick={() => addAction(action)} variant="outline">
            [{action}]
          </Button>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">[+ Custom Action]</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Action</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-type" className="text-right">
                  Type
                </Label>
                <Input
                  id="custom-type"
                  value={customAction.type}
                  onChange={(e) => setCustomAction({ ...customAction, type: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-value" className="text-right">
                  Value
                </Label>
                <Input
                  id="custom-value"
                  value={customAction.value}
                  onChange={(e) => setCustomAction({ ...customAction, value: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addCustomAction}>Add Custom Action</Button>
          </DialogContent>
        </Dialog>
      </div>
      {actions.map((action, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className="flex-grow flex items-center">
            <span className="mr-2">[{action.type}]</span>
            {action.type === 'sound' ? (
              <Select
                value={action.value}
                onValueChange={(value) => updateAction(index, 'value', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTITY_PLAYER_LEVELUP">ENTITY_PLAYER_LEVELUP</SelectItem>
                  <SelectItem value="BLOCK_NOTE_BLOCK_PLING">BLOCK_NOTE_BLOCK_PLING</SelectItem>
                  <SelectItem value="ENTITY_EXPERIENCE_ORB_PICKUP">ENTITY_EXPERIENCE_ORB_PICKUP</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={action.value}
                onChange={(e) => updateAction(index, 'value', e.target.value)}
                className="flex-grow"
              />
            )}
          </div>
          <Button onClick={() => removeAction(index)} variant="destructive" size="sm" className="ml-2">
            X
          </Button>
        </div>
      ))}
    </div>
  );
}

