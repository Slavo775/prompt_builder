<template>
  <div class="phase-template-editor">
    <JsonEditor
      v-model="localTemplate"
      label="Template"
      :placeholder="'Enter your template with [TOKEN] placeholders...'"
      :rows="12"
      :disabled="!phase.overridesEnabled"
      help-text="Use [TOKEN] syntax for placeholders. Available tokens: PROJECT_NAME, FEATURE_NAME, FEATURE_SLUG, OWNER, STACK, DATE_ISO"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import type {Phase} from "../types";
import JsonEditor from "./JsonEditor.vue";

interface Props {
  phase: Phase;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:template": [template: string];
}>();

const localTemplate = ref(props.phase.template);

watch(localTemplate, (newTemplate) => {
  emit("update:template", newTemplate);
});

watch(
  () => props.phase.template,
  (newTemplate) => {
    localTemplate.value = newTemplate;
  }
);
</script>

<style scoped>
.phase-template-editor {
  grid-column: 1 / -1;
}
</style>

