<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeValue = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  const sizes = { sm: '16px', md: '24px', lg: '32px' }
  return sizes[props.size]
})
</script>

<template>
  <span
    class="ds-spinner"
    :style="{ width: sizeValue, height: sizeValue }"
    role="status"
    aria-label="Loading"
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        class="ds-spinner-track"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        stroke-width="3"
        opacity="0.25"
      />
      <path
        class="ds-spinner-head"
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<style>
.ds-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ds-spinner svg {
  width: 100%;
  height: 100%;
  animation: ds-spin 1s linear infinite;
}

@keyframes ds-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
