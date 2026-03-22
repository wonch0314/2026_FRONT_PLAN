<script setup lang="ts">
import { ref, computed } from 'vue'
import DsModal from './DsModal.vue'
import DsButton from './DsButton.vue'
import { useDsConfig } from '../plugin'

interface Props {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
  icon?: object
}

const props = withDefaults(defineProps<Props>(), {
  title: '확인',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  type: 'info'
})

const config = useDsConfig()
const isOpen = ref(false)
const resolvePromise = ref<((value: boolean) => void) | null>(null)

const IconComponent = computed(() => props.icon || config.icons?.check)

const typeColors = {
  info: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444'
}

const open = (): Promise<boolean> => {
  isOpen.value = true
  return new Promise((resolve) => {
    resolvePromise.value = resolve
  })
}

const confirm = () => {
  isOpen.value = false
  resolvePromise.value?.(true)
  resolvePromise.value = null
}

const cancel = () => {
  isOpen.value = false
  resolvePromise.value?.(false)
  resolvePromise.value = null
}

defineExpose({ open, confirm, cancel })
</script>

<template>
  <DsModal
    v-model="isOpen"
    class="ds-confirm"
    :close-on-overlay="false"
    :close-on-esc="true"
    :show-close="false"
    @close="cancel"
  >
    <template #header>
      <div class="ds-confirm-header">
        <span
          v-if="IconComponent || type"
          class="ds-confirm-icon"
          :style="{ color: typeColors[type] }"
        >
          <component v-if="IconComponent" :is="IconComponent" />
          <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg v-else-if="type === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </span>
        <span class="ds-confirm-title">{{ title }}</span>
      </div>
    </template>

    <template #default>
      <div class="ds-confirm-message">
        <slot>{{ message }}</slot>
      </div>
    </template>

    <template #footer>
      <div class="ds-confirm-footer">
        <DsButton
          class="ds-confirm-cancel"
          @click="cancel"
        >
          {{ cancelText }}
        </DsButton>
        <DsButton
          class="ds-confirm-ok"
          :class="`ds-confirm-ok--${type}`"
          @click="confirm"
        >
          {{ confirmText }}
        </DsButton>
      </div>
    </template>
  </DsModal>
</template>

<style>
.ds-confirm .ds-modal {
  max-width: 400px;
}

.ds-confirm-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ds-confirm-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.ds-confirm-icon svg {
  width: 100%;
  height: 100%;
}

.ds-confirm-title {
  font-weight: 600;
  font-size: 1.125rem;
}

.ds-confirm-message {
  color: #6b7280;
  line-height: 1.5;
}

.ds-confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.ds-confirm-cancel {
  background: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.ds-confirm-ok {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
}

.ds-confirm-ok--info {
  background: #3b82f6;
}

.ds-confirm-ok--warning {
  background: #f59e0b;
}

.ds-confirm-ok--danger {
  background: #ef4444;
}
</style>
