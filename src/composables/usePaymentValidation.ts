import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { paymentSocketService, type PaymentStatusPayload } from '@/services/socket.services'

export type PaymentState = 'loading' | 'success' | 'error'

export interface UsePaymentValidationOptions {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function usePaymentValidation(options: UsePaymentValidationOptions = {}) {
  const route = useRoute()
  const state = ref<PaymentState>('loading')
  const errorMessage = ref('')
  const isOpeningApp = ref(false)
  const showNotification = ref(false)
  const notificationType = ref<'success' | 'error'>('success')

  const isMobile = /android|iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor)

  const API_URL =
    import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://baby.djoumaf.net'

  const BASE_URL =
    import.meta.env.MODE === 'development'
      ? 'http://localhost:8084'
      : 'https://baby-provider.djoumaf.net'

  let pollTimer: ReturnType<typeof setInterval> | null = null
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null
  let timeoutTimer: ReturnType<typeof setTimeout> | null = null

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

  const onPaymentStatus = (data: PaymentStatusPayload) => {
    if (data.status === 'Success' || (data.isPayment && data.hasActiveSubscription)) {
      state.value = 'success'
      notificationType.value = 'success'
      showNotification.value = true
      cleanupTimers()
      options.onSuccess?.()
    } else if (
      data.status === 'Failed' ||
      data.status === 'Cancelled' ||
      data.status === 'not_found'
    ) {
      errorMessage.value =
        data.status === 'not_found'
          ? 'Transaction introuvable.'
          : "Le paiement n'a pas pu être validé."
      state.value = 'error'
      notificationType.value = 'error'
      showNotification.value = true
      cleanupTimers()
      options.onError?.(errorMessage.value)
    }
  }

  const openBabyNounuApp = async (): Promise<void> => {
    if (!isMobile) return

    const userAgent = navigator.userAgent || navigator.vendor
    const linkElement = document.getElementById('openApp')

    if (linkElement) {
      isOpeningApp.value = true

      if (/android/i.test(userAgent)) {
        linkElement.setAttribute(
          'href',
          'intent://home#Intent;scheme=babynounu;package=com.babyNounu.starter;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.babyNounu.starter;end;',
        )
      } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
        linkElement.setAttribute('href', 'babynounu://home')
      } else {
        linkElement.setAttribute(
          'href',
          'https://play.google.com/store/apps/details?id=com.babyNounu.starter',
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
      linkElement.click()

      setTimeout(() => {
        if (/android/i.test(userAgent)) {
          window.location.href =
            'https://play.google.com/store/apps/details?id=com.babyNounu.starter'
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
    if (isMobile) {
      await openBabyNounuApp()
    } else {
      window.open(
        'https://play.google.com/store/apps/details?id=com.babyNounu.starter',
        '_blank',
      )
    }
  }

  const closeNotification = () => {
    showNotification.value = false
  }

  const retryPayment = () => {
    const txId = route.query.transactionId || route.query.transaction_id
    window.location.href = `${BASE_URL}/?userId=${route.query.userId || ''}&transactionId=${txId}`
  }

  onMounted(async () => {
    const userId = route.query.userId as string
    const transactionId = (route.query.transactionId || route.query.transaction_id) as string

    if (!transactionId) {
      errorMessage.value = 'Paramètres manquants (transactionId).'
      state.value = 'error'
      notificationType.value = 'error'
      showNotification.value = true
      return
    }

    localStorage.clear()
    localStorage.setItem('userId', userId)
    localStorage.setItem('transactionId', transactionId)

    paymentSocketService.connect(userId, transactionId)
    paymentSocketService.on('paymentStatus', onPaymentStatus)
    paymentSocketService.emit('checkPaymentStatus', { userId, transactionId })

    pollTimer = setInterval(() => {
      paymentSocketService.emit('checkPaymentStatus', { userId, transactionId })
    }, 5000)

    fallbackTimer = setTimeout(async () => {
      if (state.value === 'loading') {
        try {
          const response = await fetch(`${API_URL}/payments/status/${transactionId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })

          if (response.ok) {
            const data: any = await response.json()
            if (data?.status === 'Success') {
              state.value = 'success'
              notificationType.value = 'success'
              showNotification.value = true
              cleanupTimers()
              await openBabyNounuApp()
            }
          }
        } catch (error) {
          console.error('[usePaymentValidation] HTTP fallback error:', error)
        }
      }
    }, 10000)

    timeoutTimer = setTimeout(() => {
      if (state.value === 'loading') {
        errorMessage.value = "Délai d'attente dépassé. Veuillez réessayer."
        state.value = 'error'
        notificationType.value = 'error'
        showNotification.value = true
        cleanupTimers()
      }
    }, 60000)
  })

  onUnmounted(() => {
    cleanupTimers()
    paymentSocketService.off('paymentStatus', onPaymentStatus)
    paymentSocketService.disconnect()
  })

  return {
    state,
    errorMessage,
    isOpeningApp,
    showNotification,
    notificationType,
    isMobile,
    openBabyNounuApp,
    tryOpenAppAgain,
    closeNotification,
    retryPayment,
  }
}
