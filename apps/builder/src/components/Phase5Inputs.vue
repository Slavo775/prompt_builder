<template>
  <div :class="['phase5-inputs', {'phase5-inputs--compact': compact}]">
    <h3 class="phase5-inputs__title">
      Phase 5 - Fix Report Inputs
    </h3>

    <div class="phase5-inputs__sections">
      <!-- Bug Context Section -->
      <div class="phase5-inputs__section">
        <h4 class="phase5-inputs__section-title">
          Bug Context
        </h4>
        <div class="phase5-inputs__fields">
          <Phase5InputField
            :model-value="inputs.bugTitle || ''"
            :field-config="getFieldConfig('bugTitle')"
            :disabled="disabled"
            :error-message="getFieldError('bugTitle')"
            @update:model-value="updateInput('bugTitle', $event)"
          />
          <Phase5InputField
            :model-value="inputs.commitSha || ''"
            :field-config="getFieldConfig('commitSha')"
            :disabled="disabled"
            :error-message="getFieldError('commitSha')"
            @update:model-value="updateInput('commitSha', $event)"
          />
          <Phase5InputField
            :model-value="inputs.browserOs || ''"
            :field-config="getFieldConfig('browserOs')"
            :disabled="disabled"
            :error-message="getFieldError('browserOs')"
            @update:model-value="updateInput('browserOs', $event)"
          />
          <Phase5InputField
            :model-value="inputs.urlRoute || ''"
            :field-config="getFieldConfig('urlRoute')"
            :disabled="disabled"
            :error-message="getFieldError('urlRoute')"
            @update:model-value="updateInput('urlRoute', $event)"
          />
          <Phase5SeveritySelect
            :model-value="inputs.severity"
            :disabled="disabled"
            :error-message="getFieldError('severity')"
            @update:model-value="updateInput('severity', $event)"
          />
        </div>
      </div>

      <!-- PRD Context Section -->
      <div class="phase5-inputs__section">
        <h4 class="phase5-inputs__section-title">
          PRD Context
        </h4>
        <div class="phase5-inputs__fields">
          <Phase5InputField
            :model-value="inputs.prdFile || ''"
            :field-config="getFieldConfig('prdFile')"
            :disabled="disabled"
            :error-message="getFieldError('prdFile')"
            @update:model-value="updateInput('prdFile', $event)"
          />
          <Phase5InputField
            :model-value="inputs.featureName || ''"
            :field-config="getFieldConfig('featureName')"
            :disabled="disabled"
            :error-message="getFieldError('featureName')"
            @update:model-value="updateInput('featureName', $event)"
          />
          <Phase5InputField
            :model-value="inputs.prdGoalsRelevant || ''"
            :field-config="getFieldConfig('prdGoalsRelevant')"
            :disabled="disabled"
            :error-message="getFieldError('prdGoalsRelevant')"
            @update:model-value="updateInput('prdGoalsRelevant', $event)"
          />
          <Phase5InputField
            :model-value="inputs.prdNongoalsRelevant || ''"
            :field-config="getFieldConfig('prdNongoalsRelevant')"
            :disabled="disabled"
            :error-message="getFieldError('prdNongoalsRelevant')"
            @update:model-value="updateInput('prdNongoalsRelevant', $event)"
          />
          <Phase5InputField
            :model-value="inputs.prdFrIds || ''"
            :field-config="getFieldConfig('prdFrIds')"
            :disabled="disabled"
            :error-message="getFieldError('prdFrIds')"
            @update:model-value="updateInput('prdFrIds', $event)"
          />
          <Phase5InputField
            :model-value="inputs.prdTypesStable || ''"
            :field-config="getFieldConfig('prdTypesStable')"
            :disabled="disabled"
            :error-message="getFieldError('prdTypesStable')"
            @update:model-value="updateInput('prdTypesStable', $event)"
          />
        </div>
      </div>

      <!-- RFC Context Section -->
      <div class="phase5-inputs__section">
        <h4 class="phase5-inputs__section-title">
          RFC Context
        </h4>
        <div class="phase5-inputs__fields">
          <Phase5InputField
            :model-value="inputs.rfcFile || ''"
            :field-config="getFieldConfig('rfcFile')"
            :disabled="disabled"
            :error-message="getFieldError('rfcFile')"
            @update:model-value="updateInput('rfcFile', $event)"
          />
          <Phase5InputField
            :model-value="inputs.rfcAllowlistPaths || ''"
            :field-config="getFieldConfig('rfcAllowlistPaths')"
            :disabled="disabled"
            :error-message="getFieldError('rfcAllowlistPaths')"
            @update:model-value="updateInput('rfcAllowlistPaths', $event)"
          />
          <Phase5InputField
            :model-value="inputs.rfcZeroInfraSummary || ''"
            :field-config="getFieldConfig('rfcZeroInfraSummary')"
            :disabled="disabled"
            :error-message="getFieldError('rfcZeroInfraSummary')"
            @update:model-value="updateInput('rfcZeroInfraSummary', $event)"
          />
          <Phase5InputField
            :model-value="inputs.rfcOptionalAdjustments || ''"
            :field-config="getFieldConfig('rfcOptionalAdjustments')"
            :disabled="disabled"
            :error-message="getFieldError('rfcOptionalAdjustments')"
            @update:model-value="
              updateInput('rfcOptionalAdjustments', $event)
            "
          />
        </div>
      </div>

      <!-- Bug Reproduction Section -->
      <div class="phase5-inputs__section">
        <h4 class="phase5-inputs__section-title">
          Bug Reproduction
        </h4>
        <div class="phase5-inputs__fields">
          <Phase5InputField
            :model-value="inputs.reproSteps || ''"
            :field-config="getFieldConfig('reproSteps')"
            :disabled="disabled"
            :error-message="getFieldError('reproSteps')"
            @update:model-value="updateInput('reproSteps', $event)"
          />
          <Phase5InputField
            :model-value="inputs.expectedBehavior || ''"
            :field-config="getFieldConfig('expectedBehavior')"
            :disabled="disabled"
            :error-message="getFieldError('expectedBehavior')"
            @update:model-value="updateInput('expectedBehavior', $event)"
          />
          <Phase5InputField
            :model-value="inputs.actualBehavior || ''"
            :field-config="getFieldConfig('actualBehavior')"
            :disabled="disabled"
            :error-message="getFieldError('actualBehavior')"
            @update:model-value="updateInput('actualBehavior', $event)"
          />
          <Phase5InputField
            :model-value="inputs.suspectedRootCause || ''"
            :field-config="getFieldConfig('suspectedRootCause')"
            :disabled="disabled"
            :error-message="getFieldError('suspectedRootCause')"
            @update:model-value="updateInput('suspectedRootCause', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Validation Summary -->
    <div
      v-if="showValidation && !validationState.isValid"
      class="phase5-inputs__validation-summary"
      role="alert"
    >
      <h5 class="phase5-inputs__validation-title">
        Please fix the following errors:
      </h5>
      <ul class="phase5-inputs__validation-list">
        <li
          v-for="error in validationState.errors"
          :key="error.field"
          class="phase5-inputs__validation-item"
        >
          {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {watch} from "vue";
import type {
  Phase5InputsProps,
  Phase5InputFieldConfig,
  Phase5Inputs,
} from "../config/types";
import {PHASE_5_FIELD_CONFIGS} from "../config/types";
import {usePhase5Inputs} from "../composables/usePhase5Inputs";
import Phase5InputField from "./Phase5InputField.vue";
import Phase5SeveritySelect from "./Phase5SeveritySelect.vue";

const props = withDefaults(defineProps<Phase5InputsProps>(), {
  disabled: false,
  showValidation: true,
  compact: false,
});

const emit = defineEmits<{
  "update:modelValue": [inputs: Phase5Inputs];
}>();

// Use Phase 5 inputs composable
const {
  inputs,
  validationState,
  updateInput: updateInputField,
  getFieldError,
} = usePhase5Inputs(props.modelValue);

// Watch for changes and emit updates
watch(
  () => inputs.value,
  (newInputs) => {
    emit("update:modelValue", newInputs);
  },
  {deep: true}
);

// Get field configuration by key
const getFieldConfig = (key: keyof Phase5Inputs): Phase5InputFieldConfig => {
  const config = PHASE_5_FIELD_CONFIGS.find((field) => field.key === key);
  if (!config) {
    throw new Error(`Field configuration not found for key: ${key}`);
  }
  return config;
};

// Update input and emit change
const updateInput = (field: keyof Phase5Inputs, value: string): void => {
  updateInputField(field, value);
};
</script>

<style scoped>
.phase5-inputs {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.phase5-inputs__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.phase5-inputs__sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.phase5-inputs__section {
  display: flex;
  flex-direction: column;
}

.phase5-inputs__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.phase5-inputs__fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.phase5-inputs__validation-summary {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
}

.phase5-inputs__validation-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.phase5-inputs__validation-list {
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.phase5-inputs__validation-item {
  font-size: 0.875rem;
  color: #dc2626;
  margin-bottom: 0.25rem;
}

.phase5-inputs__validation-item:last-child {
  margin-bottom: 0;
}

/* Compact mode */
.phase5-inputs--compact .phase5-inputs__sections {
  gap: 1rem;
}

.phase5-inputs--compact .phase5-inputs__section-title {
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.phase5-inputs--compact .phase5-inputs__fields {
  gap: 0.75rem;
}
</style>
