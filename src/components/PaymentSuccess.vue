<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  isOpeningApp?: boolean
}>()

defineEmits<{
  openApp: []
}>()

interface ConfettiPiece {
  id: number
  tx: string
  ty: string
  r: string
  color: string
  delay: string
  left: string
  top: string
}

const confettiColors = ['bg-primary', 'bg-secondary', 'bg-indigos', 'bg-success', 'bg-primary-light']

const confetti = computed<ConfettiPiece[]>(() =>
  Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.5
    const distance = 60 + Math.random() * 70
    return {
      id: i,
      tx: `${Math.cos(angle) * distance}px`,
      ty: `${Math.sin(angle) * distance}px`,
      r: `${Math.random() * 360}deg`,
      color: confettiColors[i % confettiColors.length],
      delay: `${Math.random() * 0.15}s`,
      left: '50%',
      top: '50%',
    }
  }),
)
</script>

<template>
  <div class="flex flex-col items-center text-center animate-scale-in">
    <!-- Success icon with SVG check draw + confetti burst -->
    <div class="relative flex items-center justify-center mb-6 h-24 w-24">
      <!-- Confetti particles -->
      <span
        v-for="piece in confetti"
        :key="piece.id"
        class="absolute animate-confetti"
        :class="piece.color"
        :style="{
          height: piece.id % 3 === 0 ? '7px' : '5px',
          width: piece.id % 3 === 0 ? '7px' : '5px',
          borderRadius: piece.id % 2 === 0 ? '9999px' : '2px',
          left: piece.left,
          top: piece.top,
          '--tx': piece.tx,
          '--ty': piece.ty,
          '--r': piece.r,
          animationDelay: piece.delay,
        }"
      ></span>

      <!-- Ripple ring -->
      <div class="absolute h-20 w-20 rounded-full bg-success/20 animate-ripple"></div>
      <div class="absolute h-20 w-20 rounded-full bg-success/15 animate-pulse-ring"></div>

      <div
        class="relative h-18 w-18 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-xl shadow-success/40 ring-4 ring-white animate-check-bounce"
        style="height: 4.5rem; width: 4.5rem;"
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path
            d="M8 17.5L14 23.5L26 10.5"
            stroke="white"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="60"
            stroke-dashoffset="60"
            class="animate-draw"
            style="animation-delay: 0.3s"
          />
        </svg>
      </div>
    </div>

    <h2 class="font-anton text-2xl text-gray-900 mb-2 tracking-tight animate-slide-up" style="animation-delay: 0.15s; opacity: 0;">Paiement confirmé !</h2>

    <div class="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20 animate-slide-up" style="animation-delay: 0.25s; opacity: 0;">
      <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
      <span class="text-[11px] font-love font-semibold text-success uppercase tracking-wider">Abonnement actif</span>
    </div>

    <p class="text-sm text-gray-500 max-w-[270px] leading-relaxed mb-7 animate-slide-up" style="animation-delay: 0.35s; opacity: 0;">
      Merci pour votre confiance
      <span class="font-semibold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">BabyNounu</span>.
      Profitez dès maintenant de tous vos avantages.
    </p>

    <button
      @click="$emit('openApp')"
      :disabled="isOpeningApp"
      style="animation-delay: 0.45s; opacity: 0;"
      class="animate-slide-up group relative w-full px-8 py-5 overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white font-love font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
      :class="{ 'animate-breathe': !isOpeningApp }"
    >
      <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
      <span v-if="!isOpeningApp" class="relative flex items-center justify-center gap-2 text-base">
        Ouvrir l'application
        <i class="ri ri-arrow-right-line group-hover:translate-x-1.5 transition-transform duration-300" style="font-size: 20px;"></i>
      </span>
      <span v-else class="relative flex items-center justify-center gap-2 text-base">
        <span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Ouverture...
      </span>
    </button>
  </div>
</template>
