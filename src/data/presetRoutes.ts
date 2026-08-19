import type { PresetRoute } from '../types';

export const PUNE_PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'pune-swargate-vit',
    title: 'Swargate Bus Station ➔ VIT Pune (Bibwewadi)',
    subtitle: 'Primary Hackathon Demo: Evening Student Commute via Satara Road',
    origin: 'Swargate Bus Stand & Metro Hub',
    destination: 'VIT Pune (Vishwakarma Institute of Technology)',
    transitMode: 'PMPML Bus 42',
    distanceKm: 5.2,
    estimatedDurationMin: 22,
    normalPath: [
      [18.5018, 73.8586], // Swargate Jedhe Chowk
      [18.4980, 73.8592], // Shankar Maharaj Math approach
      [18.4942, 73.8598], // Laxmi Narayan Cinema
      [18.4905, 73.8604], // Mukund Nagar flyover
      [18.4870, 73.8610], // Panchami Chowk / Walvekar Nagar
      [18.4805, 73.8618], // City Pride Satara Road
      [18.4765, 73.8622], // Aranyeshwar Corner
      [18.4735, 73.8625], // Padmavati Chowk
      [18.4695, 73.8638], // Pushpa Park / KK Market turn
      [18.4670, 73.8655], // Bibwewadi Main Road
      [18.4648, 73.8668], // Upper Indira Nagar Junction
      [18.4636, 73.8682], // VIT Pune Main Gate, Bibwewadi
    ],
    deviationPath: [
      [18.5018, 73.8586], // Swargate
      [18.4942, 73.8598], // Laxmi Narayan Cinema
      [18.4870, 73.8610], // Panchami Chowk
      [18.4805, 73.8618], // City Pride Satara Rd (Deviation begins!)
      [18.4790, 73.8670], // Veering East into Salisbury Park back alley
      [18.4765, 73.8735], // Unlit Market Yard Warehouse Corridor
      [18.4730, 73.8785], // Isolated Gangadham Industrial Lane (480m off-route)
      [18.4690, 73.8820], // Deserted Construction Perimeter (820m off-route)
    ],
    waypoints: [
      {
        lat: 18.5018,
        lng: 73.8586,
        name: 'Swargate Bus Terminal & Metro',
        landmark: 'Jedhe Chowk Police Chowki',
        estimatedTimeMin: 0,
        crowdLevel: 'high',
        lightingQuality: 'good',
        isSafeHaven: true,
      },
      {
        lat: 18.4942,
        lng: 73.8598,
        name: 'Laxmi Narayan Chowk',
        landmark: 'Mukund Nagar Commercial Hub',
        estimatedTimeMin: 5,
        crowdLevel: 'high',
        lightingQuality: 'good',
      },
      {
        lat: 18.4870,
        lng: 73.8610,
        name: 'Panchami / Walvekar Nagar',
        landmark: 'Panchami Hotel Junction',
        estimatedTimeMin: 9,
        crowdLevel: 'medium',
        lightingQuality: 'good',
      },
      {
        lat: 18.4805,
        lng: 73.8618,
        name: 'City Pride Multiplex',
        landmark: 'Satara Road BRT Station',
        estimatedTimeMin: 13,
        crowdLevel: 'medium',
        lightingQuality: 'good',
      },
      {
        lat: 18.4735,
        lng: 73.8625,
        name: 'Padmavati Chowk',
        landmark: 'Padmavati Police Outpost & BRT',
        estimatedTimeMin: 16,
        crowdLevel: 'medium',
        lightingQuality: 'good',
        isSafeHaven: true,
      },
      {
        lat: 18.4670,
        lng: 73.8655,
        name: 'Bibwewadi Corner',
        landmark: 'Chintamani Ganpati Chowk',
        estimatedTimeMin: 19,
        crowdLevel: 'medium',
        lightingQuality: 'moderate',
      },
      {
        lat: 18.4636,
        lng: 73.8682,
        name: 'VIT Pune Main Campus',
        landmark: 'Vishwakarma Institute Gate 2, Bibwewadi',
        estimatedTimeMin: 22,
        crowdLevel: 'high',
        lightingQuality: 'good',
        isSafeHaven: true,
      },
    ],
    dangerZones: [
      {
        id: 'pune-dz-1',
        name: 'Market Yard Hinterland Zone',
        center: [18.4745, 73.8760],
        radiusMeters: 450,
        riskFactorMultiplier: 1.85,
        description: 'Poorly lit warehouse corridor with low footfall after 9:30 PM and historical blind spots',
      },
      {
        id: 'pune-dz-2',
        name: 'Salisbury Backroad Rail Underpass',
        center: [18.4830, 73.8690],
        radiusMeters: 300,
        riskFactorMultiplier: 1.6,
        description: 'Narrow unlit underpass with zero CCTV coverage and high deviation risk',
      }
    ],
  },
  {
    id: 'pune-hinjawadi-baner',
    title: 'Hinjawadi IT Hub ➔ Baner High Street',
    subtitle: 'Late-Night Corporate Shuttle Route',
    origin: 'Phase 1 Tech Park, Hinjawadi',
    destination: 'Baner High Street',
    transitMode: 'Cab Ride',
    distanceKm: 9.4,
    estimatedDurationMin: 25,
    normalPath: [
      [18.5913, 73.7389], // Hinjawadi Phase 1
      [18.5835, 73.7485], // Shivaji Chowk Hinjawadi
      [18.5780, 73.7620], // Wakad Bridge
      [18.5670, 73.7745], // Mumbai-Bangalore Highway Service Rd
      [18.5585, 73.7870], // Balewadi Stadium Flyover
      [18.5550, 73.7925], // Balewadi High Street
      [18.5490, 73.7990], // Baner Main Road
    ],
    deviationPath: [
      [18.5913, 73.7389],
      [18.5835, 73.7485],
      [18.5780, 73.7620],
      [18.5820, 73.7780], // Deviates onto isolated Mula riverbed road
      [18.5880, 73.7890], // Deserted quarry area
    ],
    waypoints: [
      { lat: 18.5913, lng: 73.7389, name: 'Hinjawadi Phase 1 IT Park', landmark: 'Infosys Circle', estimatedTimeMin: 0, crowdLevel: 'high', lightingQuality: 'good', isSafeHaven: true },
      { lat: 18.5780, lng: 73.7620, name: 'Wakad Highway Junction', landmark: 'Ginger Hotel Chowk', estimatedTimeMin: 10, crowdLevel: 'medium', lightingQuality: 'good' },
      { lat: 18.5550, lng: 73.7925, name: 'Balewadi High Street', landmark: 'Cummins India Office', estimatedTimeMin: 18, crowdLevel: 'high', lightingQuality: 'good' },
      { lat: 18.5490, lng: 73.7990, name: 'Baner Destination', landmark: 'Baner D-Mart', estimatedTimeMin: 25, crowdLevel: 'high', lightingQuality: 'good', isSafeHaven: true },
    ],
    dangerZones: [
      {
        id: 'pune-dz-hinjawadi-river',
        name: 'Mula Riverbed Dirt Tracks',
        center: [18.5840, 73.7820],
        radiusMeters: 500,
        riskFactorMultiplier: 1.9,
        description: 'Isolated riverbed terrain without mobile network connectivity',
      }
    ],
  },
  {
    id: 'pune-station-fc-deccan',
    title: 'Pune Railway Station ➔ Fergusson College (FC Rd)',
    subtitle: 'Student Evening Commute via Shivajinagar',
    origin: 'Pune Railway Station (Platform 1)',
    destination: 'Fergusson College Main Gate (FC Road)',
    transitMode: 'Shared Auto-Rickshaw',
    distanceKm: 4.8,
    estimatedDurationMin: 18,
    normalPath: [
      [18.5289, 73.8744], // Pune Railway Station
      [18.5270, 73.8640], // Sassoon Hospital / Collector Office
      [18.5300, 73.8525], // Sancheti Hospital Chowk
      [18.5315, 73.8440], // Shivajinagar Metro Station
      [18.5255, 73.8415], // Modern College Road
      [18.5190, 73.8395], // FC Road / Goodluck Chowk
      [18.5175, 73.8380], // Fergusson College Gate
    ],
    deviationPath: [
      [18.5289, 73.8744],
      [18.5270, 73.8640],
      [18.5300, 73.8525],
      [18.5360, 73.8580], // Veers into deserted railway yard siding
      [18.5420, 73.8620], // Sangamwadi riverbank isolated patch
    ],
    waypoints: [
      { lat: 18.5289, lng: 73.8744, name: 'Pune Railway Station', landmark: 'GRP Police Assistance Booth', estimatedTimeMin: 0, crowdLevel: 'high', lightingQuality: 'good', isSafeHaven: true },
      { lat: 18.5315, lng: 73.8440, name: 'Shivajinagar Metro Station', landmark: 'COEP Technological University', estimatedTimeMin: 8, crowdLevel: 'high', lightingQuality: 'good', isSafeHaven: true },
      { lat: 18.5190, lng: 73.8395, name: 'Goodluck Chowk', landmark: 'Cafe Goodluck FC Road', estimatedTimeMin: 15, crowdLevel: 'high', lightingQuality: 'good' },
      { lat: 18.5175, lng: 73.8380, name: 'Fergusson College Main Gate', landmark: 'FC Campus Security', estimatedTimeMin: 18, crowdLevel: 'high', lightingQuality: 'good', isSafeHaven: true },
    ],
    dangerZones: [
      {
        id: 'pune-dz-railway-siding',
        name: 'Sangamwadi Old Railway Siding',
        center: [18.5390, 73.8600],
        radiusMeters: 400,
        riskFactorMultiplier: 1.8,
        description: 'Uninhabited rail marshaling yard with zero lighting',
      }
    ],
  },
];
