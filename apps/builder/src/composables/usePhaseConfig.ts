import {computed, ref} from "vue";
import type {PhaseId, Phase} from "../types";
import type {
  PhaseConfig,
  UsePhaseConfigReturn,
  ConfigLoadError,
} from "../config/types";
import {PHASE_CONFIGS} from "../config";
import {DEFAULT_PHASE_TITLES, DEFAULT_PHASE_TEMPLATES} from "../types";

export function usePhaseConfig(): UsePhaseConfigReturn {
  const isLoading = ref(false);
  const configCache = ref<Record<PhaseId, PhaseConfig>>(
    {} as Record<PhaseId, PhaseConfig>
  );

  /**
   * Load all phase configurations
   */
  const loadConfigurations = async (): Promise<void> => {
    isLoading.value = true;

    try {
      // Load configurations from the config directory
      // In a real implementation, this might involve dynamic imports or API calls
      // For now, we'll use the static imports from the config index
      configCache.value = PHASE_CONFIGS;
    } catch (error) {
      const configError: ConfigLoadError = new Error(
        `Failed to load phase configurations: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      ) as ConfigLoadError;
      configError.cause = error instanceof Error ? error : undefined;
      throw configError;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get phase configuration by ID
   */
  const getPhaseConfig = (id: PhaseId): PhaseConfig => {
    // Check cache first
    if (configCache.value[id]) {
      return configCache.value[id];
    }

    // Fallback to default configuration
    return {
      id,
      title: DEFAULT_PHASE_TITLES[id],
      template: DEFAULT_PHASE_TEMPLATES[id],
      description: `Default ${DEFAULT_PHASE_TITLES[id]} phase configuration`,
    };
  };

  /**
   * Update phase configuration
   */
  const updatePhaseConfig = (
    id: PhaseId,
    config: Partial<PhaseConfig>
  ): void => {
    if (!configCache.value[id]) {
      configCache.value[id] = getPhaseConfig(id);
    }

    configCache.value[id] = {
      ...configCache.value[id],
      ...config,
    };
  };

  /**
   * Get all phase configurations
   */
  const phaseConfigs = computed(() => {
    const configs: Record<PhaseId, PhaseConfig> = {} as Record<
      PhaseId,
      PhaseConfig
    >;

    // Ensure all phases have configurations
    const phaseIds: PhaseId[] = ["0", "1", "2", "2.5", "3", "4"];

    for (const id of phaseIds) {
      configs[id] = getPhaseConfig(id);
    }

    return configs;
  });

  // Initialize configurations on first use
  if (Object.keys(configCache.value).length === 0) {
    loadConfigurations().catch((error) => {
      console.error("Failed to load initial configurations:", error);
    });
  }

  return {
    phaseConfigs,
    getPhaseConfig,
    updatePhaseConfig,
    loadConfigurations,
    isLoading,
  };
}

/**
 * Convert PhaseConfig to Phase interface
 */
export function configToPhase(config: PhaseConfig): Phase {
  return {
    id: config.id,
    title: config.title,
    template: config.template,
    overridesEnabled: false,
    inputs: {},
    lastOutput: "",
  };
}

/**
 * Convert Phase to PhaseConfig interface
 */
export function phaseToConfig(phase: Phase): PhaseConfig {
  return {
    id: phase.id,
    title: phase.title,
    template: phase.template,
    description: `${phase.title} phase configuration`,
  };
}
