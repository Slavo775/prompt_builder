import {PHASE_CONFIGS} from "../config";

export interface Phase {
  id: "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";
  title: string;
  template: string;
  overridesEnabled: boolean;
  inputs: Record<string, string>;
  lastOutput: string;
}

// Package manager selection
export type PackageManager = "npm" | "pnpm" | "yarn";

export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  requirements: string;
  packageManager: PackageManager;
  isMonorepo: boolean;
}

export interface ReplacementMap {
  [key: string]: string;
}

export interface PhaseMap {
  [phaseId: string]: Phase;
}

export interface PhaseBuilderState {
  phases: PhaseMap;
  globalInputs: GlobalInputs;
  currentPhaseId: string;
}

export type PhaseId = "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";

// View-aware types for frontend/backend split
export type ViewType = "frontend" | "backend";

export type BackendPhaseId = "0" | "1" | "2" | "3";

export type AnyPhaseId = PhaseId | BackendPhaseId;

export interface BackendPhase {
  id: BackendPhaseId;
  title: string;
  template: string;
  overridesEnabled: boolean;
  inputs: Record<string, string>;
  lastOutput: string;
}

export interface ViewState {
  phases: PhaseMap | Record<string, BackendPhase>;
  currentPhaseId: PhaseId | BackendPhaseId;
  lastModified: string;
}

export interface ViewAwarePhaseBuilderState {
  currentView: ViewType;
  views: {
    frontend: ViewState;
    backend: ViewState;
  };
  globalInputs: GlobalInputs;
}

// Tab navigation types
export interface TabConfig {
  id: ViewType;
  label: string;
  icon: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}

// Component props interfaces
export interface TabNavigationProps {
  currentView: ViewType;
  disabled?: boolean;
  "aria-label"?: string;
}

export interface ViewContainerProps {
  viewType: ViewType;
  viewState: ViewState;
  disabled?: boolean;
}

// Enhanced export/import types
export interface ViewAwareExportData {
  version: string;
  exportedAt: string;
  globalInputs: GlobalInputs;
  views: {
    frontend: ViewExportData;
    backend: ViewExportData;
  };
  metadata: {
    currentView: ViewType;
    appVersion: string;
  };
}

export interface ViewExportData {
  viewType: ViewType;
  phases: PhaseMap | Record<string, BackendPhase>;
  currentPhaseId: PhaseId | BackendPhaseId;
  lastModified: string;
}

// Type guards
export function isViewType(value: unknown): value is ViewType {
  return typeof value === "string" && ["frontend", "backend"].includes(value);
}

export function isBackendPhaseId(value: unknown): value is BackendPhaseId {
  return (
    typeof value === "string" &&
    value.startsWith("backend-") &&
    ["backend-0", "backend-1", "backend-2", "backend-3"].includes(value)
  );
}

export function isPhaseId(value: unknown): value is PhaseId {
  return (
    typeof value === "string" &&
    ["0", "1", "2", "2.5", "3", "4", "5", "6"].includes(value)
  );
}

export const DEFAULT_PHASE_TITLES: Record<PhaseId, string> = {
  "0": PHASE_CONFIGS[0].description,

  "1": PHASE_CONFIGS[1].description,

  "2": PHASE_CONFIGS[2].description,

  "2.5": PHASE_CONFIGS[2.5].description,

  "3": PHASE_CONFIGS[3].description,

  "4": PHASE_CONFIGS[4].description,

  "5": PHASE_CONFIGS[5].description,

  "6": PHASE_CONFIGS[6].description,
} as const;

export const DEFAULT_PHASE_TEMPLATES: Record<PhaseId, string> = {
  "0": PHASE_CONFIGS[0].template,

  "1": PHASE_CONFIGS[1].template,

  "2": PHASE_CONFIGS[2].template,

  "2.5": PHASE_CONFIGS[2.5].template,

  "3": PHASE_CONFIGS[3].template,

  "4": PHASE_CONFIGS[4].template,

  "5": PHASE_CONFIGS[5].template,

  "6": PHASE_CONFIGS[6].template,
} as const;
