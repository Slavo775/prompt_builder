<template>
  <div class="global-inputs">
    <h3 class="global-inputs__title">Global Inputs</h3>
    <div class="global-inputs__form">
      <div class="global-inputs__input-group">
        <label for="project-name" class="global-inputs__label"
          >Project Name</label
        >
        <input
          id="project-name"
          v-model="globalInputs.projectName"
          type="text"
          class="global-inputs__input"
          placeholder="My Project" />
      </div>
      <div class="global-inputs__input-group">
        <label for="feature-name" class="global-inputs__label"
          >Feature Name</label
        >
        <input
          id="feature-name"
          v-model="globalInputs.featureName"
          type="text"
          class="global-inputs__input"
          placeholder="User Authentication" />
      </div>
      <div class="global-inputs__input-group">
        <label for="feature-slug" class="global-inputs__label"
          >Feature Slug</label
        >
        <input
          id="feature-slug"
          v-model="globalInputs.featureSlug"
          type="text"
          class="global-inputs__input"
          placeholder="user-auth" />
      </div>
      <div class="global-inputs__input-group">
        <label for="owner" class="global-inputs__label">Owner</label>
        <input
          id="owner"
          v-model="globalInputs.owner"
          type="text"
          class="global-inputs__input"
          placeholder="John Doe" />
      </div>
      <div class="global-inputs__input-group">
        <label for="repo-url" class="global-inputs__label"
          >Repo URL (optional)</label
        >
        <input
          id="repo-url"
          v-model="globalInputs.repoUrl"
          type="url"
          class="global-inputs__input"
          placeholder="https://github.com/user/repo" />
      </div>
      <div class="global-inputs__input-group">
        <label for="stack" class="global-inputs__label">Stack</label>
        <input
          id="stack"
          v-model="globalInputs.stack"
          type="text"
          class="global-inputs__input"
          placeholder="Vue 3, TypeScript, Vite" />
      </div>
      <div class="global-inputs__input-group">
        <label for="date" class="global-inputs__label">Date</label>
        <input
          id="date"
          v-model="globalInputs.dateIso"
          type="date"
          class="global-inputs__input" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GlobalInputs} from "../types";

interface Props {
  globalInputs: GlobalInputs;
}

defineProps<Props>();
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
</style>
