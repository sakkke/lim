'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NavComponent } from './nav'
import { SearchDialogComponent } from './search-dialog'

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fra2tlIiwiYSI6ImNtMW4wMGp2dzBxNGQyanM4MTN6dml4b2sifQ.tt3AqCBM_tUCTJBf42BOwg'

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

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
      case 'search':
        console.log('Search button clicked')
        setSearchOpen(true)
        break
      case 'plus':
        console.log('Plus button clicked')
        break
      case 'user':
        console.log('User button clicked')
        break
    }
  }

  const handleSearchResult = (result: { name: string; coordinates: [number, number] }) => {
    if (map.current) {
      map.current.flyTo({
        center: result.coordinates,
        zoom: 12
      })
    }
  }

  const onCloseSearch = () => {
    setSearchOpen(false)
  }

  return (
    <div className="h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <NavComponent activeButton={activeButton} onButtonClick={handleButtonClick} />
      <SearchDialogComponent onSearchResult={handleSearchResult} open={searchOpen} onClose={onCloseSearch} />
    </div>
  )
}