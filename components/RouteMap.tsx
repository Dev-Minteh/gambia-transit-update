"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Route, Stop } from "@/types/index";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type RouteMapProps = {
  trip: Route[];
  stops: Stop[];
};

export default function RouteMap({ trip, stops }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get coordinates for each stop in the trip
    const allStopNames = [
      ...trip.map(leg => leg.from),
      trip[trip.length - 1].to
    ];

    const coordinates = allStopNames
      .map(name => stops.find(s => s.name === name))
      .filter(Boolean) as Stop[];

    if (coordinates.length === 0) return;

    // Initialize map centered on first stop
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [coordinates[0].longitude, coordinates[0].latitude],
      zoom: 10
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add route line
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates.map(s => [s.longitude, s.latitude])
          }
        }
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#14b8a6",
          "line-width": 3
        }
      });

      // Add markers for each stop
      coordinates.forEach((stop, i) => {
        const el = document.createElement("div");
        el.className = "w-3 h-3 rounded-full border-2 border-white";
        el.style.backgroundColor = i === 0 || i === coordinates.length - 1
          ? "#14b8a6"
          : "#ffffff";

        new mapboxgl.Marker(el)
          .setLngLat([stop.longitude, stop.latitude])
          .setPopup(new mapboxgl.Popup().setText(stop.name))
          .addTo(map.current!);
      });

      // Fit map to show all stops
      const bounds = coordinates.reduce(
        (b, s) => b.extend([s.longitude, s.latitude]),
        new mapboxgl.LngLatBounds(
          [coordinates[0].longitude, coordinates[0].latitude],
          [coordinates[0].longitude, coordinates[0].latitude]
        )
      );

      map.current.fitBounds(bounds, { padding: 40 });
    });

    return () => map.current?.remove();
  }, [trip, stops]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-64 rounded mt-3"
      onClick={e => e.stopPropagation()}
    />
  );
}