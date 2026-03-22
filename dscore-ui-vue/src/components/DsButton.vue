<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import DsSpinner from './DsSpinner.vue'
import { useDsConfig } from '../plugin'

interface Props {
  loading?: boolean
  throttle?: number
  spinner?: object
  disabled?: boolean
  showSuccess?: boolean
  successDuration?: number
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  throttle: undefined,
  disabled: false,
  showSuccess: false,
  successDuration: 1500,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
const config = useDsConfig()

const internalLoading = ref(false)
const showSuccessIcon = ref(false)
const lastClickTime = ref(0)

const isLoading = computed(() => props.loading || internalLoading.value)
const isDisabled = computed(() => props.disabled || isLoading.value)

const effectiveThrottle = computed(() =>
  props.throttle ?? config.defaults?.button?.throttle ?? 0
)

const SpinnerComponent = computed(() =>
  props.spinner || config.spinner || DsSpinner
)

const handleClick = async (event: MouseEvent) => {
  // Throttle check
  if (effectiveThrottle.value > 0) {
    const now = Date.now()
    if (now - lastClickTime.value < effectiveThrottle.value) {
      return
    }
    lastClickTime.value = now
  }

  // Get click handler from attrs
  const clickHandler = attrs.onClick as ((e: MouseEvent) => void | Promise<void>) | undefined

  if (!clickHandler) {
    emit('click', event)
    return
  }

  // Check if it's an async function or returns a promise
  const result = clickHandler(event)

  if (result instanceof Promise) {
    internalLoading.value = true
    try {
      await result
      if (props.showSuccess) {
        showSuccessIcon.value = true
        setTimeout(() => {
          showSuccessIcon.value = false
        }, props.successDuration)
      }
    } finally {
      internalLoading.value = false
    }
  }

  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    class="ds-button"
    :disabled="isDisabled"
    :class="{ 'ds-button--loading': isLoading, 'ds-button--disabled': isDisabled }"
    @click="handleClick"
  >
    <span v-if="isLoading" class="ds-button-spinner">
      <component :is="SpinnerComponent" size="sm" />
    </span>
    <span v-else-if="showSuccessIcon" class="ds-button-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <span class="ds-button-content" :class="{ 'ds-button-content--hidden': isLoading }">
      <slot />
    </span>
  </button>
</template>

<style>
.ds-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ds-button--disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.ds-button-spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-button-success {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-button-success svg {
  width: 16px;
  height: 16px;
}

.ds-button-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}

.ds-button-content--hidden {
  visibility: hidden;
}
</style>
