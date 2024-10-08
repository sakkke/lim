'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Marker } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { debounceTime, Subject } from 'rxjs'

interface SearchDialogProps {
  onSearchResult: (result: { name: string; lng: number; lat: number }) => void
  open: boolean
  onClose: () => void
}

export function SearchDialogComponent({ onSearchResult, open: openProp, onClose }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Marker[] | null>(null)
  const [open, setOpen] = useState(openProp)
  const [searchNameSubject] = useState(new Subject<string>())

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  useEffect(() => {
    if (!open) {
      onClose()
    }
  }, [open])

  useEffect(() => {
    searchNameSubject
      .pipe(
        debounceTime(500)
      ).subscribe((searchName) => {
        handleSearch(searchName)
      })
  }, [searchNameSubject])

  useEffect(() => {
    searchNameSubject.next(searchTerm)
  }, [searchNameSubject, searchTerm])

  const handleSearch = async (searchName: string) => {
    const supabase = createClient()
    const { data: markers } = await supabase
      .from('markers')
      .select()
      .ilike('name', `%${searchName}%`)
      .limit(5)

    if (markers) {
      const filtered = markers.filter(place => 
        place.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) as Marker[]
      setResults(filtered)
    }
  }

  const handleSelect = (place: Marker) => {
    onSearchResult(place)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>場所を検索</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => handleSearch(searchTerm)}>検索</Button>
        </div>
        <div className="mt-4 space-y-2">
          {results && results.map((place) => (
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