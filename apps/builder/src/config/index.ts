import type {PhaseId} from "../types";
import type {PhaseConfig} from "./types";

// Import phase configurations
import {PHASE_0_CONFIG} from "./phases/phase-0";
import {PHASE_1_CONFIG} from "./phases/phase-1";
import {PHASE_2_CONFIG} from "./phases/phase-2";
import {PHASE_2_5_CONFIG} from "./phases/phase-2.5";
import {PHASE_3_CONFIG} from "./phases/phase-3";
import {PHASE_4_CONFIG} from "./phases/phase-4";
import {PHASE_5_CONFIG} from "./phases/phase-5";

// Export all phase configurations
export const PHASE_CONFIGS: Record<PhaseId, PhaseConfig> = {
  "0": PHASE_0_CONFIG,
  "1": PHASE_1_CONFIG,
  "2": PHASE_2_CONFIG,
  "2.5": PHASE_2_5_CONFIG,
  "3": PHASE_3_CONFIG,
  "4": PHASE_4_CONFIG,
  "5": PHASE_5_CONFIG,
};

// Export individual configurations for direct access
export {
  PHASE_0_CONFIG,
  PHASE_1_CONFIG,
  PHASE_2_CONFIG,
  PHASE_2_5_CONFIG,
  PHASE_3_CONFIG,
  PHASE_4_CONFIG,
};

// Export types
export type {
  PhaseConfig,
  ValidationState,
  ValidationError,
  ValidationWarning,
} from "./types";
