<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: { label: string; onClick: () => void }
  cancel?: { label: string; onClick: () => void }
}

interface Props {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-right',
  duration: 3000
})

const config = useDsConfig()
const toasts = ref<Toast[]>([])

const positionClasses = computed(() => {
  const positions: Record<string, string> = {
    'top-right': 'ds-toast-container--top-right',
    'top-left': 'ds-toast-container--top-left',
    'top-center': 'ds-toast-container--top-center',
    'bottom-right': 'ds-toast-container--bottom-right',
    'bottom-left': 'ds-toast-container--bottom-left',
    'bottom-center': 'ds-toast-container--bottom-center'
  }
  return positions[props.position]
})

const getIcon = (type: Toast['type']) => {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
  return icons[type]
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast: Toast = { ...toast, id }
  toasts.value.push(newToast)

  const duration = toast.duration ?? props.duration
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }

  return id
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

const success = (message: string, options?: Partial<Toast>) =>
  addToast({ type: 'success', message, ...options })

const error = (message: string, options?: Partial<Toast>) =>
  addToast({ type: 'error', message, ...options })

const warning = (message: string, options?: Partial<Toast>) =>
  addToast({ type: 'warning', message, ...options })

const info = (message: string, options?: Partial<Toast>) =>
  addToast({ type: 'info', message, ...options })

defineExpose({
  success,
  error,
  warning,
  info,
  addToast,
  removeToast
})
</script>

<template>
  <Teleport to="body">
    <div class="ds-toast-container" :class="positionClasses">
      <TransitionGroup name="ds-toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="ds-toast"
          :class="`ds-toast--${toast.type}`"
        >
          <span class="ds-toast-icon" v-html="getIcon(toast.type)" />
          <span class="ds-toast-message">{{ toast.message }}</span>
          <div v-if="toast.action || toast.cancel" class="ds-toast-actions">
            <button
              v-if="toast.action"
              type="button"
              class="ds-toast-action"
              @click="toast.action.onClick(); removeToast(toast.id)"
            >
              {{ toast.action.label }}
            </button>
            <button
              v-if="toast.cancel"
              type="button"
              class="ds-toast-cancel"
              @click="toast.cancel.onClick(); removeToast(toast.id)"
            >
              {{ toast.cancel.label }}
            </button>
          </div>
          <button
            type="button"
            class="ds-toast-close"
            @click="removeToast(toast.id)"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.ds-toast-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  pointer-events: none;
}

.ds-toast-container--top-right { top: 0; right: 0; }
.ds-toast-container--top-left { top: 0; left: 0; }
.ds-toast-container--top-center { top: 0; left: 50%; transform: translateX(-50%); }
.ds-toast-container--bottom-right { bottom: 0; right: 0; }
.ds-toast-container--bottom-left { bottom: 0; left: 0; }
.ds-toast-container--bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }

.ds-toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  pointer-events: auto;
  min-width: 300px;
  max-width: 420px;
}

.ds-toast--success { border-left: 4px solid #10b981; }
.ds-toast--error { border-left: 4px solid #ef4444; }
.ds-toast--warning { border-left: 4px solid #f59e0b; }
.ds-toast--info { border-left: 4px solid #3b82f6; }

.ds-toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.ds-toast--success .ds-toast-icon { color: #10b981; }
.ds-toast--error .ds-toast-icon { color: #ef4444; }
.ds-toast--warning .ds-toast-icon { color: #f59e0b; }
.ds-toast--info .ds-toast-icon { color: #3b82f6; }

.ds-toast-message {
  flex: 1;
}

.ds-toast-actions {
  display: flex;
  gap: 0.5rem;
}

.ds-toast-action,
.ds-toast-cancel {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.ds-toast-action {
  color: #3b82f6;
  font-weight: 500;
}

.ds-toast-cancel {
  color: #6b7280;
}

.ds-toast-close {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.ds-toast-close:hover {
  opacity: 1;
}

.ds-toast-close svg {
  width: 16px;
  height: 16px;
}

/* Transitions */
.ds-toast-enter-active,
.ds-toast-leave-active {
  transition: all 0.3s ease;
}

.ds-toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.ds-toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
