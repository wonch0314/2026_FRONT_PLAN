<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue'

interface Props {
  label?: string
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: ''
})

const formContext = inject<{ registerField?: (field: any) => void } | null>('ds-form', null)
const internalError = ref('')

const displayError = computed(() => props.error || internalError.value)
const hasError = computed(() => !!displayError.value)

const setError = (error: string) => {
  internalError.value = error
}

const clearError = () => {
  internalError.value = ''
}

provide('ds-form-item', {
  setError,
  clearError,
  hasError
})

defineExpose({ setError, clearError, hasError })
</script>

<template>
  <div
    class="ds-form-item"
    :class="{ 'ds-form-item--error': hasError, 'ds-form-item--required': required }"
  >
    <label v-if="label" class="ds-form-item-label">
      {{ label }}
      <span v-if="required" class="ds-form-item-required">*</span>
    </label>
    <div class="ds-form-item-content">
      <slot />
    </div>
    <span v-if="hasError" class="ds-form-item-error">
      {{ displayError }}
    </span>
  </div>
</template>

<style>
.ds-form-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ds-form-item-label {
  font-weight: 500;
}

.ds-form-item-required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.ds-form-item-content {
  display: flex;
  flex-direction: column;
}

.ds-form-item-error {
  font-size: 0.875em;
  color: #ef4444;
}
</style>
