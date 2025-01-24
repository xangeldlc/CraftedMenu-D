'use client'

import React from 'react';
import { parseMiniMessage } from '../utils/miniMessageParser';

interface TooltipProps {
  name: string;
  lore?: string[];
  position: { x: number; y: number };
}

export default function Tooltip({ name, lore = [], position }: TooltipProps) {
  return (
    <div 
      className="fixed z-50 pointer-events-none p-2 rounded bg-gray-900/90 border border-gray-800"
      style={{ 
        left: `${position.x + 12}px`, 
        top: `${position.y + 12}px`,
        minWidth: '150px'
      }}
    >
      <div className="font-minecraft">
        <span dangerouslySetInnerHTML={{ __html: parseMiniMessage(name) }} />
      </div>
      {lore.map((line, index) => (
        <div key={index} className="font-minecraft text-sm">
          <span dangerouslySetInnerHTML={{ __html: parseMiniMessage(line) }} />
        </div>
      ))}
    </div>
  );
}

