<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center animate-scale-in">
    <!-- Error icon with shake -->
    <div class="relative flex items-center justify-center mb-6 h-24 w-24">
      <div class="absolute h-20 w-20 rounded-full bg-danger/10"></div>
      <div class="absolute h-20 w-20 rounded-full border-2 border-danger/20"></div>
      <div
        class="relative flex items-center justify-center animate-shake"
        style="height: 4.5rem; width: 4.5rem;"
      >
        <div
          class="h-full w-full rounded-full bg-gradient-to-br from-danger to-red-600 flex items-center justify-center shadow-xl shadow-danger/30 ring-4 ring-white"
        >
          <i class="ri ri-close-line text-white" style="font-size: 30px;"></i>
        </div>
      </div>
    </div>

    <h2 class="font-anton text-2xl text-gray-900 mb-2 tracking-tight animate-slide-up" style="animation-delay: 0.1s; opacity: 0;">Paiement invalide</h2>

    <div class="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 animate-slide-up" style="animation-delay: 0.2s; opacity: 0;">
      <span class="h-1.5 w-1.5 rounded-full bg-danger animate-pulse"></span>
      <span class="text-[11px] font-love font-semibold text-danger uppercase tracking-wider">Transaction refusée</span>
    </div>

    <p class="text-sm text-gray-500 max-w-[270px] leading-relaxed mb-7 animate-slide-up" style="animation-delay: 0.3s; opacity: 0;">{{ message }}</p>

    <button
      @click="$emit('retry')"
      style="animation-delay: 0.4s; opacity: 0;"
      class="animate-slide-up group relative w-full px-8 py-5 overflow-hidden bg-gradient-to-r from-danger to-red-600 text-white font-love font-bold rounded-2xl shadow-lg shadow-danger/30 hover:shadow-2xl hover:shadow-danger/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-300 ease-out"
    >
      <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
      <span class="relative flex items-center justify-center gap-2 text-base">
        <i class="ri ri-refresh-line group-hover:rotate-180 transition-transform duration-500" style="font-size: 20px;"></i>
        Réessayer le paiement
      </span>
    </button>

    <p class="mt-5 text-xs text-gray-400 font-love animate-fade-in" style="animation-delay: 0.6s; opacity: 0;">
      Aucun montant n'a été débité · Besoin d'aide ?
      <a href="mailto:support@babynounu.com" class="text-primary font-medium hover:underline">Contactez-nous</a>
    </p>
  </div>
</template>
