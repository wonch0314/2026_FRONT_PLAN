<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: boolean
  closeIcon?: object
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  showClose?: boolean
  confirmBeforeClose?: boolean
  confirmMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  closeOnOverlay: undefined,
  closeOnEsc: undefined,
  showClose: true,
  confirmBeforeClose: false,
  confirmMessage: '변경사항이 있습니다. 닫으시겠습니까?'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}>()

const config = useDsConfig()

const modalRef = ref<HTMLElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const effectiveCloseOnOverlay = computed(() =>
  props.closeOnOverlay ?? config.defaults?.modal?.closeOnOverlay ?? true
)

const effectiveCloseOnEsc = computed(() =>
  props.closeOnEsc ?? config.defaults?.modal?.closeOnEsc ?? true
)

const CloseIconComponent = computed(() =>
  props.closeIcon || config.icons?.close
)

const tryClose = async () => {
  if (props.confirmBeforeClose) {
    const confirmed = window.confirm(props.confirmMessage)
    if (!confirmed) return
  }
  close()
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget && effectiveCloseOnOverlay.value) {
    tryClose()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && effectiveCloseOnEsc.value) {
    tryClose()
  }

  // Focus trap
  if (event.key === 'Tab' && modalRef.value) {
    const focusableElements = modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement?.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement?.focus()
    }
  }
}

watch(isOpen, async (newValue) => {
  if (newValue) {
    previousActiveElement.value = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    emit('open')
    await nextTick()
    modalRef.value?.focus()
  } else {
    document.body.style.overflow = ''
    previousActiveElement.value?.focus()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

defineExpose({ close, tryClose })
</script>

<template>
  <Teleport to="body">
    <Transition name="ds-modal">
      <div
        v-if="isOpen"
        class="ds-modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          ref="modalRef"
          class="ds-modal"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <div v-if="$slots.header || showClose" class="ds-modal-header">
            <slot name="header" />
            <button
              v-if="showClose"
              type="button"
              class="ds-modal-close"
              @click="tryClose"
              aria-label="Close"
            >
              <component v-if="CloseIconComponent" :is="CloseIconComponent" />
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="ds-modal-content">
            <slot />
          </div>

          <div v-if="$slots.footer" class="ds-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.ds-modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.ds-modal {
  position: relative;
  background: white;
  max-height: 90vh;
  overflow: auto;
  outline: none;
}

.ds-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ds-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-modal-close svg {
  width: 20px;
  height: 20px;
}

.ds-modal-content {
  flex: 1;
}

.ds-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Transitions */
.ds-modal-enter-active,
.ds-modal-leave-active {
  transition: opacity 0.2s ease;
}

.ds-modal-enter-from,
.ds-modal-leave-to {
  opacity: 0;
}

.ds-modal-enter-active .ds-modal,
.ds-modal-leave-active .ds-modal {
  transition: transform 0.2s ease;
}

.ds-modal-enter-from .ds-modal,
.ds-modal-leave-to .ds-modal {
  transform: scale(0.95);
}
</style>
