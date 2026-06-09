"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Layers as LayersIcon,
  Eye,
  EyeOff,
  Search,
  ZoomIn,
  ZoomOut,
  Home,
  Maximize2,
  Minimize2,
  Map as MapIcon,
  Mountain,
  Satellite,
  Navigation,
  X,
  Info,
  ChevronRight,
  Database,
  ChevronDown,
  FileText,
  MapPin,
  XCircle,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import { getAssetUrl } from "@/lib/api/config";

import "leaflet/dist/leaflet.css";

/* ── Minimal Leaflet tooltip override: transparent bg, no border, no arrow ── */
const TOOLTIP_CSS = `
  .custom-map-label {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  .custom-map-label::before {
    display: none !important;
  }
`;

// BACKEND constant removed — all API calls use relative paths through Next.js proxy

/* ── Selected entity type ── */
interface SelectedEntity {
  properties: Record<string, unknown>;
  layerName?: string;
  labelField?: string;
  category?: string;
  color?: string;
}

/* ── Custom SVG markers by point category ── */
function getMarkerSvg(type: string, color: string): string {
  const t = (type || "").toLowerCase();

  if (t.includes("barrage") || t.includes("dam")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M4 28 L10 10 L22 10 L28 28 Z" fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M6 16 Q10 13 14 16 Q18 19 22 16" fill="none" stroke="white" stroke-width="1.2" opacity="0.7"/>
      <path d="M6 21 Q10 18 14 21 Q18 24 22 21" fill="none" stroke="white" stroke-width="1.2" opacity="0.7"/>
      <circle cx="16" cy="38" r="2" fill="${color}" opacity="0.4"/>
    </svg>`;
  }

  if (
    t.includes("forage") ||
    t.includes("puits") ||
    t.includes("well") ||
    t.includes("borehole")
  ) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <circle cx="14" cy="14" r="10" fill="${color}" stroke="white" stroke-width="1.5"/>
      <line x1="14" y1="6" x2="14" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="14" x2="20" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="14" cy="34" r="2" fill="${color}" opacity="0.4"/>
    </svg>`;
  }

  if (
    t.includes("station") ||
    t.includes("piezo") ||
    t.includes("monitoring")
  ) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <rect x="4" y="6" width="20" height="16" rx="2" fill="${color}" stroke="white" stroke-width="1.5"/>
      <line x1="14" y1="6" x2="14" y2="0" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="14" cy="0" r="2.5" fill="${color}" stroke="white" stroke-width="1"/>
      <circle cx="14" cy="34" r="2" fill="${color}" opacity="0.4"/>
    </svg>`;
  }

  if (
    t.includes("ville") ||
    t.includes("city") ||
    t.includes("capital") ||
    t.includes("commune") ||
    t.includes("village")
  ) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="1.5"/>
      <rect x="12" y="5" width="5" height="14" rx="0.5" fill="white" opacity="0.95"/>
      <rect x="13" y="7" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="14.8" y="7" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="13" y="10" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="14.8" y="10" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="13.5" y="15" width="2" height="4" rx="0.3" fill="${color}"/>
      <rect x="6" y="10" width="4.5" height="9" rx="0.5" fill="white" opacity="0.85"/>
      <rect x="7" y="12" width="1" height="1.2" rx="0.15" fill="${color}"/>
      <rect x="8.5" y="12" width="1" height="1.2" rx="0.15" fill="${color}"/>
      <rect x="7" y="15" width="1" height="1.2" rx="0.15" fill="${color}"/>
      <rect x="8.5" y="15" width="1" height="1.2" rx="0.15" fill="${color}"/>
      <rect x="18.5" y="8" width="5" height="11" rx="0.5" fill="white" opacity="0.9"/>
      <rect x="19.5" y="10" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="21.3" y="10" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="19.5" y="13.5" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <rect x="21.3" y="13.5" width="1.2" height="1.5" rx="0.2" fill="${color}"/>
      <path d="M16 30 L13 18 Q16 20 19 18 Z" fill="${color}" opacity="0.85"/>
      <circle cx="16" cy="38" r="2" fill="${color}" opacity="0.4"/>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0 C6.3 0 0 6.3 0 14 C0 24.5 14 36 14 36 C14 36 28 24.5 28 14 C28 6.3 21.7 0 14 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
  </svg>`;
}

function detectPointCategory(layer: any, feature: any): string {
  const name = ((layer.name || "") + " " + (layer.nameFr || "")).toLowerCase();
  const cat = (
    (layer.category || "") +
    " " +
    (feature?.properties?.type || "") +
    " " +
    (feature?.properties?.nature || "") +
    " " +
    (feature?.properties?.categorie || "")
  ).toLowerCase();
  const combined = name + " " + cat;
  if (combined.includes("barrage") || combined.includes("dam"))
    return "barrage";
  if (
    combined.includes("forage") ||
    combined.includes("puits") ||
    combined.includes("well") ||
    combined.includes("borehole")
  )
    return "forage";
  if (
    combined.includes("station") ||
    combined.includes("piezo") ||
    combined.includes("monitoring")
  )
    return "station";
  if (
    combined.includes("ville") ||
    combined.includes("city") ||
    combined.includes("capital") ||
    combined.includes("commune") ||
    combined.includes("village")
  )
    return "ville";
  return "default";
}

