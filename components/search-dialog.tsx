'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

interface SearchDialogProps {
  onSearchResult: (result: { name: string; coordinates: [number, number] }) => void
}

type Place = {
  name: string
  coordinates: [number, number]
}

const mockPlaces: Place[] = [
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
  { name: "Chicago", coordinates: [-87.6298, 41.8781] },
  { name: "Houston", coordinates: [-95.3698, 29.7604] },
  { name: "Phoenix", coordinates: [-112.0740, 33.4484] },
]

export function SearchDialogComponent({ onSearchResult }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState(mockPlaces)
  const [open, setOpen] = useState(false)

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
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          <Search className="mr-2 h-4 w-4" />
          Search places...
        </Button>
      </DialogTrigger>
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