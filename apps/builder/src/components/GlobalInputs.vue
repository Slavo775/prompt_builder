<template>
  <div class="global-inputs">
    <h3 class="global-inputs__title">
      Global Inputs
    </h3>
    <div class="global-inputs__form">
      <div class="global-inputs__input-group">
        <label
          for="project-name"
          class="global-inputs__label"
        >Project Name</label>
        <input
          id="project-name"
          :value="globalInputs.projectName"
          type="text"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('project-name')},
          ]"
          placeholder="My Project"
          :aria-describedby="
            getFieldError('project-name') ? 'project-name-error' : undefined
          "
          :aria-invalid="getFieldError('project-name') ? 'true' : 'false'"
          @input="
            updateGlobalInput(
              'projectName',
              ($event.target as HTMLInputElement).value
            )
          "
        >
        <div
          v-if="getFieldError('project-name')"
          id="project-name-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("project-name") }}
        </div>
      </div>
      <div class="global-inputs__input-group">
        <label
          for="feature-name"
          class="global-inputs__label"
        >Feature Name</label>
        <input
          id="feature-name"
          :value="globalInputs.featureName"
          type="text"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('feature-name')},
          ]"
          placeholder="User Authentication"
          :aria-describedby="
            getFieldError('feature-name') ? 'feature-name-error' : undefined
          "
          :aria-invalid="getFieldError('feature-name') ? 'true' : 'false'"
          @input="
            updateGlobalInput(
              'featureName',
              ($event.target as HTMLInputElement).value
            )
          "
        >
        <div
          v-if="getFieldError('feature-name')"
          id="feature-name-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("feature-name") }}
        </div>
      </div>
      <div class="global-inputs__input-group">
        <label
          for="feature-slug"
          class="global-inputs__label"
        >Feature Slug</label>
        <input
          id="feature-slug"
          :value="globalInputs.featureSlug"
          type="text"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('feature-slug')},
          ]"
          placeholder="user-auth"
          :aria-describedby="
            getFieldError('feature-slug') ? 'feature-slug-error' : undefined
          "
          :aria-invalid="getFieldError('feature-slug') ? 'true' : 'false'"
          @input="
            updateGlobalInput(
              'featureSlug',
              ($event.target as HTMLInputElement).value
            )
          "
        >
        <div
          v-if="getFieldError('feature-slug')"
          id="feature-slug-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("feature-slug") }}
        </div>
      </div>

      <!-- Package Manager Selection -->
      <div class="global-inputs__input-group">
        <label
          for="package-manager"
          class="global-inputs__label"
        >Package Manager</label>
        <select
          id="package-manager"
          :value="globalInputs.packageManager"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('package-manager')},
          ]"
          :aria-describedby="
            getFieldError('package-manager')
              ? 'package-manager-error'
              : 'package-manager-help'
          "
          :aria-invalid="getFieldError('package-manager') ? 'true' : 'false'"
          @change="
            updateGlobalInput(
              'packageManager',
              ($event.target as HTMLSelectElement).value as PackageManager
            )
          "
        >
          <option value="npm">
            npm
          </option>
          <option value="pnpm">
            pnpm
          </option>
          <option value="yarn">
            yarn
          </option>
        </select>
        <div
          id="package-manager-help"
          class="global-inputs__help"
        >
          Choose the package manager used in your project
        </div>
        <div
          v-if="getFieldError('package-manager')"
          id="package-manager-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("package-manager") }}
        </div>
      </div>

      <!-- Monorepo Configuration -->
      <div class="global-inputs__input-group">
        <div class="global-inputs__checkbox-wrapper">
          <input
            id="is-monorepo"
            :checked="globalInputs.isMonorepo"
            type="checkbox"
            class="global-inputs__checkbox"
            :aria-describedby="
              getFieldError('is-monorepo')
                ? 'is-monorepo-error'
                : 'is-monorepo-help'
            "
            :aria-invalid="getFieldError('is-monorepo') ? 'true' : 'false'"
            @change="
              updateGlobalInput(
                'isMonorepo',
                ($event.target as HTMLInputElement).checked
              )
            "
          >
          <label
            for="is-monorepo"
            class="global-inputs__checkbox-label"
          >
            Monorepo Project
          </label>
        </div>
        <div
          id="is-monorepo-help"
          class="global-inputs__help"
        >
          Check if your project uses workspaces (affects command flags)
        </div>
        <div
          v-if="getFieldError('is-monorepo')"
          id="is-monorepo-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("is-monorepo") }}
        </div>
      </div>

      <!-- Requirements Input -->
      <div class="global-inputs__input-group">
        <RequirementsInput
          :model-value="globalInputs.requirements"
          :error-message="getFieldError('requirements')"
          :aria-described-by="
            getFieldError('requirements') ? 'requirements-error' : undefined
          "
          @update:model-value="updateGlobalInput('requirements', $event)"
        />
        <div
          v-if="getFieldError('requirements')"
          id="requirements-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("requirements") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {toRef} from "vue";
import type {GlobalInputs, PackageManager} from "../types";
import type {ValidationError} from "../config/types";
import {useValidation} from "../composables/useValidation";
import RequirementsInput from "./RequirementsInput.vue";

interface Props {
  globalInputs: GlobalInputs;
  template?: string;
  phaseInputs?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  template: "",
  phaseInputs: () => ({}),
});

const emit = defineEmits<{
  "update:globalInputs": [globalInputs: GlobalInputs];
}>();

// Use validation composable with reactive props
const {validationState} = useValidation(
  toRef(props, "template"),
  toRef(props, "globalInputs"),
  toRef(props, "phaseInputs")
);

// Update global input function
const updateGlobalInput = (
  field: keyof GlobalInputs,
  value: string | boolean | PackageManager
) => {
  const updatedInputs = {
    ...props.globalInputs,
    [field]: value,
  };
  emit("update:globalInputs", updatedInputs);
};

// Get error message for a specific field
const getFieldError = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    "project-name": "project-name",
    "feature-name": "feature-name",
    "feature-slug": "feature-slug",
    "package-manager": "package-manager",
    "is-monorepo": "is-monorepo",
    owner: "owner",
    stack: "stack",
    date: "date",
    requirements: "requirements",
  };

  const mappedField = fieldMap[fieldName];
  if (!mappedField) return "";

  const error = validationState.value.errors.find(
    (err: ValidationError) => err.field === mappedField
  );
  return error?.message || "";
};
</script>

<style scoped>
.global-inputs {
  padding: 1rem;
  flex: 1;
}

.global-inputs__title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.global-inputs__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.global-inputs__input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.global-inputs__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.global-inputs__input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.global-inputs__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.global-inputs__input--error {
  border-color: #dc2626;
}

.global-inputs__input--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.global-inputs__error {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
  display: block;
}

.global-inputs__help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.global-inputs__checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.global-inputs__checkbox {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
}

.global-inputs__checkbox:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.global-inputs__checkbox-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}
</style>
