<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const isOn = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const toggle = () => {
  if (props.disabled) return
  isOn.value = !isOn.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <button
    type="button"
    class="ds-switch"
    :class="{
      'ds-switch--on': isOn,
      'ds-switch--disabled': disabled,
      [`ds-switch--${size}`]: true
    }"
    role="switch"
    :aria-checked="isOn"
    :disabled="disabled"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <span class="ds-switch-track">
      <span class="ds-switch-thumb" />
    </span>
    <span v-if="$slots.default" class="ds-switch-label">
      <slot />
    </span>
  </button>
</template>

<style>
.ds-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.ds-switch--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ds-switch-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: var(--ds-switch-track-bg, #d1d5db);
  border-radius: 999px;
  transition: background 0.2s;
}

.ds-switch--on .ds-switch-track {
  background: var(--ds-switch-track-bg-on, #3b82f6);
}

.ds-switch-thumb {
  position: absolute;
  background: var(--ds-switch-thumb-bg, white);
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Size variants */
.ds-switch--sm .ds-switch-track {
  width: 32px;
  height: 18px;
}
.ds-switch--sm .ds-switch-thumb {
  width: 14px;
  height: 14px;
  left: 2px;
}
.ds-switch--sm.ds-switch--on .ds-switch-thumb {
  transform: translateX(14px);
}

.ds-switch--md .ds-switch-track {
  width: 44px;
  height: 24px;
}
.ds-switch--md .ds-switch-thumb {
  width: 20px;
  height: 20px;
  left: 2px;
}
.ds-switch--md.ds-switch--on .ds-switch-thumb {
  transform: translateX(20px);
}

.ds-switch--lg .ds-switch-track {
  width: 56px;
  height: 30px;
}
.ds-switch--lg .ds-switch-thumb {
  width: 26px;
  height: 26px;
  left: 2px;
}
.ds-switch--lg.ds-switch--on .ds-switch-thumb {
  transform: translateX(26px);
}

.ds-switch:focus-visible .ds-switch-track {
  outline: 2px solid var(--ds-switch-focus-ring, #3b82f6);
  outline-offset: 2px;
}
</style>
