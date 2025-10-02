<template>
  <nav
    class="tab-navigation"
    role="tablist"
    :aria-label="ariaLabel || 'View navigation'">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="[
        'tab-navigation__tab',
        {'tab-navigation__tab--active': currentView === tab.id},
        {'tab-navigation__tab--disabled': tab.disabled || disabled},
      ]"
      :aria-selected="currentView === tab.id"
      :aria-controls="`${tab.id}-panel`"
      :disabled="tab.disabled || disabled"
      :tabindex="currentView === tab.id ? 0 : -1"
      role="tab"
      @click="handleTabClick(tab.id)"
      @keydown="handleKeyDown">
      <span class="tab-navigation__icon" aria-hidden="true">{{
        tab.icon
      }}</span>
      <span class="tab-navigation__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {ViewType} from "../types";
import {useTabNavigation} from "../composables/useTabNavigation";

interface Props {
  currentView: ViewType;
  disabled?: boolean;
  ariaLabel?: string;
}

interface Emits {
  "view-change": [viewType: ViewType];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  ariaLabel: "View navigation",
});

const emit = defineEmits<Emits>();

const ariaLabel = computed(() => props.ariaLabel);

const {tabs, handleKeyboardNavigation} = useTabNavigation(
  props.currentView,
  (viewType: ViewType) => emit("view-change", viewType)
);

const handleTabClick = (tabId: ViewType) => {
  if (!props.disabled) {
    emit("view-change", tabId);
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.disabled) {
    handleKeyboardNavigation(event);
  }
};
</script>

<style scoped>
.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  padding: 0 1rem;
}

.tab-navigation__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.tab-navigation__tab:hover:not(.tab-navigation__tab--disabled) {
  color: #374151;
  background: #f9fafb;
}

.tab-navigation__tab:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
  border-radius: 0.25rem;
}

.tab-navigation__tab--active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #eff6ff;
}

.tab-navigation__tab--disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.tab-navigation__icon {
  font-size: 1rem;
}

.tab-navigation__label {
  font-weight: inherit;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .tab-navigation__tab--active {
    border-bottom-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tab-navigation__tab {
    transition: none;
  }
}
</style>
