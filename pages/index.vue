<template>
  <div class="container">
    <h1>陣痛タイマー</h1>
    
    <StopwatchDisplay />
    
    <div class="navigation">
      <NuxtLink to="/history" class="nav-link">
        📊 陣痛履歴を見る
      </NuxtLink>
      <NuxtLink to="/hospitals" class="nav-link">
        🏥 病院情報
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContractions } from '~/composables/useContractions'

const { fetchContractions } = useContractions()

onMounted(() => {
  fetchContractions()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
}

.navigation {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  background-color: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #1976d2;
}
</style>