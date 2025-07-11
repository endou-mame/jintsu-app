<template>
  <div class="container">
    <div class="header">
      <h1>病院情報</h1>
      <NuxtLink to="/" class="back-link">← タイマーに戻る</NuxtLink>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>
    
    <div v-else-if="error" class="error">
      エラー: {{ error }}
    </div>
    
    <div v-else class="content">
      <div class="add-hospital-section">
        <h2>新しい病院を登録</h2>
        <form @submit.prevent="handleSubmit" class="hospital-form">
          <div class="form-group">
            <label for="name">病院名 *</label>
            <input 
              id="name"
              v-model="form.name" 
              type="text" 
              required
              placeholder="〇〇産婦人科"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">電話番号 *</label>
            <input 
              id="phone"
              v-model="form.phoneNumber" 
              type="tel" 
              required
              placeholder="03-1234-5678"
            />
          </div>
          
          <div class="form-group">
            <label for="address">住所</label>
            <input 
              id="address"
              v-model="form.address" 
              type="text"
              placeholder="東京都〇〇区..."
            />
          </div>
          
          <div class="form-group">
            <label for="notes">メモ</label>
            <textarea 
              id="notes"
              v-model="form.notes" 
              rows="3"
              placeholder="診察時間、担当医など"
            ></textarea>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input 
                v-model="form.isPrimary" 
                type="checkbox"
              />
              メインの病院として設定
            </label>
          </div>
          
          <button type="submit" class="submit-btn">登録</button>
        </form>
      </div>

      <div class="hospitals-list-section">
        <h2>登録済みの病院</h2>
        
        <div v-if="hospitals.length === 0" class="empty">
          まだ病院が登録されていません
        </div>
        
        <div v-else class="hospitals-grid">
          <div 
            v-for="hospital in hospitals" 
            :key="hospital.id"
            class="hospital-card"
            :class="{ primary: hospital.isPrimary }"
          >
            <div class="hospital-header">
              <h3>{{ hospital.name }}</h3>
              <span v-if="hospital.isPrimary" class="primary-badge">メイン</span>
            </div>
            
            <div class="hospital-info">
              <div class="info-row">
                <span class="label">電話:</span>
                <a :href="`tel:${hospital.phoneNumber}`" class="phone-link">
                  {{ hospital.phoneNumber }}
                </a>
              </div>
              
              <div v-if="hospital.address" class="info-row">
                <span class="label">住所:</span>
                <span>{{ hospital.address }}</span>
              </div>
              
              <div v-if="hospital.notes" class="info-row">
                <span class="label">メモ:</span>
                <span>{{ hospital.notes }}</span>
              </div>
            </div>
            
            <div class="hospital-actions">
              <button 
                @click="togglePrimary(hospital)"
                class="action-btn"
                :disabled="hospital.isPrimary"
              >
                {{ hospital.isPrimary ? 'メイン設定済み' : 'メインに設定' }}
              </button>
              
              <button 
                @click="handleDelete(hospital.id!)"
                class="action-btn delete-btn"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHospitals } from '~/composables/useHospitals'
import type { Hospital } from '~/types/schemas'

const { 
  hospitals, 
  loading, 
  error, 
  fetchHospitals, 
  createHospital,
  updateHospital,
  deleteHospital 
} = useHospitals()

const form = reactive({
  name: '',
  phoneNumber: '',
  address: '',
  notes: '',
  isPrimary: false
})

const resetForm = () => {
  form.name = ''
  form.phoneNumber = ''
  form.address = ''
  form.notes = ''
  form.isPrimary = false
}

const handleSubmit = async () => {
  try {
    await createHospital({
      name: form.name,
      phoneNumber: form.phoneNumber,
      address: form.address || undefined,
      notes: form.notes || undefined,
      isPrimary: form.isPrimary
    })
    resetForm()
  } catch (error) {
    console.error('Failed to create hospital:', error)
  }
}

const togglePrimary = async (hospital: Hospital) => {
  if (hospital.isPrimary) return
  
  try {
    await updateHospital(hospital.id!, { isPrimary: true })
  } catch (error) {
    console.error('Failed to update hospital:', error)
  }
}

const handleDelete = async (id: number) => {
  if (confirm('この病院情報を削除しますか？')) {
    try {
      await deleteHospital(id)
    } catch (error) {
      console.error('Failed to delete hospital:', error)
    }
  }
}

onMounted(() => {
  fetchHospitals()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #2196f3;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #f44336;
}

.content {
  display: grid;
  gap: 3rem;
}

.add-hospital-section,
.hospitals-list-section {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hospital-form {
  display: grid;
  gap: 1rem;
  max-width: 500px;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.submit-btn {
  padding: 0.75rem 2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #45a049;
}

.hospitals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.hospital-card {
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.hospital-card.primary {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.hospital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.hospital-header h3 {
  margin: 0;
  color: #333;
}

.primary-badge {
  background-color: #2196f3;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.hospital-info {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: bold;
  color: #666;
  min-width: 60px;
}

.phone-link {
  color: #2196f3;
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.hospital-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>