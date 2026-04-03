<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import DsSpinner from './DsSpinner.vue'
import { useDsConfig } from '../plugin'

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  loading?: boolean
  throttle?: number
  spinner?: object
  disabled?: boolean
  showSuccess?: boolean
  successDuration?: number
  type?: 'button' | 'submit' | 'reset'
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  throttle: undefined,
  disabled: false,
  showSuccess: false,
  successDuration: 1500,
  type: 'button',
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
const config = useDsConfig()

const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const asyncStatus = ref<AsyncStatus>('idle')
const lastClickTime = ref(0)
let errorResetTimer: ReturnType<typeof setTimeout> | null = null

const isLoading = computed(() => props.loading || asyncStatus.value === 'loading')
const isDisabled = computed(() => props.disabled || isLoading.value)

const effectiveThrottle = computed(() =>
  props.throttle ?? config.defaults?.button?.throttle ?? 0
)

const SpinnerComponent = computed(() =>
  props.spinner || config.spinner || DsSpinner
)

const handleClick = async (event: MouseEvent) => {
  // Clear any pending error reset when user clicks again
  if (errorResetTimer) {
    clearTimeout(errorResetTimer)
    errorResetTimer = null
  }
  // Reset success state on new click
  if (asyncStatus.value === 'success') {
    asyncStatus.value = 'idle'
  }

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

  const result = clickHandler(event)

  if (result instanceof Promise) {
    asyncStatus.value = 'loading'
    try {
      await result
      asyncStatus.value = 'success'
      // Success state is held until the next click (handled above)
    } catch {
      asyncStatus.value = 'error'
      errorResetTimer = setTimeout(() => {
        asyncStatus.value = 'idle'
        errorResetTimer = null
      }, 2000)
    }
  }

  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :class="[
      isStyled && 'ds-button',
      isStyled && isLoading && 'ds-button--loading',
      isStyled && isDisabled && 'ds-button--disabled',
      isStyled && asyncStatus === 'success' && 'ds-button--async-success',
      isStyled && asyncStatus === 'error' && 'ds-button--async-error',
    ]"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span v-if="isLoading" :class="isStyled && 'ds-button-spinner'">
      <component :is="SpinnerComponent" size="sm" />
    </span>
    <span v-else-if="asyncStatus === 'success'" :class="isStyled && 'ds-button-feedback-icon'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <span v-else-if="asyncStatus === 'error'" :class="isStyled && 'ds-button-feedback-icon'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </span>
    <span :class="[isStyled && 'ds-button-content', isStyled && isLoading && 'ds-button-content--hidden']">
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
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0px;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    height: 2.25rem;
    padding: 0.5rem 1rem;
    background-color: var(--ds-primary, #030213);
    color: var(--ds-primary-foreground, #ffffff);
    border: 1px solid transparent;
    outline: none;
    cursor: pointer;
    flex-shrink: 0;
    overflow: visible;
    box-sizing: border-box;
    transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
                transform 100ms cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1),
                border-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    font-family: inherit;
  }

  .ds-button:hover:not(:disabled) {
    background: rgba(3, 2, 19, 0.85);
  }

  .ds-button:active:not(:disabled) {
    transform: scale(0.98);
    background: rgba(3, 2, 19, 0.75);
  }

  .ds-button:focus-visible {
    border-color: var(--ds-ring, #a8a8a8);
    box-shadow: 0 0 0 3px var(--ds-ring-color, rgba(168, 168, 168, 0.5));
  }

  .ds-button--disabled,
  .ds-button:disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Async feedback states */
  .ds-button--async-success {
    background-color: #16a34a !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }

  .ds-button--async-success:hover:not(:disabled) {
    background-color: #15803d !important;
  }

  .ds-button--async-success:active:not(:disabled) {
    background-color: #166534 !important;
    transform: scale(0.98);
  }

  .ds-button--async-error {
    background-color: #9f403d !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }

  .ds-button--async-error:hover:not(:disabled) {
    background-color: #8b3230 !important;
  }

  .ds-button--async-error:active:not(:disabled) {
    background-color: #7a2b29 !important;
    transform: scale(0.98);
  }

  /* Secondary (outline) */
  .ds-button--secondary {
    background: var(--ds-background, #fff);
    color: var(--ds-foreground, #1a1a1a);
    border: 1px solid var(--ds-border, rgba(0, 0, 0, 0.1));
  }

  .ds-button--secondary:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-button--secondary:active:not(:disabled) {
    transform: scale(0.98);
    background: color-mix(in srgb, var(--ds-accent, #e9ebef) 80%, #000 20%);
  }

  /* Ghost */
  .ds-button--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-button--ghost:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-button--ghost:active:not(:disabled) {
    transform: scale(0.98);
    background: color-mix(in srgb, var(--ds-accent, #e9ebef) 80%, #000 20%);
  }

  /* Tertiary — kept for backward compat, maps to ghost behavior */
  .ds-button--tertiary {
    background: transparent;
    border-color: transparent;
    color: var(--ds-foreground, #1a1a1a);
  }

  .ds-button--tertiary:hover:not(:disabled) {
    background: var(--ds-accent, #e9ebef);
  }

  .ds-button--tertiary:active:not(:disabled) {
    transform: scale(0.98);
    background: color-mix(in srgb, var(--ds-accent, #e9ebef) 80%, #000 20%);
  }

  /* Destructive */
  .ds-button--destructive {
    background: var(--ds-destructive, #d4183d);
    color: var(--ds-destructive-foreground, #fff);
  }

  .ds-button--destructive:hover:not(:disabled) {
    background: rgba(212, 24, 61, 0.85);
  }

  .ds-button--destructive:active:not(:disabled) {
    transform: scale(0.98);
    background: rgba(212, 24, 61, 0.75);
  }

  /* Size sm */
  .ds-button--sm {
    height: 2rem;
    padding: 0 0.75rem;
    gap: 0.375rem;
  }

  /* Size lg */
  .ds-button--lg {
    height: 2.5rem;
    padding: 0 1.5rem;
  }

  /* Size icon */
  .ds-button--icon {
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
  }

  .ds-button-spinner {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ds-button-feedback-icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ds-button-feedback-icon svg {
    width: 16px;
    height: 16px;
  }

  .ds-button-content {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 150ms ease;
  }

  .ds-button-content--hidden {
    visibility: hidden;
  }
</style>
