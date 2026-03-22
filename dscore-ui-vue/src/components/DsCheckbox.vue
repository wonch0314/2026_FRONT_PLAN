<script setup lang="ts">
import { computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  checkIcon?: object
  value?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const config = useDsConfig()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const CheckIcon = computed(() => props.checkIcon || config.icons?.check)

const handleClick = () => {
  if (props.disabled) return
  isChecked.value = !isChecked.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <label
    class="ds-checkbox"
    :class="{
      'ds-checkbox--checked': isChecked,
      'ds-checkbox--indeterminate': indeterminate,
      'ds-checkbox--disabled': disabled
    }"
  >
    <input
      type="checkbox"
      class="ds-checkbox-input"
      :checked="isChecked"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :value="value"
      @change="handleClick"
    />
    <span
      class="ds-checkbox-box"
      tabindex="0"
      role="checkbox"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      @keydown="handleKeydown"
    >
      <span v-if="isChecked && !indeterminate" class="ds-checkbox-icon">
        <component v-if="CheckIcon" :is="CheckIcon" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span v-if="indeterminate" class="ds-checkbox-icon ds-checkbox-icon--indeterminate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </span>
    <span v-if="$slots.default" class="ds-checkbox-label">
      <slot />
    </span>
  </label>
</template>

<style>
.ds-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.ds-checkbox--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ds-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ds-checkbox-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ds-checkbox-size, 20px);
  height: var(--ds-checkbox-size, 20px);
  border: var(--ds-checkbox-border, 2px solid #d1d5db);
  border-radius: var(--ds-checkbox-radius, 4px);
  background: var(--ds-checkbox-bg, white);
  transition: all 0.15s;
}

.ds-checkbox--checked .ds-checkbox-box,
.ds-checkbox--indeterminate .ds-checkbox-box {
  background: var(--ds-checkbox-checked-bg, #3b82f6);
  border-color: var(--ds-checkbox-checked-border, #3b82f6);
}

.ds-checkbox-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-checkbox-check-color, white);
}

.ds-checkbox-icon svg {
  width: 14px;
  height: 14px;
}

.ds-checkbox-label {
  font-size: var(--ds-checkbox-label-size, inherit);
}

.ds-checkbox-box:focus-visible {
  outline: 2px solid var(--ds-checkbox-focus-ring, #3b82f6);
  outline-offset: 2px;
}
</style>
