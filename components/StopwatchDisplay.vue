<template>
  <div class="stopwatch">
    <div class="time-display" :class="{ running: isRunning }">
      {{ formattedTime }}
    </div>
    
    <div class="interval-warning" v-if="latestInterval">
      <p>前回からの間隔: <span :class="intervalClass">{{ latestInterval.minutes }}分</span></p>
      <div v-if="latestInterval.minutes <= 10" class="warning-box">
        <p class="warning-text">
          🚨 10分間隔になりました。病院に連絡することをお勧めします。
        </p>
        <button 
          v-if="primaryHospital"
          @click="callHospital"
          class="btn btn-call"
        >
          📞 {{ primaryHospital.name }}に電話
        </button>
      </div>
    </div>
    
    <div class="controls">
      <button 
        v-if="!isRunning" 
        @click="handleStart"
        class="btn btn-start"
      >
        開始
      </button>
      
      <button 
        v-else 
        @click="handleStop"
        class="btn btn-stop"
      >
        停止
      </button>
      
      <button 
        @click="reset"
        class="btn btn-reset"
        :disabled="!startTime"
      >
        リセット
      </button>
    </div>
    
    <div v-if="currentContraction" class="current-info">
      <p>開始時刻: {{ formatDateTime(startTime) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStopwatch } from '~/composables/useStopwatch'
import { useContractions } from '~/composables/useContractions'
import { useHospitals } from '~/composables/useHospitals'

const { 
  startTime, 
  formattedTime, 
  isRunning, 
  start, 
  stop, 
  reset 
} = useStopwatch()

const { 
  createContraction, 
  updateContraction, 
  getLatestInterval 
} = useContractions()

const {
  hospitals,
  fetchHospitals,
  getPrimaryHospital
} = useHospitals()

const currentContraction = ref<{ id: number } | null>(null)
const latestInterval = computed(() => getLatestInterval())
const primaryHospital = computed(() => getPrimaryHospital())

onMounted(() => {
  fetchHospitals()
})

const intervalClass = computed(() => {
  if (!latestInterval.value) return ''
  const minutes = latestInterval.value.minutes
  if (minutes <= 5) return 'interval-critical'
  if (minutes <= 10) return 'interval-warning'
  return 'interval-normal'
})

const formatDateTime = (date: Date | null) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const handleStart = async () => {
  start()
  try {
    const contraction = await createContraction({
      startTime: new Date().toISOString()
    })
    currentContraction.value = { id: contraction.id! }
  } catch (error) {
    console.error('Failed to create contraction:', error)
    stop()
  }
}

const handleStop = async () => {
  const result = stop()
  if (result && currentContraction.value) {
    try {
      await updateContraction(currentContraction.value.id, {
        endTime: result.endTime.toISOString()
      })
      currentContraction.value = null
    } catch (error) {
      console.error('Failed to update contraction:', error)
    }
  }
}

const callHospital = () => {
  if (primaryHospital.value) {
    window.location.href = `tel:${primaryHospital.value.phoneNumber}`
  }
}
</script>

<style scoped>
.stopwatch {
  text-align: center;
  padding: 2rem;
}

.time-display {
  font-size: 4rem;
  font-weight: bold;
  font-family: monospace;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.time-display.running {
  background-color: #ffebee;
  color: #c62828;
}

.interval-warning {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #fff3cd;
  border-radius: 0.5rem;
}

.interval-critical {
  color: #d32f2f;
  font-weight: bold;
}

.interval-warning {
  color: #f57c00;
  font-weight: bold;
}

.interval-normal {
  color: #388e3c;
}

.warning-box {
  margin-top: 0.5rem;
}

.warning-text {
  color: #d32f2f;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.btn-call {
  background-color: #2196f3;
  color: white;
}

.btn-call:hover:not(:disabled) {
  background-color: #1976d2;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start {
  background-color: #4caf50;
  color: white;
}

.btn-start:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-stop {
  background-color: #f44336;
  color: white;
}

.btn-stop:hover:not(:disabled) {
  background-color: #da190b;
}

.btn-reset {
  background-color: #9e9e9e;
  color: white;
}

.btn-reset:hover:not(:disabled) {
  background-color: #757575;
}

.current-info {
  margin-top: 1rem;
  color: #666;
}
</style>