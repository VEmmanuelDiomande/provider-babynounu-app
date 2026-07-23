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
            <p class="text-sm text-gray-600">Validation du paiement en temps réel...</p>
            <div class="flex items-center justify-center gap-2 pt-2">
              <span class="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-xs text-gray-500">En attente de la confirmation</span>
            </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { paymentSocketService, type PaymentStatusPayload } from '@/services/socket.services'

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

// API configuration (fallback)
const API_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://api.babynounu.com'

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8081'
    : 'https://baby-provider.djoumaf.net'

// Timers
let pollTimer: ReturnType<typeof setInterval> | null = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null
let timeoutTimer: ReturnType<typeof setTimeout> | null = null

// Socket event handler
const onPaymentStatus = (data: PaymentStatusPayload) => {
  console.log('[HomeView] paymentStatus received:', data)

  if (data.isPayment && data.hasActiveSubscription) {
    subscriptionValid.value = true
    showSuccessNotification.value = true
    isLoading.value = false
    cleanupTimers()
    openBabyNounuApp()
  } else if (data.status === 'Failed' || data.status === 'Cancelled' || data.status === 'not_found') {
    errorMessage.value = data.status === 'not_found'
      ? 'Transaction introuvable.'
      : "Le paiement n'a pas pu être validé."
    showErrorNotification.value = true
    isLoading.value = false
    cleanupTimers()
  }
  // For 'Pending' status, keep loading
}

const cleanupTimers = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
}

// Lifecycle hook
onMounted(async () => {
  const userId = route.query.userId as string
  const transactionId = route.query.transactionId as string

  if (!userId || !transactionId) {
    errorMessage.value = 'Paramètres manquants (userId, transactionId).'
    showErrorNotification.value = true
    isLoading.value = false
    return
  }

  localStorage.clear()
  localStorage.setItem('userId', userId)
  localStorage.setItem('transactionId', transactionId)

  // 1. Connect socket for real-time validation
  paymentSocketService.connect(userId, transactionId)
  paymentSocketService.on('paymentStatus', onPaymentStatus)

  // 2. Request immediate status check via socket
  paymentSocketService.emit('checkPaymentStatus', { userId, transactionId })

  // 3. Poll via socket every 5 seconds (in case webhook hasn't arrived yet)
  pollTimer = setInterval(() => {
    paymentSocketService.emit('checkPaymentStatus', { userId, transactionId })
  }, 5000)

  // 4. HTTP fallback after 10 seconds (in case socket fails entirely)
  fallbackTimer = setTimeout(async () => {
    if (isLoading.value) {
      console.log('[HomeView] Socket fallback: trying HTTP verification')
      try {
        const response = await fetch(`${API_URL}/payments/status/${transactionId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          const data: any = await response.json()
          if (data?.status === 'Success') {
            subscriptionValid.value = true
            showSuccessNotification.value = true
            isLoading.value = false
            cleanupTimers()
            await openBabyNounuApp()
          }
        }
      } catch (error) {
        console.error('[HomeView] HTTP fallback error:', error)
      }
    }
  }, 10000)

  // 5. Global timeout after 60 seconds
  timeoutTimer = setTimeout(() => {
    if (isLoading.value) {
      errorMessage.value = "Délai d'attente dépassé. Veuillez réessayer."
      showErrorNotification.value = true
      isLoading.value = false
      cleanupTimers()
    }
  }, 60000)
})

onUnmounted(() => {
  cleanupTimers()
  paymentSocketService.off('paymentStatus', onPaymentStatus)
  paymentSocketService.disconnect()
})

// Methods
const openBabyNounuApp = async (): Promise<void> => {
  if (!isMobile.value) return

  const userAgent = navigator.userAgent || navigator.vendor
  const linkElement = document.getElementById('openApp')

  if (linkElement) {
    isOpeningApp.value = true

    if (/android/i.test(userAgent)) {
      linkOpenApp.value = 'intent://home#Intent;scheme=babynounu;package=com.babyNounu.starter;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.babyNounu.starter;end;'
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
      linkOpenApp.value = 'babynounu://home'
    } else {
      linkOpenApp.value = 'https://play.google.com/store/apps/details?id=com.babyNounu.starter'
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
    linkElement.click()

    setTimeout(() => {
      if (/android/i.test(userAgent)) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.babyNounu.starter'
      } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
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
    window.open('https://play.google.com/store/apps/details?id=com.babyNounu.starter', '_blank')
  }
}

const closeNotification = (): void => {
  showSuccessNotification.value = false
  showErrorNotification.value = false
}

const retryPayment = (): void => {
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
