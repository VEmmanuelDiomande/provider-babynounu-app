<template>
  <!-- Simplification du conteneur principal -->
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <!-- Notification - rendue plus légère -->
    <transition
      enter-active-class="transform ease-out duration-200 transition"
      leave-active-class="transition ease-in duration-150"
    >
      <div
        v-if="showNotification"
        class="fixed top-3 inset-x-3 mx-auto max-w-md p-4 bg-white rounded-xl shadow-lg ring-1 ring-green-500/10 z-50 flex items-start"
      >
        <!-- Icône simplifiée -->
        <div class="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">Abonnement confirmé !</p>
          <p class="mt-1 text-xs text-gray-600">Votre abonnement a été activé avec succès.</p>
        </div>
        <button @click="closeNotification" class="text-gray-400 hover:text-gray-500">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition>

    <!-- Carte principale simplifiée -->
    <div class="w-full max-w-sm bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div v-if="!showNotification" class="text-center space-y-3">
          <h2 class="text-xl font-bold text-gray-800">Traitement en cours</h2>
          <p class="text-sm text-gray-600">Validation du paiement...</p>
          <div class="flex justify-center pt-2">
            <div class="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        <div v-else class="text-center space-y-3">
          <h2 class="text-xl font-bold text-gray-800">Paiement confirmé !</h2>
          <p class="text-sm text-gray-600">Merci pour votre confiance <span class="font-medium text-green-600">babynounu</span>.</p>
          <div class="pt-3">
            <button
              @click="tryOpenAppAgain"
              class="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition-colors duration-200"
            >
              Ouvrir l'application
            </button>
          </div>
        </div>
      </div>
    </div>

    <a :href="linkOpenApp" class="hidden" id="openApp">Open App</a>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:3000' 
  : 'https://api.babynounu.com'

const showNotification = ref(false)
const linkOpenApp = ref('')
const isMobile = ref(
  /android|iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor)
)

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}/abonnements/comfirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: route.query.userId,
        transactionId: route.query.transactionId,
      })
    })

    if (response.ok) {
      showNotification.value = true
      openBabyNounuApp()
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
  }
})

function openBabyNounuApp() {
  if (!isMobile.value) return

  const userAgent = navigator.userAgent || navigator.vendor
  const linkElement = document.getElementById('openApp')

  if (linkElement) {
    linkOpenApp.value = /android/i.test(userAgent)
      ? 'intent://home#Intent;scheme=com.babynounu.starter;package=com.babynounu.starter;end;'
      : 'com.babynounu.starter://home'
    
    linkElement.click()
  }
}

function tryOpenAppAgain() {
  if (isMobile.value) {
    openBabyNounuApp()
  } else {
    alert("Ouvrez l'application depuis votre mobile")
  }
}

const closeNotification = () => {
  showNotification.value = false
}
</script>
<style>
/* Suppression des animations complexes au profit de transitions simples */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Optimisation des transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>