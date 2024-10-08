'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Marker } from '@/lib/types'

interface MarkerPropertyDialogProps {
  marker: Marker | null;
  onClose: () => void;
  onDelete: (markerId: string) => void;
}

export function MarkerPropertyDialogComponent({ marker, onClose, onDelete }: MarkerPropertyDialogProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (marker) {
      setName(marker.name)
    }
  }, [marker])

  const handleDelete = () => {
    if (marker && marker.id) {
      onDelete(marker.id)
    }
    onClose()
  }

  if (!marker) return null

  return (
    <Dialog open={!!marker} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>マーカーのプロパティ</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter marker name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>座標</Label>
            <p className="text-sm text-gray-500">
              経度: {marker.lng.toFixed(6)}, 緯度: {marker.lat.toFixed(6)}
            </p>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete}>マーカーを削除</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}