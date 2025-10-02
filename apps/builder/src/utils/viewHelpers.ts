import type {
  ViewType,
  AnyPhaseId,
  ViewAwarePhaseBuilderState,
  ViewExportData,
} from "../types";

/**
 * Get the default phase ID for a given view type
 */
export function getDefaultPhaseId(viewType: ViewType): AnyPhaseId {
  switch (viewType) {
    case "frontend":
      return "0";
    case "backend":
      return "backend-0";
  }
}

/**
 * Get the phase IDs for a given view type
 */
export function getPhaseIds(viewType: ViewType): AnyPhaseId[] {
  switch (viewType) {
    case "frontend":
      return ["0", "1", "2", "2.5", "3", "4", "5", "6"];
    case "backend":
      return ["backend-0", "backend-1", "backend-2", "backend-3"];
  }
}

/**
 * Check if a phase ID belongs to a specific view type
 */
export function isPhaseIdForView(
  phaseId: AnyPhaseId,
  viewType: ViewType
): boolean {
  const phaseIds = getPhaseIds(viewType);
  return phaseIds.includes(phaseId);
}

/**
 * Validate view-aware state structure
 */
export function validateViewAwareState(
  state: unknown
): state is ViewAwarePhaseBuilderState {
  if (!state || typeof state !== "object") {
    return false;
  }

  const s = state as Record<string, unknown>;

  // Check required top-level properties
  if (!s.currentView || !s.views || !s.globalInputs) {
    return false;
  }

  // Check currentView is valid
  if (!["frontend", "backend"].includes(s.currentView as string)) {
    return false;
  }

  // Check views structure
  const views = s.views as Record<string, unknown>;
  if (!views.frontend || !views.backend) {
    return false;
  }

  return true;
}

/**
 * Create empty view export data
 */
export function createEmptyViewExportData(viewType: ViewType): ViewExportData {
  return {
    viewType,
    phases: {},
    currentPhaseId: getDefaultPhaseId(viewType),
    lastModified: new Date().toISOString(),
  };
}

/**
 * Get view display name
 */
export function getViewDisplayName(viewType: ViewType): string {
  switch (viewType) {
    case "frontend":
      return "Frontend";
    case "backend":
      return "Backend";
  }
}

/**
 * Get view icon
 */
export function getViewIcon(viewType: ViewType): string {
  switch (viewType) {
    case "frontend":
      return "🎨";
    case "backend":
      return "⚙️";
  }
}
