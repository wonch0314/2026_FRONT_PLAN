<script setup lang="ts">
import { ref, computed, watch, onMounted, useAttrs } from 'vue'

interface Props {
  modelValue?: string
  autoResize?: boolean
  minRows?: number
  maxRows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  autoResize: true,
  minRows: 3,
  maxRows: 10
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const adjustHeight = () => {
  if (!textareaRef.value || !props.autoResize) return

  const textarea = textareaRef.value
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
  const minHeight = lineHeight * props.minRows
  const maxHeight = lineHeight * props.maxRows

  textarea.style.height = 'auto'
  const scrollHeight = textarea.scrollHeight

  if (scrollHeight < minHeight) {
    textarea.style.height = `${minHeight}px`
  } else if (scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`
    textarea.style.overflowY = 'auto'
  } else {
    textarea.style.height = `${scrollHeight}px`
    textarea.style.overflowY = 'hidden'
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  adjustHeight()
}

watch(() => props.modelValue, () => {
  setTimeout(adjustHeight, 0)
})

onMounted(() => {
  adjustHeight()
})

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur()
})
</script>

<template>
  <textarea
    ref="textareaRef"
    class="ds-textarea"
    :value="modelValue"
    v-bind="attrs"
    @input="handleInput"
  />
</template>

<style>
.ds-textarea {
  width: 100%;
  resize: none;
}
</style>
