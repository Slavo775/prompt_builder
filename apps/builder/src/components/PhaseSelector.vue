<template>
  <div
    ref="selectorRef"
    class="phase-selector"
    :class="{'phase-selector--disabled': disabled}"
  >
    <button
      ref="triggerRef"
      :class="[
        'phase-selector__trigger',
        {'phase-selector__trigger--open': isOpen},
      ]"
      :disabled="disabled"
      v-bind="a11yAttrs"
      @click="handlers.onTriggerClick"
      @keydown.arrow-down="handlers.onArrowDown"
      @keydown.arrow-up="handlers.onArrowUp"
      @keydown.enter="handlers.onEnter"
      @keydown.escape="handlers.onEscape"
      @keydown.tab="handlers.onTab"
    >
      <div class="phase-selector__content">
        <span class="phase-selector__badge">{{
          selectedOption?.id || "?"
        }}</span>
        <span class="phase-selector__label">
          {{ formatTriggerLabel(selectedOption) }}
        </span>
      </div>
      <svg
        class="phase-selector__arrow"
        :class="{'phase-selector__arrow--rotated': isOpen}"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen && dropdownPosition"
        id="phase-selector-dropdown"
        ref="dropdownRef"
        class="phase-selector__dropdown"
        :style="dropdownStyles"
        role="listbox"
        :aria-label="`Phase options for ${viewType || 'frontend'} view`"
      >
        <button
          v-for="(option, index) in phaseOptions"
          :key="option.id"
          :class="[
            'phase-selector__option',
            {
              'phase-selector__option--selected': option.selected,
              'phase-selector__option--focused': index === focusedIndex,
            },
          ]"
          :aria-selected="option.selected"
          :disabled="option.disabled"
          role="option"
          @click="handlers.onOptionClick(option.id)"
          @mouseenter="focusedIndex = index"
        >
          <span class="phase-selector__option-badge">{{ option.id }}</span>
          <span class="phase-selector__option-label">{{ option.title }}</span>
        </button>
      </div>
    </Teleport>

    <!-- Click outside detector -->
    <div
      v-if="isOpen"
      class="phase-selector__backdrop"
      @click="handlers.onOutsideClick"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, nextTick, watch} from "vue";
import {usePhaseSelector} from "../composables/usePhaseSelector";
import type {PhaseSelectorProps, PhaseSelectorEmits} from "../types";

const props = withDefaults(defineProps<PhaseSelectorProps>(), {
  disabled: false,
  "aria-label": "Select phase",
  class: "",
});

const emit = defineEmits<PhaseSelectorEmits>();

// Template refs
const selectorRef = ref<HTMLElement>();
const triggerRef = ref<HTMLButtonElement>();
const dropdownRef = ref<HTMLElement>();

// Convert props to refs for composable
const phasesListRef = computed(() => props.phasesList);
const currentPhaseIdRef = computed(() => props.currentPhaseId);

// Use phase selector composable
const {
  isOpen,
  phaseOptions,
  selectedOption,
  focusedIndex,
  dropdownPosition,
  handlers,
  a11yAttrs,
  openDropdown,
  closeDropdown,
  calculatePosition,
} = usePhaseSelector(phasesListRef, currentPhaseIdRef, emit);

// Format trigger label
const formatTriggerLabel = (option: typeof selectedOption.value): string => {
  if (!option) return "Select Phase";

  const title =
    option.title.length > 25
      ? `${option.title.substring(0, 22)}...`
      : option.title;

  return `Phase ${option.id}: ${title}`;
};

// Dropdown positioning styles
const dropdownStyles = computed(() => {
  if (!dropdownPosition.value) return {};

  const pos = dropdownPosition.value;
  return {
    position: "fixed",
    top: `${pos.top}px`,
    left: `${pos.left}px`,
    width: `${pos.width}px`,
    maxHeight: `${pos.maxHeight}px`,
    zIndex: "50",
  };
});

// Handle trigger click positioning
const handleTriggerClick = async (): Promise<void> => {
  if (!triggerRef.value) return;

  if (!isOpen.value) {
    calculatePosition(triggerRef.value);
    await openDropdown();
  } else {
    closeDropdown();
  }
};

// Override the trigger click handler
handlers.onTriggerClick = handleTriggerClick;

// Handle window resize
const handleResize = (): void => {
  if (isOpen.value && triggerRef.value) {
    calculatePosition(triggerRef.value);
  }
};

// Handle scroll
const handleScroll = (): void => {
  if (isOpen.value) {
    closeDropdown();
  }
};

// Lifecycle
onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll, true);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleScroll, true);
});

// Watch for phase list changes
watch(
  () => props.phasesList,
  () => {
    if (isOpen.value) {
      closeDropdown();
    }
  }
);

// Focus management
watch(isOpen, async (newIsOpen) => {
  if (newIsOpen) {
    await nextTick();
    // Focus is managed by the composable
  }
});
</script>

<style scoped>
.phase-selector {
  position: relative;
  width: 100%;
}

.phase-selector--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.phase-selector__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.875rem;
}

.phase-selector__trigger:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.phase-selector__trigger:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phase-selector__trigger--open {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phase-selector__content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.phase-selector__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.phase-selector__label {
  font-weight: 500;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.phase-selector__arrow {
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: #6b7280;
}

.phase-selector__arrow--rotated {
  transform: rotate(180deg);
}

.phase-selector__dropdown {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  padding: 0.5rem 0;
}

.phase-selector__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-align: left;
  font-size: 0.875rem;
}

.phase-selector__option:hover,
.phase-selector__option--focused {
  background: #f3f4f6;
}

.phase-selector__option--selected {
  background: #eff6ff;
  color: #1d4ed8;
}

.phase-selector__option--selected:hover,
.phase-selector__option--selected.phase-selector__option--focused {
  background: #dbeafe;
}

.phase-selector__option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.phase-selector__option-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.phase-selector__option--selected .phase-selector__option-badge {
  background: #3b82f6;
  color: white;
}

.phase-selector__option-label {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.phase-selector__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background: transparent;
}

/* Animation classes */
.phase-selector__dropdown {
  animation: dropdown-enter 0.15s ease-out;
}

@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
