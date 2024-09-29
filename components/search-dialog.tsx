'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Marker } from '@/lib/types'

interface SearchDialogProps {
  onSearchResult: (result: { name: string; lng: number; lat: number }) => void
  open: boolean
  onClose: () => void
}

const mockPlaces: Marker[] = [
  { name: "New York", lng: -74.006, lat: 40.7128 },
  { name: "Los Angeles", lng: -118.2437, lat: 34.0522 },
  { name: "Chicago", lng: -87.6298, lat: 41.8781 },
  { name: "Houston", lng: -95.3698, lat: 29.7604 },
  { name: "Phoenix", lng: -112.0740, lat: 33.4484 },
]

export function SearchDialogComponent({ onSearchResult, open: openProp, onClose }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState(mockPlaces)
  const [open, setOpen] = useState(openProp)

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  useEffect(() => {
    if (!open) {
      onClose()
    }
  }, [open])

  const handleSearch = () => {
    const filtered = mockPlaces.filter(place => 
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setResults(filtered)
  }

  const handleSelect = (place: typeof mockPlaces[0]) => {
    onSearchResult(place)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Places</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="mt-4 space-y-2">
          {results.map((place) => (
            <Button
              key={place.name}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect(place)}
            >
              {place.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}