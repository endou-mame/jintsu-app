<template>
  <div class="chart-container">
    <Line 
      v-if="chartData" 
      :data="chartData" 
      :options="chartOptions" 
    />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  TimeScale,
  TimeSeriesScale,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { ja } from 'date-fns/locale'
import type { Contraction } from '~/types/schemas'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  TimeScale,
  TimeSeriesScale
)

const props = defineProps<{
  contractions: Contraction[]
}>()

const chartData = computed(() => {
  if (props.contractions.length === 0) return null

  const sorted = [...props.contractions].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )

  const intervalData: { x: Date; y: number }[] = []
  
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = sorted[i - 1].endTime
    const currentStart = sorted[i].startTime
    
    if (prevEnd) {
      const minutes = Math.floor(
        (new Date(currentStart).getTime() - new Date(prevEnd).getTime()) / 1000 / 60
      )
      intervalData.push({
        x: new Date(currentStart),
        y: minutes
      })
    }
  }

  return {
    datasets: [{
      label: '陣痛間隔（分）',
      data: intervalData,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: (context: any) => {
        const value = context.parsed?.y || 0
        if (value <= 5) return '#f44336'
        if (value <= 10) return '#ff9800'
        return '#4caf50'
      },
      pointBorderColor: (context: any) => {
        const value = context.parsed?.y || 0
        if (value <= 5) return '#f44336'
        if (value <= 10) return '#ff9800'
        return '#4caf50'
      }
    }]
  } as ChartData<'line'>
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: '陣痛間隔の推移'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.y
          return `間隔: ${value}分`
        }
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        displayFormats: {
          hour: 'HH:mm',
          minute: 'HH:mm'
        }
      },
      adapters: {
        date: {
          locale: ja
        }
      },
      title: {
        display: true,
        text: '時刻'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: '間隔（分）'
      },
      ticks: {
        stepSize: 5
      },
      grid: {
        color: (context) => {
          if (context.tick.value === 10) {
          return '#ff9800'
        }
        if (context.tick.value === 5) {
          return '#f44336'
        }
        return 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }
}))
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>