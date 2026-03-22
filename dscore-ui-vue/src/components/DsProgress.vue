<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  showLabel: false,
  size: 'md',
  striped: false,
  animated: false
})

const percentage = computed(() => {
  const pct = (props.value / props.max) * 100
  return Math.min(100, Math.max(0, pct))
})
</script>

<template>
  <div
    class="ds-progress"
    :class="[
      `ds-progress--${size}`,
      { 'ds-progress--striped': striped, 'ds-progress--animated': animated }
    ]"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
  >
    <div
      class="ds-progress-bar"
      :style="{ width: `${percentage}%` }"
    >
      <span v-if="showLabel" class="ds-progress-label">
        {{ Math.round(percentage) }}%
      </span>
    </div>
  </div>
</template>

<style>
.ds-progress {
  width: 100%;
  background: var(--ds-progress-track-bg, #e5e7eb);
  border-radius: 999px;
  overflow: hidden;
}

.ds-progress--sm { height: 4px; }
.ds-progress--md { height: 8px; }
.ds-progress--lg { height: 12px; }

.ds-progress-bar {
  height: 100%;
  background: var(--ds-progress-bar-bg, #3b82f6);
  border-radius: 999px;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-progress--striped .ds-progress-bar {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.ds-progress--animated .ds-progress-bar {
  animation: ds-progress-stripes 1s linear infinite;
}

@keyframes ds-progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}

.ds-progress-label {
  font-size: 0.625rem;
  color: white;
  font-weight: 500;
}
</style>
