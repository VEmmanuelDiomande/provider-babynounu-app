<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center p-6 pt-safe pb-safe">
    <BackgroundDecor />

    <!-- Toast notifications -->
    <ToastNotification
      v-if="showNotification && notificationType === 'success'"
      type="success"
      title="Abonnement confirmé !"
      message="Votre abonnement a été activé avec succès."
      @close="closeNotification"
    />
    <ToastNotification
      v-if="showNotification && notificationType === 'error'"
      type="error"
      title="Erreur de paiement"
      :message="errorMessage"
      @close="closeNotification"
    />

    <!-- Main card -->
    <div class="w-full max-w-sm animate-slide-up">
      <!-- Card body: animated gradient border + glassmorphism -->
      <div class="relative">
        <!-- glow behind card -->
        <div class="absolute -inset-3 bg-gradient-to-br from-primary/20 via-secondary/12 to-indigos/10 rounded-[2.5rem] blur-3xl opacity-80 animate-breathe" style="box-shadow: none;"></div>

        <div class="relative card-gradient-border backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-gray-400/25 overflow-hidden ">
          <!-- inner sheen -->
          <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none"></div>

          <!-- Logo header inside card -->
          <div class="relative flex flex-col items-center pt-12 pb-3 ">
            <AppLogo size="lg" />
            <div class="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="relative px-8 pb-12 pt-8 ">
            <PaymentLoader v-if="state === 'loading'" />
            <PaymentSuccess
              v-else-if="state === 'success'"
              :is-opening-app="isOpeningApp"
              @open-app="tryOpenAppAgain"
            />
            <PaymentError
              v-else
              :message="errorMessage"
              @retry="retryPayment"
            />
          </div>
        </div>
      </div>

      <!-- Footer trust badges -->
      <div class="mt-8 flex flex-col items-center gap-3 animate-fade-in" style="animation-delay: 0.4s; opacity: 0;">
        <div class="flex flex-wrap items-center justify-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm text-[11px] font-love font-medium text-gray-500">
            <i class="ri ri-lock-2-line text-success" style="font-size: 13px;"></i>
            Chiffré SSL
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm text-[11px] font-love font-medium text-gray-500">
            <i class="ri ri-shield-check-line text-primary" style="font-size: 13px;"></i>
            Paiement sécurisé
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm text-[11px] font-love font-medium text-gray-500">
            <i class="ri ri-flashlight-line text-indigos" style="font-size: 13px;"></i>
            Temps réel
          </span>
        </div>
        <p class="text-[11px] text-gray-400 font-love tracking-wide">© {{ new Date().getFullYear() }} BabyNounu · Tous droits réservés</p>
      </div>
    </div>

    <a href="#" class="hidden" id="openApp" aria-hidden="true">Open App</a>
  </div>
</template>

<script setup lang="ts">
import BackgroundDecor from '@/components/BackgroundDecor.vue'
import AppLogo from '@/components/AppLogo.vue'
import PaymentLoader from '@/components/PaymentLoader.vue'
import PaymentSuccess from '@/components/PaymentSuccess.vue'
import PaymentError from '@/components/PaymentError.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { usePaymentValidation } from '@/composables/usePaymentValidation'

const {
  state,
  errorMessage,
  isOpeningApp,
  showNotification,
  notificationType,
  tryOpenAppAgain,
  closeNotification,
  retryPayment,
} = usePaymentValidation({
  onSuccess: () => {
    // Auto-open app on success (mobile only, handled inside composable)
  },
})
</script>
