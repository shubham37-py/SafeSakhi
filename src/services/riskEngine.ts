import type { RiskFactors, RiskWeights, RiskLevel, PresetRoute } from '../types';

export const DEFAULT_RISK_WEIGHTS: RiskWeights = {
  w1: 0.30, // routeDeviation
  w2: 0.20, // unusualStop
  w3: 0.15, // timeOfDay
  w4: 0.10, // crowdDensity
  w5: 0.10, // battery
  w6: 0.15, // unresponsiveness
};

// Calculate Haversine distance in meters between two lat/lng pairs
export function calculateDistanceMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const R = 6371e3; // Earth radius in meters
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;
  const deltaLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const deltaLng = ((coord2[1] - coord1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Calculate minimum distance from a point to a polyline route in meters
export function calculateDeviationFromRoute(
  currentCoord: [number, number],
  routePath: [number, number][]
): number {
  if (!routePath || routePath.length === 0) return 0;
  let minDistance = Infinity;
  for (const point of routePath) {
    const dist = calculateDistanceMeters(currentCoord, point);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
}

// Compute Time-of-Day Risk Score (0-100)
export function computeTimeOfDayScore(hour: number, minute: number): number {
  const timeInHours = hour + minute / 60;
  // Late Night: 23:00 to 04:30 -> Highest risk (85-95)
  if (timeInHours >= 23 || timeInHours < 4.5) return 90;
  // Deep Night: 21:00 to 23:00 -> Elevated risk (60-80)
  if (timeInHours >= 21) return 70;
  // Evening: 19:00 to 21:00 -> Moderate risk (35-50)
  if (timeInHours >= 19) return 40;
  // Early morning: 04:30 to 06:30 -> Moderate risk (30-45)
  if (timeInHours >= 4.5 && timeInHours < 6.5) return 35;
  // Daytime: 06:30 to 19:00 -> Low risk (10-15)
  return 10;
}

// Compute Battery Risk Score (0-100)
export function computeBatteryScore(batteryLevel: number, isCharging: boolean): number {
  if (isCharging && batteryLevel > 20) return 5;
  if (batteryLevel <= 5) return 98;
  if (batteryLevel <= 12) return 80;
  if (batteryLevel <= 25) return 50;
  if (batteryLevel <= 40) return 25;
  return 8;
}

// Compute Crowd Density Risk Score (0-100, where 0 crowd density = highest risk score 90)
export function computeCrowdDensityScore(crowdDensityPercent: number): number {
  // If crowdDensityPercent is 10 (deserted), score is 90
  // If crowdDensityPercent is 90 (crowded), score is 10
  const isolationFactor = Math.max(5, 100 - crowdDensityPercent);
  return Math.min(95, Math.max(5, isolationFactor));
}

// Compute Deviation Risk Score (0-100) based on deviation distance in meters
export function computeDeviationScore(deviationMeters: number): number {
  if (deviationMeters < 50) return 5; // GPS jitter tolerance
  if (deviationMeters < 150) return 25; // Minor bypass
  if (deviationMeters < 350) return 55; // Noticeable off-path
  if (deviationMeters < 600) return 85; // High anomaly
  return 100; // Complete diversion
}

// Compute Unusual Stop Risk Score (0-100) based on stationary seconds off-schedule
export function computeUnusualStopScore(stopDurationSec: number, isStoppedUnusually: boolean): number {
  if (!isStoppedUnusually || stopDurationSec < 15) return 0;
  if (stopDurationSec < 45) return 30;
  if (stopDurationSec < 90) return 65;
  if (stopDurationSec < 150) return 85;
  return 100;
}

// Compute Unresponsiveness Score (0-100) based on active check-in countdown
export function computeUnresponsivenessScore(
  isCheckInActive: boolean,
  countdownRemainingSec: number
): number {
  if (!isCheckInActive) return 0;
  if (countdownRemainingSec > 7) return 35;
  if (countdownRemainingSec > 3) return 70;
  if (countdownRemainingSec > 0) return 90;
  return 100; // Expired / Unresponsive
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

export function evaluateJourneyRisk(
  params: {
    deviationDistanceMeters: number;
    isStoppedUnusually: boolean;
    stopDurationSec: number;
    simulatedHour: number;
    simulatedMinute: number;
    crowdDensityPercent: number;
    batteryLevel: number;
    isCharging: boolean;
    isCheckInActive: boolean;
    checkInCountdownSec: number;
    activeRoute?: PresetRoute;
    currentLandmark?: string;
  },
  weights: RiskWeights = DEFAULT_RISK_WEIGHTS
): RiskComputationResult {
  const routeDeviationScore = computeDeviationScore(params.deviationDistanceMeters);
  const unusualStopScore = computeUnusualStopScore(params.stopDurationSec, params.isStoppedUnusually);
  const timeOfDayScore = computeTimeOfDayScore(params.simulatedHour, params.simulatedMinute);
  const crowdDensityScore = computeCrowdDensityScore(params.crowdDensityPercent);
  const batteryScore = computeBatteryScore(params.batteryLevel, params.isCharging);
  const unresponsivenessScore = computeUnresponsivenessScore(
    params.isCheckInActive,
    params.checkInCountdownSec
  );

  const factors: RiskFactors = {
    routeDeviationScore,
    unusualStopScore,
    timeOfDayScore,
    crowdDensityScore,
    batteryScore,
    unresponsivenessScore,
  };

  const weightedBreakdown = {
    routeDeviation: Math.round(weights.w1 * factors.routeDeviationScore * 10) / 10,
    unusualStop: Math.round(weights.w2 * factors.unusualStopScore * 10) / 10,
    timeOfDay: Math.round(weights.w3 * factors.timeOfDayScore * 10) / 10,
    crowdDensity: Math.round(weights.w4 * factors.crowdDensityScore * 10) / 10,
    battery: Math.round(weights.w5 * factors.batteryScore * 10) / 10,
    unresponsiveness: Math.round(weights.w6 * factors.unresponsivenessScore * 10) / 10,
  };

  const rawTotalRisk =
    weightedBreakdown.routeDeviation +
    weightedBreakdown.unusualStop +
    weightedBreakdown.timeOfDay +
    weightedBreakdown.crowdDensity +
    weightedBreakdown.battery +
    weightedBreakdown.unresponsiveness;

  const totalRisk = Math.min(100, Math.max(0, Math.round(rawTotalRisk)));

  let riskLevel: RiskLevel = 'safe';
  if (totalRisk >= 70) {
    riskLevel = 'critical';
  } else if (totalRisk >= 35) {
    riskLevel = 'caution';
  }

  // Determine the highest contributing factor
  const factorContributions: { key: keyof RiskFactors; label: string; weightedVal: number }[] = [
    { key: 'routeDeviationScore', label: 'Route Deviation', weightedVal: weightedBreakdown.routeDeviation },
    { key: 'unresponsivenessScore', label: 'User Unresponsiveness', weightedVal: weightedBreakdown.unresponsiveness },
    { key: 'unusualStopScore', label: 'Unusual Off-Schedule Stop', weightedVal: weightedBreakdown.unusualStop },
    { key: 'timeOfDayScore', label: 'Late Night Vulnerability', weightedVal: weightedBreakdown.timeOfDay },
    { key: 'crowdDensityScore', label: 'Area Isolation / Low Footfall', weightedVal: weightedBreakdown.crowdDensity },
    { key: 'batteryScore', label: 'Critical Battery Depletion', weightedVal: weightedBreakdown.battery },
  ];

  factorContributions.sort((a, b) => b.weightedVal - a.weightedVal);
  const primaryFactor = factorContributions[0].key;
  const primaryFactorLabel = factorContributions[0].label;

  // Format time string
  const timeFormatted = `${String(params.simulatedHour).padStart(2, '0')}:${String(
    params.simulatedMinute
  ).padStart(2, '0')}`;

  // Generate plain-language Explainable AI (XAI) text
  let explanationTitle = '';
  let explanationDescription = '';
  const evidenceTags: string[] = [];

  if (riskLevel === 'safe') {
    explanationTitle = `Nominal Journey Safety (${totalRisk}/100)`;
    explanationDescription = `On-route progression along ${params.activeRoute?.title || 'transit corridor'}. Well-lit sector with steady vehicle telemetry at ${timeFormatted}.`;
    evidenceTags.push('Corridor Locked', 'GPS Signal Strong', 'Normal Speed');
  } else if (riskLevel === 'caution') {
    if (params.deviationDistanceMeters > 100) {
      explanationTitle = `Route Anomaly Detected (+${Math.round(weightedBreakdown.routeDeviation)} Risk)`;
      explanationDescription = `Vehicle has drifted ${params.deviationDistanceMeters}m away from the primary Satara Road transit path near ${params.currentLandmark || 'current sector'} at ${timeFormatted}.`;
      evidenceTags.push(`${params.deviationDistanceMeters}m Off-Path`, 'Corridor Departure');
    } else if (params.isStoppedUnusually) {
      explanationTitle = `Unscheduled Stationary Delay (+${Math.round(weightedBreakdown.unusualStop)} Risk)`;
      explanationDescription = `Marker stationary for ${params.stopDurationSec}s in non-designated transit stop zone at ${timeFormatted}.`;
      evidenceTags.push(`Stationary ${params.stopDurationSec}s`, 'Off-Schedule Halt');
    } else {
      explanationTitle = `Elevated Risk Index (${totalRisk}/100)`;
      explanationDescription = `Increased vulnerability due to ${primaryFactorLabel.toLowerCase()} during late-night transit hours (${timeFormatted}).`;
      evidenceTags.push('Night Hours', 'Low Density');
    }
  } else {
    // Critical Risk (>=70)
    if (params.isCheckInActive && params.checkInCountdownSec <= 0) {
      explanationTitle = `CRITICAL: Unresponsive Commuter Escalation (${totalRisk}/100)`;
      explanationDescription = `Safety check-in expired without response. Critical escalation triggered with ${params.deviationDistanceMeters}m route divergence at ${timeFormatted}.`;
      evidenceTags.push('Check-In Expired', 'Silent SOS Auto-Arm', 'Forensic Evidence Logged');
    } else if (params.deviationDistanceMeters > 300) {
      explanationTitle = `CRITICAL: Severe Path Diversion (${totalRisk}/100)`;
      explanationDescription = `Critical route departure detected: ${params.deviationDistanceMeters}m diversion into unverified low-density sector (${params.currentLandmark || 'corridor'}) at ${timeFormatted}.`;
      evidenceTags.push('High Diversion Anomaly', 'Isolation Penalty', 'Auto-SOS Threshold Crossed');
    } else {
      explanationTitle = `CRITICAL: Multi-Factor Threat Threshold (${totalRisk}/100)`;
      explanationDescription = `Compound safety metrics exceeded emergency boundary (Risk: ${totalRisk}/100). Dominant driver: ${primaryFactorLabel} at ${timeFormatted}.`;
      evidenceTags.push('Multi-Factor Anomaly', 'Emergency Protocol Active');
    }
  }

  return {
    totalRisk,
    riskLevel,
    factors,
    weights,
    weightedBreakdown,
    primaryFactor,
    primaryFactorLabel,
    explanationTitle,
    explanationDescription,
    evidenceTags,
  };
}

// Generate unique mock forensic SHA-256 hash for evidence
export function generateForensicSignature(coords: [number, number], timestamp: string): string {
  const input = `${coords[0]}_${coords[1]}_${timestamp}_SAFEPUNE_VIT_2026`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}7f8a91b4c3e210984d720b08a1c9`;
}
