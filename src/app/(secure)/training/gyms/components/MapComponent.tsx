"use client";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Gym } from "../../state/types";

interface MapComponentProps {
  gyms: Gym[];
  onGymClick?: (gym: Gym) => void;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  gyms,
  onGymClick,
  className = "w-full h-96 rounded-lg overflow-hidden",
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN || "";

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283], // Center of US as default
      zoom: 4,
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !gyms.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filter gyms with valid coordinates
    const validGyms = gyms.filter(
      (gym) =>
        gym.latitude !== null &&
        gym.longitude !== null &&
        !isNaN(gym.latitude) &&
        !isNaN(gym.longitude)
    );

    if (validGyms.length === 0) return;

    // Add markers for each gym
    validGyms.forEach((gym) => {
      // Create marker element using SVG for perfect pin shape
      const markerElement = document.createElement("div");
      markerElement.className = "gym-marker";
      markerElement.innerHTML = `
        <svg width="24" height="42" viewBox="0 0 24 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="38" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
          <path d="M12 0C5.372 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="#EA4335"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>
      `;
      markerElement.style.cssText = `
        cursor: pointer;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      `;

      // Create marker with proper offset for pin shape
      const marker = new mapboxgl.Marker(markerElement, {
        offset: [0, -21], // Offset so the pin tip points to the correct location
      })
        .setLngLat([gym.longitude!, gym.latitude!])
        .addTo(mapRef.current!);

      // Calculate average rating
      const averageRating =
        gym.reviews && gym.reviews.length > 0
          ? (
              gym.reviews.reduce((sum, review) => sum + review.rating, 0) /
              gym.reviews.length
            ).toFixed(1)
          : null;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: black;">${
            gym.name
          }</h3>
          <p style="margin: 0; color: #666; font-size: 12px;">
            ${
              averageRating
                ? `⭐ ${averageRating} (${gym.reviews!.length} review${
                    gym.reviews!.length !== 1 ? "s" : ""
                  })`
                : "No ratings yet"
            }
          </p>
          ${
            gym.tags && gym.tags.length > 0
              ? `<div style="margin-top: 8px;">
              ${gym.tags
                .slice(0, 3)
                .map(
                  (tag) =>
                    `<span style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-right: 4px; color: black;">${tag}</span>`
                )
                .join("")}
            </div>`
              : ""
          }
        </div>
      `);

      // Add hover events
      markerElement.addEventListener("mouseenter", () => {
        popup.addTo(mapRef.current!);
        marker.setPopup(popup);
      });

      markerElement.addEventListener("mouseleave", () => {
        popup.remove();
      });

      // Add click event
      markerElement.addEventListener("click", () => {
        if (onGymClick) {
          onGymClick(gym);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (validGyms.length === 1) {
      // Single gym - center on it
      mapRef.current.setCenter([
        validGyms[0].longitude!,
        validGyms[0].latitude!,
      ]);
      mapRef.current.setZoom(12);
    } else if (validGyms.length > 1) {
      // Multiple gyms - fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      validGyms.forEach((gym) => {
        bounds.extend([gym.longitude!, gym.latitude!]);
      });
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [gyms, onGymClick]);

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ minHeight: "300px" }}
    />
  );
};

export default MapComponent;
