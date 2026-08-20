import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type {
  SafetyState,
  PresetRoute,
  RiskComputationResult,
  IncidentEvidence,
  AIExplanationLog,
} from '../types';
import { PUNE_PRESET_ROUTES } from '../data/presetRoutes';
import {
  evaluateJourneyRisk,
  calculateDeviationFromRoute,
  generateForensicSignature,
} from '../services/riskEngine';
import { soundEngine } from '../utils/audioSynth';

interface SafetyContextValue {
  state: SafetyState;
  activeRoute: PresetRoute;
  riskEvaluation: RiskComputationResult;
  allRoutes: PresetRoute[];
  // Controls
  selectRoute: (routeId: string) => void;
  togglePlayPause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  triggerRouteDeviation: (enable?: boolean) => void;
  triggerUnusualStop: (enable?: boolean) => void;
  triggerCheckIn: () => void;
  respondToCheckIn: (isSafe: boolean) => void;
  triggerManualSos: (reason?: string) => void;
  resolveEmergency: () => void;
  resetJourney: () => void;
  setBatteryLevel: (level: number) => void;
  setCrowdDensity: (density: number) => void;
  setSimulatedTime: (hour: number, minute: number) => void;
  toggleDiscreetMode: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  startSiren: () => void;
  silenceSiren: () => void;
}

const SafetyContext = createContext<SafetyContextValue | undefined>(undefined);

