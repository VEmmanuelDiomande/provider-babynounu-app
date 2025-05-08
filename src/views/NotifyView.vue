<template>
  <div class="bg-white min-h-screen flex flex-col justify-center items-center">
    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p class="text-lg text-center">Nous validons votre paiement...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/notify`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({
    //   token: route.query.token,
    //   transaction_id: route.query.transaction_id,
    // }),
  })

  if (!response.ok) {
    throw new Error(`Erreur HTTP! statut: ${response.status}`)
  }

  const data: any = await response.json()

  if (data?.isPayment && data?.hasActiveSubscription) {
    window.location.href = '/abonnement/valide'
  } else {
    window.location.href = '/abonnement/erreur'
  }
})
</script>