function detectPointCategoryFromPt(pt: any): string {
  const combined = (
    (pt.category || "") +
    " " +
    (pt.name || "") +
    " " +
    (pt.nameFr || "")
  ).toLowerCase();
  if (combined.includes("barrage") || combined.includes("dam"))
    return "barrage";
  if (
    combined.includes("forage") ||
    combined.includes("puits") ||
    combined.includes("well") ||
    combined.includes("borehole")
  )
    return "forage";
  if (
    combined.includes("station") ||
    combined.includes("piezo") ||
    combined.includes("monitoring")
  )
    return "station";
  if (
    combined.includes("ville") ||
    combined.includes("city") ||
    combined.includes("capital") ||
    combined.includes("commune") ||
    combined.includes("village")
  )
    return "ville";
  return "default";
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), {
  ssr: false,
});
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false },
);
const ScaleControl = dynamic(
  () => import("react-leaflet").then((m) => m.ScaleControl),
  { ssr: false },
);
const MapInner = dynamic(
  () =>
    import("react-leaflet").then((m) => {
      function Inner({ mapRef }: { mapRef: React.MutableRefObject<any> }) {
        const map = m.useMap();
        mapRef.current = map;
        return null;
      }
      return { default: Inner };
    }),
  { ssr: false },
);

// ─── BASEMAPS CONFIG ─────────────────────────────────────────────────────────
// Each basemap now has a UNIQUE iconName that maps 1:1 to the BasemapIcon component.

const BASEMAPS: Record<
  string,
  {
    url: string;
    attribution: string;
    maxZoom?: number;
    labels?: string;
    label: string;
    labelFr: string;
    iconName: string;
  }
> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri",
    maxZoom: 19,
    label: "Satellite",
    labelFr: "Satellite",
    iconName: "satellite",
  },

  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri, DigitalGlobe",
    maxZoom: 19,
    labels:
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
    label: "Satellite + Labels",
    labelFr: "Satellite + Etiquettes",
    iconName: "hybrid",
  },

  streets: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    label: "Streets",
    labelFr: "Rues",
    iconName: "streets",
  },

  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "OpenTopoMap",
    maxZoom: 17,
    label: "Terrain",
    labelFr: "Terrain",
    iconName: "terrain",
  },

  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), GIS User Community",
    maxZoom: 19,
    label: "Topo Map",
    labelFr: "Carte Topographique",
    iconName: "topo", // ✅ was "terrain" — now unique
  },

  physical: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "US National Park Service",
    maxZoom: 8,
    label: "Physical Map",
    labelFr: "Carte Physique",
    iconName: "physical", // ✅ was "terrain" — now unique
  },

  gray: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri, DeLorme, NAVTEQ",
    maxZoom: 16,
    label: "Gray Canvas",
    labelFr: "Fond Gris",
    iconName: "gray", // ✅ was "streets" — now unique
  },

  usgsTopo: {
    url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
    attribution: "U.S. Geological Survey",
    maxZoom: 20,
    label: "USGS Topo",
    labelFr: "USGS Topographique",
    iconName: "usgsTopo", // ✅ was "terrain" — now unique
  },

  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    label: "Dark",
    labelFr: "Sombre",
    iconName: "dark", // ✅ was "satellite" — now unique
  },

  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    label: "Light",
    labelFr: "Clair",
    iconName: "light", // ✅ was "streets" — now unique
  },
};

// ─── BASEMAP ICON COMPONENT ─────────────────────────────────────────────────
// Now uses iconName from config (1:1 mapping) instead of guessing from the key.
// Every basemap type gets a visually distinct SVG icon.

