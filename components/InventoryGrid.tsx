import React, { useState } from 'react';
import Image from 'next/image';
import Tooltip from './Tooltip';

interface Slot {
  item?: string;
  name?: string;
  lore?: string[];
  actions?: string[];
}

interface InventoryGridProps {
  size: number;
  slots: { [key: number]: Slot };
  onSlotClick: (index: number) => void;
}

export default function InventoryGrid({ size, slots, onSlotClick }: InventoryGridProps) {
  const rows = Math.ceil(size / 9);
  const [tooltipData, setTooltipData] = useState<{ slot: Slot; position: { x: number; y: number } } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, slot: Slot) => {
    if (slot && slot.item) {
      setTooltipData({
        slot,
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tooltipData) {
      setTooltipData({
        ...tooltipData,
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  return (
    <div className="bg-gray-800 p-2 rounded-lg relative">
      <div 
        className={`grid grid-cols-9 gap-1`} 
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: size }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-700 w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => onSlotClick(index)}
            onMouseEnter={(e) => slots[index] && handleMouseEnter(e, slots[index])}
            onMouseLeave={handleMouseLeave}
          >
            {slots[index] && slots[index].item && (
              <Image
                src={`/minecraft-items/${slots[index].item.toLowerCase()}.png`}
                alt={slots[index].item}
                width={32}
                height={32}
              />
            )}
          </div>
        ))}
      </div>
      {tooltipData && tooltipData.slot.item && (
        <Tooltip
          name={tooltipData.slot.name || ''}
          lore={tooltipData.slot.lore || []}
          position={tooltipData.position}
        />
      )}
    </div>
  );
}

