'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NewMarkerDialogProps {
  onAddMarker: (name: string) => void
  open: boolean
  onClose: () => void
}

export function NewMarkerDialogComponent({ onAddMarker, open: openProp, onClose }: NewMarkerDialogProps) {
  const [open, setOpen] = useState(openProp)
  const [name, setName] = useState('')

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  useEffect(() => {
    if (!open) {
      onClose()
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddMarker(name)
    setOpen(false)
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Marker</DialogTitle>
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
          <Button type="submit">Add Marker</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}