"use client";

import { MapboxAppComponent } from "@/components/mapbox-app";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <MapboxAppComponent />
  );
}
