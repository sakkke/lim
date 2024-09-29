'use client'

import React from 'react'

export function ReticleComponent() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-full bg-black opacity-50"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-black opacity-50"></div>
        </div>
      </div>
    </div>
  )
}