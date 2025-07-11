import { ref } from 'vue'
import type { Hospital, CreateHospital, UpdateHospital } from '~/types/schemas'

export const useHospitals = () => {
  const hospitals = ref<Hospital[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchHospitals = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Hospital[]>('http://localhost:3001/api/hospitals')
      hospitals.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '病院情報の取得に失敗しました'
    } finally {
      loading.value = false
    }
  }

  const createHospital = async (data: CreateHospital) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Hospital>('http://localhost:3001/api/hospitals', {
        method: 'POST',
        body: data
      })
      hospitals.value.push(response)
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '病院情報の作成に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateHospital = async (id: number, data: UpdateHospital) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Hospital>(`http://localhost:3001/api/hospitals/${id}`, {
        method: 'PUT',
        body: data
      })
      const index = hospitals.value.findIndex(h => h.id === id)
      if (index !== -1) {
        hospitals.value[index] = response
      }
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '病院情報の更新に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteHospital = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`http://localhost:3001/api/hospitals/${id}`, {
        method: 'DELETE'
      })
      hospitals.value = hospitals.value.filter(h => h.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '病院情報の削除に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getPrimaryHospital = () => {
    return hospitals.value.find(h => h.isPrimary) || null
  }

  return {
    hospitals: computed(() => hospitals.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchHospitals,
    createHospital,
    updateHospital,
    deleteHospital,
    getPrimaryHospital
  }
}