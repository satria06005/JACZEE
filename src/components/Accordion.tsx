"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-xs tracking-widest uppercase font-semibold text-black group-hover:opacity-70 transition-opacity">
          {title}
        </span>
        <span className="text-gray-400 group-hover:text-black transition-colors">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
