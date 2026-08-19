export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
  landmark?: string;
  estimatedTimeMin: number;
  crowdLevel: 'high' | 'medium' | 'low';
  lightingQuality: 'good' | 'moderate' | 'poor';
  isSafeHaven?: boolean; // e.g. 24/7 Police booth, Hospital, Metro hub
}

export interface DangerZone {
  id: string;
  name: string;
  center: [number, number];
  radiusMeters: number;
  riskFactorMultiplier: number;
  description: string;
}

export interface PresetRoute {
  id: string;
  title: string;
  subtitle: string;
  origin: string;
  destination: string;
  transitMode: 'PMPML Bus 42' | 'Shared Auto-Rickshaw' | 'Cab Ride' | 'Walking Corridor';
  distanceKm: number;
  estimatedDurationMin: number;
  normalPath: [number, number][];
  deviationPath: [number, number][];
  waypoints: Waypoint[];
  dangerZones: DangerZone[];
}

export interface RiskFactors {
  routeDeviationScore: number;    // 0-100 (distance from corridor)
  unusualStopScore: number;        // 0-100 (abnormal stationary time)
  timeOfDayScore: number;          // 0-100 (night penalty)
  crowdDensityScore: number;       // 0-100 (isolation factor)
  batteryScore: number;            // 0-100 (critically low battery)
  unresponsivenessScore: number;   // 0-100 (missed check-in countdowns)
}

export interface RiskWeights {
  w1: number; // routeDeviation (default: 0.30)
  w2: number; // unusualStop (default: 0.20)
  w3: number; // timeOfDay (default: 0.15)
  w4: number; // crowdDensity (default: 0.10)
  w5: number; // battery (default: 0.10)
  w6: number; // unresponsiveness (default: 0.15)
}

export type RiskLevel = 'safe' | 'caution' | 'critical';

export interface AIExplanationLog {
  id: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  title: string;
  description: string;
  primaryFactor: keyof RiskFactors;
  delta: number;
  evidenceTags: string[];
}

export interface IncidentEvidence {
  id: string;
  timestamp: string;
  isoDate: string;
  coordinates: [number, number];
  nearestLandmark: string;
  speedKmph: number;
  riskScore: number;
  riskFactors: RiskFactors;
  primaryAnomaly: string;
  audioSampleCaptured: boolean;
  audioDurationSec: number;
  deviceBattery: number;
  networkCarrier: string;
  digitalSignature: string; // SHA-256 Mock hash for blockchain/forensics
  guardianNotifiedAt: string;
  emergencyStatus: 'SILENT_SOS_DISPATCHED' | 'ACKNOWLEDGED_BY_GUARDIAN' | 'POLICE_112_ESCALATED' | 'RESOLVED_SAFE';
}

export interface RiskComputationResult {
  totalRisk: number; // 0 to 100
  riskLevel: RiskLevel;
  factors: RiskFactors;
  weights: RiskWeights;
  weightedBreakdown: {
    routeDeviation: number;
    unusualStop: number;
    timeOfDay: number;
    crowdDensity: number;
    battery: number;
    unresponsiveness: number;
  };
  primaryFactor: keyof RiskFactors;
  primaryFactorLabel: string;
  explanationTitle: string;
  explanationDescription: string;
  evidenceTags: string[];
}

export interface SafetyState {

  activeRouteId: string;
  isPlaying: boolean;
  playbackSpeed: number; // 1, 2, 4
  currentWaypointIndex: number;
  progressFraction: number; // 0.0 to 1.0
  currentCoordinates: [number, number];
  currentSpeedKmph: number;
  isDeviated: boolean;
  deviationDistanceMeters: number;
  isStoppedUnusually: boolean;
  unusualStopDurationSec: number;
  simulatedHour: number; // 0 - 23
  simulatedMinute: number; // 0 - 59
  crowdDensityScoreInput: number; // 0 - 100 (0=isolated/empty, 100=packed)
  batteryLevel: number; // 0 - 100
  isCharging: boolean;
  isCheckInActive: boolean;
  checkInCountdown: number; // seconds remaining
  isSosTriggered: boolean;
  sosTriggerReason: string;
  evidencePackage: IncidentEvidence | null;
  riskHistory: { time: string; score: number; level: RiskLevel }[];
  aiExplanationFeed: AIExplanationLog[];
  guardianConnected: boolean;
  discreetModeActive: boolean;
}
