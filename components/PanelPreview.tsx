'use client'

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Tooltip from './Tooltip';
import { parseMiniMessage } from '../utils/miniMessageParser';
import itemData from '../data/minecraft-items.json';

type Enchantment = `${string};${number}`;

interface Slot {
  material?: string;
  displayName?: string;
  lore?: string[];
  actions?: { type: string; value: string }[];
  priority?: number;
  viewRequirement?: Record<string, unknown>;
  clickRequirement?: Record<string, unknown>;
  slots?: number[];
  slotName?: string;
  enchantments?: Enchantment[];
  hideEnchantments?: boolean;
}

interface Panel {
  menuTitle: string;
  openCommand: string;
  registerCommand: boolean;
  openCommands: { type: string; value: string }[];
  size: number;
  items: { [key: string]: Slot };
}

interface PanelPreviewProps {
  panel: Panel;
  onSlotClick?: (index: number) => void;
  selectedSlot?: string | null;
  multipleSlotSelection: number[];
}

export default function PanelPreview({ panel, onSlotClick, selectedSlot, multipleSlotSelection }: PanelPreviewProps) {
  const rows = Math.ceil(panel.size / 9);
  const [tooltipData, setTooltipData] = useState<{
    slot: Slot;
    position: { x: number; y: number };
  } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, slot: Slot) => {
    if (slot.material) {
      setTooltipData({
        slot,
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipData) {
      setTooltipData({
        ...tooltipData,
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const renderSlotImage = useCallback((slot: Slot | undefined) => {
    if (!slot?.material) return null;

    const item = Object.values(itemData.categories).flat().find(item => item.id === slot.material);
    const imageSrc = item ? item.texture : '/images/blocks/stone.png';

    return (
      <div className={`flex items-center justify-center w-full h-full ${slot.enchantments && slot.enchantments.length > 0 ? 'glow' : ''}`}>
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={slot.displayName || slot.material}
          width={32}
          height={32}
          className="pixelated w-8 h-8"
          unoptimized
        />
      </div>
    );
  }, []);

  return (
    <div className="mc-gui">
      <div className="tl-tl s-tl" />
      <div className="tr-tl" />
      <div className="top" />
      <div className="tl-tr" />
      <div className="tr-tr s-tr" />
      
      <div className="bl-tl" />
      <div className="br-tl" />
      <div className="bl-tr" />
      <div className="br-tr" />
      
      <div className="left" />
      <div className="middle">
        <div className="inventory">
          <h2 className="text-xl font-minecraft mb-1 text-left">
            <span dangerouslySetInnerHTML={{ __html: parseMiniMessage(panel.menuTitle || 'Untitled Menu') }} />
          </h2>
          <div 
            className="grid grid-cols-9"
            style={{ 
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
            onMouseMove={handleMouseMove}
          >
            {Array.from({ length: panel.size }).map((_, index) => {
              const slotKey = `slot_${index}`;
              const slot = panel.items[slotKey];
              const isSelected = selectedSlot === slotKey || multipleSlotSelection.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => onSlotClick?.(index)}
                  onMouseEnter={(e) => slot && handleMouseEnter(e, slot)}
                  onMouseLeave={handleMouseLeave}
                  className={`cell ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {renderSlotImage(slot)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="right" />
      
      <div className="tl-bl" />
      <div className="tr-bl" />
      <div className="bottom" />
      <div className="tl-br" />
      <div className="tr-br" />
      
      <div className="bl-bl s-bl" />
      <div className="br-bl" />
      <div className="bl-br" />
      <div className="br-br s-br" />
      
      {tooltipData && (
        <Tooltip
          name={tooltipData.slot.displayName || tooltipData.slot.material || ''}
          lore={tooltipData.slot.lore || []}
          position={tooltipData.position}
          enchantments={tooltipData.slot.enchantments}
          hideEnchantments={tooltipData.slot.hideEnchantments}
        />
      )}
    </div>
  );
}

