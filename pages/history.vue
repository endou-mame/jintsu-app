<template>
  <div class="container">
    <div class="header">
      <h1>陣痛履歴</h1>
      <NuxtLink to="/" class="back-link">← タイマーに戻る</NuxtLink>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>
    
    <div v-else-if="error" class="error">
      エラー: {{ error }}
    </div>
    
    <div v-else-if="contractions.length === 0" class="empty">
      まだ記録がありません
    </div>
    
    <div v-else class="content">
      <div class="chart-section">
        <h2>陣痛間隔グラフ</h2>
        <ContractionChart :contractions="contractions" />
      </div>

      <div class="intervals-section">
        <h2>陣痛間隔</h2>
        <div class="intervals-list">
          <div 
            v-for="(interval, index) in intervals" 
            :key="index"
            class="interval-item"
            :class="getIntervalClass(interval.minutes)"
          >
            <div class="interval-time">
              <span class="interval-value">{{ interval.minutes }}</span>
              <span class="interval-unit">分</span>
            </div>
            <div class="interval-detail">
              {{ formatTime(interval.from) }} → {{ formatTime(interval.to) }}
            </div>
          </div>
        </div>
      </div>

      <div class="records-section">
        <h2>記録一覧</h2>
        <table class="records-table">
          <thead>
            <tr>
              <th>開始時刻</th>
              <th>終了時刻</th>
              <th>継続時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contraction in contractions" :key="contraction.id">
              <td>{{ formatDateTime(contraction.startTime) }}</td>
              <td>{{ contraction.endTime ? formatDateTime(contraction.endTime) : '記録中...' }}</td>
              <td>{{ contraction.durationSeconds ? formatDuration(contraction.durationSeconds) : '-' }}</td>
              <td>
                <button 
                  @click="handleDelete(contraction.id!)"
                  class="delete-btn"
                >
                  削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContractions } from '~/composables/useContractions'

const { 
  contractions, 
  loading, 
  error, 
  fetchContractions, 
  deleteContraction,
  getIntervals 
} = useContractions()

const intervals = computed(() => getIntervals())

const getIntervalClass = (minutes: number) => {
  if (minutes <= 5) return 'critical'
  if (minutes <= 10) return 'warning'
  return 'normal'
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}分${secs}秒`
}

const handleDelete = async (id: number) => {
  if (confirm('この記録を削除しますか？')) {
    try {
      await deleteContraction(id)
    } catch (error) {
      console.error('Failed to delete contraction:', error)
    }
  }
}

onMounted(() => {
  fetchContractions()
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

.chart-section h2,
.intervals-section h2,
.records-section h2 {
  margin-bottom: 1rem;
}

.chart-section {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.intervals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.interval-item {
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.interval-item.critical {
  background-color: #ffebee;
  border: 2px solid #f44336;
}

.interval-item.warning {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
}

.interval-item.normal {
  background-color: #e8f5e9;
  border: 2px solid #4caf50;
}

.interval-time {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.interval-value {
  font-size: 2rem;
  font-weight: bold;
}

.interval-unit {
  font-size: 1rem;
}

.interval-detail {
  font-size: 0.875rem;
  color: #666;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.records-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.delete-btn {
  padding: 0.25rem 0.75rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>