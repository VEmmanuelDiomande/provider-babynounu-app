<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const steps = [
  { label: 'Connexion au serveur de paiement', icon: 'ri-links-line' },
  { label: 'Vérification de la transaction', icon: 'ri-search-eye-line' },
  { label: 'Confirmation de l\'abonnement', icon: 'ri-verified-badge-line' },
]

const currentStep = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }, 2200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="flex flex-col items-center text-center animate-scale-in">
    <!-- Conic spinner loader -->
    <div class="relative flex items-center justify-center mb-8 h-28 w-28">
      <!-- Expanding halo rings -->
      <div class="absolute h-24 w-24 rounded-full bg-primary/15 animate-halo"></div>
      <div class="absolute h-24 w-24 rounded-full bg-secondary/15 animate-halo" style="animation-delay: 0.8s"></div>

      <!-- Conic gradient spinner -->
      <div class="absolute h-[104px] w-[104px] rounded-full spinner-ring animate-spin-ring"></div>

      <!-- Counter-rotating dashed ring -->
      <div
        class="absolute h-[84px] w-[84px] rounded-full border border-dashed border-primary/25 animate-rotate"
        style="animation-direction: reverse; animation-duration: 6s;"
      ></div>

      <!-- Center icon -->
      <div
        class="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary-dark flex items-center justify-center shadow-xl shadow-primary/40 ring-4 ring-white"
      >
        <i class="ri ri-bank-card-2-line text-white" style="font-size: 26px;"></i>
      </div>
    </div>

    <!-- Title -->
    <h2 class="font-anton text-2xl text-gray-900 mb-2 tracking-tight">Validation en cours</h2>
    <p class="text-sm text-gray-500 max-w-[260px] leading-relaxed">
      Nous confirmons votre transaction en temps réel
    </p>

    <!-- Step checklist -->
    <div class="mt-7 w-full max-w-[260px] flex flex-col gap-2.5 text-left">
      <div
        v-for="(step, i) in steps"
        :key="step.label"
        class="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500"
        :class="[
          i < currentStep
            ? 'bg-success/5 border-success/15'
            : i === currentStep
              ? 'bg-primary/5 border-primary/20 shadow-sm shadow-primary/10'
              : 'bg-gray-50/60 border-gray-100 opacity-50',
        ]"
      >
        <!-- Step status icon -->
        <div
          class="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-500"
          :class="[
            i < currentStep
              ? 'bg-success text-white'
              : i === currentStep
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 text-gray-400',
          ]"
        >
          <i v-if="i < currentStep" class="ri ri-check-line animate-step-pop" style="font-size: 15px;"></i>
          <span
            v-else-if="i === currentStep"
            class="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"
          ></span>
          <i v-else class="ri" :class="step.icon" style="font-size: 14px;"></i>
        </div>
        <span
          class="text-xs font-love font-medium transition-colors duration-500"
          :class="i <= currentStep ? 'text-gray-700' : 'text-gray-400'"
        >{{ step.label }}</span>
      </div>
    </div>

    <!-- Shimmer progress bar -->
    <div class="mt-6 w-full max-w-[220px] h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-progress"
      ></div>
    </div>

    <!-- Status indicator -->
    <div class="mt-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/10">
      <span class="relative flex h-2 w-2">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
      </span>
      <span class="text-xs text-gray-500 font-love font-medium">Connexion sécurisée active</span>
    </div>
  </div>
</template>
