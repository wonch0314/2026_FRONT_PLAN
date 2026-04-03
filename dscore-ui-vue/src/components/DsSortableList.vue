<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDsConfig } from '../plugin'

interface Props {
  modelValue?: any[]
  itemKey?: string
  direction?: 'vertical' | 'horizontal'
  handle?: boolean
  disabled?: boolean
  applyDefaultStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  itemKey: 'id',
  direction: 'vertical',
  handle: false,
  disabled: false,
  applyDefaultStyle: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  'sort-end': [payload: { oldIndex: number; newIndex: number }]
}>()

const config = useDsConfig()
const isStyled = computed(() => props.applyDefaultStyle !== false && config.applyDefaultStyle !== false)

const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

const getKey = (item: any, index: number): string | number => {
  if (typeof item === 'object' && item !== null && props.itemKey in item) {
    return item[props.itemKey]
  }
  return index
}

const handleDragStart = (e: DragEvent, index: number) => {
  if (props.disabled) return
  dragIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

const handleDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (props.disabled) return
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dropIndex.value = index
}

const handleDragLeave = () => {
  dropIndex.value = null
}

const handleDrop = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (props.disabled || dragIndex.value === null) return

  const from = dragIndex.value
  const to = index

  if (from !== to) {
    const items = [...props.modelValue]
    const [moved] = items.splice(from, 1)
    items.splice(to, 0, moved)
    emit('update:modelValue', items)
    emit('sort-end', { oldIndex: from, newIndex: to })
  }

  dragIndex.value = null
  dropIndex.value = null
}

const handleDragEnd = () => {
  dragIndex.value = null
  dropIndex.value = null
}
</script>

<template>
  <div
    :class="[
      isStyled && 'ds-sortable-list',
      isStyled && `ds-sortable-list--${direction}`,
      isStyled && disabled && 'ds-sortable-list--disabled'
    ]"
  >
    <div
      v-for="(item, index) in modelValue"
      :key="getKey(item, index)"
      :class="[
        isStyled && 'ds-sortable-list__item',
        isStyled && dragIndex === index && 'ds-sortable-list__item--dragging',
        isStyled && dropIndex === index && dragIndex !== index && 'ds-sortable-list__item--drop-target'
      ]"
      :draggable="!disabled && !handle"
      @dragstart="handleDragStart($event, index)"
      @dragover="handleDragOver($event, index)"
      @dragleave="handleDragLeave"
      @drop="handleDrop($event, index)"
      @dragend="handleDragEnd"
    >
      <div
        v-if="handle"
        :class="isStyled && 'ds-sortable-list__handle'"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>
      <div :class="isStyled && 'ds-sortable-list__content'">
        <slot name="item" :item="item" :index="index">
          {{ typeof item === 'object' ? JSON.stringify(item) : item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
  .ds-sortable-list {
    display: flex;
    gap: 0;
    font-family: var(--ds-font-family, inherit);
  }

  .ds-sortable-list--vertical {
    flex-direction: column;
  }

  .ds-sortable-list--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .ds-sortable-list--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .ds-sortable-list__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    background: var(--ds-background, #fff);
    border: 1px solid var(--ds-border, rgba(0,0,0,0.1));
    border-radius: 0.375rem;
    margin-bottom: -1px;
    cursor: grab;
    transition: background 150ms cubic-bezier(0.4,0,0.2,1),
                box-shadow 150ms cubic-bezier(0.4,0,0.2,1);
    user-select: none;
    font-size: 0.875rem;
  }

  .ds-sortable-list__item:first-child {
    border-radius: 0.375rem 0.375rem 0 0;
  }

  .ds-sortable-list__item:last-child {
    border-radius: 0 0 0.375rem 0.375rem;
    margin-bottom: 0;
  }

  .ds-sortable-list__item:only-child {
    border-radius: 0.375rem;
  }

  .ds-sortable-list--horizontal .ds-sortable-list__item {
    margin-bottom: 0;
    margin-right: -1px;
    border-radius: 0.375rem;
  }

  .ds-sortable-list__item:active {
    cursor: grabbing;
  }

  .ds-sortable-list__item--dragging {
    opacity: 0.4;
    background: var(--ds-accent, #e9ebef);
  }

  .ds-sortable-list__item--drop-target {
    border-color: var(--ds-primary, #030213);
    box-shadow: 0 0 0 1px var(--ds-primary, #030213);
    background: color-mix(in srgb, var(--ds-primary, #030213) 5%, transparent);
  }

  .ds-sortable-list__handle {
    display: flex;
    align-items: center;
    cursor: grab;
    color: var(--ds-muted-foreground, #717182);
    flex-shrink: 0;
    padding: 0.125rem;
  }

  .ds-sortable-list__handle:active {
    cursor: grabbing;
  }

  .ds-sortable-list__content {
    flex: 1;
    min-width: 0;
  }
</style>