const SYNC_CHANNEL_NAME = 'safetransit_telemetry_bus';

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allRoutes] = useState<PresetRoute[]>(PUNE_PRESET_ROUTES);
  const [activeRouteId, setActiveRouteId] = useState<string>('pune-swargate-vit');
  const activeRoute = allRoutes.find((r) => r.id === activeRouteId) || allRoutes[0];

  // Core Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressFraction, setProgressFraction] = useState<number>(0.0);
  const [isDeviated, setIsDeviated] = useState<boolean>(false);
  const [isStoppedUnusually, setIsStoppedUnusually] = useState<boolean>(false);
  const [unusualStopDurationSec, setUnusualStopDurationSec] = useState<number>(0);
  const [simulatedHour, setSimulatedHour] = useState<number>(22); // 10 PM
  const [simulatedMinute, setSimulatedMinute] = useState<number>(42);
  const [crowdDensityScoreInput, setCrowdDensityScoreInput] = useState<number>(30); // Low-to-moderate crowd at night
  const [batteryLevel, setBatteryLevelState] = useState<number>(68);
  const [isCharging] = useState<boolean>(false);
  const [isCheckInActive, setIsCheckInActive] = useState<boolean>(false);
  const [checkInCountdown, setCheckInCountdown] = useState<number>(12);
  const [isSosTriggered, setIsSosTriggered] = useState<boolean>(false);
  const [sosTriggerReason, setSosTriggerReason] = useState<string>('');
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [evidencePackage, setEvidencePackage] = useState<IncidentEvidence | null>(null);
  const [riskHistory, setRiskHistory] = useState<{ time: string; score: number; level: 'safe' | 'caution' | 'critical' }[]>([
    { time: '22:38', score: 14, level: 'safe' },
    { time: '22:40', score: 16, level: 'safe' },
    { time: '22:42', score: 15, level: 'safe' },
  ]);
  const [aiExplanationFeed, setAiExplanationFeed] = useState<AIExplanationLog[]>([
    {
      id: 'init-1',
      timestamp: '22:42:00',
      riskScore: 15,
      riskLevel: 'safe',
      title: 'Journey Commenced Safely',
      description: 'Traveler boarded PMPML Bus 42 at Swargate Terminal. Telemetry synchronized with Guardian console.',
      primaryFactor: 'routeDeviationScore',
      delta: 0,
      evidenceTags: ['Swargate BRT', 'GPS Locked', 'Battery 68%'],
    },
  ]);
  const [discreetModeActive, setDiscreetModeActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Broadcast channel for multi-tab sync
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Siren Controller
  const startSiren = useCallback(() => {
    setIsSirenActive(true);
    if (soundEnabled) {
      soundEngine.startContinuousSiren();
    }
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'SIREN_STARTED' });
    }
  }, [soundEnabled]);

  const silenceSiren = useCallback(() => {
    setIsSirenActive(false);
    soundEngine.stopSiren();
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'SIREN_STOPPED' });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SOS_DISPATCHED') {
          setIsSosTriggered(true);
          setSosTriggerReason(payload.reason);
          setEvidencePackage(payload.evidence);
          setIsSirenActive(true);
          if (soundEnabled) soundEngine.startContinuousSiren();
        } else if (type === 'EMERGENCY_RESOLVED') {
          setIsSosTriggered(false);
          setEvidencePackage(null);
          setIsSirenActive(false);
          soundEngine.stopSiren();
        } else if (type === 'SIREN_STARTED') {
          setIsSirenActive(true);
          if (soundEnabled) soundEngine.startContinuousSiren();
        } else if (type === 'SIREN_STOPPED') {
          setIsSirenActive(false);
          soundEngine.stopSiren();
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [soundEnabled]);

  // Attempt real device battery status if available in browser
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean }> })
        .getBattery()
        .then((batt) => {
          if (batt && typeof batt.level === 'number') {
            setBatteryLevelState(Math.round(batt.level * 100));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Compute interpolated GPS coordinates based on current progress fraction and deviation state
  const getCurrentCoordinates = useCallback((): [number, number] => {
    const path = isDeviated ? activeRoute.deviationPath : activeRoute.normalPath;
    if (!path || path.length === 0) return [18.5018, 73.8586];

    const totalSegments = path.length - 1;
    const progress = Math.max(0, Math.min(0.999, progressFraction));
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(progress * totalSegments));
    const segmentFraction = (progress * totalSegments) - segmentIndex;

    const startPt = path[segmentIndex];
    const endPt = path[segmentIndex + 1] || startPt;

    const lat = startPt[0] + (endPt[0] - startPt[0]) * segmentFraction;
    const lng = startPt[1] + (endPt[1] - startPt[1]) * segmentFraction;

    return [lat, lng];
  }, [activeRoute, isDeviated, progressFraction]);

  const currentCoordinates = getCurrentCoordinates();

  // Find nearest landmark
  const currentWaypointIndex = Math.floor(progressFraction * activeRoute.waypoints.length);
  const currentLandmark =
    activeRoute.waypoints[Math.min(currentWaypointIndex, activeRoute.waypoints.length - 1)]?.name ||
    'Satara Road Corridor';

  // Calculate deviation distance from normal path
  const deviationDistanceMeters = isDeviated
    ? calculateDeviationFromRoute(currentCoordinates, activeRoute.normalPath)
    : 0;

  // Calculate speed
  const currentSpeedKmph = isStoppedUnusually ? 0 : isDeviated ? 18 : 34;

  // Compute Risk Score with transparent formula
  const riskEvaluation = evaluateJourneyRisk({
    deviationDistanceMeters,
    isStoppedUnusually,
    stopDurationSec: unusualStopDurationSec,
    simulatedHour,
    simulatedMinute,
    crowdDensityPercent: crowdDensityScoreInput,
    batteryLevel,
    isCharging,
    isCheckInActive,
    checkInCountdownSec: checkInCountdown,
    activeRoute,
    currentLandmark,
  });

  // Helper to append AI log
  const pushAiLog = useCallback(
    (title: string, desc: string, score: number, level: 'safe' | 'caution' | 'critical', factor: keyof typeof riskEvaluation.factors, delta: number, tags: string[]) => {
      const timeStr = `${String(simulatedHour).padStart(2, '0')}:${String(simulatedMinute).padStart(2, '0')}:${String(new Date().getSeconds()).padStart(2, '0')}`;
      const newLog: AIExplanationLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: timeStr,
        riskScore: score,
        riskLevel: level,
        title,
        description: desc,
        primaryFactor: factor,
        delta,
        evidenceTags: tags,
      };

      setAiExplanationFeed((prev) => [newLog, ...prev.slice(0, 24)]);
    },
    [simulatedHour, simulatedMinute, riskEvaluation.factors]
  );

  // Trigger Silent Auto-SOS function
  const triggerSilentAutoSos = useCallback(
    (reason: string) => {
      if (isSosTriggered) return;

      const timeStr = `${String(simulatedHour).padStart(2, '0')}:${String(simulatedMinute).padStart(2, '0')}`;
      const isoNow = new Date().toISOString();
      const coords = getCurrentCoordinates();
      const signature = generateForensicSignature(coords, isoNow);

      const evidence: IncidentEvidence = {
        id: `EVID-PUNE-${Date.now()}`,
        timestamp: timeStr,
        isoDate: isoNow,
        coordinates: coords,
        nearestLandmark: currentLandmark,
        speedKmph: currentSpeedKmph,
        riskScore: riskEvaluation.totalRisk,
        riskFactors: riskEvaluation.factors,
        primaryAnomaly: reason,
        audioSampleCaptured: true,
        audioDurationSec: 5,
        deviceBattery: batteryLevel,
        networkCarrier: 'Jio 5G / Pune South Node (Cell-412)',
        digitalSignature: signature,
        guardianNotifiedAt: timeStr,
        emergencyStatus: 'SILENT_SOS_DISPATCHED',
      };

      setIsSosTriggered(true);
      setSosTriggerReason(reason);
      setEvidencePackage(evidence);
      setIsSirenActive(true);

      if (soundEnabled) {
        soundEngine.startContinuousSiren();
      }

      // Sync across browser tabs via BroadcastChannel
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'SOS_DISPATCHED',
          payload: { reason, evidence },
        });
      }

      pushAiLog(
        '🚨 SILENT AUTO-SOS ESCALATED',
        `Emergency protocol active. Risk reached ${riskEvaluation.totalRisk}/100. Emergency siren sounding until acknowledged. Forensic evidence dispatched.`,
        riskEvaluation.totalRisk,
        'critical',
        'routeDeviationScore',
        +45,
        ['SOS Dispatched', 'Continuous Siren Active', 'Guardian Alerted']
      );
    },
    [
      isSosTriggered,
      simulatedHour,
      simulatedMinute,
      getCurrentCoordinates,
      currentLandmark,
      currentSpeedKmph,
      riskEvaluation,
      batteryLevel,
      soundEnabled,
      pushAiLog,
    ]
  );

  // Check-In countdown effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isCheckInActive && checkInCountdown > 0) {
      timer = setTimeout(() => {
        setCheckInCountdown((prev) => prev - 1);
      }, 1000 / playbackSpeed);
    } else if (isCheckInActive && checkInCountdown <= 0) {
      // Countdown expired! Escalation check
      if (riskEvaluation.totalRisk >= 65 || isDeviated) {
        triggerSilentAutoSos('Unresponsive User Check-In + Route Deviation Anomaly');
      }
      setIsCheckInActive(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCheckInActive, checkInCountdown, playbackSpeed, riskEvaluation.totalRisk, isDeviated, triggerSilentAutoSos]);

  // Main Simulation Interval (Steps the marker along the path)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // 1. Advance Progress if not stopped unusually
      if (!isStoppedUnusually) {
        setProgressFraction((prev) => {
          const next = prev + 0.02 * playbackSpeed;
          if (next >= 1.0) {
            return 0.0; // Loop or complete
          }
          return next;
        });
      } else {
        // Increment stop duration
        setUnusualStopDurationSec((prev) => prev + 1 * playbackSpeed);
      }

      // 2. Slowly advance simulated clock
      setSimulatedMinute((prev) => {
        if (Math.random() < 0.15) {
          return (prev + 1) % 60;
        }
        return prev;
      });

      // 3. Update Risk History for Sparkline
      const timeLabel = `${String(simulatedHour).padStart(2, '0')}:${String(simulatedMinute).padStart(2, '0')}`;
      setRiskHistory((prev) => {
        const updated = [...prev, { time: timeLabel, score: riskEvaluation.totalRisk, level: riskEvaluation.riskLevel }];
        return updated.slice(-20); // Keep last 20 ticks
      });

      // 4. Auto check-in trigger if risk is escalating and check-in not already open
      if (riskEvaluation.totalRisk >= 60 && !isCheckInActive && !isSosTriggered && checkInCountdown > 0) {
        setIsCheckInActive(true);
        setCheckInCountdown(10);
        if (soundEnabled) soundEngine.playCheckInChime();
      }

      // 5. Automatic SOS threshold check (Risk >= 75)
      if (riskEvaluation.totalRisk >= 75 && !isSosTriggered && (!isCheckInActive || checkInCountdown <= 2)) {
        triggerSilentAutoSos('Autonomous Risk Threshold Exceeded (>75)');
      }
    }, 1200 / playbackSpeed);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    isStoppedUnusually,
    playbackSpeed,
    simulatedHour,
    simulatedMinute,
    riskEvaluation.totalRisk,
    riskEvaluation.riskLevel,
    isCheckInActive,
    isSosTriggered,
    checkInCountdown,
    soundEnabled,
    triggerSilentAutoSos,
  ]);

  // Demo Control Handlers
  const selectRoute = (routeId: string) => {
    setActiveRouteId(routeId);
    setProgressFraction(0.0);
    setIsDeviated(false);
    setIsStoppedUnusually(false);
    setUnusualStopDurationSec(0);
    setIsSosTriggered(false);
    setEvidencePackage(null);
    setIsCheckInActive(false);
    silenceSiren();
  };

  const togglePlayPause = () => setIsPlaying((p) => !p);

  const triggerRouteDeviation = (enable?: boolean) => {
    const nextState = enable !== undefined ? enable : !isDeviated;
    setIsDeviated(nextState);

    if (nextState) {
      pushAiLog(
        '⚠️ Route Deviation Detected',
        'Vehicle turned off Satara Road onto unverified warehouse bylane. Risk index recalculated.',
        58,
        'caution',
        'routeDeviationScore',
        +38,
        ['Off-Corridor 380m', 'Low Illumination']
      );
      // Auto prompt check-in
      setIsCheckInActive(true);
      setCheckInCountdown(12);
      if (soundEnabled) soundEngine.playCheckInChime();
    } else {
      pushAiLog(
        '🟢 Returned to Safe Corridor',
        'Vehicle re-aligned with standard Satara Road transit path. Risk normalized.',
        16,
        'safe',
        'routeDeviationScore',
        -35,
        ['Corridor Restored']
      );
      silenceSiren();
    }
  };

  const triggerUnusualStop = (enable?: boolean) => {
    const next = enable !== undefined ? enable : !isStoppedUnusually;
    setIsStoppedUnusually(next);
    if (next) {
      setUnusualStopDurationSec(10);
      pushAiLog(
        '🛑 Unusual Stop Detected',
        'Vehicle has stopped in an unscheduled zone for >10s with no designated transit stop nearby.',
        48,
        'caution',
        'unusualStopScore',
        +25,
        ['Stationary Anomaly', 'Off-Schedule']
      );
    } else {
      setUnusualStopDurationSec(0);
    }
  };

  const triggerCheckIn = () => {
    setIsCheckInActive(true);
    setCheckInCountdown(12);
    if (soundEnabled) soundEngine.playCheckInChime();
  };

  const respondToCheckIn = (isSafe: boolean) => {
    setIsCheckInActive(false);
    silenceSiren(); // Reaction received! Stop siren immediately.

    if (isSafe) {
      pushAiLog(
        '✅ Commuter Verified Safe',
        'Traveler responded "I am Safe". Alarm silenced and risk normalized.',
        18,
        'safe',
        'unresponsivenessScore',
        -40,
        ['User Responsive', 'Safe Confirmation', 'Siren Silenced']
      );
    } else {
      // User tapped Panic/Help
      triggerManualSos('User Tapped Panic / SOS in Check-In Prompt');
    }
  };

  const triggerManualSos = (reason: string = 'Manual SOS Triggered by Traveler') => {
    triggerSilentAutoSos(reason);
  };

  const resolveEmergency = () => {
    setIsSosTriggered(false);
    setEvidencePackage(null);
    setIsDeviated(false);
    setIsStoppedUnusually(false);
    setIsCheckInActive(false);
    silenceSiren(); // Reaction received! Silence siren.

    pushAiLog(
      '🛡️ Emergency Resolved by Guardian',
      'Safety status reset to nominal. Emergency alarm silenced.',
      14,
      'safe',
      'routeDeviationScore',
      -60,
      ['Resolved Safe', 'Guardian Verified', 'Siren Silenced']
    );

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'EMERGENCY_RESOLVED' });
    }
  };

  const resetJourney = () => {
    setProgressFraction(0.0);
    setIsDeviated(false);
    setIsStoppedUnusually(false);
    setUnusualStopDurationSec(0);
    setIsSosTriggered(false);
    setEvidencePackage(null);
    setIsCheckInActive(false);
    silenceSiren();
    setBatteryLevelState(68);
    setCrowdDensityScoreInput(30);
    setSimulatedHour(22);
    setSimulatedMinute(42);
    setRiskHistory([
      { time: '22:38', score: 14, level: 'safe' },
      { time: '22:40', score: 16, level: 'safe' },
      { time: '22:42', score: 15, level: 'safe' },
    ]);
  };

  const setBatteryLevel = (val: number) => setBatteryLevelState(val);
  const setCrowdDensity = (val: number) => setCrowdDensityScoreInput(val);
  const setSimulatedTime = (h: number, m: number) => {
    setSimulatedHour(h);
    setSimulatedMinute(m);
  };
  const toggleDiscreetMode = () => setDiscreetModeActive((prev) => !prev);

  const state: SafetyState = {
    activeRouteId,
    isPlaying,
    playbackSpeed,
    currentWaypointIndex,
    progressFraction,
    currentCoordinates,
    currentSpeedKmph,
    isDeviated,
    deviationDistanceMeters,
    isStoppedUnusually,
    unusualStopDurationSec,
    simulatedHour,
    simulatedMinute,
    crowdDensityScoreInput,
    batteryLevel,
    isCharging,
    isCheckInActive,
    checkInCountdown,
    isSosTriggered,
    sosTriggerReason,
    isSirenActive,
    evidencePackage,
    riskHistory,
    aiExplanationFeed,
    guardianConnected: true,
    discreetModeActive,
  };

  return (
    <SafetyContext.Provider
      value={{
        state,
        activeRoute,
        riskEvaluation,
        allRoutes,
        selectRoute,
        togglePlayPause,
        setPlaybackSpeed,
        triggerRouteDeviation,
        triggerUnusualStop,
        triggerCheckIn,
        respondToCheckIn,
        triggerManualSos,
        resolveEmergency,
        resetJourney,
        setBatteryLevel,
        setCrowdDensity,
        setSimulatedTime,
        toggleDiscreetMode,
        soundEnabled,
        setSoundEnabled,
        startSiren,
        silenceSiren,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = (): SafetyContextValue => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