function BasemapIcon({ name }: { name: string }) {
  const config = BASEMAPS[name];
  const icon = config?.iconName ?? name;

  switch (icon) {
    // 🛰️ Satellite — dish with signal arcs
    case "satellite":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 7L9 3 5 7l4 4" />
          <path d="m17 11 4-4-4-4-4 4" />
          <path d="m8 12 4 4 4-4-4-4" />
          <path d="m13 17-4 4-4-4 4-4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    // 🛰️+🏷️ Hybrid — satellite + label overlay
    case "hybrid":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="10" height="10" rx="1" />
          <path d="M4 8h6" />
          <path d="M7 5v6" />
          <rect
            x="13"
            y="13"
            width="9"
            height="9"
            rx="2"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path d="M16 18h3" />
          <path d="M16 15.5h3" />
        </svg>
      );

    // 🗺️ Streets — road grid
    case "streets":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path d="M3 12h18" />
          <path d="M12 3v18" />
          <path d="M3 7h18" />
          <path d="M3 17h18" />
          <path d="M7 3v18" />
          <path d="M17 3v18" />
        </svg>
      );

    // ⛰️ Terrain — mountain peaks
    case "terrain":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="m8 3 4 8 5-5 5 15H2L8 3z"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      );

    // 🏔️ Topo — contour lines (topographic)
    case "topo":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="15" rx="9" ry="6" />
          <ellipse cx="12" cy="12" rx="7" ry="4.5" />
          <ellipse cx="12" cy="9" rx="4.5" ry="3" />
          <ellipse cx="12" cy="7" rx="2" ry="1.2" />
        </svg>
      );

    // 🌍 Physical — globe / earth
    case "physical":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      );

    // ⬜ Gray — muted square
    case "gray":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            fill="currentColor"
            fillOpacity="0.25"
          />
          <path d="M3 9h18" opacity="0.5" />
          <path d="M9 3v18" opacity="0.5" />
        </svg>
      );

    // 🇺🇸 USGS Topo — map with pin
    case "usgsTopo":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <path d="M12 7v6" />
          <path d="M9 13h6" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );

    // 🌙 Dark — moon / night mode
    case "dark":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      );

    // ☀️ Light — sun / day mode
    case "light":
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );

    // 🗺️ Fallback — generic map
    default:
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 7 5-2 5 2 5-2v12l-5 2-5-2-5 2V7z" />
          <path d="M8 5v12" />
          <path d="M13 7v12" />
        </svg>
      );
  }
}

// ─── GEOM ICON COMPONENT (unchanged) ────────────────────────────────────────

function GeomIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = (type || "").toUpperCase();
  if (t.includes("POINT"))
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5" fill="white" />
        <circle cx="8" cy="8" r="3" fill="currentColor" />
      </svg>
    );
  if (t.includes("LINE"))
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12 L5 5 L9 10 L14 3"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (t.includes("POLYGON"))
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2 L14 6 L12 13 L4 13 L2 6 Z"
          fill="white"
          fillOpacity="0.35"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect
        x="4"
        y="4"
        width="8"
        height="8"
        rx="1"
        transform="rotate(45 8 8)"
        fill="white"
        fillOpacity="0.35"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ── Point markers layer — now uses onSelectEntity instead of Popup ── */
const RLMarker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

function PointMarkersLayer({
  points,
  onSelectEntity,
}: {
  points: any[];
  onSelectEntity: (entity: SelectedEntity) => void;
}) {
  if (!points.length) return null;
  const L = typeof window !== "undefined" ? (window as any).L : null;
  if (!L) return null;

  return (
    <>
      {points.map((pt) => {
        const ptCat = detectPointCategoryFromPt(pt);
        const color = pt.color || "#3b82f6";

        const entityData: SelectedEntity = {
          properties: {
            Nom: pt.nameFr || pt.name,
            Catégorie: pt.category || "",
            Description:
              pt.popupContentFr || pt.popupContent || pt.description || "",
            Latitude: pt.latitude,
            Longitude: pt.longitude,
          },
          layerName: pt.category || "Points",
          category: ptCat,
          color: color,
        };

        if (ptCat !== "default") {
          const svg = getMarkerSvg(ptCat, color);
          const isVille = ptCat === "ville";
          const icon = L.divIcon({
            html: svg,
            className: "custom-map-marker",
            iconSize: ptCat === "barrage" || isVille ? [32, 40] : [28, 36],
            iconAnchor: ptCat === "barrage" || isVille ? [16, 38] : [14, 34],
            tooltipAnchor: [0, 0],
          });
          return (
            <RLMarker
              key={pt.id}
              position={[pt.latitude, pt.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectEntity(entityData),
              }}
            />
          );
        }

        return (
          <CircleMarker
            key={pt.id}
            center={[pt.latitude, pt.longitude]}
            radius={pt.size || 8}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onSelectEntity(entityData),
            }}
          />
        );
      })}
    </>
  );
}

function MapSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-sky-400/20 animate-ping" />
          <div
            className="absolute inset-3 rounded-full border-2 border-sky-400/40 animate-ping"
            style={{ animationDelay: "0.4s" }}
          />
          <div className="absolute inset-6 rounded-full flex items-center justify-center bg-sky-500 shadow-lg shadow-sky-500/30">
            <Navigation className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-slate-700 text-sm font-semibold tracking-wide">
            Chargement de la carte
          </p>
          <p className="text-slate-400 text-xs">
            Systeme Aquifere Senegalo-Mauritanien
          </p>
        </div>
        <div className="w-52 h-1 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full w-1/2 rounded-full bg-sky-500"
            style={{
              animation: "smas-shimmer 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <style>{`@keyframes smas-shimmer { 0%{transform:translateX(-200%)} 100%{transform:translateX(400%)} }`}</style>
    </div>
  );
}

