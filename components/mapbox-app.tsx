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
import { Marker } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'

// Set your Mapbox token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [newOpen, setNewOpen] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
  const [lngLat, setLngLat] = useState<[number, number] | null>(null)

  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        setLngLat([position.coords.longitude, position.coords.latitude])
      })
    } catch (e) {
      console.error(e)
      setLngLat([-74.5, 40])
    }
  }, [])

  useEffect(() => {
    if (map.current) return // initialize map only once

    if (!mapContainer.current) return
    if (!lngLat) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: lngLat, // Default to New York
      zoom: 9
    })

    const fetchMarkers = async () => {
      const supabase = createClient()
      try {
        const { data: markers } = await supabase
          .from('markers')
          .select()
        if (markers) {
          setMarkers(markers)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchMarkers()
  }, [lngLat])

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
        .setLngLat([marker.lng, marker.lat])
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

  const handleSearchResult = (result: { name: string; lng: number; lat: number }) => {
    if (map.current) {
      map.current.flyTo({
        center: [result.lng, result.lat],
        zoom: 12
      })
    }
  }

  const onCloseSearch = () => {
    setSearchOpen(false)
  }

  const handleLogin = async (userData: { name: string; email: string }) => {
    setUser(userData)
    console.log('User logged in:', userData)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const onCloseLogin = () => {
    setLoginOpen(false)
  }

  const handleAddMarker = async (name: string) => {
    if (map.current) {
      const center = map.current.getCenter()
      const supabase = createClient()
      const newMarker: Marker = {
        name,
        lng: center.lng,
        lat: center.lat
      }
      try {
        const { data: marker } = await supabase
          .from('markers')
          .insert([newMarker])
          .select('id')
          .limit(1)
          .single()
        if (marker) {
          setMarkers([...markers, { ...newMarker, id: marker.id }])
        }
      } catch (e) {
        console.error(e)
      }
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