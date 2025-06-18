<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <!-- Notification de succès -->
    <transition
      enter-active-class="transform ease-out duration-200 transition"
      leave-active-class="transition ease-in duration-150"
      appear
    >
      <div
        v-if="showSuccessNotification"
        class="fixed top-3 inset-x-3 mx-auto max-w-md p-4 bg-white rounded-xl shadow-lg ring-1 ring-green-500/10 z-50 flex items-start"
        role="alert"
      >
        <div class="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
          <CheckCircleIcon />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">Abonnement confirmé !</p>
          <p class="mt-1 text-xs text-gray-600">Votre abonnement a été activé avec succès.</p>
        </div>
        <button
          @click="closeNotification"
          class="text-gray-400 hover:text-gray-500"
          aria-label="Fermer la notification"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </transition>

    <!-- Notification d'erreur -->
    <transition
      enter-active-class="transform ease-out duration-200 transition"
      leave-active-class="transition ease-in duration-150"
      appear
    >
      <div
        v-if="showErrorNotification"
        class="fixed top-3 inset-x-3 mx-auto max-w-md p-4 bg-white rounded-xl shadow-lg ring-1 ring-red-500/10 z-50 flex items-start"
        role="alert"
      >
        <div class="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5">
          <ExclamationTriangleIcon />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">Erreur d'abonnement</p>
          <p class="mt-1 text-xs text-gray-600">{{ errorMessage }}</p>
        </div>
        <button
          @click="closeNotification"
          class="text-gray-400 hover:text-gray-500"
          aria-label="Fermer la notification"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </transition>

    <!-- Carte principale -->
    <div class="w-full max-w-sm bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <template v-if="isLoading">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <div
                class="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          </div>
          <div class="text-center space-y-3">
            <h2 class="text-xl font-bold text-gray-800">Traitement en cours</h2>
            <p class="text-sm text-gray-600">Validation du paiement...</p>
          </div>
        </template>

        <template v-else-if="subscriptionValid">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircleIcon class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="text-center space-y-3">
            <h2 class="text-xl font-bold text-gray-800">Paiement confirmé !</h2>
            <p class="text-sm text-gray-600">
              Merci pour votre confiance <span class="font-medium text-green-600">babynounu</span>.
            </p>
            <div class="pt-3">
              <button
                @click="tryOpenAppAgain"
                class="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition-colors duration-200"
                :disabled="isOpeningApp"
              >
                <span v-if="!isOpeningApp">Ouvrir l'application</span>
                <span v-else class="flex items-center justify-center">
                  <span
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                  ></span>
                  Ouverture...
                </span>
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="text-center space-y-3">
            <h2 class="text-xl font-bold text-gray-800">Abonnement invalide</h2>
            <p class="text-sm text-gray-600">{{ errorMessage }}</p>
            <div class="pt-3">
              <button
                @click="retryPayment"
                class="w-full px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
              >
                Réessayer le paiement
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <a :href="linkOpenApp" class="hidden" id="openApp">Open App</a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Reactive state
const route = useRoute()
const showSuccessNotification = ref(false)
const showErrorNotification = ref(false)
const errorMessage = ref('')
const linkOpenApp = ref('')
const isOpeningApp = ref(false)
const isLoading = ref(true)
const subscriptionValid = ref(false)
const isMobile = ref(/android|iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor))

// API configuration
const API_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://api.babynounu.com'

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8081'
    : 'https://provider.babynounu.com'

interface ApiResponse {
  isPayment: boolean
  hasActiveSubscription: boolean
  error?: string
}

// Lifecycle hook
onMounted(async () => {
  try {
    localStorage.clear()
    localStorage.setItem('userId', route.query.userId as string)
    localStorage.setItem('transactionId', route.query.transactionId as string)

    // Get the payment status
    const paymentGetResponse = await fetch(
      `${API_URL}/payments/user/:userId/transaction/:transactionId`
        .replace(':userId', route.query.userId as string)
        .replace(':transactionId', route.query.transactionId as string),
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (!paymentGetResponse.ok) {
      throw new Error(`Erreur HTTP! statut: ${paymentGetResponse.status}`)
    }

    const paymentData: any = await paymentGetResponse.json()

  
    // Confirm the subscription

    const response = await fetch(`${API_URL}/abonnements/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: route.query.userId,
        transactionId: route.query.transactionId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    if (data?.isPayment && data?.hasActiveSubscription) {
      subscriptionValid.value = true
      showSuccessNotification.value = true
      await openBabyNounuApp()
    } else {
      errorMessage.value = data?.error || "Le paiement n'a pas pu être validé."
      showErrorNotification.value = true
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
    errorMessage.value = 'Une erreur est survenue lors de la validation de votre abonnement.'
    showErrorNotification.value = true
  } finally {
    isLoading.value = false
  }
})

// Methods
const openBabyNounuApp = async (): Promise<void> => {
  if (!isMobile.value) return

  const userAgent = navigator.userAgent || navigator.vendor
  const linkElement = document.getElementById('openApp')

  if (linkElement) {
    isOpeningApp.value = true
    
    if (/android/i.test(userAgent)) {
      // Essayer d'ouvrir l'app Android avec intent
      linkOpenApp.value = 'intent://home#Intent;scheme=babynounu;package=com.babyNounu.starter;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.babyNounu.starter;end;'
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
      // Essayer d'ouvrir l'app iOS avec custom scheme
      linkOpenApp.value = 'babynounu://home'
    } else {
      // Fallback pour autres plateformes
      linkOpenApp.value = 'https://play.google.com/store/apps/details?id=com.babyNounu.starter'
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
    linkElement.click()

    // Fallback vers le store si l'app ne s'ouvre pas
    setTimeout(() => {
      if (/android/i.test(userAgent)) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.babyNounu.starter'
      } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
        // Rediriger vers l'App Store iOS si disponible
        window.location.href = 'https://apps.apple.com/app/babynounu'
      }
    }, 3000)

    setTimeout(() => {
      isOpeningApp.value = false
    }, 4000)
  }
}

const tryOpenAppAgain = async () => {
  if (isMobile.value) {
    await openBabyNounuApp()
  } else {
    // Rediriger vers le Play Store pour les utilisateurs desktop
    window.open('https://play.google.com/store/apps/details?id=com.babyNounu.starter', '_blank')
  }
}

const closeNotification = (): void => {
  showSuccessNotification.value = false
  showErrorNotification.value = false
}

const retryPayment = (): void => {
  // Rediriger vers la page de paiement ou recharger la page
  window.location.href = `${BASE_URL}/?userId=${route.query.userId}&transactionId=${route.query.transactionId}`
}
</script>

<style>
* {
  font-family: 'Figtree';
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
