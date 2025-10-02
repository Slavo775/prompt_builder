<template>
  <div class="phase-view">
    <div class="phase-view__header">
      <h2 class="phase-view__title">
        {{ phase.title }}
      </h2>
      <div class="phase-view__actions">
        <button
          :class="[
            'phase-view__toggle',
            {'phase-view__toggle--active': phase.overridesEnabled},
          ]"
          :aria-pressed="phase.overridesEnabled"
          @click="toggleOverrides"
        >
          {{ phase.overridesEnabled ? "Custom Template" : "Default Template" }}
        </button>
        <button
          v-if="phase.overridesEnabled"
          class="phase-view__reset"
          @click="resetToDefault"
        >
          Reset to Default
        </button>
      </div>
    </div>

    <div class="phase-view__content">
      <PhaseTemplateEditor
        :phase="phase"
        @update:template="updateTemplate"
      />

      <!-- Phase 5 Specialized Inputs -->
      <Phase5InputsComponent
        v-if="phase.id === '5'"
        :model-value="phase5Inputs"
        :disabled="false"
        :show-validation="true"
        @update:model-value="updatePhase5Inputs"
      />

      <!-- Standard Phase Inputs -->
      <PhaseInputs
        v-else
        :phase="phase"
        :global-inputs="globalInputs"
        :template="phase.template"
        @update:phase="updatePhase"
      />

      <PhasePreview
        :rendered-template="renderedTemplate"
        :last-output="phase.lastOutput"
        @save-output="saveOutput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {Phase, BackendPhase, GlobalInputs, ViewType} from "../types";
import type {Phase5Inputs} from "../config/types";
import {useReplacements} from "../composables/useReplacements";
import {
  createEmptyPhase5Inputs,
  phase5InputsToTokenMap,
} from "../utils/phase5Validation";
import PhaseTemplateEditor from "./PhaseTemplateEditor.vue";
import PhaseInputs from "./PhaseInputs.vue";
import Phase5InputsComponent from "./Phase5Inputs.vue";
import PhasePreview from "./PhasePreview.vue";

interface Props {
  phase: Phase | BackendPhase;
  globalInputs: GlobalInputs;
  viewType?: ViewType;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:phase": [phase: Phase | BackendPhase];
}>();

// Phase 5 inputs state
const phase5Inputs = ref<Phase5Inputs>(createEmptyPhase5Inputs());

// Initialize Phase 5 inputs from phase data
const initializePhase5Inputs = () => {
  if (props.phase.id === "5") {
    // Auto-generate PRD and RFC file names from global inputs
    const featureSlug = props.globalInputs.featureSlug || "feature";
    const prdFileName = `PRD_${featureSlug}.md`;
    const rfcFileName = `RFC_${featureSlug}.md`;

    // Convert phase inputs to Phase 5 inputs
    const inputs: Phase5Inputs = {
      bugTitle: props.phase.inputs.BUG_TITLE || "",
      commitSha: props.phase.inputs.COMMIT_SHA || "",
      browserOs: props.phase.inputs.BROWSER_OS || "",
      urlRoute: props.phase.inputs.URL_ROUTE || "",
      severity: (props.phase.inputs.SEVERITY as any) || "minor",
      prdFile: props.phase.inputs.PRD_FILE || prdFileName,
      featureName: props.phase.inputs.FEATURE_NAME || "",
      prdGoalsRelevant: props.phase.inputs.PRD_GOALS_RELEVANT || "",
      prdNongoalsRelevant: props.phase.inputs.PRD_NONGOALS_RELEVANT || "",
      prdFrIds: props.phase.inputs.PRD_FR_IDS || "",
      prdTypesStable: props.phase.inputs.PRD_TYPES_STABLE || "",
      rfcFile: props.phase.inputs.RFC_FILE || rfcFileName,
      rfcAllowlistPaths: props.phase.inputs.RFC_ALLOWLIST_PATHS || "",
      rfcZeroInfraSummary: props.phase.inputs.RFC_ZERO_INFRA_SUMMARY || "",
      rfcOptionalAdjustments: props.phase.inputs.RFC_OPTIONAL_ADJUSTMENTS || "",
      reproSteps: props.phase.inputs.REPRO_STEPS || "",
      expectedBehavior: props.phase.inputs.EXPECTED_BEHAVIOR || "",
      actualBehavior: props.phase.inputs.ACTUAL_BEHAVIOR || "",
      suspectedRootCause: props.phase.inputs.SUSPECTED_ROOT_CAUSE || "",
    };
    phase5Inputs.value = inputs;
  }
};

// Initialize on mount
initializePhase5Inputs();

// Watch for phase changes
watch(
  () => props.phase.id,
  () => {
    initializePhase5Inputs();
  }
);

// Watch for global inputs changes to update file names
watch(
  () => props.globalInputs.featureSlug,
  () => {
    if (props.phase.id === "5") {
      initializePhase5Inputs();
    }
  }
);

const renderedTemplate = computed(() => {
  // For Phase 5, use specialized token replacement
  if (props.phase.id === "5") {
    const phase5TokenMap = phase5InputsToTokenMap(phase5Inputs.value);
    const {replaceTokens} = useReplacements(props.globalInputs, phase5TokenMap);
    return replaceTokens(props.phase.template);
  }

  // For other phases, use standard replacement
  const {replaceTokens} = useReplacements(
    props.globalInputs,
    props.phase.inputs
  );
  return replaceTokens(props.phase.template);
});

// Enhanced token replacement result for future use
// const tokenReplacementResult = computed(() => {
//   return replaceTokensWithResult(props.phase.template);
// });

const toggleOverrides = () => {
  const updatedPhase = {
    ...props.phase,
    overridesEnabled: !props.phase.overridesEnabled,
  };
  emit("update:phase", updatedPhase);
};

const resetToDefault = () => {
  const updatedPhase = {
    ...props.phase,
    overridesEnabled: false,
    inputs: {},
    lastOutput: "",
  };
  emit("update:phase", updatedPhase);
};

const updateTemplate = (template: string) => {
  const updatedPhase = {...props.phase, template};
  emit("update:phase", updatedPhase);
};

const updatePhase = (phase: Phase | BackendPhase) => {
  emit("update:phase", phase);
};

const updatePhase5Inputs = (inputs: Phase5Inputs) => {
  phase5Inputs.value = inputs;

  // Convert Phase 5 inputs to phase inputs format
  const phaseInputs = phase5InputsToTokenMap(inputs);

  const updatedPhase = {
    ...props.phase,
    inputs: phaseInputs,
  };
  emit("update:phase", updatedPhase);
};

const saveOutput = (output: string) => {
  const updatedPhase = {...props.phase, lastOutput: output};
  emit("update:phase", updatedPhase);
};
</script>

<style scoped>
.phase-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.phase-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.phase-view__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.phase-view__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.phase-view__toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-view__toggle:hover {
  background: #f9fafb;
}

.phase-view__toggle--active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.phase-view__reset {
  padding: 0.5rem 1rem;
  border: 1px solid #dc2626;
  background: white;
  color: #dc2626;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-view__reset:hover {
  background: #dc2626;
  color: white;
}

.phase-view__content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow: hidden;
}
</style>
