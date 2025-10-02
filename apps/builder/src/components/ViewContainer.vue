<template>
  <div
    :id="`${viewType}-panel`"
    :class="[
      'view-container',
      `view-container--${viewType}`,
      {'view-container--disabled': disabled},
    ]"
    :data-view="viewType"
    role="tabpanel"
    :aria-labelledby="`${viewType}-tab`">
    <slot :view-type="viewType" :view-state="viewState" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import type {ViewType, ViewState} from "../types";

interface Props {
  viewType: ViewType;
  viewState: ViewState;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

<style scoped>
.view-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.view-container--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.view-container--frontend {
  /* Frontend-specific styling if needed */
}

.view-container--backend {
  /* Backend-specific styling if needed */
}
</style>
