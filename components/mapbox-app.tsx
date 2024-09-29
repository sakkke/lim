'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NavComponent } from './nav'
import { SearchDialogComponent } from './search-dialog'
import { LoginDialogComponent } from './login-dialog'
import { ReticleComponent } from './reticle'
import { NewMarkerDialogComponent } from './new-marker-dialog'

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fra2tlIiwiYSI6ImNtMW4wMGp2dzBxNGQyanM4MTN6dml4b2sifQ.tt3AqCBM_tUCTJBf42BOwg'

interface Marker {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
}

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [newOpen, setNewOpen] = useState(false)

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
        setNewOpen(true)
        break
      case 'user':
        console.log('User button clicked')
        setLoginOpen(true)
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

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData)
    console.log('User logged in:', userData)
  }

  const onCloseLogin = () => {
    setLoginOpen(false)
  }

  const handleAddMarker = (name: string, description: string) => {
    if (map.current) {
      const center = map.current.getCenter()
      const newMarker: Marker = {
        id: Date.now().toString(),
        name,
        description,
        coordinates: [center.lng, center.lat]
      }
      setMarkers([...markers, newMarker])
    }
  }

  const onCloseNew = () => {
    setNewOpen(false)
  }

  return (
    <div className="h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <NavComponent activeButton={activeButton} onButtonClick={handleButtonClick} />
      <SearchDialogComponent onSearchResult={handleSearchResult} open={searchOpen} onClose={onCloseSearch} />
      <LoginDialogComponent onLogin={handleLogin} open={loginOpen} onClose={onCloseLogin} />
      <ReticleComponent />
      <NewMarkerDialogComponent onAddMarker={handleAddMarker} open={newOpen} onClose={onCloseNew} />
    </div>
  )
}