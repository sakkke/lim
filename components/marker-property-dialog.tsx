'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Marker {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
}

interface MarkerPropertyDialogProps {
  marker: Marker | null;
  onClose: () => void;
  onUpdate: (updatedMarker: Marker) => void;
  onDelete: (markerId: string) => void;
}

export function MarkerPropertyDialogComponent({ marker, onClose, onUpdate, onDelete }: MarkerPropertyDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (marker) {
      setName(marker.name)
      setDescription(marker.description)
    }
  }, [marker])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (marker) {
      onUpdate({ ...marker, name, description })
    }
    onClose()
  }

  const handleDelete = () => {
    if (marker) {
      onDelete(marker.id)
    }
    onClose()
  }

  if (!marker) return null

  return (
    <Dialog open={!!marker} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Marker Properties</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter marker name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter marker description"
            />
          </div>
          <div className="space-y-2">
            <Label>Coordinates</Label>
            <p className="text-sm text-gray-500">
              Longitude: {marker.coordinates[0].toFixed(6)}, Latitude: {marker.coordinates[1].toFixed(6)}
            </p>
          </div>
          <div className="flex justify-between">
            <Button type="submit">Update Marker</Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>Delete Marker</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}