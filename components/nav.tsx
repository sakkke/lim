'use client'

import React from 'react'
import { Layers, Map, Navigation } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NavProps {
  activeButton: string | null
  onButtonClick: (buttonName: string) => void
}

export function NavComponent({ activeButton, onButtonClick }: NavProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-md">
      <Button
        variant={activeButton === 'layers' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onButtonClick('layers')}
        className="rounded-r-none"
      >
        <Layers className="h-4 w-4" />
        <span className="sr-only">Layers</span>
      </Button>
      <Button
        variant={activeButton === 'map' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onButtonClick('map')}
        className="rounded-none border-x border-gray-200"
      >
        <Map className="h-4 w-4" />
        <span className="sr-only">Map Style</span>
      </Button>
      <Button
        variant={activeButton === 'navigation' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onButtonClick('navigation')}
        className="rounded-l-none"
      >
        <Navigation className="h-4 w-4" />
        <span className="sr-only">Navigation</span>
      </Button>
    </div>
  )
}