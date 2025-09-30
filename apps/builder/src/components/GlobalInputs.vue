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
      <div class="global-inputs__input-group">
        <label
          for="owner"
          class="global-inputs__label"
        >Owner</label>
        <input
          id="owner"
          :value="globalInputs.owner"
          type="text"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('owner')},
          ]"
          placeholder="John Doe"
          :aria-describedby="getFieldError('owner') ? 'owner-error' : undefined"
          :aria-invalid="getFieldError('owner') ? 'true' : 'false'"
          @input="
            updateGlobalInput(
              'owner',
              ($event.target as HTMLInputElement).value
            )
          "
        >
        <div
          v-if="getFieldError('owner')"
          id="owner-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("owner") }}
        </div>
      </div>
      <div class="global-inputs__input-group">
        <label
          for="repo-url"
          class="global-inputs__label"
        >Repo URL (optional)</label>
        <input
          id="repo-url"
          :value="globalInputs.repoUrl"
          type="url"
          class="global-inputs__input"
          placeholder="https://github.com/user/repo"
          @input="
            updateGlobalInput(
              'repoUrl',
              ($event.target as HTMLInputElement).value
            )
          "
        >
      </div>
      <div class="global-inputs__input-group">
        <label
          for="stack"
          class="global-inputs__label"
        >Stack</label>
        <input
          id="stack"
          :value="globalInputs.stack"
          type="text"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('stack')},
          ]"
          placeholder="Vue 3, TypeScript, Vite"
          :aria-describedby="getFieldError('stack') ? 'stack-error' : undefined"
          :aria-invalid="getFieldError('stack') ? 'true' : 'false'"
          @input="
            updateGlobalInput(
              'stack',
              ($event.target as HTMLInputElement).value
            )
          "
        >
        <div
          v-if="getFieldError('stack')"
          id="stack-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("stack") }}
        </div>
      </div>
      <div class="global-inputs__input-group">
        <label
          for="date"
          class="global-inputs__label"
        >Date</label>
        <input
          id="date"
          :value="globalInputs.dateIso"
          type="date"
          :class="[
            'global-inputs__input',
            {'global-inputs__input--error': getFieldError('date')},
          ]"
          :aria-describedby="getFieldError('date') ? 'date-error' : undefined"
          :aria-invalid="getFieldError('date') ? 'true' : 'false'"
          @input="
            updateGlobalInput(
              'dateIso',
              ($event.target as HTMLInputElement).value
            )
          "
        >
        <div
          v-if="getFieldError('date')"
          id="date-error"
          class="global-inputs__error"
          role="alert"
        >
          {{ getFieldError("date") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GlobalInputs} from "../types";
import type {ValidationError} from "../config/types";
import {useValidation} from "../composables/useValidation";

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

// Use validation composable
const {validationState} = useValidation(
  props.template,
  props.globalInputs,
  props.phaseInputs
);

// Update global input function
const updateGlobalInput = (field: keyof GlobalInputs, value: string) => {
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
    owner: "owner",
    stack: "stack",
    date: "date",
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
</style>
