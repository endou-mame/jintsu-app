import { ref } from 'vue'
import type { Contraction, CreateContraction, UpdateContraction } from '~/types/schemas'

export const useContractions = () => {
  const contractions = ref<Contraction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchContractions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Contraction[]>('http://localhost:3001/api/contractions')
      contractions.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '陣痛記録の取得に失敗しました'
    } finally {
      loading.value = false
    }
  }

  const createContraction = async (data: CreateContraction) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Contraction>('http://localhost:3001/api/contractions', {
        method: 'POST',
        body: data
      })
      contractions.value.unshift(response)
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '陣痛記録の作成に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateContraction = async (id: number, data: UpdateContraction) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Contraction>(`http://localhost:3001/api/contractions/${id}`, {
        method: 'PUT',
        body: data
      })
      const index = contractions.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contractions.value[index] = response
      }
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '陣痛記録の更新に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteContraction = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`http://localhost:3001/api/contractions/${id}`, {
        method: 'DELETE'
      })
      contractions.value = contractions.value.filter(c => c.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '陣痛記録の削除に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getIntervals = () => {
    const sorted = [...contractions.value].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    
    const intervals: { minutes: number; from: Date; to: Date }[] = []
    
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = sorted[i - 1].endTime
      const currentStart = sorted[i].startTime
      
      if (prevEnd) {
        const minutes = Math.floor(
          (new Date(currentStart).getTime() - new Date(prevEnd).getTime()) / 1000 / 60
        )
        intervals.push({
          minutes,
          from: new Date(prevEnd),
          to: new Date(currentStart)
        })
      }
    }
    
    return intervals
  }

  const getLatestInterval = () => {
    const intervals = getIntervals()
    return intervals.length > 0 ? intervals[intervals.length - 1] : null
  }

  return {
    contractions: computed(() => contractions.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchContractions,
    createContraction,
    updateContraction,
    deleteContraction,
    getIntervals,
    getLatestInterval
  }
}