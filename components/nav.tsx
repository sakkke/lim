'use client'

import React from 'react'
import { MapPinPlus, Search, User } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NavProps {
  activeButton: string | null
  onButtonClick: (buttonName: string) => void
}

export function NavComponent({ activeButton, onButtonClick }: NavProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-md">
      <Button
        variant={activeButton === 'search' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onButtonClick('search')}
        className="rounded-r-none"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Layers</span>
      </Button>
      <Button
        variant={activeButton === 'plus' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onButtonClick('plus')}
        className="rounded-none border-x border-gray-200"
      >
        <MapPinPlus className="h-4 w-4" />
        <span className="sr-only">Map Style</span>
      </Button>
      <Button
        variant={activeButton === 'user' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onButtonClick('user')}
        className="rounded-l-none"
      >
        <User className="h-4 w-4" />
        <span className="sr-only">Navigation</span>
      </Button>
    </div>
  )
}