function LayerItem({
  layer,
  visible,
  onToggle,
  onExpand,
  expanded,
}: {
  layer: any;
  visible: boolean;
  onToggle: () => void;
  onExpand: () => void;
  expanded: boolean;
}) {
  const PALETTE = [
    "#3b82f6",
    "#ef4444",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#64748b",
    "#ec4899",
    "#14b8a6",
    "#84cc16",
    "#f43f5e",
    "#78716c",
    "#a855f7",
    "#eab308",
  ];

  const name = layer.nameFr || layer.name;
  const layerType = (layer.layerType || "").toUpperCase();
  const isPolygon = layerType.includes("POLYGON");
  const isLine = layerType.includes("LINE");
  const isPoint = layerType.includes("POINT");

  const fillC = layer.fillColor || layer.color || "#3b82f6";
  const borderC = layer.borderColor || layer.color || "#3b82f6";
  const layerWeight = layer.weight ?? 2;
  const layerFillOpacity = layer.fillOpacity ?? 0.4;
  const layerBorderOpacity = layer.borderOpacity ?? 0.8;

  const categoryLegend = useMemo(() => {
    if (!layer.categorize || !layer.categorizeField || !layer.geoData)
      return [];
    try {
      const geo =
        typeof layer.geoData === "string"
          ? JSON.parse(layer.geoData)
          : layer.geoData;
      const unique: string[] = [];
      (geo?.features || []).forEach((f: any) => {
        const v = String(f?.properties?.[layer.categorizeField] ?? "N/A");
        if (!unique.includes(v)) unique.push(v);
      });
      return unique.map((v, i) => ({
        value: v,
        fillColor: PALETTE[i % PALETTE.length],
        borderColor: PALETTE[i % PALETTE.length],
      }));
    } catch {
      return [];
    }
  }, [layer]);

  return (
    <div
      className={`group rounded-xl border transition-all duration-200 overflow-hidden ${
        expanded
          ? "border-sky-200 bg-sky-50/60 shadow-sm"
          : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div
        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
        onClick={onExpand}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="relative flex-shrink-0 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:ring-offset-1"
          style={{
            width: 36,
            height: 20,
            background: visible
              ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
              : "#cbd5e1",
          }}
          aria-label="Toggle layer"
        >
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
            style={{
              transform: visible ? "translateX(16px)" : "translateX(0)",
            }}
          />
        </button>

        {(() => {
          if (!layer.categorize || !layer.categorizeField) {
            if (isPolygon) {
              return (
                <span
                  className="w-8 h-6 rounded flex-shrink-0 shadow-sm"
                  style={{
                    background: fillC,
                    border: `${Math.max(layerWeight, 2)}px solid ${borderC}`,
                    borderRadius: 4,
                  }}
                />
              );
            }
            if (isLine) {
              return (
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="6">
                    <line
                      x1="2"
                      y1="3"
                      x2="26"
                      y2="3"
                      stroke={borderC}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              );
            }
            if (isPoint) {
              return (
                <span
                  className="flex-shrink-0"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: fillC,
                    border: `2px solid ${borderC}`,
                    margin: "0 9px",
                  }}
                />
              );
            }
          }
          const t = (layer.layerType || "").toUpperCase();
          const bg = layer.color || "#3b82f6";
          const iconEl = (
            <GeomIcon type={layer.layerType || "VECTOR"} size={15} />
          );
          if (t.includes("POINT")) {
            return (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                style={{ background: bg }}
              >
                {iconEl}
              </div>
            );
          }
          if (t.includes("LINE")) {
            return (
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
                }}
              >
                {iconEl}
              </div>
            );
          }
          if (t.includes("POLYGON")) {
            return (
              <div
                className="w-8 h-8 flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                style={{
                  background: bg,
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                {iconEl}
              </div>
            );
          }
          return (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm"
              style={{ background: bg }}
            >
              {iconEl}
            </div>
          );
        })()}

        <div className="flex-1 min-w-0">
          <span
            className="text-[13px] block truncate transition-colors duration-200"
            style={{
              color: visible ? "#1e293b" : "#94a3b8",
              fontWeight: visible ? 600 : 400,
            }}
          >
            {name}
          </span>
          {layer.layerType && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {layer.layerType}
            </span>
          )}
        </div>

        {categoryLegend.length > 0 && (
          <ChevronDown
            className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
            style={{
              color: expanded ? "#3b82f6" : "#cbd5e1",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-100 pt-2.5">
          {categoryLegend.length > 0 && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">
                {layer.categorizeField}
              </p>
              <div className="flex flex-col gap-1.5">
                {categoryLegend.map(({ value, fillColor, borderColor }) => (
                  <div key={value} className="flex items-center gap-2.5">
                    {isPolygon && (
                      <span
                        className="flex-shrink-0"
                        style={{
                          width: 20,
                          height: 14,
                          borderRadius: 2,
                          background: fillColor,
                          border: `${Math.max(layerWeight, 2)}px solid ${borderColor}`,
                        }}
                      />
                    )}
                    {isLine && (
                      <svg width="20" height="4" className="flex-shrink-0">
                        <line
                          x1="0"
                          y1="2"
                          x2="20"
                          y2="2"
                          stroke={borderColor}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {isPoint && (
                      <span
                        className="flex-shrink-0"
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: fillColor,
                          border: `2px solid ${borderColor}`,
                        }}
                      />
                    )}
                    {!isPolygon && !isLine && !isPoint && (
                      <span
                        className="flex-shrink-0"
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 2,
                          background: fillColor,
                          border: `${Math.max(layerWeight, 2)}px solid ${borderColor}`,
                        }}
                      />
                    )}
                    <span className="text-xs text-slate-600 truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CtrlBtn({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-white/95 shadow-md border border-slate-200/60 hover:bg-sky-50 hover:border-sky-200"
      style={{
        color: active ? "#3b82f6" : "#64748b",
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </button>
  );
}

/* ── Right sidebar for entity details ── */
function EntityDetailSidebar({
  entity,
  onClose,
}: {
  entity: SelectedEntity;
  onClose: () => void;
}) {
  const entries = Object.entries(entity.properties).filter(
    ([, v]) => v != null && v !== "",
  );
  const labelValue =
    entity.labelField && entity.properties[entity.labelField]
      ? String(entity.properties[entity.labelField])
      : null;

  return (
    <div className="flex flex-col h-full bg-white" style={{ minWidth: 340 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-sky-500 to-cyan-500">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white leading-tight truncate">
              {labelValue || entity.layerName || "Entité"}
            </h2>
            {entity.layerName && (
              <p className="text-[11px] text-white/70 leading-tight truncate">
                {entity.layerName}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 text-white/60 hover:text-white hover:bg-white/20 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category badge */}
      {entity.category && entity.category !== "default" && (
        <div className="px-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: entity.color || "#3b82f6" }}
            />
            <span className="text-xs font-semibold text-sky-700 capitalize">
              {entity.category}
            </span>
          </div>
        </div>
      )}

      {/* Properties table */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Attributs ({entries.length})
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200">
              <FileText className="w-6 h-6 text-slate-200" />
            </div>
            <p className="text-sm text-slate-400">Aucun attribut</p>
          </div>
        ) : (
          <div className="space-y-0 rounded-xl border border-slate-200 overflow-hidden">
            {entries.map(([key, value], index) => {
              const isLabelField = entity.labelField === key;
              return (
                <div
                  key={key}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                    index < entries.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  } ${isLabelField ? "bg-sky-50/50" : ""}`}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex-shrink-0 pt-0.5 min-w-[80px] max-w-[120px] break-all leading-tight">
                    {key}
                  </span>
                  <span
                    className={`text-[13px] flex-1 break-words leading-relaxed ${
                      isLabelField
                        ? "font-semibold text-sky-700"
                        : "text-slate-700"
                    }`}
                  >
                    {String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500"
        >
          <XCircle className="w-4 h-4" />
          Fermer le panneau
        </button>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [layers, setLayers] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [basemap, setBasemap] = useState<string>("usgsTopo");
  const [basemapOpen, setBasemapOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(
    null,
  );
  const mapRef = useRef<any>(null);

  const DEFAULT_CENTER: [number, number] = [16.5, -14.5];
  const DEFAULT_ZOOM = 6;

  useEffect(() => {
    async function load() {
      try {
        const [layerRes, pointRes] = await Promise.all([
          fetch('/api/map/layers'),
          fetch('/api/map/points'),
        ]);
        if (!layerRes.ok) throw new Error(`Layers: ${layerRes.status}`);
        const layerData = await layerRes.json();
        const pointData = pointRes.ok ? await pointRes.json() : { points: [] };
        const fetchedLayers = layerData.layers || [];
        const fetchedPoints = pointData.points || [];
        setLayers(fetchedLayers);
        setPoints(fetchedPoints);
        setVisible(
          new Set<string>(
            fetchedLayers
              .filter((l: any) => l.isVisible || l.isDefault)
              .map((l: any) => l.id),
          ),
        );
        setExpandedLayers(
          new Set<string>(
            fetchedLayers
              .filter((l: any) => l.isVisible || l.isDefault)
              .map((l: any) => l.id),
          ),
        );
      } catch (e: any) {
        setError(e.message || "Failed to load map data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectEntity = useCallback((entity: SelectedEntity) => {
    setSelectedEntity(entity);
  }, []);

  const handleCloseEntity = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  const filtered = layers.filter(
    (l) =>
      !search ||
      (l.name + (l.nameFr || "")).toLowerCase().includes(search.toLowerCase()),
  );

  const cfg = BASEMAPS[basemap];

  const parseGeoData = (layer: any) => {
    if (!layer.geoData) return null;
    try {
      return typeof layer.geoData === "string"
        ? JSON.parse(layer.geoData)
        : layer.geoData;
    } catch {
      return null;
    }
  };

  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut(), []);
  const handleHome = useCallback(
    () => mapRef.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM),
    [],
  );

  const PALETTE = [
    "#3b82f6",
    "#ef4444",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#64748b",
    "#ec4899",
    "#14b8a6",
    "#84cc16",
    "#f43f5e",
    "#78716c",
    "#a855f7",
    "#eab308",
  ];

  return (
    <div
      className={`flex flex-col ${fullscreen ? "fixed inset-0 z-50" : "h-screen overflow-hidden"}`}
    >
      <style>{TOOLTIP_CSS}</style>
      {!fullscreen && <Navbar />}
      <div
        className="flex-1 flex overflow-hidden"
        style={{
          height: fullscreen ? "100vh" : "calc(100vh - 64px)",
          marginTop: fullscreen ? 0 : 64,
        }}
      >
        {/* ── LEFT SIDE PANEL — Couches ── */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            panelOpen ? "w-80" : "w-0"
          }`}
          style={{
            background: "white",
            borderRight: "1px solid #e2e8f0",
            boxShadow: panelOpen ? "4px 0 24px rgba(0,0,0,0.06)" : "none",
          }}
        >
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ width: 320 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-sky-500 to-cyan-500 shadow-sm shadow-sky-500/20">
                  <LayersIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 leading-none mb-0.5">
                    Couches cartographiques
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-none">
                    SMAS — {layers.length} couche
                    {layers.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 text-slate-300 hover:text-slate-500 hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 border-b border-slate-100 flex-shrink-0">
              {[
                {
                  label: "Visibles",
                  value: visible.size,
                  color: "#3b82f6",
                },
                { label: "Total", value: layers.length, color: "#334155" },
                {
                  label: "Points",
                  value: points.filter((p) => p.isActive).length,
                  color: "#22c55e",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center py-3 gap-0.5"
                  style={{
                    borderRight: i < 2 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-300" />
                <input
                  type="text"
                  placeholder="Rechercher une couche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-sm rounded-lg outline-none transition-all duration-150 bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  style={{ padding: "8px 12px 8px 36px" }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2.5">
                <button
                  onClick={() => setVisible(new Set(layers.map((l) => l.id)))}
                  className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md transition-all duration-150 text-sky-600 hover:bg-sky-50"
                >
                  <Eye className="w-3 h-3" />
                  Tout afficher
                </button>
                <div className="w-px h-3 bg-slate-200" />
                <button
                  onClick={() => setVisible(new Set())}
                  className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md transition-all duration-150 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  <EyeOff className="w-3 h-3" />
                  Masquer tout
                </button>
              </div>
            </div>

            {/* Layer list — scrollable */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-1.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
              }}
            >
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200">
                    <LayersIcon className="w-6 h-6 text-slate-200" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-400">
                      {search ? "Aucun resultat" : "Aucune couche"}
                    </p>
                    <p className="text-xs mt-1 text-slate-300">
                      {search
                        ? "Essayez un autre terme"
                        : "Ajoutez des couches via le panneau admin"}
                    </p>
                  </div>
                </div>
              )}
              {filtered.map((layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  visible={visible.has(layer.id)}
                  onToggle={() => toggleLayer(layer.id)}
                  onExpand={() =>
                    setExpandedLayers((prev) => {
                      const next = new Set(prev);
                      if (next.has(layer.id)) next.delete(layer.id);
                      else next.add(layer.id);
                      return next;
                    })
                  }
                  expanded={expandedLayers.has(layer.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-sky-500 to-cyan-500">
                  <Database className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-500 truncate">
                    Systeme Aquifere Senegalo-Mauritanien
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Donnees transfrontalières
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAP AREA (flex-1, fills the middle) ── */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ background: "#0a1628" }}
        >
          {/* PANEL TOGGLE (when left panel closed) */}
          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute top-4 left-4 z-[1000] flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 bg-white shadow-md border border-slate-200/80 hover:shadow-lg hover:border-sky-200 text-slate-600"
            >
              <LayersIcon className="w-4 h-4 text-sky-500" />
              <span>Couches</span>
              {visible.size > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-sky-500">
                  {visible.size}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          )}

          {loading ? (
            <MapSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-red-50 border border-red-200">
                <Info className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-slate-800 font-semibold mb-1">
                Erreur de chargement
              </p>
              <p className="text-slate-400 text-sm max-w-xs">{error}</p>
            </div>
          ) : (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              maxZoom={18}
              minZoom={3}
              className="h-full w-full z-0"
              zoomControl={false}
            >
              <MapInner mapRef={mapRef} />
              <ScaleControl position="bottomleft" imperial={false} />
              <TileLayer
                url={cfg.url}
                attribution={cfg.attribution}
                maxZoom={cfg.maxZoom || 18}
              />
              {cfg.labels && (
                <TileLayer
                  url={cfg.labels}
                  attribution=""
                  maxZoom={18}
                  zIndex={1000}
                />
              )}

              {layers.map((layer) => {
                if (!visible.has(layer.id)) return null;
                const geo = parseGeoData(layer);
                if (!geo) return null;
                const fillC = layer.fillColor || layer.color || "#3b82f6";
                const borderC = layer.borderColor || layer.color || "#3b82f6";
                let categoryColors: Record<string, string> = {};
                if (
                  layer.categorize &&
                  layer.categorizeField &&
                  geo?.features
                ) {
                  const uniqueVals: string[] = [];
                  geo.features.forEach((f: any) => {
                    const v = String(
                      f?.properties?.[layer.categorizeField] ?? "N/A",
                    );
                    if (!uniqueVals.includes(v)) uniqueVals.push(v);
                  });
                  uniqueVals.forEach((v, i) => {
                    categoryColors[v] = PALETTE[i % PALETTE.length];
                  });
                }
                const onEachFeature = (feature: any, leafletLayer: any) => {
                  const props = feature?.properties || {};

                  /* ── Click → right sidebar instead of popup ── */
                  leafletLayer.on("click", () => {
                    handleSelectEntity({
                      properties: props,
                      layerName: layer.nameFr || layer.name,
                      labelField: layer.labelField,
                      category: layer.category,
                      color: layer.fillColor || layer.color,
                    });
                  });

                  /* ── Labels (tooltips) with inline styling ── */
                  if (
                    layer.showLabels &&
                    layer.labelField &&
                    props[layer.labelField] != null
                  ) {
                    const ptCat = detectPointCategory(layer, feature);
                    const isBarrage = ptCat === "barrage";
                    const isVille = ptCat === "ville";
                    const isCustomMarker =
                      isBarrage ||
                      isVille ||
                      ptCat === "forage" ||
                      ptCat === "station";
                    const labelText = isBarrage
                      ? `Barrage de ${props[layer.labelField]}`
                      : String(props[layer.labelField]);

                    const textColor = isBarrage ? "#0369a1" : "#1e293b";
                    const fontWeight = isBarrage ? 700 : 600;
                    /* Offsets account for the full marker height since tooltipAnchor is [0,0]
                       Barrage/Ville markers: 40px tall, iconAnchor at y=38 → top at 38px above anchor
                       Forage/Station markers: 36px tall, iconAnchor at y=34 → top at 34px above anchor
                       CircleMarker: no icon → just a small offset above center */
                    const labelOffset =
                      isBarrage || isVille
                        ? [0, -40]
                        : isCustomMarker
                          ? [0, -36]
                          : [0, -6];
                    const haloShadow = [
                      "-1px -1px 0 #fff",
                      "1px -1px 0 #fff",
                      "-1px 1px 0 #fff",
                      "1px 1px 0 #fff",
                      "0 -1px 0 #fff",
                      "0 1px 0 #fff",
                      "-1px 0 0 #fff",
                      "1px 0 0 #fff",
                      "2px 2px 3px rgba(255,255,255,0.8)",
                      "-1px -1px 3px rgba(255,255,255,0.6)",
                      "1px -1px 3px rgba(255,255,255,0.6)",
                      "-1px 1px 3px rgba(255,255,255,0.6)",
                      "1px 1px 3px rgba(255,255,255,0.6)",
                    ].join(", ");

                    const tooltipHtml = `<span style="
                      color:${textColor};
                      font-size:11px;
                      font-weight:${fontWeight};
                      letter-spacing:0.02em;
                      text-shadow:${haloShadow};
                      white-space:nowrap;
                    ">${labelText}</span>`;

                    leafletLayer.bindTooltip(tooltipHtml, {
                      permanent: true,
                      direction: "top",
                      className: "custom-map-label",
                      offset: labelOffset,
                    });
                  }
                };
                const styleFn = (feature: any) => {
                  if (layer.categorize && layer.categorizeField) {
                    const val = String(
                      feature?.properties?.[layer.categorizeField] ?? "N/A",
                    );
                    const catColor = categoryColors[val] || fillC;
                    return {
                      color: catColor,
                      fillColor: catColor,
                      weight: layer.weight ?? 2,
                      opacity:
                        (layer.borderOpacity ?? 0.8) * (layer.opacity ?? 0.9),
                      fillOpacity: layer.fillOpacity ?? 0.4,
                    };
                  }
                  return {
                    color: borderC,
                    fillColor: fillC,
                    weight: layer.weight ?? 2,
                    opacity:
                      (layer.borderOpacity ?? 0.8) * (layer.opacity ?? 0.9),
                    fillOpacity: layer.fillOpacity ?? 0.35,
                  };
                };
                const pointToLayer = (feature: any, latlng: any) => {
                  const L = (window as any).L;
                  const catColor =
                    layer.categorize && layer.categorizeField
                      ? categoryColors[
                          String(
                            feature?.properties?.[layer.categorizeField] ??
                              "N/A",
                          )
                        ] || fillC
                      : fillC;
                  const ptCat = detectPointCategory(layer, feature);

                  if (ptCat !== "default") {
                    const svg = getMarkerSvg(ptCat, catColor);
                    const isTall = ptCat === "barrage" || ptCat === "ville";
                    const icon = L.divIcon({
                      html: svg,
                      className: "custom-map-marker",
                      iconSize: isTall ? [32, 40] : [28, 36],
                      iconAnchor: isTall ? [16, 38] : [14, 34],
                      tooltipAnchor: [0, 0],
                    });
                    return L.marker(latlng, { icon });
                  }

                  return L.circleMarker(latlng, {
                    radius: 7,
                    color: borderC,
                    fillColor: catColor,
                    weight: layer.weight ?? 2,
                    opacity: layer.borderOpacity ?? 0.9,
                    fillOpacity: layer.fillOpacity ?? 0.8,
                  });
                };
                return (
                  <GeoJSON
                    key={`${layer.id}-${layer.updatedAt}`}
                    data={geo}
                    style={styleFn}
                    onEachFeature={onEachFeature}
                    pointToLayer={pointToLayer}
                  />
                );
              })}

              <PointMarkersLayer
                points={points.filter((p) => p.isActive)}
                onSelectEntity={handleSelectEntity}
              />
            </MapContainer>
          )}

          {/* FLOATING MAP CONTROLS (inside map area) */}
          {!loading && !error && (
            <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2 items-end">
              {/* Basemap picker */}
              <div className="relative">
                {basemapOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[999]"
                      onClick={() => setBasemapOpen(false)}
                    />
                    <div className="absolute bottom-full mb-2 right-0 z-[1001] w-56 rounded-xl overflow-hidden bg-white shadow-xl border border-slate-200/80">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Fond de carte
                        </p>
                      </div>
                      <div className="p-1.5">
                        {Object.entries(BASEMAPS).map(([id, bm]) => (
                          <button
                            key={id}
                            onClick={() => {
                              setBasemap(id);
                              setBasemapOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                            style={{
                              color: basemap === id ? "#3b82f6" : "#475569",
                              background:
                                basemap === id ? "#eff6ff" : "transparent",
                            }}
                          >
                            <span
                              style={{
                                color: basemap === id ? "#3b82f6" : "#94a3b8",
                              }}
                            >
                              <BasemapIcon name={bm.iconName} />
                            </span>
                            <span className="font-medium">
                              {bm.labelFr || bm.label}
                            </span>
                            {basemap === id && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <CtrlBtn
                  onClick={() => setBasemapOpen((o) => !o)}
                  title="Fond de carte"
                  active={basemapOpen}
                >
                  <MapIcon className="w-4 h-4" />
                </CtrlBtn>
              </div>

              {/* Zoom cluster */}
              <div className="flex flex-col rounded-xl overflow-hidden bg-white/95 shadow-md border border-slate-200/60">
                {[
                  {
                    handler: handleZoomIn,
                    icon: <ZoomIn className="w-4 h-4" />,
                    title: "Zoom +",
                  },
                  {
                    handler: handleZoomOut,
                    icon: <ZoomOut className="w-4 h-4" />,
                    title: "Zoom -",
                  },
                  {
                    handler: handleHome,
                    icon: <Home className="w-4 h-4" />,
                    title: "Reinitialiser",
                  },
                ].map((btn, i) => (
                  <div key={i}>
                    {i > 0 && <div className="h-px mx-2 bg-slate-100" />}
                    <button
                      onClick={btn.handler}
                      title={btn.title}
                      className="w-10 h-10 flex items-center justify-center transition-all duration-150 hover:bg-sky-50 text-slate-400 hover:text-sky-600"
                    >
                      {btn.icon}
                    </button>
                  </div>
                ))}
              </div>

              <CtrlBtn
                onClick={() => setFullscreen((f) => !f)}
                title={fullscreen ? "Quitter" : "Plein ecran"}
              >
                {fullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </CtrlBtn>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDE PANEL — Entity details ── */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            selectedEntity ? "w-[340px]" : "w-0"
          }`}
          style={{
            background: "white",
            borderLeft: "1px solid #e2e8f0",
            boxShadow: selectedEntity ? "-4px 0 24px rgba(0,0,0,0.06)" : "none",
          }}
        >
          {selectedEntity && (
            <EntityDetailSidebar
              entity={selectedEntity}
              onClose={handleCloseEntity}
            />
          )}
        </div>
      </div>
    </div>
  );
}
