'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LoginDialogProps {
  onLogin: (userData: { name: string; email: string }) => void
  open: boolean
  onClose: () => void
}

export function LoginDialogComponent({ onLogin, open: openProp, onClose }: LoginDialogProps) {
  const [open, setOpen] = useState(openProp)

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  useEffect(() => {
    if (!open) {
      onClose()
    }
  }, [open])

  const handleGoogleLogin = () => {
    // In a real application, this would initiate the Google OAuth flow
    // For this example, we'll simulate a successful login
    const mockUserData = {
      name: "John Doe",
      email: "johndoe@example.com"
    }
    onLogin(mockUserData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 pt-4">
          <Button onClick={handleGoogleLogin} className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}