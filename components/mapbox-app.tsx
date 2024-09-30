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
import { Marker, User } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import UserPropertyDialog from './user-property-dialog'

// Set your Mapbox token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [newOpen, setNewOpen] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
  const [lngLat, setLngLat] = useState<[number, number] | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [routeLayer, setRouteLayer] = useState<mapboxgl.Layer | null>(null)

  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        setLngLat([position.coords.longitude, position.coords.latitude])
      })
    } catch (e) {
      console.error(e)
      setLngLat([-74.5, 40])
    }

    const setupUser = async () => {
      const supabase = createClient()
      try {
        const { data: res } = await supabase.auth.getUser()
        if (res.user) {
          const { name } = res.user.user_metadata
          setUser({ name })
        }
      } catch (e) {
        console.error(e)
      }
    }
    setupUser()
  }, [])

  useEffect(() => {
    if (map.current) return // initialize map only once

    if (!mapContainer.current) return
    if (!lngLat) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: lngLat, // Default to New York
      zoom: 9,
      language: 'ja'
    })

    const fetchMarkers = async () => {
      const supabase = createClient()
      try {
        const { data: markers } = await supabase
          .from('markers')
          .select()
          .limit(1000)
        if (markers) {
          setMarkers(markers)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchMarkers()

    const el = document.createElement('div')
    el.id = 'marker-current'
    el.className = 'marker'
    el.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <span style="font-size: 24px;">👤</span>
        <span style="background-color: white; border-radius: 4px; padding: 2px 4px; font-size: 12px; white-space: nowrap; margin-top: 2px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">現在</span>
      </div>
    `
    el.style.cursor = 'pointer'

    if (lngLat) {
      new mapboxgl.Marker(el)
        .setLngLat(lngLat)
        .addTo(map.current!)
    }
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
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <span style="font-size: 24px;">📍</span>
          <span style="background-color: white; border-radius: 4px; padding: 2px 4px; font-size: 12px; white-space: nowrap; margin-top: 2px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">${marker.name}</span>
        </div>
      `
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

  useEffect(() => {
    console.log(`routeLayer: ${routeLayer}`)
  }, [routeLayer])

  const getRoute = async (start: [number, number], end: [number, number]) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    )
    const json = await query.json()
    const data = json.routes[0]
    const route = data.geometry.coordinates
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    }

    if (map.current?.getSource('route')) {
      (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as GeoJSON.GeoJSON)
    } else {
      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson as GeoJSON.GeoJSON
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      })
      setRouteLayer(map.current?.getLayer('route') as mapboxgl.Layer)
    }
  }

  const clearRoute = () => {
    if (map.current?.getLayer('route')) {
      map.current.removeLayer('route')
      map.current.removeSource('route')
      setRouteLayer(null)
    }
  }

  const handleButtonClick = (buttonName: string) => {
    // Here you can add specific functionality for each button
    switch (buttonName) {
      case 'search':
        console.log('Search button clicked')
        clearRoute()
        setSearchOpen(true)
        break
      case 'plus':
        console.log('Plus button clicked')
        setNewOpen(true)
        break
      case 'user':
        console.log('User button clicked')
        if (user) {
          setIsUserDialogOpen(true)
        } else {
          setLoginOpen(true)
        }
        break
    }
  }

  const handleSearchResult = (result: { name: string; lng: number; lat: number }) => {
    if (map.current) {
      map.current.flyTo({
        center: [result.lng, result.lat],
        zoom: 12
      })

      if (lngLat) {
        getRoute(lngLat, [result.lng, result.lat])
      }
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
      <UserPropertyDialog
        user={user}
        onClose={() => setIsUserDialogOpen(false)}
        open={isUserDialogOpen}
      />
    </div>
  )
}