import { ref, watch, onMounted, type Ref } from 'vue'

export interface UseDraftSaveOptions<T extends Record<string, any>> {
  key: string
  data: Ref<T>
  storage?: 'local' | 'session'
  debounce?: number
  autoLoad?: boolean
}

export function useDraftSave<T extends Record<string, any>>(
  options: UseDraftSaveOptions<T>
): {
  hasDraft: Ref<boolean>
  lastSaved: Ref<Date | null>
  save: () => void
  load: () => T | null
  clear: () => void
} {
  const { key, data, storage = 'local', debounce: debounceMs = 1000, autoLoad = true } = options

  const store = storage === 'local' ? localStorage : sessionStorage
  const storageKey = `ds-draft:${key}`

  const hasDraft = ref(false)
  const lastSaved = ref<Date | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const save = () => {
    try {
      const payload = {
        data: JSON.parse(JSON.stringify(data.value)),
        savedAt: new Date().toISOString(),
      }
      store.setItem(storageKey, JSON.stringify(payload))
      hasDraft.value = true
      lastSaved.value = new Date()
    } catch {
      // storage full or serialization error
    }
  }

  const load = (): T | null => {
    try {
      const raw = store.getItem(storageKey)
      if (!raw) return null
      const payload = JSON.parse(raw)
      if (payload?.data) {
        hasDraft.value = true
        lastSaved.value = payload.savedAt ? new Date(payload.savedAt) : null
        return payload.data as T
      }
      return null
    } catch {
      return null
    }
  }

  const clear = () => {
    store.removeItem(storageKey)
    hasDraft.value = false
    lastSaved.value = null
  }

  // Auto-save on data change
  watch(
    data,
    () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(save, debounceMs)
    },
    { deep: true }
  )

  // Auto-load on mount
  onMounted(() => {
    const existing = load()
    if (autoLoad && existing) {
      Object.assign(data.value, existing)
    }
  })

  // Check if draft exists
  onMounted(() => {
    hasDraft.value = store.getItem(storageKey) !== null
  })

  return { hasDraft, lastSaved, save, load, clear }
}
