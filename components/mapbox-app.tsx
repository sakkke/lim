'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fra2tlIiwiYSI6ImNtMW4wMGp2dzBxNGQyanM4MTN6dml4b2sifQ.tt3AqCBM_tUCTJBf42BOwg'

export function MapboxAppComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)

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

  return (
    <div className="h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  )
}