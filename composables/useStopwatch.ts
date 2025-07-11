import { ref, computed } from 'vue'

export const useStopwatch = () => {
  const startTime = ref<Date | null>(null)
  const endTime = ref<Date | null>(null)
  const elapsedTime = ref(0)
  const intervalId = ref<number | null>(null)
  const isRunning = computed(() => intervalId.value !== null)

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return [hours, minutes, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':')
  }

  const start = () => {
    if (isRunning.value) return
    
    startTime.value = new Date()
    endTime.value = null
    elapsedTime.value = 0
    
    intervalId.value = window.setInterval(() => {
      if (startTime.value) {
        elapsedTime.value = Math.floor(
          (Date.now() - startTime.value.getTime()) / 1000
        )
      }
    }, 100)
  }

  const stop = () => {
    if (!isRunning.value || !startTime.value) return
    
    endTime.value = new Date()
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    
    return {
      startTime: startTime.value,
      endTime: endTime.value,
      duration: elapsedTime.value
    }
  }

  const reset = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    startTime.value = null
    endTime.value = null
    elapsedTime.value = 0
  }

  return {
    startTime: computed(() => startTime.value),
    endTime: computed(() => endTime.value),
    elapsedTime: computed(() => elapsedTime.value),
    formattedTime: computed(() => formatTime(elapsedTime.value)),
    isRunning,
    start,
    stop,
    reset
  }
}