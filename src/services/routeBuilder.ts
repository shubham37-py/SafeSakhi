import type { PresetRoute, Waypoint, DangerZone } from '../types';
import { PUNE_PRESET_ROUTES } from '../data/presetRoutes';
import { calculateDistanceMeters } from './riskEngine';

export interface StopInfo extends Waypoint {
  id: string;
  corridorId: string;
  corridorName: string;
}

// Catalog of all unique stops across Pune transit network
export const ALL_PUNE_STOPS: StopInfo[] = [
  // Corridor 1: Satara Road / Bibwewadi
  {
    id: 'swargate',
    name: 'Swargate Bus Terminal & Metro',
    landmark: 'Jedhe Chowk Police Chowki',
    lat: 18.5018,
    lng: 73.8586,
    estimatedTimeMin: 0,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },
  {
    id: 'laxmi-narayan',
    name: 'Laxmi Narayan Chowk',
    landmark: 'Mukund Nagar Commercial Hub',
    lat: 18.4942,
    lng: 73.8598,
    estimatedTimeMin: 5,
    crowdLevel: 'high',
    lightingQuality: 'good',
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },
  {
    id: 'panchami',
    name: 'Panchami / Walvekar Nagar',
    landmark: 'Panchami Hotel Junction',
    lat: 18.4870,
    lng: 73.8610,
    estimatedTimeMin: 9,
    crowdLevel: 'medium',
    lightingQuality: 'good',
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },
  {
    id: 'city-pride',
    name: 'City Pride Multiplex',
    landmark: 'Satara Road BRT Station',
    lat: 18.4805,
    lng: 73.8618,
    estimatedTimeMin: 13,
    crowdLevel: 'medium',
    lightingQuality: 'good',
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },
  {
    id: 'padmavati',
    name: 'Padmavati Chowk',
    landmark: 'Padmavati Police Outpost & BRT',
    lat: 18.4735,
    lng: 73.8625,
    estimatedTimeMin: 16,
    crowdLevel: 'medium',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },
  {
    id: 'bibwewadi',
    name: 'Bibwewadi Corner',
    landmark: 'Chintamani Ganpati Chowk',
    lat: 18.4670,
    lng: 73.8655,
    estimatedTimeMin: 19,
    crowdLevel: 'medium',
    lightingQuality: 'moderate',
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },
  {
    id: 'vit-pune',
    name: 'VIT Pune Main Campus',
    landmark: 'Vishwakarma Institute Gate 2, Bibwewadi',
    lat: 18.4636,
    lng: 73.8682,
    estimatedTimeMin: 22,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-swargate-vit',
    corridorName: 'Satara Road / Bibwewadi',
  },

  // Corridor 2: Hinjawadi IT Corridor
  {
    id: 'hinjawadi-phase1',
    name: 'Hinjawadi Phase 1 IT Park',
    landmark: 'Infosys Circle',
    lat: 18.5913,
    lng: 73.7389,
    estimatedTimeMin: 0,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-hinjawadi-baner',
    corridorName: 'Hinjawadi IT Corridor',
  },
  {
    id: 'wakad-junction',
    name: 'Wakad Highway Junction',
    landmark: 'Ginger Hotel Chowk',
    lat: 18.5780,
    lng: 73.7620,
    estimatedTimeMin: 10,
    crowdLevel: 'medium',
    lightingQuality: 'good',
    corridorId: 'pune-hinjawadi-baner',
    corridorName: 'Hinjawadi IT Corridor',
  },
  {
    id: 'balewadi-highstreet',
    name: 'Balewadi High Street',
    landmark: 'Cummins India Office',
    lat: 18.5550,
    lng: 73.7925,
    estimatedTimeMin: 18,
    crowdLevel: 'high',
    lightingQuality: 'good',
    corridorId: 'pune-hinjawadi-baner',
    corridorName: 'Hinjawadi IT Corridor',
  },
  {
    id: 'baner-destination',
    name: 'Baner Destination',
    landmark: 'Baner D-Mart',
    lat: 18.5490,
    lng: 73.7990,
    estimatedTimeMin: 25,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-hinjawadi-baner',
    corridorName: 'Hinjawadi IT Corridor',
  },

  // Corridor 3: Station & Shivajinagar
  {
    id: 'pune-station',
    name: 'Pune Railway Station',
    landmark: 'GRP Police Assistance Booth',
    lat: 18.5289,
    lng: 73.8744,
    estimatedTimeMin: 0,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-station-fc-deccan',
    corridorName: 'Station & Shivajinagar',
  },
  {
    id: 'shivajinagar-metro',
    name: 'Shivajinagar Metro Station',
    landmark: 'COEP Technological University',
    lat: 18.5315,
    lng: 73.8440,
    estimatedTimeMin: 8,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-station-fc-deccan',
    corridorName: 'Station & Shivajinagar',
  },
  {
    id: 'goodluck-chowk',
    name: 'Goodluck Chowk',
    landmark: 'Cafe Goodluck FC Road',
    lat: 18.5190,
    lng: 73.8395,
    estimatedTimeMin: 15,
    crowdLevel: 'high',
    lightingQuality: 'good',
    corridorId: 'pune-station-fc-deccan',
    corridorName: 'Station & Shivajinagar',
  },
  {
    id: 'fergusson-college',
    name: 'Fergusson College Main Gate',
    landmark: 'FC Campus Security',
    lat: 18.5175,
    lng: 73.8380,
    estimatedTimeMin: 18,
    crowdLevel: 'high',
    lightingQuality: 'good',
    isSafeHaven: true,
    corridorId: 'pune-station-fc-deccan',
    corridorName: 'Station & Shivajinagar',
  },
];

