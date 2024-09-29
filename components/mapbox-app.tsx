'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NavComponent } from './nav'
import { SearchDialogComponent } from './search-dialog'
import { LoginDialogComponent } from './login-dialog'
import { ReticleComponent } from './reticle'
import { NewMarkerDialogComponent } from './new-marker-dialog'
import { MarkerPropertyDialogComponent } from './marker-property-dialog'

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fra2tlIiwiYSI6ImNtMW4wMGp2dzBxNGQyanM4MTN6dml4b2sifQ.tt3AqCBM_tUCTJBf42BOwg'

interface Marker {
  id: string;
  name: string;
  coordinates: [number, number];
}

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [newOpen, setNewOpen] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)

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

  useEffect(() => {
    if (!map.current) return

    // Remove existing markers
    markers.forEach(marker => {
      const el = document.getElementById(`marker-${marker.id}`)
      if (el) el.remove()
    })

    // Add markers to the map
    markers.forEach(marker => {
      const el = document.createElement('div')
      el.id = `marker-${marker.id}`
      el.className = 'marker'
      el.innerHTML = '<span style="font-size: 24px;">📍</span>'
      el.style.cursor = 'pointer'

      el.addEventListener('click', () => {
        setSelectedMarker(marker)
      })

      new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .addTo(map.current!)
    })
  }, [markers])

  useEffect(() => {
    console.log(`user: ${user}`)
  }, [user])

  const handleButtonClick = (buttonName: string) => {
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

  const handleAddMarker = (name: string) => {
    if (map.current) {
      const center = map.current.getCenter()
      const newMarker: Marker = {
        id: Date.now().toString(),
        name,
        coordinates: [center.lng, center.lat]
      }
      setMarkers([...markers, newMarker])
    }
  }

  const onCloseNew = () => {
    setNewOpen(false)
  }

  const handleUpdateMarker = (updatedMarker: Marker) => {
    setMarkers(markers.map(marker => 
      marker.id === updatedMarker.id ? updatedMarker : marker
    ))
  }

  const handleDeleteMarker = (markerId: string) => {
    setMarkers(markers.filter(marker => marker.id !== markerId))
  }

  return (
    <div className="h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <NavComponent onButtonClick={handleButtonClick} />
      <SearchDialogComponent onSearchResult={handleSearchResult} open={searchOpen} onClose={onCloseSearch} />
      <LoginDialogComponent onLogin={handleLogin} open={loginOpen} onClose={onCloseLogin} />
      <ReticleComponent />
      <NewMarkerDialogComponent onAddMarker={handleAddMarker} open={newOpen} onClose={onCloseNew} />
      <MarkerPropertyDialogComponent
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
        onUpdate={handleUpdateMarker}
        onDelete={handleDeleteMarker}
      />
    </div>
  )
}