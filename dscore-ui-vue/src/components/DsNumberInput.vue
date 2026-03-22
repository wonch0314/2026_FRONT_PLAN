<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  placeholder?: string
  formatter?: (value: number) => string
  parser?: (value: string) => number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  step: 1,
  disabled: false,
  placeholder: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
}>()

const config = useDsConfig()
const inputRef = ref<HTMLInputElement | null>(null)

const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return ''
  if (props.formatter) return props.formatter(props.modelValue)
  return props.modelValue.toLocaleString()
})

const ArrowIcon = computed(() => config.icons?.arrow)

const parseValue = (str: string): number | null => {
  if (!str) return null
  if (props.parser) return props.parser(str)
  const cleaned = str.replace(/,/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

const clampValue = (value: number): number => {
  let result = value
  if (props.min !== undefined) result = Math.max(result, props.min)
  if (props.max !== undefined) result = Math.min(result, props.max)
  return result
}

const updateValue = (newValue: number | null) => {
  if (newValue !== null) {
    newValue = clampValue(newValue)
  }
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseValue(target.value)
  updateValue(value)
}

const increment = () => {
  if (props.disabled) return
  const current = props.modelValue ?? 0
  updateValue(current + props.step)
}

const decrement = () => {
  if (props.disabled) return
  const current = props.modelValue ?? 0
  updateValue(current - props.step)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    increment()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    decrement()
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<template>
  <div
    class="ds-number-input"
    :class="{ 'ds-number-input--disabled': disabled }"
  >
    <button
      type="button"
      class="ds-number-input-btn ds-number-input-btn--decrement"
      :disabled="disabled || (min !== undefined && (modelValue ?? 0) <= min)"
      @click="decrement"
      aria-label="Decrease"
    >
      <component v-if="ArrowIcon" :is="ArrowIcon" style="transform: rotate(90deg)" />
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <input
      ref="inputRef"
      type="text"
      class="ds-number-input-field"
      :value="displayValue"
      :disabled="disabled"
      :placeholder="placeholder"
      inputmode="numeric"
      @input="handleInput"
      @keydown="handleKeydown"
    />

    <button
      type="button"
      class="ds-number-input-btn ds-number-input-btn--increment"
      :disabled="disabled || (max !== undefined && (modelValue ?? 0) >= max)"
      @click="increment"
      aria-label="Increase"
    >
      <component v-if="ArrowIcon" :is="ArrowIcon" style="transform: rotate(-90deg)" />
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </div>
</template>

<style>
.ds-number-input {
  display: inline-flex;
  align-items: center;
}

.ds-number-input--disabled {
  opacity: 0.6;
}

.ds-number-input-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
}

.ds-number-input-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ds-number-input-btn svg {
  width: 16px;
  height: 16px;
}

.ds-number-input-field {
  text-align: center;
  width: 100%;
}

.ds-number-input-field::-webkit-outer-spin-button,
.ds-number-input-field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