// Helper to group stops by corridor
export const GROUPED_STOPS = ALL_PUNE_STOPS.reduce<Record<string, { corridorName: string; stops: StopInfo[] }>>((acc, stop) => {
  if (!acc[stop.corridorId]) {
    acc[stop.corridorId] = {
      corridorName: stop.corridorName,
      stops: [],
    };
  }
  acc[stop.corridorId].stops.push(stop);
  return acc;
}, {});

// Find closest path index to a coordinate
function findClosestPathIndex(coord: [number, number], path: [number, number][]): number {
  let closestIdx = 0;
  let minDistance = Infinity;
  for (let i = 0; i < path.length; i++) {
    const dist = calculateDistanceMeters(coord, path[i]);
    if (dist < minDistance) {
      minDistance = dist;
      closestIdx = i;
    }
  }
  return closestIdx;
}

// Generate smooth intermediate GPS path between two points
function generateInterpolatedPath(start: [number, number], end: [number, number], segments = 8): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    const lat = start[0] + (end[0] - start[0]) * frac;
    const lng = start[1] + (end[1] - start[1]) * frac;
    points.push([Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
  }
  return points;
}

// Build dynamic route between any start and end stop
export function buildRouteBetweenStops(startStopName: string, endStopName: string): PresetRoute {
  const startStop = ALL_PUNE_STOPS.find(s => s.name === startStopName) || ALL_PUNE_STOPS[0];
  let endStop = ALL_PUNE_STOPS.find(s => s.name === endStopName) || ALL_PUNE_STOPS[6];

  // If start and end are identical, pick a sensible next stop
  if (startStop.name === endStop.name) {
    const otherStops = ALL_PUNE_STOPS.filter(s => s.name !== startStop.name);
    endStop = otherStops[0];
  }

  // Check if both stops share the same corridor
  if (startStop.corridorId === endStop.corridorId) {
    const parentCorridor = PUNE_PRESET_ROUTES.find(r => r.id === startStop.corridorId) || PUNE_PRESET_ROUTES[0];
    const startIndex = parentCorridor.waypoints.findIndex(w => w.name === startStop.name);
    const endIndex = parentCorridor.waypoints.findIndex(w => w.name === endStop.name);

    const isForward = startIndex <= endIndex;
    const rawWaypoints = isForward
      ? parentCorridor.waypoints.slice(startIndex, endIndex + 1)
      : parentCorridor.waypoints.slice(endIndex, startIndex + 1).reverse();

    // Recalculate relative estimated times from 0 min
    let accumulatedTime = 0;
    const waypoints: Waypoint[] = rawWaypoints.map((wp, idx) => {
      if (idx === 0) {
        accumulatedTime = 0;
      } else {
        const prevWp = rawWaypoints[idx - 1];
        const distMeters = calculateDistanceMeters([prevWp.lat, prevWp.lng], [wp.lat, wp.lng]);
        const segmentMin = Math.max(2, Math.round((distMeters / 1000) * 3.5));
        accumulatedTime += segmentMin;
      }
      return {
        ...wp,
        estimatedTimeMin: accumulatedTime,
      };
    });

    // Sub-slice normal path
    const startPathIdx = findClosestPathIndex([startStop.lat, startStop.lng], parentCorridor.normalPath);
    const endPathIdx = findClosestPathIndex([endStop.lat, endStop.lng], parentCorridor.normalPath);

    let normalPath: [number, number][];
    if (startPathIdx <= endPathIdx) {
      normalPath = parentCorridor.normalPath.slice(startPathIdx, endPathIdx + 1);
    } else {
      normalPath = parentCorridor.normalPath.slice(endPathIdx, startPathIdx + 1).reverse();
    }

    if (normalPath.length < 2) {
      normalPath = generateInterpolatedPath([startStop.lat, startStop.lng], [endStop.lat, endStop.lng], 6);
    }

    // Calculate actual distance
    let totalDistMeters = 0;
    for (let i = 0; i < normalPath.length - 1; i++) {
      totalDistMeters += calculateDistanceMeters(normalPath[i], normalPath[i + 1]);
    }
    const distanceKm = Number(Math.max(0.8, totalDistMeters / 1000).toFixed(1));
    const estimatedDurationMin = Math.max(4, accumulatedTime || Math.round(distanceKm * 3.8));

    // Generate deviation path for testing
    const midIdx = Math.floor(normalPath.length / 2);
    const midPoint = normalPath[midIdx] || normalPath[0];
    const deviationPath: [number, number][] = [
      ...normalPath.slice(0, midIdx),
      [Number((midPoint[0] - 0.003).toFixed(5)), Number((midPoint[1] + 0.005).toFixed(5))],
      [Number((midPoint[0] - 0.006).toFixed(5)), Number((midPoint[1] + 0.010).toFixed(5))],
      [Number((midPoint[0] - 0.009).toFixed(5)), Number((midPoint[1] + 0.014).toFixed(5))],
    ];

    // Filter danger zones near this segment
    const dangerZones: DangerZone[] = parentCorridor.dangerZones.filter(zone => {
      const dist = calculateDistanceMeters([startStop.lat, startStop.lng], zone.center);
      return dist < 4500;
    });

    return {
      id: `custom-${startStop.id}-to-${endStop.id}`,
      title: `${startStop.name} ➔ ${endStop.name}`,
      subtitle: `${startStop.corridorName} Segment (${distanceKm} km)`,
      origin: startStop.name,
      destination: endStop.name,
      transitMode: parentCorridor.transitMode,
      distanceKm,
      estimatedDurationMin,
      normalPath,
      deviationPath,
      waypoints,
      dangerZones: dangerZones.length > 0 ? dangerZones : parentCorridor.dangerZones,
    };
  }

  // Cross-corridor Route
  const startCoord: [number, number] = [startStop.lat, startStop.lng];
  const endCoord: [number, number] = [endStop.lat, endStop.lng];
  const straightDistMeters = calculateDistanceMeters(startCoord, endCoord);
  const distanceKm = Number((straightDistMeters / 1000 * 1.25).toFixed(1)); // road curvature factor 1.25
  const estimatedDurationMin = Math.max(8, Math.round(distanceKm * 3.5));

  // Determine intermediate transit mode
  const transitMode = distanceKm > 8 ? 'Cab Ride' : distanceKm > 4 ? 'PMPML Bus 42' : 'Shared Auto-Rickshaw';

  // Build intermediate waypoints
  const normalPath = generateInterpolatedPath(startCoord, endCoord, 10);
  const waypoints: Waypoint[] = [
    { ...startStop, estimatedTimeMin: 0 },
    {
      lat: normalPath[3][0],
      lng: normalPath[3][1],
      name: 'Mid-Corridor Transit Link',
      landmark: 'Pune South / Central Junction',
      estimatedTimeMin: Math.round(estimatedDurationMin * 0.35),
      crowdLevel: 'medium',
      lightingQuality: 'good',
    },
    {
      lat: normalPath[7][0],
      lng: normalPath[7][1],
      name: 'Destination Approach Point',
      landmark: 'Arterial Link Road',
      estimatedTimeMin: Math.round(estimatedDurationMin * 0.75),
      crowdLevel: 'high',
      lightingQuality: 'good',
    },
    { ...endStop, estimatedTimeMin: estimatedDurationMin },
  ];

  const midPoint = normalPath[5];
  const deviationPath: [number, number][] = [
    ...normalPath.slice(0, 5),
    [Number((midPoint[0] - 0.004).toFixed(5)), Number((midPoint[1] + 0.007).toFixed(5))],
    [Number((midPoint[0] - 0.008).toFixed(5)), Number((midPoint[1] + 0.013).toFixed(5))],
  ];

  const dangerZones: DangerZone[] = [
    {
      id: `cross-dz-${startStop.id}`,
      name: 'Low Illumination Cross-Corridor Byway',
      center: [Number(((startCoord[0] + endCoord[0]) / 2).toFixed(5)), Number(((startCoord[1] + endCoord[1]) / 2 + 0.004).toFixed(5))],
      radiusMeters: 400,
      riskFactorMultiplier: 1.75,
      description: 'Secondary connecting corridor with variable night lighting and limited commercial activity',
    },
  ];

  return {
    id: `custom-${startStop.id}-to-${endStop.id}`,
    title: `${startStop.name} ➔ ${endStop.name}`,
    subtitle: `Cross-City Commute · ${startStop.corridorName} to ${endStop.corridorName}`,
    origin: startStop.name,
    destination: endStop.name,
    transitMode,
    distanceKm,
    estimatedDurationMin,
    normalPath,
    deviationPath,
    waypoints,
    dangerZones,
  };
}
