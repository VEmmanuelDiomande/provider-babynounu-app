<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 transition-all duration-300">
    <!-- Notification améliorée avec animations -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showNotification"
        class="fixed top-5 right-5 flex items-center w-full max-w-md p-6 space-x-4 bg-white rounded-2xl shadow-xl ring-1 ring-green-500/10 transition-all duration-300 z-50"
      >
        <div class="flex-shrink-0">
          <div class="relative">
            <div class="absolute inset-0 bg-green-200 rounded-full opacity-75 animate-ping"></div>
            <div class="relative flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
              <svg
                class="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-lg font-semibold text-gray-900">Abonnement confirmé !</p>
          <p class="mt-1 text-sm text-gray-600">Votre abonnement a été activé avec succès.</p>
        </div>
        <button
          @click="closeNotification"
          class="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Fermer"
        >
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition>

    <!-- Contenu principal avec animations -->
    <transition
      appear
      enter-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div class="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div class="p-8">
          <div class="flex items-center justify-center mb-6">
            <div class="relative">
              <transition
                appear
                enter-active-class="transition-all duration-700 ease-in-out"
                enter-from-class="transform scale-50 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
              >
                <div class="absolute inset-0 bg-green-100 rounded-full opacity-0 animate-pulse"></div>
              </transition>
              <div class="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
                <svg
                  class="w-10 h-10 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="transform translate-y-4 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-4 opacity-0"
          >
            <div v-if="!showNotification" key="processing" class="text-center space-y-4">
              <h2 class="text-2xl font-bold text-gray-800">Traitement en cours</h2>
              <p class="text-gray-600">Nous validons votre paiement, merci de patienter...</p>
              <div class="flex justify-center pt-4">
                <div class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            <div v-else key="confirmed" class="text-center space-y-4">
              <h2 class="text-2xl font-bold text-gray-800">Paiement confirmé !</h2>
              <p class="text-gray-600">Merci pour votre confiance <span class="font-semibold text-green-600">babynounu</span>.</p>
              <div class="pt-4">
                <button
                  @click="tryOpenAppAgain"
                  class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Ouvrir l'application
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>

    <a :href="linkOpenApp" class="hidden" id="openApp">Open App</a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const MODE: 'development' | 'production' = import.meta.env.MODE === 'development' ? 'development' : 'production'
const API_URL = MODE === 'production' ? 'http://localhost:3000' : 'https://api.babynounu.com'

const showNotification = ref(false)
const linkOpenApp = ref('')
const isMobile = ref(false)

onMounted(async () => {
  checkDeviceType()
  
  try {
    const response = await axios.post(`${API_URL}/abonnements/comfirm`, {
      userId: route.query.userId,
      transactionId: route.query.transactionId,
    })

    if (response.status === 200) {
      showNotification.value = true
      openBabyNounuApp()
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
    // Gérer l'erreur ici (afficher un message, etc.)
  }
})

function checkDeviceType() {
  const userAgent = navigator.userAgent || navigator.vendor
  isMobile.value = /android|iPad|iPhone|iPod/i.test(userAgent)
}

function openBabyNounuApp() {
  if (!isMobile.value) return

  const userAgent = navigator.userAgent || navigator.vendor
  const linkElement = document.getElementById('openApp') as HTMLAnchorElement

  if (/android/i.test(userAgent)) {
    linkOpenApp.value = 'intent://home#Intent;scheme=com.babynounu.starter;package=com.babynounu.starter;end;'
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    linkOpenApp.value = 'com.babynounu.starter://home'
  }

  if (linkElement && linkOpenApp.value) {
    linkElement.click()
  }
}

function tryOpenAppAgain() {
  if (isMobile.value) {
    openBabyNounuApp()
  } else {
    alert("L'ouverture de l'application n'est disponible que sur mobile.")
  }
}

const closeNotification = () => {
  showNotification.value = false
}
</script>

<style>
/* Animation personnalisée pour le pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>