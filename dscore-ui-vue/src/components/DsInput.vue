<script setup lang="ts">
import { ref, computed, watch, useAttrs, onMounted, onUnmounted } from 'vue'
import { useDsConfig } from '../plugin'

type ValidationRule = (value: string) => string | boolean

interface Props {
  modelValue?: string
  debounce?: number
  rules?: ValidationRule[]
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  debounce: undefined,
  rules: () => [],
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validate': [isValid: boolean, error: string]
}>()

const attrs = useAttrs()
const config = useDsConfig()

const internalValue = ref(props.modelValue)
const internalError = ref('')
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const effectiveDebounce = computed(() =>
  props.debounce ?? config.defaults?.input?.debounce ?? 0
)

const displayError = computed(() => props.error || internalError.value)
const hasError = computed(() => !!displayError.value)

const validate = (value: string): boolean => {
  for (const rule of props.rules) {
    const result = rule(value)
    if (typeof result === 'string') {
      internalError.value = result
      emit('validate', false, result)
      return false
    }
    if (result === false) {
      internalError.value = 'Invalid value'
      emit('validate', false, 'Invalid value')
      return false
    }
  }
  internalError.value = ''
  emit('validate', true, '')
  return true
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  internalValue.value = value

  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  if (effectiveDebounce.value > 0) {
    debounceTimer.value = setTimeout(() => {
      emit('update:modelValue', value)
      if (props.rules.length > 0) {
        validate(value)
      }
    }, effectiveDebounce.value)
  } else {
    emit('update:modelValue', value)
    if (props.rules.length > 0) {
      validate(value)
    }
  }
}

const handleBlur = () => {
  if (props.rules.length > 0) {
    validate(internalValue.value)
  }
}

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

defineExpose({
  validate: () => validate(internalValue.value),
  focus: () => {
    const input = document.querySelector('.ds-input') as HTMLInputElement
    input?.focus()
  }
})
</script>

<template>
  <div class="ds-input-wrapper" :class="{ 'ds-input-wrapper--error': hasError }">
    <input
      class="ds-input"
      :value="internalValue"
      v-bind="attrs"
      @input="handleInput"
      @blur="handleBlur"
    />
    <span v-if="hasError" class="ds-input-error">{{ displayError }}</span>
  </div>
</template>

<style>
.ds-input-wrapper {
  display: flex;
  flex-direction: column;
}

.ds-input {
  width: 100%;
}

.ds-input-error {
  font-size: 0.875em;
  color: #ef4444;
  margin-top: 0.25em;
}
</style>
