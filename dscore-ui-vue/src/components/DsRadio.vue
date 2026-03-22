<script setup lang="ts">
import { computed, inject } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: string | number | boolean
  value: string | number | boolean
  disabled?: boolean
  checkIcon?: object
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'change': [value: string | number | boolean]
}>()

const config = useDsConfig()
const groupContext = inject<{ modelValue: any; updateValue: (v: any) => void } | null>('ds-radio-group', null)

const isChecked = computed(() => {
  const currentValue = groupContext?.modelValue ?? props.modelValue
  return currentValue === props.value
})

const CheckIcon = computed(() => props.checkIcon || config.icons?.check)

const handleChange = () => {
  if (props.disabled) return
  if (groupContext) {
    groupContext.updateValue(props.value)
  } else {
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    handleChange()
  }
}
</script>

<template>
  <label
    class="ds-radio"
    :class="{
      'ds-radio--checked': isChecked,
      'ds-radio--disabled': disabled
    }"
  >
    <input
      type="radio"
      class="ds-radio-input"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      @change="handleChange"
    />
    <span
      class="ds-radio-circle"
      tabindex="0"
      role="radio"
      :aria-checked="isChecked"
      @keydown="handleKeydown"
    >
      <span v-if="isChecked" class="ds-radio-dot" />
    </span>
    <span v-if="$slots.default" class="ds-radio-label">
      <slot />
    </span>
  </label>
</template>

<style>
.ds-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.ds-radio--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ds-radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ds-radio-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ds-radio-size, 20px);
  height: var(--ds-radio-size, 20px);
  border: var(--ds-radio-border, 2px solid #d1d5db);
  border-radius: 50%;
  background: var(--ds-radio-bg, white);
  transition: all 0.15s;
}

.ds-radio--checked .ds-radio-circle {
  border-color: var(--ds-radio-checked-border, #3b82f6);
}

.ds-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ds-radio-dot-color, #3b82f6);
}

.ds-radio-circle:focus-visible {
  outline: 2px solid var(--ds-radio-focus-ring, #3b82f6);
  outline-offset: 2px;
}
</style>
