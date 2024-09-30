'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from '@/lib/types'

interface UserPropertyDialogProps {
  user: User | null;
  onClose: () => void;
  open: boolean;
}

export default function UserPropertyDialog({ user, onClose, open: openProp }: UserPropertyDialogProps) {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(openProp)

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ユーザープロフィール</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              placeholder="Enter your name"
              required
              readOnly
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}