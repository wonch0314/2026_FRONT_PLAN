<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

interface Option {
  value: string | number
  label: string
  icon?: object
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  options?: Option[]
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: '선택하세요',
  searchable: false,
  clearable: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
}>()

const config = useDsConfig()

const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const selectRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query)
  )
})

const selectedOption = computed(() =>
  props.options.find(opt => opt.value === props.modelValue)
)

const displayValue = computed(() =>
  selectedOption.value?.label || ''
)

const ArrowIcon = computed(() => config.icons?.arrow)

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = filteredOptions.value.findIndex(
    opt => opt.value === props.modelValue
  )
  if (highlightedIndex.value === -1) highlightedIndex.value = 0
}

const close = () => {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
}

const toggle = () => {
  isOpen.value ? close() : open()
}

const select = (option: Option) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
}

const clear = (event: Event) => {
  event.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      open()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        select(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="selectRef"
    class="ds-select"
    :class="{
      'ds-select--open': isOpen,
      'ds-select--disabled': disabled,
      'ds-select--clearable': clearable && modelValue != null
    }"
    @keydown="handleKeydown"
  >
    <div
      class="ds-select-trigger"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span v-if="selectedOption" class="ds-select-value">
        {{ displayValue }}
      </span>
      <span v-else class="ds-select-placeholder">
        {{ placeholder }}
      </span>

      <button
        v-if="clearable && modelValue != null"
        type="button"
        class="ds-select-clear"
        @click="clear"
        aria-label="Clear"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <span class="ds-select-arrow">
        <component v-if="ArrowIcon" :is="ArrowIcon" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>

    <Transition name="ds-select-dropdown">
      <div v-if="isOpen" class="ds-select-dropdown">
        <input
          v-if="searchable"
          v-model="searchQuery"
          class="ds-select-search"
          type="text"
          placeholder="검색..."
          @click.stop
        />

        <div class="ds-select-options">
          <div
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            class="ds-select-option"
            :class="[
              `ds-select-option-${option.value}`,
              {
                'ds-select-option--selected': option.value === modelValue,
                'ds-select-option--highlighted': index === highlightedIndex,
                'ds-select-option--disabled': option.disabled
              }
            ]"
            @click="select(option)"
            @mouseenter="highlightedIndex = index"
          >
            <slot name="option" :option="option" :selected="option.value === modelValue" :highlighted="index === highlightedIndex">
              <component v-if="option.icon" :is="option.icon" class="ds-select-option-icon" />
              <div class="ds-select-option-content">
                <span class="ds-select-option-label">{{ option.label }}</span>
                <span v-if="option.description" class="ds-select-option-description">
                  {{ option.description }}
                </span>
              </div>
            </slot>
          </div>

          <div v-if="filteredOptions.length === 0" class="ds-select-empty">
            검색 결과가 없습니다
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.ds-select {
  position: relative;
  display: inline-block;
}

.ds-select--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.ds-select-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.ds-select-value {
  flex: 1;
}

.ds-select-placeholder {
  flex: 1;
  opacity: 0.5;
}

.ds-select-clear,
.ds-select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-select-clear {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.ds-select-clear svg,
.ds-select-arrow svg {
  width: 16px;
  height: 16px;
}

.ds-select-arrow {
  transition: transform 0.2s;
}

.ds-select--open .ds-select-arrow {
  transform: rotate(180deg);
}

.ds-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.ds-select-search {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  outline: none;
}

.ds-select-options {
  max-height: 200px;
  overflow-y: auto;
}

.ds-select-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
}

.ds-select-option--highlighted {
  background-color: #f3f4f6;
}

.ds-select-option--selected {
  background-color: #eff6ff;
}

.ds-select-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-select-option-content {
  display: flex;
  flex-direction: column;
}

.ds-select-option-description {
  font-size: 0.875em;
  opacity: 0.7;
}

.ds-select-empty {
  padding: 1rem;
  text-align: center;
  color: #9ca3af;
}

/* Transitions */
.ds-select-dropdown-enter-active,
.ds-select-dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.ds-select-dropdown-enter-from,
.ds-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
