'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NavComponent } from './nav'

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fra2tlIiwiYSI6ImNtMW4wMGp2dzBxNGQyanM4MTN6dml4b2sifQ.tt3AqCBM_tUCTJBf42BOwg'

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)

  useEffect(() => {
    if (map.current) return // initialize map only once

    if (!mapContainer.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Default to New York
      zoom: 9
    })
  }, [])

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(activeButton === buttonName ? null : buttonName)
    // Here you can add specific functionality for each button
    switch (buttonName) {
      case 'layers':
        console.log('Layers button clicked')
        // Add layers functionality
        break
      case 'map':
        console.log('Map button clicked')
        // Add map style switching functionality
        break
      case 'navigation':
        console.log('Navigation button clicked')
        // Add navigation functionality
        break
    }
  }

  return (
    <div className="h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <NavComponent activeButton={activeButton} onButtonClick={handleButtonClick} />
    </div>
  )
}