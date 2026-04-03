import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseInfiniteScrollOptions {
  target: Ref<HTMLElement | null>
  threshold?: number
  rootMargin?: string
  enabled?: Ref<boolean>
}

export function useInfiniteScroll(
  options: UseInfiniteScrollOptions,
  callback: () => void | Promise<void>
): {
  isLoading: Ref<boolean>
  sentinelRef: Ref<HTMLElement | null>
  reset: () => void
} {
  const { target, threshold = 0.1, rootMargin = '0px 0px 200px 0px', enabled } = options

  const isLoading = ref(false)
  const sentinelRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    if (!entry?.isIntersecting) return
    if (isLoading.value) return
    if (enabled && !enabled.value) return

    isLoading.value = true
    try {
      await callback()
    } finally {
      isLoading.value = false
    }
  }

  const setupObserver = () => {
    cleanup()
    const el = sentinelRef.value
    if (!el) return

    observer = new IntersectionObserver(handleIntersect, {
      root: target.value,
      threshold,
      rootMargin,
    })
    observer.observe(el)
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const reset = () => {
    isLoading.value = false
    setupObserver()
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  return { isLoading, sentinelRef, reset }
}
